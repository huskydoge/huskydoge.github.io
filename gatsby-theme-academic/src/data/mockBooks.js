// Mock data for testing the Bookshelf page without Notion API
// Useful for development and demo purposes

export const mockBooks = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    author: 'Vaswani, Shazeer, Parmar, et al.',
    status: 'Read',
    category: 'Paper',
    rating: 5,
    cover: null,
    link: 'https://arxiv.org/abs/1706.03762',
    notes: 'Groundbreaking paper introducing the Transformer architecture. Changed the landscape of NLP forever.',
    createdTime: '2024-01-15T00:00:00.000Z',
    lastEditedTime: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    status: 'Reading',
    category: 'Book',
    rating: 5,
    cover: null,
    link: 'https://www.deeplearningbook.org/',
    notes: 'Comprehensive introduction to deep learning. Great for understanding the fundamentals.',
    createdTime: '2024-02-01T00:00:00.000Z',
    lastEditedTime: '2024-03-15T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Generative Agents: Interactive Simulacra of Human Behavior',
    author: 'Park, O\'Brien, Cai, et al.',
    status: 'Read',
    category: 'Paper',
    rating: 5,
    cover: null,
    link: 'https://arxiv.org/abs/2304.03442',
    notes: 'Fascinating work on using LLMs to create believable agent behaviors. Great applications for gaming and simulation.',
    createdTime: '2024-03-10T00:00:00.000Z',
    lastEditedTime: '2024-03-12T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'React Documentation',
    author: 'Meta',
    status: 'To Read',
    category: 'Documentation',
    rating: null,
    cover: null,
    link: 'https://react.dev/',
    notes: null,
    createdTime: '2024-04-01T00:00:00.000Z',
    lastEditedTime: '2024-04-01T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    status: 'To Read',
    category: 'Book',
    rating: null,
    cover: null,
    link: null,
    notes: 'Classic software engineering book. Highly recommended by many developers.',
    createdTime: '2024-05-01T00:00:00.000Z',
    lastEditedTime: '2024-05-01T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    author: 'Lewis, Perez, Piktus, et al.',
    status: 'Read',
    category: 'Paper',
    rating: 4,
    cover: null,
    link: 'https://arxiv.org/abs/2005.11401',
    notes: 'Important work on RAG systems. Foundation for many modern LLM applications.',
    createdTime: '2024-06-01T00:00:00.000Z',
    lastEditedTime: '2024-06-15T00:00:00.000Z',
  },
  {
    id: '7',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    status: 'Reading',
    category: 'Book',
    rating: 4,
    cover: null,
    link: null,
    notes: 'Learning principles of writing maintainable code. Some examples are dated but principles are timeless.',
    createdTime: '2024-07-01T00:00:00.000Z',
    lastEditedTime: '2024-09-20T00:00:00.000Z',
  },
  {
    id: '8',
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    author: 'Bai, Kadavath, Kundu, et al.',
    status: 'To Read',
    category: 'Paper',
    rating: null,
    cover: null,
    link: 'https://arxiv.org/abs/2212.08073',
    notes: null,
    createdTime: '2024-08-01T00:00:00.000Z',
    lastEditedTime: '2024-08-01T00:00:00.000Z',
  },
];

// Helper function to use mock data in development
export function getMockBooks() {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockBooks);
    }, 500);
  });
}

export default mockBooks;
