import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import { useConversations } from './hooks/useConversations';
import { useMessages } from './hooks/useMessages';
import './App.css';

function App() {
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
  } = useMessages(currentConversationId, updateConversationTitle);

  const handleNewConversation = async () => {
    await createNewConversation();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={deleteConversation}
      />
      <ChatArea
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        currentConversationId={currentConversationId}
      />
    </div>
  );
}

export default App;
