import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const ChatInput = forwardRef(({ 
  value, 
  onChange, 
  onSend, 
  disabled, 
  loading 
}, ref) => {
  const textareaRef = useRef(null);

  // Expose focus method to parent components
  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && !loading) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-gray-700 bg-[#343541] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center bg-[#40414f] rounded-lg shadow-lg border border-gray-700 focus-within:border-gray-600 transition-colors">
          <textarea
            ref={textareaRef}
            rows="1"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white p-4 pr-12 resize-none outline-none placeholder-gray-400 max-h-48 overflow-y-auto"
            placeholder={disabled ? "Select a conversation to start chatting..." : "Send a message..."}
            disabled={disabled}
            style={{
              minHeight: '24px',
              maxHeight: '200px',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <button
            onClick={onSend}
            disabled={loading || disabled || !value.trim()}
            className={`absolute right-3 p-2 rounded-md transition-all ${
              loading || disabled || !value.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#10a37f] text-white hover:bg-[#1a7f64]'
            }`}
            title="Send message"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <div className="text-xs text-center text-gray-500 mt-3">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;

