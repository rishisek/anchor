import styled from "styled-components";

export interface Props {
  options: Array<string>;
}

const SelectField = styled.select``;

const Select = ({ options }: Props) => {
  return (
    <SelectField>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </SelectField>
  );
};

export default Select;
