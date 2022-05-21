import styled from "styled-components";

export interface Props {
  placeholder: string;
}

const InputField = styled.input.attrs({ type: "text" })``;

const Input = ({ placeholder }: Props) => {
  return <InputField placeholder={placeholder}></InputField>;
};

export default Input;
