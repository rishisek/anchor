import styled from "styled-components";

export interface Props {
  placeholder: string;
  type: "text" | "number";
  value: string | number;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = styled.input.attrs((props) => ({ type: props.type }))``;

const Input = ({ name, placeholder, type, value, onChange }: Props) => {
  return (
    <InputField
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
