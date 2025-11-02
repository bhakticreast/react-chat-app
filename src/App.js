import React, { useRef } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import { useConversations } from './hooks/useConversations';
import { useMessages } from './hooks/useMessages';
import './App.css';

function App() {
  const chatInputRef = useRef(null);

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
    // Focus the input field after a brief delay to ensure state updates
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="flex h-screen bg-[#343541] overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={deleteConversation}
      />
      <ChatArea
        ref={chatInputRef}
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

export default App;
