import React from "react";
import { useParams } from "react-router-dom";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "./../../VintedCSS/ChatCss/ChatPage.css";

const ChatPage: React.FC<{ userId: number }> = ({ userId }) => {
  const { chatRoomId } = useParams<{ chatRoomId?: string }>();

  console.log(localStorage.getItem("productDetails"));
  return (
    <div className="chat-page">
  {!chatRoomId ? <ChatList userId={userId} /> : <ChatRoom />}
</div>
  );
};

export default ChatPage;
