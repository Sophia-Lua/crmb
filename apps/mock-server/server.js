const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mockData = require('./mock-data');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper function for pagination
const paginate = (data, page = 1, pageSize = 20) => {
  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);
  
  return {
    list: paginatedData,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  };
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock server is running with realistic business data',
    timestamp: new Date().toISOString()
  });
});

// === MALL MODULE ===
// Products
app.get('/api/mall/products', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.mall.products, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

app.get('/api/mall/products/:id', (req, res) => {
  const product = mockData.mall.products.find(p => p.id === req.params.id);
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

// Categories
app.get('/api/mall/categories', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: mockData.mall.categories,
      total: mockData.mall.categories.length
    }
  });
});

// Banners
app.get('/api/mall/home/banner', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: mockData.mall.banners,
      total: mockData.mall.banners.length
    }
  });
});

// Announcements
app.get('/api/mall/home/announcements', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: mockData.mall.announcements,
      total: mockData.mall.announcements.length
    }
  });
});

// VIP Packages
app.get('/api/mall/vip/info', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      packages: mockData.mall.vipPackages,
      userVip: null // No VIP info for demo
    }
  });
});

// === CUSTOMER SERVICE MODULE ===
// Orders
app.get('/api/customer-service/orders', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.orders, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

app.get('/api/customer-service/orders/:id', (req, res) => {
  const order = mockData.customerService.orders.find(o => o.id === req.params.id);
  if (order) {
    res.json({
      code: 200,
      message: 'success',
      data: order
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Order not found'
    });
  }
});

// After Sales
app.get('/api/customer-service/after-sales', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.afterSales, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Complaints
app.get('/api/customer-service/complaints', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.complaints, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Reviews
app.get('/api/customer-service/reviews', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.reviews, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Feedback
app.get('/api/customer-service/feedbacks', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.feedbacks, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Invoices
app.get('/api/customer-service/invoices', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.invoices, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// === SALES MODULE ===
// Visits
app.get('/api/sales/visits', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.visits, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Stores - Unclaimed
app.get('/api/sales/stores/unclaimed', (req, res) => {
  const unclaimedStores = mockData.sales.stores.filter(store => store.status === 'unclaimed');
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: unclaimedStores,
      total: unclaimedStores.length
    }
  });
});

// Stores - Review
app.get('/api/sales/stores/review', (req, res) => {
  const reviewStores = mockData.sales.stores.filter(store => store.status === 'pending');
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: reviewStores,
      total: reviewStores.length
    }
  });
});

// Stores - All
app.get('/api/sales/stores', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.stores, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Customers - Public (unassigned)
app.get('/api/sales/customers/public', (req, res) => {
  const publicCustomers = mockData.sales.customers.filter(cust => !cust.assignedTo);
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(publicCustomers, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Customers - Private (assigned)
app.get('/api/sales/customers/private', (req, res) => {
  const privateCustomers = mockData.sales.customers.filter(cust => cust.assignedTo);
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(privateCustomers, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Special Stock Requests
app.get('/api/sales/special-stock-requests', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.specialStockRequests, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Blacklist
app.get('/api/sales/blacklist', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.blacklist, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// === FINANCE MODULE ===
// Transactions
app.get('/api/finance/transactions', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.finance.transactions, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Reconciliations
app.get('/api/finance/reconciliations', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.finance.reconciliations, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Reports
app.get('/api/finance/reports', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.finance.reports, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// === HR MODULE ===
// Employees
app.get('/api/hr/employees', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.hr.employees, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Attendance
app.get('/api/hr/attendance', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.hr.attendanceRecords, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Performance
app.get('/api/hr/performance', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.hr.performanceReviews, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// === CLOUD WAREHOUSE MODULE ===
// Inventory
app.get('/api/cloud-warehouse/inventory', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.cloudWarehouse.inventory, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Outbound Orders
app.get('/api/cloud-warehouse/outbound', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.cloudWarehouse.outboundOrders, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

// Inbound Orders
app.get('/api/cloud-warehouse/inbound', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.cloudWarehouse.inboundOrders, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
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

// Generic fallback for other modules
const otherModules = ['procurement', 'payment', 'operations', 'data-center', 'direct-delivery', 'supplier'];
otherModules.forEach(module => {
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
  console.log(`Mock server running on http://0.0.0.0:${PORT}`);
  console.log('Available modules with realistic data:');
  console.log('- mall (products, categories, banners, announcements, VIP)');
  console.log('- customer-service (orders, after-sales, complaints, reviews, feedback, invoices)');
  console.log('- sales (visits, stores, customers, special requests, blacklist)');
  console.log('- finance (transactions, reconciliations, reports)');
  console.log('- hr (employees, attendance, performance)');
  console.log('- cloud-warehouse (inventory, outbound, inbound)');
});

module.exports = app;