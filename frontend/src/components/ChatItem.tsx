import React from 'react';

interface ChatReference {
  id: string;
  name: string;
  lastMessage: string;
}

interface ChatItemProps {
  chat: ChatReference;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
  return (
    <div className="chat-item">
      <h3>{chat.name}</h3>
      <p>{chat.lastMessage}</p>
    </div>
  );
};

export default ChatItem;