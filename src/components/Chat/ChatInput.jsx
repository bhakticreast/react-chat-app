import React from 'react';

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  disabled, 
  loading 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled && !loading) {
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t flex items-center gap-3 shadow">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="flex-1 p-2 border rounded-full shadow-sm focus:outline-blue-400"
        placeholder="Type your message…"
        disabled={disabled}
      />
      <button
        onClick={onSend}
        className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full shadow"
        disabled={loading || disabled}
        title="Send"
      >
        <svg 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          transform="rotate(-45)matrix(-1, 0, 0, -1, 0, 0)"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path 
              d="M14.4376 15.3703L12.3042 19.5292C11.9326 20.2537 10.8971 20.254 10.525 19.5297L4.24059 7.2971C3.81571 6.47007 4.65077 5.56156 5.51061 5.91537L18.5216 11.2692C19.2984 11.5889 19.3588 12.6658 18.6227 13.0704L14.4376 15.3703ZM14.4376 15.3703L5.09594 6.90886" 
              stroke="#000000" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;

