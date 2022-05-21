import styled from "styled-components";

export interface Props {
  options: Array<string>;
  value: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = styled.select``;

const Select = ({ name, options, value, onChange }: Props) => {
  return (
    <SelectField name={name} value={value} onChange={onChange}>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </SelectField>
  );
};

export default Select;
