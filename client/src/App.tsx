import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "components/Select";
import Input from "components/Input";
import { IMessage } from "@server/models/message";

const Wrapper = styled.div`
  text-align: center;

  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const ProtobufField = styled.div``;

interface IProtobufField {
  name: string;
  type: string;
  number: number;
}

function App() {
  let [fields, setFields] = useState<Array<IProtobufField>>([
    { type: "string" } as IProtobufField,
  ]);
  let [name] = useState<string>("Test");
  let [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`/proto/${name}?json=true`)
      .then((res) => {
        let message = res.data as IMessage;
        setFields(message.fields);
      })
      .catch((err) => setIsNew(true));
  }, []);

  const addField: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setFields((oldArray) => [
      ...oldArray,
      { type: "string" } as IProtobufField,
    ]);
  };

  const submit = () => {
    axios
      .post(isNew ? "/proto/create" : "/proto/update", {
        name: name,
        fields: fields,
      })
      .then((res) => {
        console.log(res);
        setIsNew(false);
      });
  };

  const onFieldChange =
    (
      index: number,
      prop: "type" | "name" | "number"
    ): React.FormEventHandler<HTMLElement> =>
    (e) => {
      let field = fields[index];
      switch (prop) {
        case "type":
          field[prop] = (e.target as HTMLSelectElement).value;
          break;
        case "name":
          field[prop] = (e.target as HTMLInputElement).value;
          break;
        case "number":
          field[prop] = parseInt((e.target as HTMLInputElement).value);
          break;
      }
      setFields([...fields.slice(0, index), field, ...fields.slice(index + 1)]);
    };

  return (
    <Wrapper>
      <p>{name}</p>
      {fields.map((field, index) => (
        <ProtobufField>
          <Select
            name="type"
            options={["string", "int"]}
            value={field.type}
            onChange={onFieldChange(index, "type")}
          />
          <Input
            name="name"
            type="text"
            placeholder="Name"
            value={field.name}
            onChange={onFieldChange(index, "name")}
          />
          <Input
            name="number"
            type="number"
            placeholder="Field"
            value={field.number}
            onChange={onFieldChange(index, "number")}
          />
        </ProtobufField>
      ))}
      <button onClick={addField}>+</button>
      <button onClick={submit}>+</button>
    </Wrapper>
  );
}

export default App;
