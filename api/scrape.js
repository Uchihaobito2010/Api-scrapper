const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

// 启用 CORS
app.use(cors());
app.use(express.json());

// 你的名字（这里可以修改）
const YOUR_NAME = "YOUR_NAME";

// 首页 - 显示你的名字
app.get('/', (req, res) => {
  res.json({
    message: `This API is hosted by ${YOUR_NAME} on Vercel`,
    endpoints: {
      home: "/",
      scrape: "/api/scrape?url=YOUR_URL",
      github: "/api/github?username=USERNAME",
      hello: "/api/hello"
    },
    status: "Active",
    hostedBy: YOUR_NAME
  });
});

// 通用网页抓取 API
app.get('/api/scrape', async (req, res) => {
  try {
    const { url, selector } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'Please provide a URL parameter',
        example: `/api/scrape?url=https://example.com`,
        hostedBy: YOUR_NAME
      });
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // 如果没有提供选择器，返回页面标题和所有链接
    if (!selector) {
      const title = $('title').text();
      const links = [];
      
      $('a').each((i, elem) => {
        const link = $(elem).attr('href');
        const text = $(elem).text();
        if (link && link.startsWith('http')) {
          links.push({ text: text.trim(), url: link });
        }
      });

      res.json({
        url,
        title: title.trim(),
        totalLinks: links.length,
        links: links.slice(0, 20), // 限制返回数量
        scrapedAt: new Date().toISOString(),
        hostedBy: YOUR_NAME
      });
    } else {
      // 使用提供的 CSS 选择器
      const elements = [];
      $(selector).each((i, elem) => {
        elements.push({
          html: $(elem).html(),
          text: $(elem).text().trim(),
          attributes: elem.attribs
        });
      });

      res.json({
        url,
        selector,
        count: elements.length,
        elements,
        hostedBy: YOUR_NAME
      });
    }

  } catch (error) {
    res.status(500).json({
      error: error.message,
      hostedBy: YOUR_NAME
    });
  }
});

// GitHub 用户信息 API
app.get('/api/github', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({
        error: 'Please provide a username parameter',
        example: `/api/github?username=torvalds`,
        hostedBy: YOUR_NAME
      });
    }

    const response = await axios.get(`https://api.github.com/users/${username}`);
    
    res.json({
      user: response.data,
      requestedBy: YOUR_NAME,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      hostedBy: YOUR_NAME
    });
  }
});

// 测试端点
app.get('/api/hello', (req, res) => {
  res.json({
    message: `Hello! This API is hosted by ${YOUR_NAME}`,
    timestamp: new Date().toISOString(),
    endpoints: {
      scrape: "GET /api/scrape?url=URL",
      github: "GET /api/github?username=USERNAME"
    }
  });
});

// 处理 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `This API is hosted by ${YOUR_NAME}`,
    availableEndpoints: ['/', '/api/scrape', '/api/github', '/api/hello']
  });
});

// Vercel 需要导出 app
module.exports = app;
