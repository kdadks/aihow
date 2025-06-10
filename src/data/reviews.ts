import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    toolId: '1', // MidJourney
    userId: 'user1',
    userName: 'Alex Johnson',
    userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'MidJourney has completely changed my creative workflow. The images it generates are stunning and often surpass my expectations. Worth every penny!',
    date: new Date('2023-09-15'),
    verified: true,
    upvotes: 42
  },
  {
    id: '2',
    toolId: '1', // MidJourney
    userId: 'user2',
    userName: 'Sam Rivera',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Great tool for artistic inspiration. Sometimes the generated images don\'t perfectly match my vision, but they always provide interesting directions I hadn\'t considered.',
    date: new Date('2023-08-22'),
    verified: true,
    upvotes: 18
  },
  {
    id: '3',
    toolId: '2', // ChatGPT
    userId: 'user3',
    userName: 'Taylor Kim',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'I use ChatGPT daily for everything from coding help to content creation. It\'s like having an expert assistant available 24/7. The Plus subscription is well worth it for faster responses.',
    date: new Date('2023-09-10'),
    verified: true,
    upvotes: 65
  },
  {
    id: '4',
    toolId: '2', // ChatGPT
    userId: 'user4',
    userName: 'Jordan Patel',
    userAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'ChatGPT has been transformative for my workflow, though you need to be careful about fact-checking its outputs. The latest model is much better than previous versions.',
    date: new Date('2023-07-18'),
    verified: true,
    upvotes: 31
  },
  {
    id: '5',
    toolId: '3', // Notion AI
    userId: 'user5',
    userName: 'Morgan Chen',
    userAvatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'As a long-time Notion user, the AI integration is game-changing. It helps me draft content, summarize notes, and brainstorm ideas all within my workspace.',
    date: new Date('2023-08-05'),
    verified: true,
    upvotes: 24
  },
  {
    id: '6',
    toolId: '4', // GitHub Copilot
    userId: 'user6',
    userName: 'Casey Wright',
    userAvatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'As a developer, Copilot has been a massive productivity boost. It\'s like pair programming with an AI that knows every library and function. Sometimes it seems to read my mind!',
    date: new Date('2023-09-20'),
    verified: true,
    upvotes: 47
  },
  {
    id: '7',
    toolId: '5', // DALL-E
    userId: 'user7',
    userName: 'Riley Thompson',
    userAvatar: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'DALL-E produces some incredible images, though I find the credit system a bit frustrating. It\'s particularly good at photorealistic images compared to some competitors.',
    date: new Date('2023-07-30'),
    verified: true,
    upvotes: 19
  },
  {
    id: '8',
    toolId: '8', // Anthropic Claude
    userId: 'user8',
    userName: 'Jamie Lopez',
    userAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Claude is my go-to AI assistant now. The responses are incredibly nuanced and thoughtful, and it handles complex questions better than any other AI I\'ve used.',
    date: new Date('2023-09-25'),
    verified: true,
    upvotes: 38
  },
  {
    id: '9',
    toolId: '10', // Beautiful.ai
    userId: 'user9',
    userName: 'Dana Martinez',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Beautiful.ai has saved me countless hours on presentation design. The smart templates are truly smart and the automatic adjustments make everything look professional.',
    date: new Date('2023-08-15'),
    verified: true,
    upvotes: 22
  },
  {
    id: '10',
    toolId: '7', // Synthesia
    userId: 'user10',
    userName: 'Quinn Wilson',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Synthesia has revolutionized our training video production. Creating videos in multiple languages used to take weeks and cost thousands. Now we can do it in hours.',
    date: new Date('2023-06-10'),
    verified: true,
    upvotes: 27
  },
  // New reviews with Indian names from March 2025 onwards
  {
    id: '11',
    toolId: 'chatgpt-document',
    userId: 'user11',
    userName: 'Arjun Sharma',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'ChatGPT has completely transformed how I create technical documentation for my startup. The quality of reports and proposals it generates is exceptional, and it understands Indian business contexts really well.',
    date: new Date('2025-03-15'),
    verified: true,
    upvotes: 89
  },
  {
    id: '12',
    toolId: 'grammarly-go',
    userId: 'user12',
    userName: 'Priya Patel',
    userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'As a content writer working with international clients, Grammarly has been a game-changer. It helps me polish my English writing and ensures my work meets global standards. Highly recommend it!',
    date: new Date('2025-04-02'),
    verified: true,
    upvotes: 67
  },
  {
    id: '13',
    toolId: 'jasper-ai',
    userId: 'user13',
    userName: 'Raj Kumar Singh',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Jasper AI has streamlined our marketing team\'s content creation process. We can now produce high-quality blog posts, social media content, and email campaigns in minutes rather than hours.',
    date: new Date('2025-03-28'),
    verified: true,
    upvotes: 54
  },
  {
    id: '14',
    toolId: 'github-copilot',
    userId: 'user14',
    userName: 'Sneha Agarwal',
    userAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'GitHub Copilot has been my coding companion for the past few months. It understands my coding patterns and suggests exactly what I need. It\'s like having a senior developer sitting next to me!',
    date: new Date('2025-04-10'),
    verified: true,
    upvotes: 112
  },
  {
    id: '15',
    toolId: 'claude-3-opus',
    userId: 'user15',
    userName: 'Vikram Mehta',
    userAvatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Claude 3 Opus is incredibly sophisticated. I use it for complex analysis and research work. The depth of understanding and nuanced responses are far superior to other AI models I\'ve tried.',
    date: new Date('2025-04-18'),
    verified: true,
    upvotes: 98
  },
  {
    id: '16',
    toolId: 'notion-ai',
    userId: 'user16',
    userName: 'Anita Desai',
    userAvatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Notion AI has made project management so much easier. I can quickly generate meeting notes, project summaries, and action items. It integrates seamlessly with my existing Notion workspace.',
    date: new Date('2025-03-22'),
    verified: true,
    upvotes: 76
  },
  {
    id: '17',
    toolId: 'midjourney',
    userId: 'user17',
    userName: 'Rohit Gupta',
    userAvatar: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'As a digital artist, MidJourney has opened up incredible creative possibilities. The quality of images it generates is mind-blowing. I\'ve been able to create artwork that would have taken weeks in just hours.',
    date: new Date('2025-04-05'),
    verified: true,
    upvotes: 143
  },
  {
    id: '18',
    toolId: 'dall-e-3',
    userId: 'user18',
    userName: 'Kavya Nair',
    userAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'DALL-E 3 produces incredibly detailed and artistic images. I use it for creating unique visuals for my blog and social media. The improvement from previous versions is remarkable.',
    date: new Date('2025-04-12'),
    verified: true,
    upvotes: 81
  },
  {
    id: '19',
    toolId: 'gamma-ai',
    userId: 'user19',
    userName: 'Abhishek Joshi',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Gamma has revolutionized how I create presentations. Just provide the topic and it creates beautiful, professional slides with relevant content. Perfect for client presentations and investor pitches.',
    date: new Date('2025-03-30'),
    verified: true,
    upvotes: 92
  },
  {
    id: '20',
    toolId: 'beautiful-ai',
    userId: 'user20',
    userName: 'Meera Reddy',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Beautiful.AI saves me so much time on presentation design. The smart templates automatically adjust layouts and maintain visual consistency. Great for business presentations and proposals.',
    date: new Date('2025-04-08'),
    verified: true,
    upvotes: 63
  },
  {
    id: '21',
    toolId: 'synthesia',
    userId: 'user21',
    userName: 'Karan Malhotra',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Synthesia has transformed our training programs. We can create multilingual training videos with AI avatars that look incredibly realistic. It\'s cost-effective and efficient for global teams.',
    date: new Date('2025-04-15'),
    verified: true,
    upvotes: 107
  },
  {
    id: '22',
    toolId: 'elevenlabs',
    userId: 'user22',
    userName: 'Swati Bhargava',
    userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'ElevenLabs voice cloning is absolutely incredible! I created a voice-over for my podcast that sounds completely natural. The quality is so good that people think it\'s my actual voice.',
    date: new Date('2025-03-25'),
    verified: true,
    upvotes: 128
  },
  {
    id: '23',
    toolId: 'cursor-ai',
    userId: 'user23',
    userName: 'Nikhil Agarwal',
    userAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Cursor AI has made coding so much more intuitive. The AI understands context extremely well and provides relevant suggestions. It\'s like having an intelligent autocomplete that actually thinks.',
    date: new Date('2025-04-20'),
    verified: true,
    upvotes: 95
  },
  {
    id: '24',
    toolId: 'perplexity-ai',
    userId: 'user24',
    userName: 'Deepika Sharma',
    userAvatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Perplexity AI is my go-to research assistant. It provides accurate, up-to-date information with proper citations. Much better than traditional search engines for academic and professional research.',
    date: new Date('2025-04-03'),
    verified: true,
    upvotes: 156
  },
  {
    id: '25',
    toolId: 'runway-gen-2',
    userId: 'user25',
    userName: 'Aryan Singh',
    userAvatar: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg?auto=compress&cs=tinysrgb&w=1260&h-750&dpr=1',
    rating: 4,
    content: 'Runway Gen-2 is pushing the boundaries of video creation. I\'ve been able to create stunning video content for my marketing campaigns that would have required a full production team before.',
    date: new Date('2025-04-25'),
    verified: true,
    upvotes: 134
  },
  {
    id: '26',
    toolId: 'leonardo-ai',
    userId: 'user26',
    userName: 'Ritu Kapoor',
    userAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Leonardo.ai offers incredible control over image generation. The fine-tuning options and different models give me exactly the artistic style I need for my design projects. Highly versatile tool.',
    date: new Date('2025-03-18'),
    verified: true,
    upvotes: 118
  },
  {
    id: '27',
    toolId: 'copy-ai-marketing',
    userId: 'user27',
    userName: 'Gaurav Thakur',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Copy.ai has significantly improved our marketing copy. From email campaigns to social media posts, it generates engaging content that resonates with our Indian audience. Great ROI on investment.',
    date: new Date('2025-04-07'),
    verified: true,
    upvotes: 79
  },
  {
    id: '28',
    toolId: 'autogpt',
    userId: 'user28',
    userName: 'Pooja Bansal',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'AutoGPT is fascinating for automating complex tasks. I\'ve set it up to handle research and data collection for my consultancy work. It can work independently and deliver comprehensive results.',
    date: new Date('2025-04-22'),
    verified: true,
    upvotes: 103
  },
  {
    id: '29',
    toolId: 'suno-ai',
    userId: 'user29',
    userName: 'Manish Kumar',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 5,
    content: 'Suno.ai is absolutely magical for music creation! I created background music for my YouTube videos that sounds professionally produced. The quality and variety of genres available is impressive.',
    date: new Date('2025-03-12'),
    verified: true,
    upvotes: 147
  },
  {
    id: '30',
    toolId: 'gemini',
    userId: 'user30',
    userName: 'Shreya Iyer',
    userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4,
    content: 'Google Gemini is excellent for multimodal tasks. I can upload images, documents, and ask complex questions. The integration with Google Workspace makes it perfect for my daily workflow.',
    date: new Date('2025-04-28'),
    verified: true,
    upvotes: 91
  }
];