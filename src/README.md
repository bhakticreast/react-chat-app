# Project Structure Documentation

This document explains the improved project structure and organization of the ChatGPT app.

## Directory Structure

```
src/
├── components/           # React components organized by feature
│   ├── Chat/            # Chat-related components
│   │   ├── ChatArea.jsx           # Main chat container
│   │   ├── MessageList.jsx        # Displays list of messages
│   │   ├── MessageBubble.jsx      # Individual message component
│   │   └── ChatInput.jsx          # Input field and send button
│   └── Sidebar/         # Sidebar-related components
│       ├── Sidebar.jsx            # Main sidebar container
│       ├── ConversationList.jsx   # List of conversations
│       └── ConversationItem.jsx   # Individual conversation item
├── hooks/               # Custom React hooks
│   ├── useConversations.js        # Manages conversation state and operations
│   └── useMessages.js             # Manages message state and operations
├── services/            # External service integrations
│   ├── supabase.js               # Supabase client and database operations
│   └── api.js                    # Perplexity AI API integration
├── constants/           # Configuration constants
│   └── config.js                 # App-wide configuration values
├── App.js              # Main application component
├── App.css             # Application styles
└── index.js            # Application entry point
```

## Component Architecture

### Components
Each component has a single responsibility and receives props for maximum reusability:

- **Sidebar**: Displays conversation history and new chat button
- **ConversationList**: Renders multiple conversation items
- **ConversationItem**: Individual conversation with title, date, and delete button
- **ChatArea**: Main chat interface container
- **MessageList**: Displays all messages in the current conversation
- **MessageBubble**: Individual message with markdown support
- **ChatInput**: User input field with send functionality

### Custom Hooks
Hooks encapsulate business logic and state management:

- **useConversations**: Handles all conversation-related operations (CRUD)
- **useMessages**: Manages messages and chat API interactions

### Services
Services abstract external integrations:

- **supabase.js**: Database operations for conversations and messages
- **api.js**: API calls to Perplexity AI

### Constants
Centralized configuration for easy maintenance:

- **config.js**: Rate limits, API settings, system prompts

## Benefits of This Structure

1. **Separation of Concerns**: UI, business logic, and data access are separated
2. **Reusability**: Components can be easily reused or replaced
3. **Maintainability**: Easy to find and modify specific functionality
4. **Testability**: Each module can be tested independently
5. **Scalability**: Easy to add new features without affecting existing code
6. **Readability**: Clear organization makes the codebase easier to understand

## How to Add New Features

### Adding a new component:
1. Create a new file in the appropriate `components/` subdirectory
2. Import and use it in the parent component

### Adding new business logic:
1. Create a custom hook in `hooks/` directory
2. Import and use it in your components

### Adding new API integrations:
1. Create a service file in `services/` directory
2. Export functions that encapsulate the API calls

### Adding configuration:
1. Add constants to `constants/config.js`
2. Import where needed

## Migration from Old Structure

The refactoring transformed a monolithic 273-line `App.js` into:
- 1 main App component (45 lines)
- 11 modular files with clear responsibilities
- Better code organization and maintainability

