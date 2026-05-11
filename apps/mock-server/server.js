const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock data storage (in-memory)
let mockData = {
  users: [],
  products: [],
  orders: [],
  visits: [],
  stores: []
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock server is running' });
});

// Generic CRUD endpoints for all modules
const modules = ['mall', 'customer-service', 'finance', 'hr', 'sales-module', 'cloud-warehouse', 'procurement', 'payment', 'operations', 'data-center', 'direct-delivery', 'supplier'];

modules.forEach(module => {
  const basePath = `/api/${module}`;
  
  // GET list
  app.get(`${basePath}`, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const data = mockData[module] || [];
    const total = data.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);
    
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: paginatedData,
        total,
        page,
        pageSize
      }
    });
  });
  
  // GET by ID
  app.get(`${basePath}/:id`, (req, res) => {
    const id = req.params.id;
    const data = mockData[module] || [];
    const item = data.find(item => item.id === id);
    
    if (item) {
      res.json({
        code: 200,
        message: 'success',
        data: item
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'Not found'
      });
    }
  });
  
  // POST create
  app.post(`${basePath}`, (req, res) => {
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    if (!mockData[module]) {
      mockData[module] = [];
    }
    mockData[module].push(newItem);
    
    res.json({
      code: 200,
      message: 'success',
      data: newItem
    });
  });
  
  // PUT update
  app.put(`${basePath}/:id`, (req, res) => {
    const id = req.params.id;
    const index = mockData[module]?.findIndex(item => item.id === id);
    
    if (index !== -1) {
      mockData[module][index] = {
        ...mockData[module][index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      res.json({
        code: 200,
        message: 'success',
        data: mockData[module][index]
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'Not found'
      });
    }
  });
  
  // DELETE
  app.delete(`${basePath}/:id`, (req, res) => {
    const id = req.params.id;
    const index = mockData[module]?.findIndex(item => item.id === id);
    
    if (index !== -1) {
      mockData[module].splice(index, 1);
      res.json({
        code: 200,
        message: 'success'
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'Not found'
      });
    }
  });
});

// File upload endpoint
app.post('/api/files/upload', (req, res) => {
  // Mock file upload response
  const mockFileUrl = `/api/files/${Date.now()}-mock-file.jpg`;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: Date.now().toString(),
      url: mockFileUrl,
      name: 'mock-file.jpg'
    }
  });
});

// Serve mock files
app.get('/api/files/:filename', (req, res) => {
  // Return a simple image or file
  res.json({
    code: 200,
    message: 'File served',
    filename: req.params.filename
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available modules:', modules.join(', '));
});

module.exports = app;