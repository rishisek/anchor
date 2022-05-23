import styled from "styled-components";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Select from "components/Select";
import Input from "components/Input";
import { IMessage, IField } from "@server/models/message";
import { useParams } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
`;

const Form = styled.div``;
const Render = styled.div``;

const ProtobufField = styled.div``;

interface Edit {
  type: "type" | "name" | "number" | "remove";
  index: number;
  old_value?: string | undefined;
  old_field?: IField;
}

const Message = () => {
  let params = useParams();
  let [edits, setEdits] = useState<Array<Edit>>([]);
  let [fields, setFields] = useState<Array<IField>>([{} as IField]);
  let [isNew, setIsNew] = useState<boolean>(false);
  let [render, setRender] = useState<string>("");

  const refreshRender = useCallback(() => {
    axios
      .get(`/proto/${params.name}`)
      .then((res) => {
        setRender(res.data);
      })
      .catch((err) => setIsNew(true));
  }, [params.name]);

  useEffect(() => {
    axios
      .get(`/proto/${params.name}?json=true`)
      .then((res) => {
        let message = res.data as IMessage;
        setFields(message.fields);
        refreshRender();
      })
      .catch((err) => setIsNew(true));
  }, [params.name, refreshRender]);

  const addField = (index = fields.length, field = {} as IField) => {
    setFields((fields) => [
      ...fields.slice(0, index),
      field,
      ...fields.slice(index),
    ]);
  };

  const submit = () => {
    axios
      .post(isNew ? "/proto/create" : "/proto/update", {
        name: params.name,
        fields: fields,
      })
      .then((res) => {
        console.log(res);
        setIsNew(false);
      })
      .catch((e) => console.log(e));
    refreshRender();
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
        {
          type: prop,
          index: index,
          old_value: old_value === undefined ? undefined : old_value.toString(),
        },
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
      <Form>
        <p>{params.name}</p>
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
      </Form>
      <Render>{render}</Render>
    </Wrapper>
  );
};

export default Message;
