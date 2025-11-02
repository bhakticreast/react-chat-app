import React from 'react';

const ConversationItem = ({ conversation, isActive, onClick, onDelete }) => {
  return (
    <div 
      className={`group flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <div className="flex-1 overflow-hidden">
        <div className="text-sm text-gray-100 truncate">{conversation.title || 'New Chat'}</div>
      </div>
      <button 
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation.id);
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default ConversationItem;

