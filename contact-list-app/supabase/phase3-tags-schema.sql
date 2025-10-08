-- Phase 3: Contact Tagging/Grouping System
-- This migration adds support for tags and tag-contact relationships

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6', -- Default blue color
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name) -- Prevent duplicate tag names per user
);

-- Create contact_tags junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS contact_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(contact_id, tag_id) -- Prevent duplicate tag assignments
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
CREATE INDEX IF NOT EXISTS contact_tags_contact_id_idx ON contact_tags(contact_id);
CREATE INDEX IF NOT EXISTS contact_tags_tag_id_idx ON contact_tags(tag_id);

-- Enable Row Level Security on tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on contact_tags
ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own tags" ON tags;
DROP POLICY IF EXISTS "Users can insert their own tags" ON tags;
DROP POLICY IF EXISTS "Users can update their own tags" ON tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON tags;

DROP POLICY IF EXISTS "Users can view their own contact_tags" ON contact_tags;
DROP POLICY IF EXISTS "Users can insert their own contact_tags" ON contact_tags;
DROP POLICY IF EXISTS "Users can delete their own contact_tags" ON contact_tags;

-- RLS Policies for tags table
CREATE POLICY "Users can view their own tags"
  ON tags
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON tags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for contact_tags table
-- Users can only manage tags for their own contacts
CREATE POLICY "Users can view their own contact_tags"
  ON contact_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = contact_tags.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own contact_tags"
  ON contact_tags
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = contact_tags.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own contact_tags"
  ON contact_tags
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM contacts
      WHERE contacts.id = contact_tags.contact_id
      AND contacts.user_id = auth.uid()
    )
  );

-- Create trigger to automatically update tags updated_at
DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for contacts with their tags (for easier querying)
CREATE OR REPLACE VIEW contacts_with_tags AS
SELECT 
  c.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'color', t.color
      )
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'::json
  ) as tags
FROM contacts c
LEFT JOIN contact_tags ct ON c.id = ct.contact_id
LEFT JOIN tags t ON ct.tag_id = t.id
GROUP BY c.id;
