-- Forum Database Setup
-- Run this after setup-database.sql to add forum functionality

-- Create forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'message-circle',
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reply_user_id TEXT REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_last_reply_at ON forum_posts(last_reply_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created_at ON forum_replies(created_at ASC);

-- Enable Row Level Security
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for forum_categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON forum_categories
  FOR SELECT USING (is_active = TRUE);

-- Create policies for forum_posts
CREATE POLICY "Anyone can view posts" ON forum_posts
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own posts" ON forum_posts
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own posts" ON forum_posts
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for forum_replies
CREATE POLICY "Anyone can view replies" ON forum_replies
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create replies" ON forum_replies
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own replies" ON forum_replies
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own replies" ON forum_replies
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create function to update post reply count and last reply info
CREATE OR REPLACE FUNCTION update_post_reply_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts SET 
      reply_count = reply_count + 1,
      last_reply_at = NEW.created_at,
      last_reply_user_id = NEW.user_id,
      updated_at = NOW()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts SET 
      reply_count = reply_count - 1,
      updated_at = NOW()
    WHERE id = OLD.post_id;
    
    -- Update last reply info if this was the last reply
    UPDATE forum_posts SET
      last_reply_at = COALESCE(
        (SELECT created_at FROM forum_replies 
         WHERE post_id = OLD.post_id 
         ORDER BY created_at DESC LIMIT 1),
        forum_posts.created_at
      ),
      last_reply_user_id = COALESCE(
        (SELECT user_id FROM forum_replies 
         WHERE post_id = OLD.post_id 
         ORDER BY created_at DESC LIMIT 1),
        forum_posts.user_id
      )
    WHERE id = OLD.post_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create function to update category post count
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_categories SET 
      post_count = post_count + 1,
      updated_at = NOW()
    WHERE id = NEW.category_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_categories SET 
      post_count = post_count - 1,
      updated_at = NOW()
    WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update stats
CREATE TRIGGER update_post_reply_stats_trigger
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_stats();

CREATE TRIGGER update_category_post_count_trigger
  AFTER INSERT OR DELETE ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_forum_categories_updated_at BEFORE UPDATE ON forum_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default forum categories
INSERT INTO forum_categories (name, description, slug, color, icon) VALUES
  ('General Discussion', 'General crochet topics and conversations', 'general', '#3B82F6', 'message-circle'),
  ('Pattern Help', 'Get help with crochet patterns and techniques', 'pattern-help', '#10B981', 'help-circle'),
  ('Show & Tell', 'Share your finished crochet projects', 'show-tell', '#F59E0B', 'image'),
  ('CrocheTeX Support', 'Questions and support for the CrocheTeX platform', 'platform-support', '#8B5CF6', 'code'),
  ('Beginner Corner', 'A place for crochet beginners to ask questions', 'beginners', '#EF4444', 'heart'),
  ('Marketplace Discussion', 'Discuss buying and selling patterns', 'marketplace', '#6B7280', 'shopping-bag')
ON CONFLICT (slug) DO NOTHING; 