import styles from "./textareaField.module.css";
export const TextareaField = ({
  placeholder,
  value,
  onChange,
  defaultValue,
  width,
  height,
  maxHeight,
  minHeight,
  minWidth,
  maxWidth,
}) => {
  return (
    <form className={styles.formAreaInput}>
      <textarea
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        className={styles.textareaInputInput}
        style={{
          paddingLeft: "1em",
          paddingRight: "1em",
          width: width,
          height: height,
          minHeight: minHeight,
          maxHeight: maxHeight,
          minWidth: minWidth,
          maxWidth: maxWidth,
        }}
      />
    </form>
  );
};

export default TextareaField;
