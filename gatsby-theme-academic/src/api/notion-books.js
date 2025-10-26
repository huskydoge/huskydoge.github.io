const { Client } = require('@notionhq/client');

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Transform Notion page to book object
 */
function transformNotionPage(page) {
  const properties = page.properties;

  // Helper function to extract property values
  const getProp = (name, type) => {
    const prop = properties[name];
    if (!prop) return null;

    switch (type) {
      case 'title':
        return prop.title?.[0]?.plain_text || '';
      case 'rich_text':
        if (!prop.rich_text || prop.rich_text.length === 0) {
          return '';
        }
        const text = prop.rich_text
          .map((segment) => {
            if (!segment) return '';
            if (segment.type === 'equation') {
              return segment.equation?.expression || segment.plain_text || '';
            }
            return segment.plain_text || '';
          })
          .join('');
        return text.trim();
      case 'select':
        return prop.select?.name || null;
      case 'multi_select':
        return prop.multi_select?.map(item => item.name) || [];
      case 'number':
        return prop.number || null;
      case 'url':
        return prop.url || null;
      case 'date':
        return prop.date?.start || null;
      case 'files':
        if (prop.files?.[0]) {
          return prop.files[0].file?.url || prop.files[0].external?.url || null;
        }
        return null;
      default:
        return null;
    }
  };

  return {
    id: page.id,
    title: getProp('Title', 'title') || getProp('Name', 'title') || 'Untitled',
    author: getProp('Author', 'rich_text') || getProp('Authors', 'rich_text'),
    status: getProp('Status', 'select'),
    category: getProp('Category', 'select') || getProp('Type', 'select'),
    rating: getProp('Rating', 'number') || getProp('importance', 'select'),
    cover: getProp('Cover', 'files') || page.cover?.external?.url || page.cover?.file?.url,
    link: getProp('Link', 'url') || getProp('URL', 'url'),
  notes: getProp('Notes', 'rich_text') || getProp('TLDR', 'rich_text') || getProp('Key Takeaways', 'rich_text'),
  twoCents: getProp('2 cents', 'rich_text') || getProp('2 Cents', 'rich_text'),
    keywords: getProp('Keywords', 'multi_select'),
    dateSaved: getProp('Date Saved', 'date'),
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

/**
 * Gatsby API handler for fetching books from Notion
 */
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check if Notion credentials are configured
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      res.status(500).json({
        error: 'Notion API credentials not configured',
        message: 'Please set NOTION_API_KEY and NOTION_DATABASE_ID environment variables',
      });
      return;
    }

    // Query the Notion database
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Title',
          direction: 'ascending',
        },
      ],
    });

    // Transform the results
    const books = response.results.map(transformNotionPage);

    // Return the books
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    
    res.status(500).json({
      error: 'Failed to fetch books from Notion',
      message: error.message,
      hint: 'Make sure your Notion integration has access to the database',
    });
  }
}
