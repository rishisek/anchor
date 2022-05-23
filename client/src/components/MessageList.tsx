import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  text-align: center;
  background-color: grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  position: absolute;
  right: 0;
`;

function MessageList() {
  let [messages, setMessages] = useState<Array<string>>([]);
  useEffect(() => {
    axios.get("/proto/messages").then((res) => setMessages(res.data));
  }, []);
  return (
    <Wrapper>
      {messages.map((message) => (
        <Link to={message}>{message}</Link>
      ))}
    </Wrapper>
  );
}

export default MessageList;
