import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onDeleteConversation 
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conv => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={currentConversationId === conv.id}
          onClick={() => onSelectConversation(conv.id)}
          onDelete={onDeleteConversation}
        />
      ))}
    </div>
  );
};

export default ConversationList;

