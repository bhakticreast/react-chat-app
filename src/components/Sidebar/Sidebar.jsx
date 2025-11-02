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
    <div className="w-64 bg-[#202123] flex flex-col h-screen border-r border-gray-700">
      <div className="p-3">
        <button 
          onClick={onNewConversation} 
          className="w-full flex items-center justify-center gap-3 p-3 rounded-lg border border-gray-600 hover:bg-gray-700 text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">New chat</span>
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

