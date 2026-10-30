import https from 'https';

const SUPABASE_URL = 'ectfmfydnlvguixhzbmy.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g';

const books = [
  {
    title: 'Software Engineering: Principles & Lecture Notes',
    author: 'Roger S. Pressman / Karunya University CS',
    isbn: '978-0078022128',
    description: 'Comprehensive study manual covering Agile lifecycle, requirements modeling, architectural design, verification, and testing methodologies for 25CS312.',
    category_id: 'f7ba349d-3f74-42ea-9ca8-fc8ee2609f47',
    file_path: '/books/software_engineering_principles.pdf',
    file_name: 'software_engineering_principles.pdf',
    file_size: 6348,
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
    category_id: 'f7ba349d-3f74-42ea-9ca8-fc8ee2609f47',
    file_path: '/books/clean_architecture_handbook.pdf',
    file_name: 'clean_architecture_handbook.pdf',
    file_size: 4710,
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
    category_id: '8376f273-50ee-4608-bf55-4922b94f19d7',
    file_path: '/books/architecture_of_a_dbms.pdf',
    file_name: 'architecture_of_a_dbms.pdf',
    file_size: 3174,
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
    category_id: '3d5a1ff5-23d3-4ac7-b461-d577281cad28',
    file_path: '/books/ai_modern_approach.pdf',
    file_name: 'ai_modern_approach.pdf',
    file_size: 2969,
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
    category_id: '16ea25d6-72d7-481f-bbf3-86617f8ba2ff',
    file_path: '/books/whirlwind_tour_of_python.pdf',
    file_name: 'whirlwind_tour_of_python.pdf',
    file_size: 2867,
    file_type: 'application/pdf',
    cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    tags: ['Python', 'Data Science', 'Open Access', 'Programming'],
    is_published: true,
    download_count: 278,
  }
];

// Delete previous records and re-insert fresh
function executeUpdate() {
  const delReq = https.request({
    hostname: SUPABASE_URL,
    path: '/rest/v1/digital_assets?id=neq.00000000-0000-0000-0000-000000000000',
    method: 'DELETE',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    }
  }, (res) => {
    console.log('Cleared existing digital_assets, status:', res.statusCode);
    
    // Now insert updated items
    const insertData = JSON.stringify(books);
    const postReq = https.request({
      hostname: SUPABASE_URL,
      path: '/rest/v1/digital_assets',
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }, (insertRes) => {
      let b = '';
      insertRes.on('data', c => b += c);
      insertRes.on('end', () => {
        console.log('Insertion status:', insertRes.statusCode);
        if (insertRes.statusCode >= 200 && insertRes.statusCode < 300) {
          console.log('✅ Successfully seeded Supabase with verified free downloadable PDF books!');
        } else {
          console.error('❌ Insert error:', b);
        }
      });
    });
    postReq.write(insertData);
    postReq.end();
  });
  delReq.end();
}

executeUpdate();
