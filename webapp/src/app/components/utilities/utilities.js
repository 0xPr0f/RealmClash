export const loadExternalURL = (url, newpage = true) => {
  if (newpage == true) {
    window.open(url, "_blank");
  } else if (newpage == false) {
    window.open(url, "_self");
  }
};

export const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.log(error);
  }
};

export const shortenText = (str, n1 = 6, n2 = 4) => {
  if (str) {
    return `${str.slice(0, n1)}...${str.slice(str.length - n2)}`;
  }
  return "";
};

export function die(message) {
  console.error(message);
  process.exit(1);
}

function padTo2Digits(num) {
  if (num > 9) {
    return num.toString().padStart(2, "0");
  } else if (num < 10) {
    return num.toString().padStart(1, "0");
  } else if (num > 99) {
    return num.toString().padStart(3, "0");
  } else if (num > 999) {
    return num.toString().padStart(4, "0");
  } else if (num > 9999) {
    return num.toString().padStart(5, "0");
  } else if (num > 99999) {
    return num.toString().padStart(6, "0");
  }
}

export function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let day = Math.floor(hours / 24);

  seconds = seconds % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
  // hours = hours % 24;
  if (minutes > 119) {
    return `${padTo2Digits(hours)} hours`;
  } else if (minutes < 120) {
    return `${padTo2Digits(minutes)} mins`;
  } else if (hours > 120) {
    return `${padTo2Digits(day)} days`;
  }
}

export function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}
