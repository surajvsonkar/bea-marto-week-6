-- ============================================================
-- CardVault — Seed Data
-- Run this AFTER 001_schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- CATEGORIES (8 categories with distinct colors)
-- ============================================================

INSERT INTO categories (name, slug, color) VALUES
  ('Technology',     'technology',     '#14b8a6'),
  ('Design',         'design',         '#f472b6'),
  ('Marketing',      'marketing',      '#fb923c'),
  ('Finance',        'finance',        '#a78bfa'),
  ('Healthcare',     'healthcare',     '#34d399'),
  ('Education',      'education',      '#60a5fa'),
  ('Real Estate',    'real-estate',    '#fbbf24'),
  ('Food & Beverage','food-beverage',  '#f87171');

-- ============================================================
-- CARDS (20+ sample business cards)
-- Each has a unique DiceBear avatar seed
-- ============================================================

-- Technology (4 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Alex Rivera',      'Senior Software Engineer',    'NovaTech Solutions',   'alex.r@novatech.io',       '(555) 100-2001', 'https://novatech.io',       (SELECT id FROM categories WHERE slug = 'technology'), 'alex-rivera'),
  ('Priya Sharma',     'DevOps Lead',                 'CloudScale Inc.',      'priya@cloudscale.dev',     '(555) 100-2002', 'https://cloudscale.dev',    (SELECT id FROM categories WHERE slug = 'technology'), 'priya-sharma'),
  ('Marcus Johnson',   'Full-Stack Developer',        'ByteCraft Labs',       'marcus.j@bytecraft.co',    '(555) 100-2003', NULL,                        (SELECT id FROM categories WHERE slug = 'technology'), 'marcus-johnson'),
  ('Yuki Tanaka',      'AI Research Engineer',         'DeepMind Studio',      'yuki.t@deepmindstudio.ai', NULL,             'https://deepmindstudio.ai', (SELECT id FROM categories WHERE slug = 'technology'), 'yuki-tanaka');

-- Design (3 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Sofia Chen',       'UX Design Director',          'PixelForge',           'sofia@pixelforge.design',  '(555) 200-3001', 'https://pixelforge.design', (SELECT id FROM categories WHERE slug = 'design'), 'sofia-chen'),
  ('Liam O''Brien',    'Brand Identity Designer',     'Mosaic Creative',      'liam@mosaiccreative.co',   '(555) 200-3002', 'https://mosaiccreative.co', (SELECT id FROM categories WHERE slug = 'design'), 'liam-obrien'),
  ('Aisha Patel',      'Motion Graphics Artist',      'FrameWave Studio',     'aisha@framewave.art',      NULL,             'https://framewave.art',     (SELECT id FROM categories WHERE slug = 'design'), 'aisha-patel');

-- Marketing (3 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Jordan Blake',     'Growth Marketing Manager',    'LaunchPad Agency',     'jordan@launchpad.mktg',    '(555) 300-4001', 'https://launchpad.mktg',    (SELECT id FROM categories WHERE slug = 'marketing'), 'jordan-blake'),
  ('Emma Larsson',     'Content Strategist',          'NarrativeHQ',          'emma@narrativehq.com',     '(555) 300-4002', NULL,                        (SELECT id FROM categories WHERE slug = 'marketing'), 'emma-larsson'),
  ('Carlos Mendez',    'SEO Specialist',              'RankRise Digital',     'carlos@rankrise.io',       '(555) 300-4003', 'https://rankrise.io',       (SELECT id FROM categories WHERE slug = 'marketing'), 'carlos-mendez');

-- Finance (2 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Rachel Adler',     'Financial Analyst',           'Summit Capital',       'rachel@summitcap.com',     '(555) 400-5001', 'https://summitcap.com',     (SELECT id FROM categories WHERE slug = 'finance'), 'rachel-adler'),
  ('David Kim',        'Investment Advisor',          'Horizon Wealth',       'david.k@horizonwealth.co', '(555) 400-5002', 'https://horizonwealth.co',  (SELECT id FROM categories WHERE slug = 'finance'), 'david-kim');

-- Healthcare (3 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Dr. Nadia Osei',   'Chief Medical Officer',       'VitalCare Clinics',    'nadia@vitalcare.med',      '(555) 500-6001', 'https://vitalcare.med',     (SELECT id FROM categories WHERE slug = 'healthcare'), 'nadia-osei'),
  ('James Torres',     'Health Tech Researcher',      'BioSync Labs',         'james.t@biosync.io',       '(555) 500-6002', NULL,                        (SELECT id FROM categories WHERE slug = 'healthcare'), 'james-torres'),
  ('Fatima Al-Rashid', 'Pharmacy Director',           'MedPrime Rx',          'fatima@medprimerx.com',    '(555) 500-6003', 'https://medprimerx.com',    (SELECT id FROM categories WHERE slug = 'healthcare'), 'fatima-alrashid');

-- Education (2 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Prof. Ian Clarke', 'Dean of Computer Science',    'Pacific University',   'iclarke@pacific.edu',      '(555) 600-7001', 'https://pacific.edu',       (SELECT id FROM categories WHERE slug = 'education'), 'ian-clarke'),
  ('Maya Thompson',    'EdTech Product Manager',      'LearnSphere',          'maya@learnsphere.io',      '(555) 600-7002', 'https://learnsphere.io',    (SELECT id FROM categories WHERE slug = 'education'), 'maya-thompson');

-- Real Estate (2 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Robert Chang',     'Commercial Real Estate Agent','Keystone Properties',  'robert@keystoneprop.com',  '(555) 700-8001', 'https://keystoneprop.com',  (SELECT id FROM categories WHERE slug = 'real-estate'), 'robert-chang'),
  ('Sarah Mitchell',   'Property Manager',            'Urban Nest Realty',    'sarah@urbannest.co',       '(555) 700-8002', 'https://urbannest.co',      (SELECT id FROM categories WHERE slug = 'real-estate'), 'sarah-mitchell');

-- Food & Beverage (2 cards)
INSERT INTO cards (name, title, company, email, phone, website, category_id, avatar_seed) VALUES
  ('Chef Marco Rossi', 'Executive Chef',              'Oro Bistro',           'marco@orobistro.com',      '(555) 800-9001', 'https://orobistro.com',     (SELECT id FROM categories WHERE slug = 'food-beverage'), 'marco-rossi'),
  ('Lucia Fernandez',  'Pastry Chef & Owner',         'Dulce Vida Bakery',    'lucia@dulcevida.cafe',     '(555) 800-9002', 'https://dulcevida.cafe',    (SELECT id FROM categories WHERE slug = 'food-beverage'), 'lucia-fernandez');
