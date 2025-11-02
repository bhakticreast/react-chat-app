-- Migration: Create conversations and messages tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Date: 2024

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table with TEXT column (unlimited length)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,  -- TEXT type has no character limit (up to ~1GB)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

-- If tables already exist and you need to alter the content column:
-- This ensures content column is TEXT (unlimited) if it was created differently
DO $$
BEGIN
  -- Check if content column exists and is not TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'content' 
    AND data_type != 'text'
  ) THEN
    ALTER TABLE messages 
    ALTER COLUMN content TYPE TEXT USING content::TEXT;
  END IF;
END $$;

-- Verify the schema
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('conversations', 'messages')
ORDER BY table_name, ordinal_position;
