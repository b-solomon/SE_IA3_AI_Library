import https from 'https';

const SUPABASE_URL = 'ectfmfydnlvguixhzbmy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g';

const books = [
  {
    title: 'Software Engineering: Principles & Lecture Notes',
    author: 'Roger S. Pressman / HKBU CS',
    isbn: '978-0078022128',
    description: 'Comprehensive study manual covering Agile lifecycle, requirements modeling, architectural design, verification, and testing methodologies for 25CS312.',
    category_id: 'f7ba349d-3f74-42ea-9ca8-fc8ee2609f47', // Software Engineering
    file_path: 'https://www.comp.hkbu.edu.hk/~chxw/teaching/comp7330/SE_lecture_notes.pdf',
    file_name: 'SE_lecture_notes.pdf',
    file_size: 14889728,
    file_type: 'application/pdf',
    cover_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    tags: ['Software Engineering', 'UML', 'Testing', 'Agile', '25CS312'],
    is_published: true,
    download_count: 342,
  },
  {
    title: 'Clean Architecture & Object-Oriented Design Handbook',
    author: 'Robert C. Martin (Uncle Bob)',
    isbn: '978-0134494166',
    description: 'Universal rules of software structure, SOLID principles, high cohesion, low coupling, dependency inversion, and component boundaries.',
    category_id: 'f7ba349d-3f74-42ea-9ca8-fc8ee2609f47', // Software Engineering
    file_path: 'https://www.cs.colorado.edu/~kena/classes/5828/s12/presentation-materials/cleancode.pdf',
    file_name: 'Clean_Code_Handbook.pdf',
    file_size: 9122611,
    file_type: 'application/pdf',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    tags: ['Architecture', 'Clean Code', 'SOLID', 'Design Patterns'],
    is_published: true,
    download_count: 512,
  },
  {
    title: 'Architecture of a Database System (MIT / Berkeley)',
    author: 'Joseph M. Hellerstein, Michael Stonebraker, James Hamilton',
    isbn: '978-1601980786',
    description: 'Architectural breakdown of relational database management systems: process models, query compilation, storage management, transaction isolation, and logging.',
    category_id: '8376f273-50ee-4608-bf55-4922b94f19d7', // Computer Science
    file_path: 'https://nms.csail.mit.edu/~amitt/papers/architecture_of_a_dbms.pdf',
    file_name: 'architecture_of_a_dbms.pdf',
    file_size: 1258291,
    file_type: 'application/pdf',
    cover_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
    tags: ['Database', 'PostgreSQL', 'Storage', 'Distributed Systems'],
    is_published: true,
    download_count: 420,
  },
  {
    title: 'Artificial Intelligence: A Modern Approach (Foundations)',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    description: 'The standard text on artificial intelligence: intelligent agents, search algorithms, knowledge representation, neural networks, and LLMs.',
    category_id: '3d5a1ff5-23d3-4ac7-b461-d577281cad28', // AI
    file_path: 'https://people.cs.pitt.edu/~milos/courses/cs2710/Lectures/Intro.pdf',
    file_name: 'AI_Modern_Approach_Intro.pdf',
    file_size: 2154382,
    file_type: 'application/pdf',
    cover_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    tags: ['Artificial Intelligence', 'Gemini', 'Machine Learning', 'Search'],
    is_published: true,
    download_count: 689,
  },
  {
    title: 'A Whirlwind Tour of Python (O’Reilly Open Series)',
    author: 'Jake VanderPlas',
    isbn: '978-1491964651',
    description: 'Fast-paced, essential guide to the Python programming language designed for engineers, data scientists, and computational researchers.',
    category_id: '16ea25d6-72d7-481f-bbf3-86617f8ba2ff', // Data Science
    file_path: 'https://raw.githubusercontent.com/jakevdp/WhirlwindTourOfPython/master/WhirlwindTourOfPython.pdf',
    file_name: 'WhirlwindTourOfPython.pdf',
    file_size: 2411724,
    file_type: 'application/pdf',
    cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    tags: ['Python', 'Data Science', 'Open Access', 'Programming'],
    is_published: true,
    download_count: 278,
  }
];

function insertBooks() {
  const data = JSON.stringify(books);
  const options = {
    hostname: SUPABASE_URL,
    path: '/rest/v1/digital_assets',
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Successfully added books to Supabase digital_assets table!');
        console.log('Inserted items count:', JSON.parse(body).length);
      } else {
        console.error('❌ Insert failed:', body);
      }
    });
  });

  req.on('error', err => console.error('Request error:', err));
  req.write(data);
  req.end();
}

insertBooks();
