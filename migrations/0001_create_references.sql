CREATE TABLE IF NOT EXISTS vault_references (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  collection TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  creator_name TEXT,
  creator_url TEXT,
  location TEXT,
  year TEXT,
  description TEXT,
  image_url TEXT,
  image TEXT,
  source_label TEXT,
  source_url TEXT,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (collection, subcategory, slug)
);

CREATE INDEX IF NOT EXISTS references_gallery
  ON vault_references (collection, subcategory, published, created_at);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  ip TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
