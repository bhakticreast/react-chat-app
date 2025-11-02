import React, { useRef, useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import { useConversations } from './hooks/useConversations';
import { useMessages } from './hooks/useMessages';
import './App.css';

function App() {
  const chatInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation
  } = useConversations();

  const {
    messages,
    loading,
    sendMessage
  } = useMessages(
    currentConversationId, 
    setCurrentConversationId,
    updateConversationTitle, 
    createNewConversation
  );

  const handleNewConversation = () => {
    // Just clear the current conversation - don't create in DB yet
    setCurrentConversationId(null);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
    // Focus the input field after a brief delay to ensure state updates
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 0);
  };

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#343541] overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <ChatArea
        ref={chatInputRef}
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        onToggleSidebar={toggleSidebar}
        onNewConversation={handleNewConversation}
      />
    </div>
  );
}

export default App;
