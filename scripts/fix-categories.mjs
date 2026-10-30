const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g'

const CATEGORIES = [
  { name: 'Artificial Intelligence', icon: '\u{1F916}', description: 'Machine learning, deep learning, NLP, computer vision' },
  { name: 'Computer Science',        icon: '\u{1F4BB}', description: 'Core CS: algorithms, data structures, OS, networks' },
  { name: 'Data Science',            icon: '\u{1F4CA}', description: 'Data analysis, visualization, pandas, R, statistics' },
  { name: 'Electronics',             icon: '\u26A1',     description: 'Circuits, digital systems, embedded systems, VLSI' },
  { name: 'Mathematics',             icon: '\u{1F4D0}', description: 'Calculus, linear algebra, discrete math, statistics' },
  { name: 'Physics',                 icon: '\u269B\uFE0F', description: 'Classical mechanics, electromagnetism, quantum physics' },
  { name: 'Research Papers',         icon: '\u{1F4C4}', description: 'Academic journals, conference papers, preprints' },
  { name: 'Software Engineering',    icon: '\u2699\uFE0F', description: 'SE process, design patterns, testing, architecture' },
]

const H = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'apikey': SERVICE_KEY,
}

async function main() {
  // Update each category icon by name using PATCH
  console.log('🔧 Updating emoji icons for each category...\n')
  for (const cat of CATEGORIES) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?name=eq.${encodeURIComponent(cat.name)}`,
      {
        method: 'PATCH',
        headers: { ...H, 'Prefer': 'return=representation' },
        body: JSON.stringify({ icon: cat.icon }),
      }
    )
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      console.log(`   ✅  ${data[0].icon}  ${data[0].name}`)
    } else {
      // Category doesn't exist yet — insert it
      const ins = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
        method: 'POST',
        headers: { ...H, 'Prefer': 'return=representation' },
        body: JSON.stringify([{ name: cat.name, icon: cat.icon, description: cat.description }]),
      })
      const insData = await ins.json()
      if (Array.isArray(insData) && insData[0]) {
        console.log(`   ➕  ${insData[0].icon}  ${insData[0].name}  (created)`)
      } else {
        console.log(`   ❌  ${cat.name}: ${JSON.stringify(insData)}`)
      }
    }
  }
  console.log('\n✅ All categories updated with correct emoji!')
}

main().catch(console.error)
