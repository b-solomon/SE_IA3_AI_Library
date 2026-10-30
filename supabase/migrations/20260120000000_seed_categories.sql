-- Default categories seed
INSERT INTO public.categories (name, description, icon) VALUES
    ('Computer Science',     'Core CS: algorithms, data structures, OS, networks', '💻'),
    ('Software Engineering', 'SE process, design patterns, testing, architecture', '⚙️'),
    ('Artificial Intelligence', 'Machine learning, deep learning, NLP, computer vision', '🤖'),
    ('Mathematics',          'Calculus, linear algebra, discrete math, statistics', '📐'),
    ('Physics',              'Classical mechanics, electromagnetism, quantum physics', '⚛️'),
    ('Data Science',         'Data analysis, visualization, pandas, R, statistics', '📊'),
    ('Electronics',          'Circuits, digital systems, embedded systems, VLSI', '🔌'),
    ('Research Papers',      'Academic journals, conference papers, preprints', '📄')
ON CONFLICT (name) DO NOTHING;
