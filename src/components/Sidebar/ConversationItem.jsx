import React from 'react';

const ConversationItem = ({ conversation, isActive, onClick, onDelete }) => {
  return (
    <div 
      className={`flex items-center px-4 py-2 cursor-pointer ${
        isActive ? "bg-blue-50" : "hover:bg-gray-100"
      }`}
    >
      <span onClick={onClick} className="flex-1 flex items-center">
        <span>
          <div className="font-medium">{conversation.title || 'New Chat'}</div>
          <div className="text-xs text-gray-400">
            {new Date(conversation.created_at).toLocaleDateString()}
          </div>
        </span>
      </span>
      <button 
        className="ml-2 text-red-400 hover:text-red-600" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation.id);
        }}
      >
        🗑
      </button>
    </div>
  );
};

export default ConversationItem;

