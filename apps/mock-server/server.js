const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mockData = require('./mock-data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mock server is running with realistic business data',
    timestamp: new Date().toISOString()
  });
});

// === AUTH MODULE ===
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  const user = mockData.auth.users.find(u => u.username === username && u.password === password);
  if (user) {
    const tokenKey = Object.keys(mockData.auth.tokenMap).find(k => mockData.auth.tokenMap[k].userId === user.id);
    const token = tokenKey || `token-${user.role}-${Date.now()}`;
    res.json({
      code: 200,
      message: 'success',
      data: {
        token: token,
        userInfo: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          department: user.department,
          phone: user.phone,
          email: user.email
        }
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      message: 'Invalid username or password'
    });
  }
});

app.get('/api/auth/userinfo', (req, res) => {
  const token = req.headers['authorization'] || req.query.token;
  const tokenData = mockData.auth.tokenMap[token];
  if (tokenData) {
    const user = mockData.auth.users.find(u => u.id === tokenData.userId);
    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        phone: user.phone,
        email: user.email
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      message: 'Invalid token'
    });
  }
});

// === MALL MODULE ===
app.get('/api/mall/products', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.mall.products, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/mall/products/:id', (req, res) => {
  const product = mockData.mall.products.find(p => p.id === req.params.id);
  if (product) {
    res.json({ code: 200, message: 'success', data: product });
  } else {
    res.status(404).json({ code: 404, message: 'Product not found' });
  }
});

app.get('/api/mall/categories', (req, res) => {
  res.json({ code: 200, message: 'success', data: { list: mockData.mall.categories, total: mockData.mall.categories.length } });
});

app.get('/api/mall/home/banner', (req, res) => {
  res.json({ code: 200, message: 'success', data: { list: mockData.mall.banners, total: mockData.mall.banners.length } });
});

app.get('/api/mall/home/announcements', (req, res) => {
  res.json({ code: 200, message: 'success', data: { list: mockData.mall.announcements, total: mockData.mall.announcements.length } });
});

app.get('/api/mall/home/recommend', (req, res) => {
  const recommended = mockData.mall.products
    .filter(p => p.status === 'on_sale')
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 6);
  res.json({ code: 200, message: 'success', data: { list: recommended, total: recommended.length } });
});

app.get('/api/mall/cart', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { id: 'cart-001', userId: 'user-001', items: [], totalAmount: 0, selectedItems: [], updatedAt: new Date().toISOString() }
  });
});

app.post('/api/mall/cart/items', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = mockData.mall.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ code: 404, message: 'Product not found' });
  }
  res.json({
    code: 200, message: 'success',
    data: { id: `cart-item-${Date.now()}`, productId: product.id, sku: product.sku, productName: product.name, image: product.images[0], price: product.price, quantity: quantity, selected: true }
  });
});

app.put('/api/mall/cart/items/:id', (req, res) => {
  const { quantity } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, quantity: quantity || 1, updatedAt: new Date().toISOString() } });
});

app.delete('/api/mall/cart/items/:id', (req, res) => {
  res.json({ code: 200, message: 'success' });
});

app.get('/api/mall/orders', (req, res) => {
  const userOrders = mockData.customerService.orders.filter(order => order.customerId === 'cust-001');
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(userOrders, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/mall/orders/:id', (req, res) => {
  const order = mockData.customerService.orders.find(o => o.id === req.params.id);
  if (order) {
    res.json({ code: 200, message: 'success', data: order });
  } else {
    res.status(404).json({ code: 404, message: 'Order not found' });
  }
});

app.post('/api/mall/orders', (req, res) => {
  const { items, address, couponId } = req.body;
  const orderNo = `ORD${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
  res.json({
    code: 200, message: 'success',
    data: {
      id: `order-${Date.now()}`, orderNo: orderNo, userId: 'user-001', items: items || [],
      totalAmount: 100.00, discountAmount: couponId ? 10.00 : 0.00, freight: 10.00, payAmount: 90.00,
      status: 'pending', payType: null, payTime: null,
      address: address || { name: '张三', phone: '13800138001', province: '北京市', city: '朝阳区', district: '朝阳区', address: '中山路123号', isDefault: true },
      couponId: couponId || null, couponDiscount: couponId ? 10.00 : 0.00, remark: '', logistics: null,
      createdAt: new Date().toISOString(), paidAt: null, shippedAt: null, deliveredAt: null, completedAt: null
    }
  });
});

app.post('/api/mall/orders/:id/pay', (req, res) => {
  const { payType } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'paid', payType: payType || 'wechat', payTime: new Date().toISOString() } });
});

app.get('/api/mall/after-sales', (req, res) => {
  const userAfterSales = mockData.customerService.afterSales.filter(as => as.orderId.startsWith('order'));
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(userAfterSales, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/mall/after-sales', (req, res) => {
  const { orderId, type, reason, description } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `as-${Date.now()}`, afterSaleNo: `AS${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, orderId: orderId, type: type || 'return', reason: reason || '其他原因', description: description || '', status: 'pending', createdAt: new Date().toISOString() }
  });
});

app.post('/api/mall/vip/purchase', (req, res) => {
  const { packageId } = req.body;
  const vipPackage = mockData.mall.vipPackages.find(p => p.id === packageId);
  if (!vipPackage) {
    return res.status(404).json({ code: 404, message: 'VIP package not found' });
  }
  res.json({
    code: 200, message: 'success',
    data: { userId: 'user-001', level: vipPackage.level, startDate: new Date().toISOString(), endDate: new Date(Date.now() + vipPackage.duration * 24 * 60 * 60 * 1000).toISOString(), autoRenew: false }
  });
});

app.get('/api/mall/customer-service/phone', (req, res) => {
  res.json({ code: 200, message: 'success', data: { phone: '400-123-4567', serviceHours: '9:00-18:00' } });
});

app.post('/api/mall/customer-service/feedback', (req, res) => {
  const { content, images } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `fb-${Date.now()}`, userId: 'user-001', userName: '用户', userPhone: '13800138001', content: content, images: images || [], status: 'pending', createdAt: new Date().toISOString() }
  });
});

app.get('/api/mall/vip/info', (req, res) => {
  res.json({ code: 200, message: 'success', data: { packages: mockData.mall.vipPackages, userVip: null } });
});

// === CUSTOMER SERVICE MODULE ===
app.get('/api/customer-service/orders', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let orders = mockData.customerService.orders;
  if (status) orders = orders.filter(o => o.status === status);
  const result = paginate(orders, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/customer-service/orders/:id', (req, res) => {
  const order = mockData.customerService.orders.find(o => o.id === req.params.id);
  if (order) {
    res.json({ code: 200, message: 'success', data: order });
  } else {
    res.status(404).json({ code: 404, message: 'Order not found' });
  }
});

app.get('/api/customer-service/after-sales', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.afterSales, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/customer-service/complaints', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.complaints, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/customer-service/reviews', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.reviews, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/customer-service/feedbacks', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.feedbacks, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/customer-service/invoices', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.customerService.invoices, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/customer-service/after-sales/:id', (req, res) => {
  const afterSale = mockData.customerService.afterSales.find(as => as.id === req.params.id);
  if (afterSale) {
    res.json({ code: 200, message: 'success', data: afterSale });
  } else {
    res.status(404).json({ code: 404, message: 'After sale not found' });
  }
});

app.put('/api/customer-service/after-sales/:id/approve', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'approved', updatedAt: new Date().toISOString() } });
});

app.put('/api/customer-service/after-sales/:id/receive', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'received', updatedAt: new Date().toISOString() } });
});

app.put('/api/customer-service/after-sales/:id/refund', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'refunded', updatedAt: new Date().toISOString() } });
});

app.get('/api/customer-service/complaints/:id', (req, res) => {
  const complaint = mockData.customerService.complaints.find(c => c.id === req.params.id);
  if (complaint) {
    res.json({ code: 200, message: 'success', data: complaint });
  } else {
    res.status(404).json({ code: 404, message: 'Complaint not found' });
  }
});

app.put('/api/customer-service/complaints/:id/accept', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'accepted', updatedAt: new Date().toISOString() } });
});

app.put('/api/customer-service/complaints/:id/process', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'processing', updatedAt: new Date().toISOString() } });
});

app.put('/api/customer-service/complaints/:id/close', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'closed', closedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.post('/api/customer-service/reviews/:id/reply', (req, res) => {
  const { reply } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, reply: reply, replyBy: '客服专员', replyAt: new Date().toISOString(), status: 'replied' } });
});

app.put('/api/customer-service/orders/:id/confirm', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'confirmed', updatedAt: new Date().toISOString() } });
});

app.put('/api/customer-service/orders/:id/cancel', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'cancelled', updatedAt: new Date().toISOString() } });
});

app.post('/api/customer-service/orders/:id/remark', (req, res) => {
  const { remark } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: req.params.id, remark: remark, operatorLog: [{ id: `log-${Date.now()}`, operatorId: 'op-001', operatorName: '客服专员', action: '添加备注', remark: remark, createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() }
  });
});

// === SALES MODULE ===
app.get('/api/sales/visits', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.visits, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/sales/stores/unclaimed', (req, res) => {
  const unclaimedStores = mockData.sales.stores.filter(store => store.status === 'unclaimed');
  res.json({ code: 200, message: 'success', data: { list: unclaimedStores, total: unclaimedStores.length } });
});

app.get('/api/sales/stores/review', (req, res) => {
  const reviewStores = mockData.sales.stores.filter(store => store.status === 'pending');
  res.json({ code: 200, message: 'success', data: { list: reviewStores, total: reviewStores.length } });
});

app.get('/api/sales/stores', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.stores, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/sales/customers/public', (req, res) => {
  const publicCustomers = mockData.sales.customers.filter(cust => !cust.assignedTo);
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(publicCustomers, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/sales/customers/private', (req, res) => {
  const privateCustomers = mockData.sales.customers.filter(cust => cust.assignedTo);
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(privateCustomers, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/sales/special-stock-requests', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.specialStockRequests, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/sales/blacklist', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.sales.blacklist, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/sales/visits/:id', (req, res) => {
  const visit = mockData.sales.visits.find(v => v.id === req.params.id);
  if (visit) {
    res.json({ code: 200, message: 'success', data: visit });
  } else {
    res.status(404).json({ code: 404, message: 'Visit not found' });
  }
});

app.post('/api/sales/visits', (req, res) => {
  const { customerId, visitType, visitMethod, planDate, subject, content } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `visit-${Date.now()}`, customerId: customerId, customerName: '客户名称', customerType: 'private', visitType: visitType || 'regular', visitMethod: visitMethod || 'onsite', planDate: planDate || new Date().toISOString().split('T')[0], subject: subject || '拜访主题', content: content || '拜访内容', status: 'pending', createdBy: 'sales-001', createdAt: new Date().toISOString() }
  });
});

app.put('/api/sales/visits/:id', (req, res) => {
  const { status, feedback, followUpPlan } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status || 'completed', feedback: feedback, followUpPlan: followUpPlan, updatedAt: new Date().toISOString() } });
});

app.delete('/api/sales/visits/:id', (req, res) => {
  res.json({ code: 200, message: 'success' });
});

app.get('/api/sales/visits/statistics', (req, res) => {
  res.json({ code: 200, message: 'success', data: { today: 2, thisWeek: 5, thisMonth: 15, total: mockData.sales.visits.length } });
});

app.get('/api/sales/stores/:id', (req, res) => {
  const store = mockData.sales.stores.find(s => s.id === req.params.id);
  if (store) {
    res.json({ code: 200, message: 'success', data: store });
  } else {
    res.status(404).json({ code: 404, message: 'Store not found' });
  }
});

app.post('/api/sales/stores/:id/claim', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'pending', claimBy: 'sales-001', claimedAt: new Date().toISOString() } });
});

app.post('/api/sales/stores/:id/review', (req, res) => {
  const { status, rejectReason } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status || 'approved', rejectReason: rejectReason, reviewBy: 'reviewer-001', reviewedAt: new Date().toISOString() } });
});

app.post('/api/sales/stores/:id/assign', (req, res) => {
  const { assignedTo } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, assignedTo: assignedTo || 'sales-001', assignedAt: new Date().toISOString() } });
});

app.get('/api/sales/stores/statistics', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { unclaimed: mockData.sales.stores.filter(s => s.status === 'unclaimed').length, pending: mockData.sales.stores.filter(s => s.status === 'pending').length, approved: mockData.sales.stores.filter(s => s.status === 'approved').length, total: mockData.sales.stores.length }
  });
});

app.get('/api/sales/customers/:id', (req, res) => {
  const customer = mockData.sales.customers.find(c => c.id === req.params.id);
  if (customer) {
    res.json({ code: 200, message: 'success', data: customer });
  } else {
    res.status(404).json({ code: 404, message: 'Customer not found' });
  }
});

app.post('/api/sales/customers/:id/claim', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, customerType: 'private', assignedTo: 'sales-001', claimedAt: new Date().toISOString() } });
});

app.post('/api/sales/customers/:id/return', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, customerType: 'public', assignedTo: null, returnedAt: new Date().toISOString() } });
});

app.post('/api/sales/customers/:id/transfer', (req, res) => {
  const { assignedTo } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, assignedTo: assignedTo || 'sales-002', transferredAt: new Date().toISOString() } });
});

app.get('/api/sales/customers/search', (req, res) => {
  const { keyword } = req.query;
  let customers = mockData.sales.customers;
  if (keyword) {
    customers = customers.filter(c => c.customerName.includes(keyword) || c.contactPhone.includes(keyword));
  }
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(customers, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

// === FINANCE MODULE ===
app.get('/api/finance/transactions', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.finance.transactions, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/finance/reconciliations', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.finance.reconciliations, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/finance/reports', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.finance.reports, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/finance/reports/generate', (req, res) => {
  const { type, period, startDate, endDate } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `rep-${Date.now()}`, reportNo: `REP${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, type: type || 'income_statement', period: period || 'daily', startDate: startDate || new Date().toISOString(), endDate: endDate || new Date().toISOString(), data: { totalIncome: 10000.00, totalExpense: 8000.00, netProfit: 2000.00, orderCount: 50, customerCount: 30 }, status: 'draft', createdAt: new Date().toISOString() }
  });
});

// === HR MODULE ===
app.get('/api/hr/employees', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.hr.employees, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/hr/attendance', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.hr.attendanceRecords, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/hr/performance', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.hr.performanceReviews, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/hr/attendance/check-in', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { id: `att-${Date.now()}`, employeeId: 'emp-001', employeeName: '销售代表张', date: new Date().toISOString().split('T')[0], checkInTime: new Date().toTimeString().slice(0, 5), status: 'present', createdAt: new Date().toISOString() }
  });
});

app.post('/api/hr/attendance/check-out', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { id: `att-${Date.now()}`, employeeId: 'emp-001', employeeName: '销售代表张', date: new Date().toISOString().split('T')[0], checkOutTime: new Date().toTimeString().slice(0, 5), status: 'present', createdAt: new Date().toISOString() }
  });
});

// === CLOUD WAREHOUSE MODULE ===
app.get('/api/cloud-warehouse/inventory', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.cloudWarehouse.inventory, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/cloud-warehouse/outbound', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.cloudWarehouse.outboundOrders, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/cloud-warehouse/inbound', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.cloudWarehouse.inboundOrders, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/cloud-warehouse/outbound', (req, res) => {
  const { items, warehouseId, operatorId } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `out-${Date.now()}`, orderNo: `OUT${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, type: 'sale', items: items || [], status: 'pending', warehouseId: warehouseId || 'WH-001', operatorId: operatorId || 'emp-002', createdAt: new Date().toISOString() }
  });
});

app.post('/api/cloud-warehouse/inbound', (req, res) => {
  const { items, warehouseId, operatorId } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `in-${Date.now()}`, orderNo: `IN${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, type: 'purchase', items: items || [], status: 'pending', warehouseId: warehouseId || 'WH-001', operatorId: operatorId || 'emp-002', createdAt: new Date().toISOString() }
  });
});

app.post('/api/cloud-warehouse/inventory/check', (req, res) => {
  const { sku, location } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `check-${Date.now()}`, sku: sku || 'SKU000001', location: location || 'A-01-05', actualQuantity: 500, systemQuantity: 495, difference: 5, checkedBy: 'emp-002', checkedAt: new Date().toISOString() }
  });
});

app.get('/api/cloud-warehouse/admin/unloading', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { list: [{ id: 'unload-001', supplierId: 'supplier-001', supplierName: '苹果供应商', items: [{ sku: 'SKU000001', productName: '红富士苹果', quantity: 100 }], status: 'pending', plannedTime: '2025-05-11T10:00:00Z', createdAt: '2025-05-10T16:00:00Z' }], total: 1 }
  });
});

// === PROCUREMENT MODULE ===
app.get('/api/procurement/suppliers', (req, res) => {
  const { page = 1, pageSize = 20, qualificationStatus, rating, category } = req.query;
  let suppliers = mockData.procurement.suppliers;
  if (qualificationStatus) suppliers = suppliers.filter(s => s.qualificationStatus === qualificationStatus);
  if (rating) suppliers = suppliers.filter(s => s.rating === rating);
  if (category) suppliers = suppliers.filter(s => s.category === category);
  const result = paginate(suppliers, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/procurement/suppliers/:id', (req, res) => {
  const supplier = mockData.procurement.suppliers.find(s => s.id === req.params.id);
  if (supplier) {
    res.json({ code: 200, message: 'success', data: supplier });
  } else {
    res.status(404).json({ code: 404, message: 'Supplier not found' });
  }
});

app.post('/api/procurement/suppliers', (req, res) => {
  const { name, contactName, contactPhone, address, category, bankAccount, bankName } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `supplier-${Date.now()}`, name: name, contactName: contactName, contactPhone: contactPhone, address: address, qualificationStatus: 'pending', rating: 'C', category: category, bankAccount: bankAccount, bankName: bankName, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  });
});

app.put('/api/procurement/suppliers/:id', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() } });
});

app.put('/api/procurement/suppliers/:id/audit', (req, res) => {
  const { qualificationStatus } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, qualificationStatus: qualificationStatus || 'qualified', updatedAt: new Date().toISOString() } });
});

app.get('/api/procurement/suppliers/:id/rating', (req, res) => {
  const supplier = mockData.procurement.suppliers.find(s => s.id === req.params.id);
  res.json({ code: 200, message: 'success', data: { id: req.params.id, rating: supplier ? supplier.rating : 'C', updatedAt: new Date().toISOString() } });
});

app.get('/api/procurement/purchase-requests', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let requests = mockData.procurement.purchaseRequests;
  if (status) requests = requests.filter(r => r.status === status);
  const result = paginate(requests, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/procurement/purchase-requests', (req, res) => {
  const { productName, sku, quantity, unit, expectedDate, reason } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `pr-${Date.now()}`, requestNo: `PR${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, productName: productName, sku: sku, quantity: quantity, unit: unit || 'kg', requesterId: 'emp-004', requesterName: '采购专员陈', expectedDate: expectedDate, reason: reason, status: 'pending', approvedBy: null, approvedAt: null, createdAt: new Date().toISOString() }
  });
});

app.put('/api/procurement/purchase-requests/:id/approve', (req, res) => {
  const { status } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status || 'approved', approvedBy: 'mgr-001', approvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.get('/api/procurement/purchase-orders', (req, res) => {
  const { page = 1, pageSize = 20, approvalStatus, status } = req.query;
  let orders = mockData.procurement.purchaseOrders;
  if (approvalStatus) orders = orders.filter(o => o.approvalStatus === approvalStatus);
  if (status) orders = orders.filter(o => o.status === status);
  const result = paginate(orders, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/procurement/purchase-orders', (req, res) => {
  const { supplierId, supplierName, items, totalAmount, deliveryDate } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `po-${Date.now()}`, orderNo: `PO${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, supplierId: supplierId, supplierName: supplierName, items: items || [], totalAmount: totalAmount || 0, approvalStatus: 'pending', approvedBy: null, approvedAt: null, deliveryDate: deliveryDate, status: 'pending', createdAt: new Date().toISOString() }
  });
});

app.put('/api/procurement/purchase-orders/:id/approve', (req, res) => {
  const { approvalStatus } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, approvalStatus: approvalStatus || 'approved', approvedBy: 'mgr-001', approvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.get('/api/procurement/purchase-orders/:id/track', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { id: req.params.id, tracking: [{ step: 'order_created', status: 'completed', timestamp: '2025-05-10T16:00:00Z' }, { step: 'supplier_confirmed', status: 'completed', timestamp: '2025-05-11T08:00:00Z' }, { step: 'shipping', status: 'in_progress', timestamp: null }, { step: 'received', status: 'pending', timestamp: null }], updatedAt: new Date().toISOString() }
  });
});

app.get('/api/procurement/payable-accounts', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let accounts = mockData.procurement.payableAccounts;
  if (status) accounts = accounts.filter(a => a.status === status);
  const result = paginate(accounts, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/procurement/reconciliation/generate', (req, res) => {
  const { supplierId, period } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `recon-${Date.now()}`, reconciliationNo: `RECON${new Date().getFullYear()}${String(Date.now()).slice(-6)}`, supplierId: supplierId, period: period, totalPurchaseAmount: 4000.00, totalPaidAmount: 0.00, difference: 4000.00, status: 'pending', createdAt: new Date().toISOString() }
  });
});

app.put('/api/procurement/reconciliation/:id/confirm', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'confirmed', confirmedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.post('/api/procurement/payment-requests', (req, res) => {
  const { payableAccountId, amount, payee } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `payreq-${Date.now()}`, payableAccountId: payableAccountId, amount: amount, payee: payee, status: 'pending', createdAt: new Date().toISOString() }
  });
});

app.put('/api/procurement/payment-requests/:id/approve', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'approved', approvedBy: 'fin-001', approvedAt: new Date().toISOString() } });
});

app.put('/api/procurement/payment-requests/:id/execute', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'executed', executedAt: new Date().toISOString() } });
});

// === PAYMENT MODULE ===
app.get('/api/payment/merchants', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let merchants = mockData.payment.merchants;
  if (status) merchants = merchants.filter(m => m.status === status);
  const result = paginate(merchants, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/payment/merchants/:id', (req, res) => {
  const merchant = mockData.payment.merchants.find(m => m.id === req.params.id);
  if (merchant) {
    res.json({ code: 200, message: 'success', data: merchant });
  } else {
    res.status(404).json({ code: 404, message: 'Merchant not found' });
  }
});

app.post('/api/payment/merchants', (req, res) => {
  const { name, contactName, contactPhone, feeRate, settlementAccount, settlementBank } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `merch-${Date.now()}`, name: name, contactName: contactName, contactPhone: contactPhone, feeRate: feeRate || 0.02, settlementAccount: settlementAccount, settlementBank: settlementBank, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  });
});

app.put('/api/payment/merchants/:id', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() } });
});

app.put('/api/payment/merchants/:id/fee-rate', (req, res) => {
  const { feeRate } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, feeRate: feeRate, updatedAt: new Date().toISOString() } });
});

app.put('/api/payment/merchants/:id/settlement-account', (req, res) => {
  const { settlementAccount, settlementBank } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, settlementAccount: settlementAccount, settlementBank: settlementBank, updatedAt: new Date().toISOString() } });
});

app.get('/api/payment/receipts', (req, res) => {
  const { page = 1, pageSize = 20, status, payMethod, merchantId } = req.query;
  let receipts = mockData.payment.receipts;
  if (status) receipts = receipts.filter(r => r.status === status);
  if (payMethod) receipts = receipts.filter(r => r.payMethod === payMethod);
  if (merchantId) receipts = receipts.filter(r => r.merchantId === merchantId);
  const result = paginate(receipts, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/payment/receipts/:id', (req, res) => {
  const receipt = mockData.payment.receipts.find(r => r.id === req.params.id);
  if (receipt) {
    res.json({ code: 200, message: 'success', data: receipt });
  } else {
    res.status(404).json({ code: 404, message: 'Receipt not found' });
  }
});

app.get('/api/payment/receipts/daily-summary', (req, res) => {
  const { date } = req.query;
  res.json({
    code: 200, message: 'success',
    data: { date: date || new Date().toISOString().split('T')[0], totalAmount: 350.50, totalCount: 4, wechatAmount: 170.35, alipayAmount: 57.00, bankCardAmount: 123.15 }
  });
});

app.get('/api/payment/receipts/monthly-summary', (req, res) => {
  const { month } = req.query;
  res.json({
    code: 200, message: 'success',
    data: { month: month || '2025-05', totalAmount: 2500.00, totalCount: 30, wechatAmount: 1200.00, alipayAmount: 800.00, bankCardAmount: 500.00 }
  });
});

app.put('/api/payment/receipts/:id/mark-abnormal', (req, res) => {
  const { abnormalReason } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'abnormal', abnormalReason: abnormalReason, updatedAt: new Date().toISOString() } });
});

app.put('/api/payment/receipts/:id/process-abnormal', (req, res) => {
  const { processResult } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'normal', processResult: processResult, updatedAt: new Date().toISOString() } });
});

app.get('/api/payment/settlement/config', (req, res) => {
  res.json({ code: 200, message: 'success', data: mockData.payment.settlementConfig });
});

app.get('/api/payment/settlement/reports', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let reports = mockData.payment.settlementReports;
  if (status) reports = reports.filter(r => r.status === status);
  const result = paginate(reports, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/payment/settlement/execute', (req, res) => {
  const { merchantId, amount } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `settle-${Date.now()}`, merchantId: merchantId, amount: amount, status: 'processing', createdAt: new Date().toISOString() }
  });
});

app.post('/api/payment/settlement/notify', (req, res) => {
  const { settlementId, status, amount } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { settlementId: settlementId, status: status || 'completed', amount: amount, notifiedAt: new Date().toISOString() }
  });
});

// === OPERATIONS MODULE ===
app.get('/api/operations/products', (req, res) => {
  const { page = 1, pageSize = 20, status, categoryId } = req.query;
  let products = mockData.operations.products;
  if (status) products = products.filter(p => p.status === status);
  if (categoryId) products = products.filter(p => p.categoryId === categoryId);
  const result = paginate(products, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/operations/products/:id', (req, res) => {
  const product = mockData.operations.products.find(p => p.id === req.params.id);
  if (product) {
    res.json({ code: 200, message: 'success', data: product });
  } else {
    res.status(404).json({ code: 404, message: 'Product not found' });
  }
});

app.post('/api/operations/products', (req, res) => {
  const { sku, name, categoryId, categoryName, price, vipPrice, stock, image } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `ops-prod-${Date.now()}`, sku: sku, name: name, categoryId: categoryId, categoryName: categoryName, price: price, vipPrice: vipPrice, stock: stock, status: 'off_sale', image: image, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  });
});

app.put('/api/operations/products/:id', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() } });
});

app.put('/api/operations/products/:id/status', (req, res) => {
  const { status } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status || 'on_sale', updatedAt: new Date().toISOString() } });
});

app.get('/api/operations/categories', (req, res) => {
  res.json({ code: 200, message: 'success', data: { list: mockData.operations.categories, total: mockData.operations.categories.length } });
});

app.post('/api/operations/categories', (req, res) => {
  const { name, parentId, level, icon, sortOrder } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `ops-cat-${Date.now()}`, name: name, parentId: parentId, level: level || 1, icon: icon, sortOrder: sortOrder || 0, status: 'active', createdAt: new Date().toISOString() }
  });
});

app.put('/api/operations/categories/:id', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() } });
});

app.get('/api/operations/promotions', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let promotions = mockData.operations.promotions;
  if (status) promotions = promotions.filter(p => p.status === status);
  const result = paginate(promotions, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/operations/promotions', (req, res) => {
  const { name, type, rule, startDate, endDate, applicableCategories } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `promo-${Date.now()}`, name: name, type: type, rule: rule, startDate: startDate, endDate: endDate, applicableCategories: applicableCategories || [], status: 'upcoming', createdAt: new Date().toISOString() }
  });
});

app.put('/api/operations/promotions/:id', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() } });
});

app.get('/api/operations/promotions/:id/statistics', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { promotionId: req.params.id, totalOrders: 150, totalRevenue: 5000.00, totalDiscount: 800.00, avgOrderAmount: 33.33, participantCount: 80 }
  });
});

app.get('/api/operations/coupons', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let coupons = mockData.operations.coupons;
  if (status) coupons = coupons.filter(c => c.status === status);
  const result = paginate(coupons, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/operations/coupons', (req, res) => {
  const { name, type, amount, minPurchase, validFrom, validTo, totalCount } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `coupon-${Date.now()}`, name: name, type: type, amount: amount, minPurchase: minPurchase, validFrom: validFrom, validTo: validTo, totalCount: totalCount || 100, usedCount: 0, status: 'active', createdAt: new Date().toISOString() }
  });
});

app.get('/api/operations/seckill/config', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { enabled: true, startTime: '10:00', endTime: '12:00', maxQuantityPerUser: 3, products: [{ sku: 'SKU000001', seckillPrice: 5.99, totalStock: 50 }] }
  });
});

app.get('/api/operations/merchant-applications', (req, res) => {
  const { page = 1, pageSize = 20, reviewStatus } = req.query;
  let applications = mockData.operations.merchantApplications;
  if (reviewStatus) applications = applications.filter(a => a.reviewStatus === reviewStatus);
  const result = paginate(applications, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/operations/merchant-applications/:id', (req, res) => {
  const application = mockData.operations.merchantApplications.find(a => a.id === req.params.id);
  if (application) {
    res.json({ code: 200, message: 'success', data: application });
  } else {
    res.status(404).json({ code: 404, message: 'Application not found' });
  }
});

app.put('/api/operations/merchant-applications/:id/review', (req, res) => {
  const { reviewStatus, reviewRemark } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, reviewStatus: reviewStatus || 'approved', reviewedBy: 'mgr-001', reviewedAt: new Date().toISOString(), reviewRemark: reviewRemark } });
});

// === DATA CENTER MODULE ===
app.post('/api/data-center/query', (req, res) => {
  const { module, metrics, startDate, endDate } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { module: module, metrics: metrics, startDate: startDate, endDate: endDate, results: { totalSales: 28000.00, orderCount: 240, avgOrderAmount: 116.67 }, createdAt: new Date().toISOString() }
  });
});

app.get('/api/data-center/realtime', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { currentSales: 1250.00, currentOrders: 12, activeUsers: 350, onlineMerchants: 5, timestamp: new Date().toISOString() }
  });
});

app.get('/api/data-center/history', (req, res) => {
  const { startDate, endDate, module } = req.query;
  res.json({
    code: 200, message: 'success',
    data: { startDate: startDate || '2025-05-01', endDate: endDate || '2025-05-10', module: module || 'sales', records: [{ date: '2025-05-01', value: 1500.00 }, { date: '2025-05-02', value: 1800.00 }, { date: '2025-05-03', value: 2200.00 }] }
  });
});

app.get('/api/data-center/analysis/sales', (req, res) => {
  res.json({ code: 200, message: 'success', data: mockData.dataCenter.salesAnalysis });
});

app.get('/api/data-center/analysis/user', (req, res) => {
  res.json({ code: 200, message: 'success', data: mockData.dataCenter.userAnalysis });
});

app.get('/api/data-center/analysis/product', (req, res) => {
  res.json({ code: 200, message: 'success', data: mockData.dataCenter.productAnalysis });
});

app.get('/api/data-center/analysis/channel', (req, res) => {
  res.json({ code: 200, message: 'success', data: mockData.dataCenter.channelAnalysis });
});

app.get('/api/data-center/report/templates', (req, res) => {
  res.json({ code: 200, message: 'success', data: { list: mockData.dataCenter.reportTemplates, total: mockData.dataCenter.reportTemplates.length } });
});

app.post('/api/data-center/report/generate', (req, res) => {
  const { templateId, startDate, endDate } = req.body;
  const template = mockData.dataCenter.reportTemplates.find(t => t.id === templateId);
  res.json({
    code: 200, message: 'success',
    data: { id: `report-${Date.now()}`, templateId: templateId, templateName: template ? template.name : 'Unknown', type: template ? template.type : 'daily', startDate: startDate, endDate: endDate, status: 'generating', createdAt: new Date().toISOString() }
  });
});

app.get('/api/data-center/report/:id/export', (req, res) => {
  const { format } = req.query;
  res.json({
    code: 200, message: 'success',
    data: { id: req.params.id, format: format || 'excel', downloadUrl: `/api/files/report-${req.params.id}.${format || 'xlsx'}`, generatedAt: new Date().toISOString() }
  });
});

app.get('/api/data-center/auto-export/config', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { enabled: true, frequency: 'daily', time: '08:00', recipients: ['admin@crmb.com'], format: 'excel', lastExportAt: '2025-05-10T08:00:00Z' }
  });
});

app.put('/api/data-center/auto-export/config', (req, res) => {
  res.json({ code: 200, message: 'success', data: { ...req.body, updatedAt: new Date().toISOString() } });
});

// === DIRECT DELIVERY MODULE ===
app.get('/api/direct-delivery/routes', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.directDelivery.routes, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/direct-delivery/routes', (req, res) => {
  const { name, stations, deliveryPersonId, deliveryPersonName, estimatedTime } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `route-${Date.now()}`, name: name, stations: stations || [], deliveryPersonId: deliveryPersonId, deliveryPersonName: deliveryPersonName, estimatedTime: estimatedTime, status: 'active', createdAt: new Date().toISOString() }
  });
});

app.put('/api/direct-delivery/routes/:id', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, ...req.body, updatedAt: new Date().toISOString() } });
});

app.delete('/api/direct-delivery/routes/:id', (req, res) => {
  res.json({ code: 200, message: 'success' });
});

app.post('/api/direct-delivery/routes/optimize', (req, res) => {
  const { routeId, stationIds } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { routeId: routeId, originalTime: 120, optimizedTime: 95, suggestedOrder: stationIds || ['station-001', 'station-002'], estimatedSavings: 25 }
  });
});

app.get('/api/direct-delivery/stations', (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;
  const result = paginate(mockData.directDelivery.stations, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/direct-delivery/stations', (req, res) => {
  const { name, address, latitude, longitude, sortOrder } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `station-${Date.now()}`, name: name, address: address, latitude: latitude, longitude: longitude, sortOrder: sortOrder || 1, status: 'active', createdAt: new Date().toISOString() }
  });
});

app.get('/api/direct-delivery/tasks', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  let tasks = mockData.directDelivery.deliveryTasks;
  if (status) tasks = tasks.filter(t => t.status === status);
  const result = paginate(tasks, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.post('/api/direct-delivery/tasks/assign', (req, res) => {
  const { taskId, deliveryPersonId, deliveryPersonName } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { taskId: taskId, deliveryPersonId: deliveryPersonId, deliveryPersonName: deliveryPersonName, assignedAt: new Date().toISOString() }
  });
});

app.post('/api/direct-delivery/tasks/auto-assign', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { assignedCount: 3, tasks: [{ taskId: 'task-003', deliveryPersonId: 'emp-005', deliveryPersonName: '配送员刘', routeId: 'route-002' }] }
  });
});

app.put('/api/direct-delivery/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status, updatedAt: new Date().toISOString() } });
});

app.post('/api/direct-delivery/tasks/:id/exception', (req, res) => {
  const { exceptionType, description } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { taskId: req.params.id, exceptionType: exceptionType, description: description, status: 'exception', createdAt: new Date().toISOString() }
  });
});

app.put('/api/direct-delivery/tasks/:id/confirm', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'completed', completedTime: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.get('/api/direct-delivery/tracking/realtime/:taskId', (req, res) => {
  const points = mockData.directDelivery.trackPoints.filter(p => p.taskId === req.params.taskId);
  res.json({
    code: 200, message: 'success',
    data: { taskId: req.params.taskId, currentPosition: { latitude: 39.9219, longitude: 116.4736, timestamp: new Date().toISOString() }, recentPoints: points.slice(-3), estimatedArrival: '2025-05-12T14:00:00Z' }
  });
});

app.get('/api/direct-delivery/tracking/history/:taskId', (req, res) => {
  const points = mockData.directDelivery.trackPoints.filter(p => p.taskId === req.params.taskId);
  res.json({ code: 200, message: 'success', data: { taskId: req.params.taskId, trackPoints: points, totalTime: 120 } });
});

app.get('/api/direct-delivery/tracking/analysis', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { avgDeliveryTime: 95, onTimeRate: 0.85, exceptionRate: 0.05, routeEfficiency: { route001: 0.88, route002: 0.92 } }
  });
});

app.get('/api/direct-delivery/tracking/abnormal-warning', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { warnings: [{ taskId: 'task-002', type: 'delay', description: '配送超时预警', estimatedDelay: 30, severity: 'medium' }], totalCount: 1 }
  });
});

// === SUPPLIER MODULE ===
app.get('/api/supplier/orders', (req, res) => {
  const { page = 1, pageSize = 20, confirmStatus } = req.query;
  let orders = mockData.supplier.supplierOrders;
  if (confirmStatus) orders = orders.filter(o => o.confirmStatus === confirmStatus);
  const result = paginate(orders, page, pageSize);
  res.json({ code: 200, message: 'success', data: result });
});

app.get('/api/supplier/orders/:id', (req, res) => {
  const order = mockData.supplier.supplierOrders.find(o => o.id === req.params.id);
  if (order) {
    res.json({ code: 200, message: 'success', data: order });
  } else {
    res.status(404).json({ code: 404, message: 'Supplier order not found' });
  }
});

app.put('/api/supplier/orders/:id/confirm', (req, res) => {
  const { confirmStatus } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, confirmStatus: confirmStatus || 'confirmed', confirmedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.put('/api/supplier/orders/:id/status', (req, res) => {
  const { status } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status, updatedAt: new Date().toISOString() } });
});

app.post('/api/supplier/orders/:id/exception', (req, res) => {
  const { exceptionType, description } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { orderId: req.params.id, exceptionType: exceptionType, description: description, createdAt: new Date().toISOString() }
  });
});

app.post('/api/supplier/shipping/create', (req, res) => {
  const { supplierOrderId, logisticsCompany, logisticsNo, estimatedArrival } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { id: `ship-${Date.now()}`, supplierOrderId: supplierOrderId, logisticsCompany: logisticsCompany, logisticsNo: logisticsNo, estimatedArrival: estimatedArrival, status: 'pending', createdAt: new Date().toISOString() }
  });
});

app.put('/api/supplier/shipping/:id/logistics', (req, res) => {
  const { logisticsCompany, logisticsNo } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, logisticsCompany: logisticsCompany, logisticsNo: logisticsNo, updatedAt: new Date().toISOString() } });
});

app.put('/api/supplier/shipping/:id/status', (req, res) => {
  const { status, shippedAt } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: status || 'shipped', shippedAt: shippedAt || new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.post('/api/supplier/shipping/:id/exception', (req, res) => {
  const { exceptionType, description } = req.body;
  res.json({
    code: 200, message: 'success',
    data: { shippingId: req.params.id, exceptionType: exceptionType, description: description, createdAt: new Date().toISOString() }
  });
});

app.get('/api/supplier/reconciliation/monthly', (req, res) => {
  const { month } = req.query;
  res.json({ code: 200, message: 'success', data: { list: mockData.supplier.reconciliationData, total: mockData.supplier.reconciliationData.length } });
});

app.put('/api/supplier/reconciliation/:id/difference', (req, res) => {
  const { differenceAmount, differenceReason } = req.body;
  res.json({ code: 200, message: 'success', data: { id: req.params.id, differenceAmount: differenceAmount, differenceReason: differenceReason, updatedAt: new Date().toISOString() } });
});

app.put('/api/supplier/reconciliation/:id/confirm', (req, res) => {
  res.json({ code: 200, message: 'success', data: { id: req.params.id, status: 'confirmed', confirmedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
});

app.get('/api/supplier/reconciliation/:id/payment-progress', (req, res) => {
  res.json({
    code: 200, message: 'success',
    data: { id: req.params.id, totalAmount: 4000.00, paidAmount: 0.00, remainingAmount: 4000.00, paymentStatus: 'unpaid', expectedPayDate: '2025-06-10' }
  });
});

// === FILES MODULE ===
app.post('/api/files/upload', (req, res) => {
  const mockFileUrl = `/api/files/${Date.now()}-mock-file.jpg`;
  res.json({ code: 200, message: 'success', data: { id: Date.now().toString(), url: mockFileUrl, name: 'mock-file.jpg' } });
});

app.get('/api/files/:filename', (req, res) => {
  res.json({ code: 200, message: 'File served', filename: req.params.filename });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock server running on http://0.0.0.0:${PORT}`);
  console.log('Available modules with realistic data:');
  console.log('- auth (login, userinfo)');
  console.log('- mall (products, categories, banners, announcements, VIP)');
  console.log('- customer-service (orders, after-sales, complaints, reviews, feedback, invoices)');
  console.log('- sales (visits, stores, customers, special requests, blacklist)');
  console.log('- finance (transactions, reconciliations, reports)');
  console.log('- hr (employees, attendance, performance)');
  console.log('- cloud-warehouse (inventory, outbound, inbound)');
  console.log('- procurement (suppliers, purchase requests, purchase orders, payable accounts, reconciliation)');
  console.log('- payment (merchants, receipts, settlement)');
  console.log('- operations (products, categories, promotions, coupons, merchant applications)');
  console.log('- data-center (query, realtime, history, analysis, reports)');
  console.log('- direct-delivery (routes, stations, tasks, tracking)');
  console.log('- supplier (orders, shipping, reconciliation)');
});

module.exports = app;