import React from 'react';
import ChatItem from './ChatItem';

interface ChatReference {
  id: string;
  name: string;
  lastMessage: string;
}

interface ChatListProps {
  chatList: ChatReference[];
}

const ChatList: React.FC<ChatListProps> = ({ chatList }) => {
  return (
    <div className="chat-list">
      {chatList.length > 0 ? (
        chatList.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
};

export default ChatList;