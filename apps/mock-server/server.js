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

// Simple mock data
const mockData = {
  products: [
    {
      id: "prod-001",
      sku: "SKU000001",
      name: "红富士苹果",
      categoryId: "cat-001",
      categoryName: "生鲜水果",
      images: ["/api/files/product-1-1.jpg"],
      description: "新鲜优质红富士苹果，产地直供",
      price: 12.99,
      vipPrice: 10.99,
      superVipPrice: 8.99,
      stock: 500,
      status: "on_sale",
      tags: ["生鲜水果", "热销"],
      salesCount: 1200,
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-05-10T14:20:00Z"
    },
    {
      id: "prod-002",
      sku: "SKU000002",
      name: "香蕉",
      categoryId: "cat-001",
      categoryName: "生鲜水果",
      images: ["/api/files/product-2-1.jpg"],
      description: "进口香蕉，香甜可口",
      price: 8.50,
      vipPrice: 7.20,
      superVipPrice: 6.50,
      stock: 300,
      status: "on_sale",
      tags: ["生鲜水果", "新品"],
      salesCount: 800,
      createdAt: "2025-02-20T09:15:00Z",
      updatedAt: "2025-05-09T11:45:00Z"
    }
  ],
  stores: [
    {
      id: "store-001",
      storeName: "永辉超市分店",
      storeType: "supermarket",
      address: "北京市朝阳区中山路123号",
      province: "北京市",
      city: "朝阳区",
      district: "朝阳区",
      latitude: 39.9042,
      longitude: 116.4074,
      area: 200,
      contactName: "联系人1",
      contactPhone: "13800138001",
      licenses: [
        {
          id: "license-1-1",
          url: "/api/files/license-1-1.jpg",
          name: "营业执照.jpg",
          type: "营业执照",
          expiryDate: "2027-12-31T00:00:00Z"
        }
      ],
      status: "approved",
      assignedTo: "sales-001",
      createdAt: "2025-03-10T08:20:00Z"
    }
  ],
  orders: [
    {
      id: "order-001",
      orderNo: "ORD2025000001",
      userId: "cust-001",
      items: [
        {
          id: "item-001",
          productId: "prod-001",
          sku: "SKU000001",
          productName: "红富士苹果",
          image: "/api/files/product-1-1.jpg",
          price: 12.99,
          quantity: 5
        }
      ],
      totalAmount: 64.95,
      discountAmount: 5.00,
      freight: 10.00,
      payAmount: 69.95,
      status: "completed",
      payType: "wechat",
      payTime: "2025-05-08T14:30:00Z",
      address: {
        name: "张三",
        phone: "13800138001",
        province: "北京市",
        city: "朝阳区",
        district: "朝阳区",
        address: "中山路123号",
        isDefault: true
      },
      createdAt: "2025-05-08T14:20:00Z",
      paidAt: "2025-05-08T14:30:00Z",
      completedAt: "2025-05-10T16:45:00Z"
    }
  ]
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock server is running with realistic data',
    timestamp: new Date().toISOString()
  });
});

// Mall module - products
app.get('/api/mall/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const data = mockData.products;
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

app.get('/api/mall/products/:id', (req, res) => {
  const product = mockData.products.find(p => p.id === req.params.id);
  if (product) {
    res.json({
      code: 200,
      message: 'success',
      data: product
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Product not found'
    });
  }
});

// Customer service - orders
app.get('/api/customer-service/orders', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const data = mockData.orders;
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

// Sales module - stores
app.get('/api/sales-module/stores/unclaimed', (req, res) => {
  const unclaimedStores = mockData.stores.filter(store => store.status === 'unclaimed');
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: unclaimedStores,
      total: unclaimedStores.length
    }
  });
});

app.get('/api/sales-module/stores/review', (req, res) => {
  const reviewStores = mockData.stores.filter(store => store.status === 'pending');
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: reviewStores,
      total: reviewStores.length
    }
  });
});

// Generic fallback for other modules
const modules = ['finance', 'hr', 'cloud-warehouse', 'procurement', 'payment', 'operations', 'data-center', 'direct-delivery', 'supplier'];

modules.forEach(module => {
  app.get(`/api/${module}`, (req, res) => {
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: [],
        total: 0,
        page: 1,
        pageSize: 20
      }
    });
  });
});

// File upload endpoint
app.post('/api/files/upload', (req, res) => {
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
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock server running on http://127.0.0.1:${PORT}`);
  console.log('Available endpoints:');
  console.log('- /api/health');
  console.log('- /api/mall/products');
  console.log('- /api/customer-service/orders');
  console.log('- /api/sales-module/stores/unclaimed');
  console.log('- /api/sales-module/stores/review');
  console.log('- /api/files/upload');
});

module.exports = app;