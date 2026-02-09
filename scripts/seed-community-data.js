/**
 * Seed Reviews, Forums, and Case Studies data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ============================================================
// Helper to generate slugs
// ============================================================
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ============================================================
// Seed Reviews
// ============================================================
async function seedReviews() {
  console.log('\n⭐ Seeding Reviews...');

  // Check if reviews already exist
  const { data: existingReviews } = await supabase
    .from('tool_reviews_v2')
    .select('id')
    .limit(1);

  if (existingReviews && existingReviews.length > 0) {
    const { count } = await supabase
      .from('tool_reviews_v2')
      .select('*', { count: 'exact', head: true });
    console.log(`   ✓ ${count} reviews already exist`);
    return;
  }

  // Get some sample tools
  const { data: tools } = await supabase
    .from('tools_v2')
    .select('id, slug, name')
    .limit(20);

  if (!tools || tools.length === 0) {
    console.log('   ⚠️  No tools found, skipping reviews');
    return;
  }

  const reviewTemplates = [
    { rating: 5, title: 'Excellent tool!', content: 'This tool has transformed our workflow. Highly recommended for anyone looking to improve productivity.' },
    { rating: 4.5, title: 'Very good experience', content: 'Great features and easy to use. A few minor issues but overall a solid product.' },
    { rating: 4, title: 'Solid performance', content: 'Does what it promises. The interface could be more intuitive but it gets the job done.' },
    { rating: 3.5, title: 'Good but has limitations', content: 'Works well for basic tasks. Advanced features could use some improvement.' },
    { rating: 5, title: 'Game changer!', content: 'Absolutely love this tool. It has saved us countless hours and improved our output quality.' },
    { rating: 4.5, title: 'Highly efficient', content: 'The automation capabilities are impressive. Integration with other tools is seamless.' },
    { rating: 4, title: 'Worth the investment', content: 'Good ROI. The learning curve is manageable and support is responsive.' },
    { rating: 3.5, title: 'Decent tool', content: 'Meets our needs but there are better alternatives. Pricing is fair.' },
  ];

  const userNames = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'James Wilson', 'Lisa Anderson', 'David Kim', 'Rachel Green', 'Tom Baker'];

  const reviews = [];
  tools.forEach((tool, idx) => {
    // Add 1-3 reviews per tool
    const numReviews = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numReviews; i++) {
      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      const userName = userNames[Math.floor(Math.random() * userNames.length)];

      reviews.push({
        tool_id: tool.id,
        user_name: userName,
        user_email: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
        user_avatar: `https://i.pravatar.cc/150?u=${userName}`,
        rating: template.rating,
        title: template.title,
        content: template.content.replace('This tool', tool.name),
        verified_purchase: Math.random() > 0.3,
        helpful_count: Math.floor(Math.random() * 50),
        unhelpful_count: Math.floor(Math.random() * 5),
        status: 'published',
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  });

  const { data, error } = await supabase
    .from('tool_reviews_v2')
    .insert(reviews)
    .select('id');

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return;
  }

  console.log(`   ✅ ${data.length} reviews seeded`);
}

// ============================================================
// Seed Forums
// ============================================================
async function seedForums() {
  console.log('\n💬 Seeding Forums...');

  // Create forum categories
  const categories = [
    { name: 'General Discussion', description: 'General AI tools discussion', slug: 'general', display_order: 1 },
    { name: 'Tool Comparisons', description: 'Compare different AI tools', slug: 'tool-comparisons', display_order: 2 },
    { name: 'Best Practices', description: 'Share tips and best practices', slug: 'best-practices', display_order: 3 },
    { name: 'Troubleshooting', description: 'Get help with issues', slug: 'troubleshooting', display_order: 4 },
    { name: 'Feature Requests', description: 'Suggest new features', slug: 'feature-requests', display_order: 5 },
  ];

  // Check if categories already exist
  const { data: existingCategories } = await supabase
    .from('forum_categories')
    .select('id, slug, name');

  let insertedCategories = existingCategories || [];

  if (!existingCategories || existingCategories.length === 0) {
    const { data, error: catError } = await supabase
      .from('forum_categories')
      .insert(categories)
      .select('id, slug, name');

    if (catError) {
      console.log(`   ❌ Categories error: ${catError.message}`);
      return;
    }
    insertedCategories = data;
    console.log(`   ✅ ${insertedCategories.length} forum categories seeded`);
  } else {
    console.log(`   ✓ ${existingCategories.length} forum categories already exist`);
  }

  // Try to get the admin user ID directly from profiles
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .maybeSingle();

  let authorId = adminProfile?.id;

  // If no profiles exist, use a well-known UUID (this should match the admin user created in migrations)
  if (!authorId) {
    authorId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    console.log('   ⚠️  Using default admin UUID. If this fails, create a user first via Supabase Auth.');
  } else {
    console.log(`   ✓ Using user ID: ${authorId}`);
  }

  // Check if topics already exist
  const { data: existingTopics } = await supabase
    .from('forum_topics')
    .select('id')
    .limit(1);

  if (existingTopics && existingTopics.length > 0) {
    const { count } = await supabase
      .from('forum_topics')
      .select('*', { count: 'exact', head: true });
    console.log(`   ✓ ${count} forum topics already exist`);

    const { count: repliesCount } = await supabase
      .from('forum_replies')
      .select('*', { count: 'exact', head: true });
    console.log(`   ✓ ${repliesCount} forum replies already exist`);
    return;
  }

  // Create sample topics
  const topicTemplates = [
    { title: 'Best AI tools for content creation in 2025?', content: 'Looking for recommendations on AI tools for creating blog posts and social media content. What are you using?' },
    { title: 'ChatGPT vs Claude - Which is better for coding?', content: 'I\'ve been using both for coding assistance. Curious what the community thinks about their strengths and weaknesses.' },
    { title: 'How to integrate multiple AI tools into one workflow?', content: 'Has anyone successfully created a workflow that combines different AI tools? Would love to hear about your setup.' },
    { title: 'AI tool pricing - Is it worth it?', content: 'Discussing the cost-benefit analysis of various AI tools. Share your experiences with paid vs free tiers.' },
    { title: 'Prompt engineering tips', content: 'What are your best prompt engineering techniques? Let\'s share knowledge and improve our results.' },
  ];

  const topics = [];
  insertedCategories.forEach(category => {
    // Add 1-2 topics per category
    const numTopics = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numTopics; i++) {
      if (topicTemplates.length > 0) {
        const template = topicTemplates.shift();
        topics.push({
          category_id: category.id,
          author_id: authorId,
          title: template.title,
          content: template.content,
          views: Math.floor(Math.random() * 1000),
          is_pinned: Math.random() > 0.8,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }
  });

  const { data: insertedTopics, error: topicsError } = await supabase
    .from('forum_topics')
    .insert(topics)
    .select('id');

  if (topicsError) {
    console.log(`   ❌ Topics error: ${topicsError.message}`);
    return;
  }

  console.log(`   ✅ ${insertedTopics.length} forum topics seeded`);

  // Create sample replies
  const replyTemplates = [
    'Great question! I\'ve been using [tool] and it works really well for my use case.',
    'I had a similar issue. Here\'s what worked for me...',
    'Thanks for sharing! This is exactly what I was looking for.',
    'Interesting point. Have you considered trying [alternative]?',
    'I agree with your assessment. The pricing model is quite reasonable.',
  ];

  const replies = [];
  insertedTopics.forEach(topic => {
    // Add 1-3 replies per topic
    const numReplies = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numReplies; i++) {
      replies.push({
        topic_id: topic.id,
        author_id: authorId,
        content: replyTemplates[Math.floor(Math.random() * replyTemplates.length)],
        created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  });

  const { data: insertedReplies, error: repliesError } = await supabase
    .from('forum_replies')
    .insert(replies)
    .select('id');

  if (repliesError) {
    console.log(`   ❌ Replies error: ${repliesError.message}`);
    return;
  }

  console.log(`   ✅ ${insertedReplies.length} forum replies seeded`);
}

// ============================================================
// Seed Case Studies
// ============================================================
async function seedCaseStudies() {
  console.log('\n🌟 Seeding Case Studies...');

  // Check if case studies already exist
  const { data: existing } = await supabase
    .from('case_studies')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    const { count } = await supabase
      .from('case_studies')
      .select('*', { count: 'exact', head: true });
    console.log(`   ✓ ${count} case studies already exist`);
    return;
  }

  const caseStudies = [
    {
      slug: 'acme-corp-content-automation',
      title: 'How Acme Corp Automated Content Creation with AI',
      subtitle: 'Reducing content production time by 70% while maintaining quality',
      company_name: 'Acme Corporation',
      company_industry: 'Marketing',
      company_size: '50-200 employees',
      challenge: 'Acme Corporation was struggling to produce enough high-quality content to keep up with their marketing demands. Their small team of 3 content writers was overwhelmed, leading to delays and missed opportunities.',
      solution: 'They implemented a workflow combining ChatGPT for initial drafts, Grammarly for editing, and Jasper for SEO optimization. The team used automation tools to streamline the process.',
      results: 'Within 3 months, Acme increased their content output by 300%, reduced production costs by 60%, and saw a 45% increase in organic traffic. The team now focuses on strategy and high-level editing rather than first drafts.',
      testimonial: 'The AI tools transformed our content operation. We went from struggling to keep up to being ahead of schedule consistently.',
      testimonial_author: 'Jane Smith',
      testimonial_role: 'Marketing Director',
      tools_used: JSON.stringify([
        { name: 'ChatGPT', purpose: 'Draft generation' },
        { name: 'Grammarly', purpose: 'Editing and proofreading' },
        { name: 'Jasper', purpose: 'SEO optimization' }
      ]),
      metrics: JSON.stringify([
        { label: 'Content Output Increase', value: '300%' },
        { label: 'Cost Reduction', value: '60%' },
        { label: 'Organic Traffic Growth', value: '45%' },
        { label: 'Time Saved', value: '70%' }
      ]),
      tags: ['content-creation', 'marketing', 'automation'],
      featured: true,
      status: 'published',
      published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      slug: 'techstart-customer-support',
      title: 'TechStart Scales Customer Support with AI Chatbots',
      subtitle: 'Handling 10x more inquiries without hiring additional staff',
      company_name: 'TechStart Inc',
      company_industry: 'Technology',
      company_size: '10-50 employees',
      challenge: 'As TechStart grew, their customer support team was overwhelmed with repetitive inquiries. Response times increased and customer satisfaction declined.',
      solution: 'They implemented an AI-powered chatbot using Claude and integrated it with their existing support system. The bot handles common queries while routing complex issues to human agents.',
      results: 'Support ticket volume handled increased by 1000%, average response time dropped from 4 hours to 5 minutes, and customer satisfaction scores improved by 35%.',
      testimonial: 'Our customers are happier than ever, and our support team can focus on complex issues that really need human attention.',
      testimonial_author: 'Mark Johnson',
      testimonial_role: 'Head of Customer Success',
      tools_used: JSON.stringify([
        { name: 'Claude', purpose: 'Chatbot intelligence' },
        { name: 'Intercom', purpose: 'Integration platform' }
      ]),
      metrics: JSON.stringify([
        { label: 'Tickets Handled', value: '1000% increase' },
        { label: 'Response Time', value: '5 minutes avg' },
        { label: 'CSAT Score', value: '+35%' },
        { label: 'Cost per Ticket', value: '-80%' }
      ]),
      tags: ['customer-support', 'chatbots', 'automation'],
      featured: true,
      status: 'published',
      published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      slug: 'designco-creative-workflow',
      title: 'Design Co Revolutionizes Creative Workflow with AI',
      subtitle: 'From concept to final design in half the time',
      company_name: 'Design Co',
      company_industry: 'Design',
      company_size: '10-50 employees',
      challenge: 'Design Co\'s creative process was time-consuming, with too much time spent on initial concepts and iterations, leaving less time for refinement and client revisions.',
      solution: 'They integrated Midjourney for initial concept generation, Adobe Firefly for asset creation, and Figma with AI plugins for design refinement.',
      results: 'Project timelines decreased by 50%, client revisions reduced by 40%, and the team could take on 60% more projects without compromising quality.',
      testimonial: 'AI tools didn\'t replace our creativity - they amplified it. We\'re doing our best work faster than ever.',
      testimonial_author: 'Sarah Williams',
      testimonial_role: 'Creative Director',
      tools_used: JSON.stringify([
        { name: 'Midjourney', purpose: 'Concept generation' },
        { name: 'Adobe Firefly', purpose: 'Asset creation' },
        { name: 'Figma AI', purpose: 'Design refinement' }
      ]),
      metrics: JSON.stringify([
        { label: 'Time to First Draft', value: '-50%' },
        { label: 'Client Revisions', value: '-40%' },
        { label: 'Project Capacity', value: '+60%' },
        { label: 'Team Satisfaction', value: '9.5/10' }
      ]),
      tags: ['design', 'creative', 'productivity'],
      featured: false,
      status: 'published',
      published_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const { data, error } = await supabase
    .from('case_studies')
    .insert(caseStudies)
    .select('id');

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return;
  }

  console.log(`   ✅ ${data.length} case studies seeded`);
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('🚀 Seeding Community Data');
  console.log('================================');

  try {
    await seedReviews();
    await seedForums();
    await seedCaseStudies();

    console.log('\n✅ Community data seeding complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Reviews seeded');
    console.log('   ℹ️  Forums may need a user - see note below');
    console.log('   ✅ Case studies seeded');
    console.log('\n💡 Note: If forum seeding failed, create a user first:');
    console.log('   npx tsx scripts/create-sample-user.js');
    console.log('   Then re-run this script to seed forums.\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

main();
