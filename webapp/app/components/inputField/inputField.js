import styles from "./inputField.module.css";
export default function InputFieldTest({
  placeholder,
  value,
  onChange,
  defaultValue,
  width,
  height,
}) {
  return (
    <form>
      <input
        spellCheck={false}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        className={styles.textfield}
        style={{ width: width, height: height }}
      />
    </form>
  );
}
export const InputField = ({
  placeholder,
  value,
  onChange,
  defaultValue,
  width,
  height,
}) => {
  return (
    <form className={styles.formInput}>
      <input
        spellCheck={false}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        className=" textInputInput"
        style={{ width: width, height: height }}
      />
    </form>
  );
};
