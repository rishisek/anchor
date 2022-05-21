import styled from "styled-components";
import Message from "./Message";

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
      <Message />
    </Wrapper>
  );
}

export default App;
