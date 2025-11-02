import React from 'react';
import ConversationList from './ConversationList';

const Sidebar = ({ 
  conversations, 
  currentConversationId, 
  onNewConversation, 
  onSelectConversation, 
  onDeleteConversation 
}) => {
  return (
    <div className="w-72 bg-white border-r shadow-sm flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-bold text-blue-600 text-lg">My Chats</div>
        <button 
          onClick={onNewConversation} 
          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600"
        >
          +
        </button>
      </div>
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
      />
    </div>
  );
};

export default Sidebar;

