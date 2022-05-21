import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "components/Select";
import Input from "components/Input";
import { IMessage, IField } from "@server/models/message";

const Wrapper = styled.div``;

const ProtobufField = styled.div``;

interface Edit {
  type: "type" | "name" | "number" | "remove";
  index: number;
  old_value?: string;
  old_field?: IField;
}

function Message() {
  let [edits, setEdits] = useState<Array<Edit>>([]);
  let [fields, setFields] = useState<Array<IField>>([
    { type: "string" } as IField,
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

  const addField = (
    index = fields.length,
    field = { type: "string" } as IField
  ) => {
    setFields((fields) => [
      ...fields.slice(0, index),
      field,
      ...fields.slice(index),
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
      let old_value = field[prop];
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
      setFields((fields) => [
        ...fields.slice(0, index),
        field,
        ...fields.slice(index + 1),
      ]);
      setEdits((edits) => [
        ...edits,
        { type: prop, index: index, old_value: old_value.toString() },
      ]);
    };

  const remove = (index: number) => () => {
    let old_value = fields[index];
    setFields((fields) => [
      ...fields.slice(0, index),
      ...fields.slice(index + 1),
    ]);
    setEdits((edits) => [
      ...edits,
      { type: "remove", index: index, old_field: old_value },
    ]);
  };

  const undo = () => {
    let edit = edits[edits.length - 1];
    switch (edit.type) {
      case "remove":
        addField(edit.index, edit.old_field);
        break;
      default:
        let field = fields[edit.index];
        if (!edit.old_value) break;
        if (edit.type === "number") field[edit.type] = parseInt(edit.old_value);
        else field[edit.type] = edit.old_value;

        setFields((fields) => [
          ...fields.slice(0, edit.index),
          field,
          ...fields.slice(edit.index + 1),
        ]);
    }
    setEdits((edits) => edits.slice(0, edits.length - 1));
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
          <button onClick={remove(index)}>-</button>
        </ProtobufField>
      ))}
      <button onClick={() => addField()}>+</button>
      <button onClick={submit}>Save</button>
      <button onClick={undo}>Undo</button>
    </Wrapper>
  );
}

export default Message;
