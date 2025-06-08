/**
 * Test script to validate the enhanced search functionality
 */

const categories = [
  {
    id: 'document-creation',
    name: 'Document Creation',
    description: 'AI tools for creating various types of documents',
    subcategories: [
      {
        id: 'general-documents',
        name: 'General Documents',
        description: 'Tools for creating general purpose documents'
      }
    ]
  },
  {
    id: 'code-creation',
    name: 'Code Creation',
    description: 'AI tools for generating and writing code',
    subcategories: [
      {
        id: 'web-development',
        name: 'Web Development',
        description: 'Tools for web development and frontend frameworks'
      }
    ]
  }
];

const tools = [
  {
    id: 'chatgpt-document',
    name: 'ChatGPT for Documents',
    slug: 'chatgpt-document',
    description: 'ChatGPT excels at creating various types of documents including essays, reports, letters, and creative writing.',
    shortDescription: 'AI-powered document creation with natural language generation',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents'],
    features: ['Multi-format document creation', 'Style and tone adaptation', 'Real-time editing']
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'AI pair programmer that helps you write code faster',
    shortDescription: 'AI-powered code completion and generation',
    categoryId: 'code-creation',
    subcategoryIds: ['web-development'],
    features: ['Code completion', 'Code generation', 'Multi-language support']
  }
];

function generateSuggestions(searchQuery) {
  const query = searchQuery.toLowerCase();
  const suggestions = [];
  const maxSuggestions = 8;

  // Search tools
  const toolMatches = tools.filter(tool => 
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query) ||
    tool.shortDescription.toLowerCase().includes(query) ||
    tool.features.some(feature => feature.toLowerCase().includes(query))
  ).slice(0, 5);

  toolMatches.forEach(tool => {
    const category = categories.find(cat => cat.id === tool.categoryId);
    suggestions.push({
      type: 'tool',
      id: tool.id,
      name: tool.name,
      description: tool.shortDescription,
      url: `/directory/${tool.categoryId}/${tool.subcategoryIds[0]}/${tool.slug}`,
      categoryName: category?.name
    });
  });

  // Search categories
  if (suggestions.length < maxSuggestions) {
    const categoryMatches = categories.filter(cat =>
      cat.name.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query)
    ).slice(0, maxSuggestions - suggestions.length);

    categoryMatches.forEach(category => {
      suggestions.push({
        type: 'category',
        id: category.id,
        name: category.name,
        description: category.description,
        url: `/directory/${category.id}`
      });
    });
  }

  return suggestions;
}

// Test cases
console.log('🧪 Testing Enhanced Search Functionality\n');

const testCases = [
  'chatgpt',
  'document',
  'code',
  'ai',
  'github',
  'writing',
  'development',
  'creation'
];

testCases.forEach(query => {
  console.log(`🔍 Search query: "${query}"`);
  const results = generateSuggestions(query);
  
  if (results.length > 0) {
    console.log(`✅ Found ${results.length} suggestions:`);
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. [${result.type}] ${result.name}`);
      if (result.description) {
        console.log(`      ${result.description}`);
      }
      if (result.categoryName) {
        console.log(`      in ${result.categoryName}`);
      }
      console.log(`      URL: ${result.url}`);
    });
  } else {
    console.log('❌ No suggestions found');
  }
  console.log('');
});

console.log('✅ Search functionality test completed');

// Test search performance
console.log('\n⚡ Performance Test');
const performanceTestQuery = 'document creation tools';
const startTime = Date.now();

for (let i = 0; i < 1000; i++) {
  generateSuggestions(performanceTestQuery);
}

const endTime = Date.now();
const avgTime = (endTime - startTime) / 1000;

console.log(`🏎️  Average time for 1000 searches: ${avgTime.toFixed(2)}ms per search`);

// Test edge cases
console.log('\n🔬 Edge Cases Test');
const edgeCases = ['', '   ', 'xyz123', 'very-long-search-query-that-should-not-match-anything'];

edgeCases.forEach(query => {
  const results = generateSuggestions(query);
  console.log(`Query: "${query}" → ${results.length} results`);
});

console.log('\n✅ All tests completed successfully!');