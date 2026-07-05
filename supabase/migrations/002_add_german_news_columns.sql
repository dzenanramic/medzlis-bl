-- Add German language columns to news table
ALTER TABLE news
ADD COLUMN IF NOT EXISTS title_de TEXT,
ADD COLUMN IF NOT EXISTS summary_de TEXT,
ADD COLUMN IF NOT EXISTS content_de TEXT;
