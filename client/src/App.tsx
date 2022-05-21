import React from "react";
import styled from "styled-components";
import Select from "components/Select";
import Input from "components/Input";

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

function App() {
  return (
    <Wrapper>
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Select options={["stringf", "int"]} />
      <Input placeholder="Name" />
    </Wrapper>
  );
}

export default App;
