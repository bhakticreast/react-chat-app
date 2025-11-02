import React from 'react';
import ConversationList from './ConversationList';

const Sidebar = ({ 
  conversations, 
  currentConversationId, 
  onNewConversation, 
  onSelectConversation, 
  onDeleteConversation,
  isOpen,
  onClose
}) => {
  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-64 bg-[#202123] flex flex-col h-screen border-r border-gray-700
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-2">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* New chat button - hidden on mobile, visible on desktop */}
      <div className="p-3 hidden lg:block">
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
      {/* Chats header */}
      <div className="px-5 py-2 border-t border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chats</h2>
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

