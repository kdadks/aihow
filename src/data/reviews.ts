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
  }
];