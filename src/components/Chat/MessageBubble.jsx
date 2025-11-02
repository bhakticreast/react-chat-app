import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`group w-full ${isUser ? 'bg-[#343541]' : 'bg-[#444654]'} border-b border-gray-800/50 animate-fadeIn`}>
      <div className="max-w-4xl mx-auto px-4 py-6 flex gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-white font-semibold ${
            isUser ? 'bg-[#5436DA]' : 'bg-[#10a37f]'
          }`}>
            {isUser ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <div className="flex-1 overflow-hidden">
          <div className="prose prose-invert max-w-none text-gray-100 leading-7">
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? 
                    <code className="bg-black/30 rounded px-1 py-0.5 text-sm text-gray-200" {...props} /> :
                    <code className="block bg-black/30 rounded p-4 text-sm overflow-x-auto" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-black/30 rounded p-4 overflow-x-auto mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

