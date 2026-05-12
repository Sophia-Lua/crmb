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

// Recommend products
app.get('/api/mall/home/recommend', (req, res) => {
  // Return recommended products (top selling)
  const recommended = mockData.mall.products
    .filter(p => p.status === 'on_sale')
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 6);
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: recommended,
      total: recommended.length
    }
  });
});

// Cart - for now return empty cart
app.get('/api/mall/cart', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: 'cart-001',
      userId: 'user-001',
      items: [],
      totalAmount: 0,
      selectedItems: [],
      updatedAt: new Date().toISOString()
    }
  });
});

// Add to cart
app.post('/api/mall/cart/items', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = mockData.mall.products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      code: 404,
      message: 'Product not found'
    });
  }
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `cart-item-${Date.now()}`,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      image: product.images[0],
      price: product.price,
      quantity: quantity,
      selected: true
    }
  });
});

// Update cart item quantity
app.put('/api/mall/cart/items/:id', (req, res) => {
  const { quantity } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      quantity: quantity || 1,
      updatedAt: new Date().toISOString()
    }
  });
});

// Delete cart item
app.delete('/api/mall/cart/items/:id', (req, res) => {
  res.json({
    code: 200,
    message: 'success'
  });
});

// Orders
app.get('/api/mall/orders', (req, res) => {
  // Mall orders are customer service orders for the current user
  const userOrders = mockData.customerService.orders.filter(order => order.customerId === 'cust-001');
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(userOrders, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

app.get('/api/mall/orders/:id', (req, res) => {
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

// Create order
app.post('/api/mall/orders', (req, res) => {
  const { items, address, couponId } = req.body;
  const orderNo = `ORD${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `order-${Date.now()}`,
      orderNo: orderNo,
      userId: 'user-001',
      items: items || [],
      totalAmount: 100.00,
      discountAmount: couponId ? 10.00 : 0.00,
      freight: 10.00,
      payAmount: 100.00,
      status: 'pending',
      address: address || {
        name: '张三',
        phone: '13800138001',
        province: '北京市',
        city: '朝阳区',
        district: '朝阳区',
        address: '中山路123号',
        isDefault: true
      },
      couponId: couponId || null,
      couponDiscount: couponId ? 10.00 : 0.00,
      remark: '',
      createdAt: new Date().toISOString()
    }
  });
});

// Pay order
app.post('/api/mall/orders/:id/pay', (req, res) => {
  const { payType } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'paid',
      payType: payType || 'wechat',
      payTime: new Date().toISOString()
    }
  });
});

// After sales
app.get('/api/mall/after-sales', (req, res) => {
  const userAfterSales = mockData.customerService.afterSales.filter(as => as.orderId.startsWith('order'));
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(userAfterSales, page, pageSize);
  
  res.json({
    code: 200,
    message: 'success',
    data: result
  });
});

app.post('/api/mall/after-sales', (req, res) => {
  const { orderId, type, reason, description } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `as-${Date.now()}`,
      afterSaleNo: `AS${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      orderId: orderId,
      type: type || 'return',
      reason: reason || '其他原因',
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

// VIP purchase
app.post('/api/mall/vip/purchase', (req, res) => {
  const { packageId } = req.body;
  const vipPackage = mockData.mall.vipPackages.find(p => p.id === packageId);
  
  if (!vipPackage) {
    return res.status(404).json({
      code: 404,
      message: 'VIP package not found'
    });
  }
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      userId: 'user-001',
      level: vipPackage.level,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + vipPackage.duration * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: false
    }
  });
});

// Customer service phone
app.get('/api/mall/customer-service/phone', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      phone: '400-123-4567',
      serviceHours: '9:00-18:00'
    }
  });
});

// Customer service feedback
app.post('/api/mall/customer-service/feedback', (req, res) => {
  const { content, images } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `fb-${Date.now()}`,
      userId: 'user-001',
      userName: '用户',
      userPhone: '13800138001',
      content: content,
      images: images || [],
      status: 'pending',
      createdAt: new Date().toISOString()
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

// After Sales - detail
app.get('/api/customer-service/after-sales/:id', (req, res) => {
  const afterSale = mockData.customerService.afterSales.find(as => as.id === req.params.id);
  if (afterSale) {
    res.json({
      code: 200,
      message: 'success',
      data: afterSale
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'After sale not found'
    });
  }
});

// Approve after sale
app.put('/api/customer-service/after-sales/:id/approve', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'approved',
      updatedAt: new Date().toISOString()
    }
  });
});

// Receive after sale
app.put('/api/customer-service/after-sales/:id/receive', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'received',
      updatedAt: new Date().toISOString()
    }
  });
});

// Refund after sale
app.put('/api/customer-service/after-sales/:id/refund', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'refunded',
      updatedAt: new Date().toISOString()
    }
  });
});

// Complaints - detail
app.get('/api/customer-service/complaints/:id', (req, res) => {
  const complaint = mockData.customerService.complaints.find(c => c.id === req.params.id);
  if (complaint) {
    res.json({
      code: 200,
      message: 'success',
      data: complaint
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Complaint not found'
    });
  }
});

// Accept complaint
app.put('/api/customer-service/complaints/:id/accept', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'accepted',
      updatedAt: new Date().toISOString()
    }
  });
});

// Process complaint
app.put('/api/customer-service/complaints/:id/process', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'processing',
      updatedAt: new Date().toISOString()
    }
  });
});

// Close complaint
app.put('/api/customer-service/complaints/:id/close', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'closed',
      closedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

// Reply to review
app.post('/api/customer-service/reviews/:id/reply', (req, res) => {
  const { reply } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      reply: reply,
      replyBy: '客服专员',
      replyAt: new Date().toISOString(),
      status: 'replied'
    }
  });
});

// Confirm order
app.put('/api/customer-service/orders/:id/confirm', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'confirmed',
      updatedAt: new Date().toISOString()
    }
  });
});

// Cancel order
app.put('/api/customer-service/orders/:id/cancel', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    }
  });
});

// Add order remark
app.post('/api/customer-service/orders/:id/remark', (req, res) => {
  const { remark } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      remark: remark,
      operatorLog: [{
        id: `log-${Date.now()}`,
        operatorId: 'op-001',
        operatorName: '客服专员',
        action: '添加备注',
        remark: remark,
        createdAt: new Date().toISOString()
      }],
      updatedAt: new Date().toISOString()
    }
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

// Visit detail
app.get('/api/sales/visits/:id', (req, res) => {
  const visit = mockData.sales.visits.find(v => v.id === req.params.id);
  if (visit) {
    res.json({
      code: 200,
      message: 'success',
      data: visit
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Visit not found'
    });
  }
});

// Create visit
app.post('/api/sales/visits', (req, res) => {
  const { customerId, visitType, visitMethod, planDate, subject, content } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `visit-${Date.now()}`,
      customerId: customerId,
      customerName: '客户名称',
      customerType: 'private',
      visitType: visitType || 'regular',
      visitMethod: visitMethod || 'onsite',
      planDate: planDate || new Date().toISOString().split('T')[0],
      subject: subject || '拜访主题',
      content: content || '拜访内容',
      status: 'pending',
      createdBy: 'sales-001',
      createdAt: new Date().toISOString()
    }
  });
});

// Update visit
app.put('/api/sales/visits/:id', (req, res) => {
  const { status, feedback, followUpPlan } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: status || 'completed',
      feedback: feedback,
      followUpPlan: followUpPlan,
      updatedAt: new Date().toISOString()
    }
  });
});

// Delete visit
app.delete('/api/sales/visits/:id', (req, res) => {
  res.json({
    code: 200,
    message: 'success'
  });
});

// Visit statistics
app.get('/api/sales/visits/statistics', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      today: 2,
      thisWeek: 5,
      thisMonth: 15,
      total: mockData.sales.visits.length
    }
  });
});

// Store detail
app.get('/api/sales/stores/:id', (req, res) => {
  const store = mockData.sales.stores.find(s => s.id === req.params.id);
  if (store) {
    res.json({
      code: 200,
      message: 'success',
      data: store
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Store not found'
    });
  }
});

// Claim store
app.post('/api/sales/stores/:id/claim', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: 'pending',
      claimBy: 'sales-001',
      claimedAt: new Date().toISOString()
    }
  });
});

// Review store
app.post('/api/sales/stores/:id/review', (req, res) => {
  const { status, rejectReason } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      status: status || 'approved',
      rejectReason: rejectReason,
      reviewBy: 'reviewer-001',
      reviewedAt: new Date().toISOString()
    }
  });
});

// Assign store
app.post('/api/sales/stores/:id/assign', (req, res) => {
  const { assignedTo } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      assignedTo: assignedTo || 'sales-001',
      assignedAt: new Date().toISOString()
    }
  });
});

// Store statistics
app.get('/api/sales/stores/statistics', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      unclaimed: mockData.sales.stores.filter(s => s.status === 'unclaimed').length,
      pending: mockData.sales.stores.filter(s => s.status === 'pending').length,
      approved: mockData.sales.stores.filter(s => s.status === 'approved').length,
      total: mockData.sales.stores.length
    }
  });
});

// Customer detail
app.get('/api/sales/customers/:id', (req, res) => {
  const customer = mockData.sales.customers.find(c => c.id === req.params.id);
  if (customer) {
    res.json({
      code: 200,
      message: 'success',
      data: customer
    });
  } else {
    res.status(404).json({
      code: 404,
      message: 'Customer not found'
    });
  }
});

// Claim customer
app.post('/api/sales/customers/:id/claim', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      customerType: 'private',
      assignedTo: 'sales-001',
      claimedAt: new Date().toISOString()
    }
  });
});

// Return customer to public
app.post('/api/sales/customers/:id/return', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      customerType: 'public',
      assignedTo: null,
      returnedAt: new Date().toISOString()
    }
  });
});

// Transfer customer
app.post('/api/sales/customers/:id/transfer', (req, res) => {
  const { assignedTo } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: req.params.id,
      assignedTo: assignedTo || 'sales-002',
      transferredAt: new Date().toISOString()
    }
  });
});

// Customer search
app.get('/api/sales/customers/search', (req, res) => {
  const { keyword } = req.query;
  let customers = mockData.sales.customers;
  
  if (keyword) {
    customers = customers.filter(c => 
      c.customerName.includes(keyword) || 
      c.contactPhone.includes(keyword)
    );
  }
  
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(customers, page, pageSize);
  
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

// Check-in attendance
app.post('/api/hr/attendance/check-in', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `att-${Date.now()}`,
      employeeId: 'emp-001',
      employeeName: '销售代表张',
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toTimeString().slice(0, 5),
      status: 'present',
      createdAt: new Date().toISOString()
    }
  });
});

// Check-out attendance
app.post('/api/hr/attendance/check-out', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `att-${Date.now()}`,
      employeeId: 'emp-001',
      employeeName: '销售代表张',
      date: new Date().toISOString().split('T')[0],
      checkOutTime: new Date().toTimeString().slice(0, 5),
      status: 'present',
      createdAt: new Date().toISOString()
    }
  });
});

// Generate financial report
app.post('/api/finance/reports/generate', (req, res) => {
  const { type, period, startDate, endDate } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `rep-${Date.now()}`,
      reportNo: `REP${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      type: type || 'income_statement',
      period: period || 'daily',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date().toISOString(),
      data: {
        totalIncome: 10000.00,
        totalExpense: 8000.00,
        netProfit: 2000.00,
        orderCount: 50,
        customerCount: 30
      },
      status: 'draft',
      createdAt: new Date().toISOString()
    }
  });
});

// Create outbound order
app.post('/api/cloud-warehouse/outbound', (req, res) => {
  const { items, warehouseId, operatorId } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `out-${Date.now()}`,
      orderNo: `OUT${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      type: 'sale',
      items: items || [],
      status: 'pending',
      warehouseId: warehouseId || 'WH-001',
      operatorId: operatorId || 'emp-002',
      createdAt: new Date().toISOString()
    }
  });
});

// Create inbound order
app.post('/api/cloud-warehouse/inbound', (req, res) => {
  const { items, warehouseId, operatorId } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `in-${Date.now()}`,
      orderNo: `IN${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      type: 'purchase',
      items: items || [],
      status: 'pending',
      warehouseId: warehouseId || 'WH-001',
      operatorId: operatorId || 'emp-002',
      createdAt: new Date().toISOString()
    }
  });
});

// Inventory check
app.post('/api/cloud-warehouse/inventory/check', (req, res) => {
  const { sku, location } = req.body;
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: `check-${Date.now()}`,
      sku: sku || 'SKU000001',
      location: location || 'A-01-05',
      actualQuantity: 500,
      systemQuantity: 495,
      difference: 5,
      checkedBy: 'emp-002',
      checkedAt: new Date().toISOString()
    }
  });
});

// Unloading management
app.get('/api/cloud-warehouse/admin/unloading', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'unload-001',
          supplierId: 'supplier-001',
          supplierName: '苹果供应商',
          items: [
            { sku: 'SKU000001', productName: '红富士苹果', quantity: 100 }
          ],
          status: 'pending',
          plannedTime: '2025-05-11T10:00:00Z',
          createdAt: '2025-05-10T16:00:00Z'
        }
      ],
      total: 1
    }
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