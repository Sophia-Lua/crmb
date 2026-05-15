const mockData = {
  mall: {
    categories: [
      { id: 'cat-001', code: 'fresh_fruit', name: '生鲜水果', parentId: null, icon: '/api/files/icon-fruit.png', sortOrder: 1, status: 'active' },
      { id: 'cat-002', code: 'vegetables', name: '蔬菜', parentId: null, icon: '/api/files/icon-veg.png', sortOrder: 2, status: 'active' },
      { id: 'cat-003', code: 'meat', name: '肉类', parentId: null, icon: '/api/files/icon-meat.png', sortOrder: 3, status: 'active' },
      { id: 'cat-004', code: 'dairy', name: '乳制品', parentId: null, icon: '/api/files/icon-dairy.png', sortOrder: 4, status: 'active' },
      { id: 'cat-005', code: 'beverages', name: '饮料', parentId: null, icon: '/api/files/icon-drink.png', sortOrder: 5, status: 'active' }
    ],
    products: [
      {
        id: 'prod-001', sku: 'SKU000001', name: '红富士苹果', categoryId: 'cat-001', categoryName: '生鲜水果',
        images: ['/api/files/apple-1.jpg', '/api/files/apple-2.jpg'],
        description: '新鲜优质红富士苹果，山东烟台产地直供，甜脆多汁',
        price: 12.99, vipPrice: 10.99, superVipPrice: 8.99, stock: 500, status: 'on_sale',
        tags: ['生鲜水果', '热销', '山东特产'], salesCount: 1200,
        createdAt: '2025-01-15T10:30:00Z', updatedAt: '2025-05-10T14:20:00Z'
      },
      {
        id: 'prod-002', sku: 'SKU000002', name: '香蕉', categoryId: 'cat-001', categoryName: '生鲜水果',
        images: ['/api/files/banana-1.jpg'],
        description: '进口香蕉，香甜可口，菲律宾直供',
        price: 8.50, vipPrice: 7.20, superVipPrice: 6.50, stock: 300, status: 'on_sale',
        tags: ['生鲜水果', '新品', '进口水果'], salesCount: 800,
        createdAt: '2025-02-20T09:15:00Z', updatedAt: '2025-05-09T11:45:00Z'
      },
      {
        id: 'prod-003', sku: 'SKU000003', name: '西红柿', categoryId: 'cat-002', categoryName: '蔬菜',
        images: ['/api/files/tomato-1.jpg'],
        description: '有机西红柿，无农药残留，本地农场直供',
        price: 6.80, vipPrice: 5.80, superVipPrice: 4.90, stock: 200, status: 'on_sale',
        tags: ['蔬菜', '有机', '本地直供'], salesCount: 650,
        createdAt: '2025-03-05T08:20:00Z', updatedAt: '2025-05-08T16:30:00Z'
      },
      {
        id: 'prod-004', sku: 'SKU000004', name: '猪肉', categoryId: 'cat-003', categoryName: '肉类',
        images: ['/api/files/pork-1.jpg'],
        description: '冷鲜猪肉，检疫合格，当日屠宰',
        price: 28.50, vipPrice: 25.00, superVipPrice: 22.00, stock: 150, status: 'on_sale',
        tags: ['肉类', '冷鲜', '检疫合格'], salesCount: 420,
        createdAt: '2025-03-10T07:45:00Z', updatedAt: '2025-05-07T12:15:00Z'
      },
      {
        id: 'prod-005', sku: 'SKU000005', name: '蒙牛纯牛奶', categoryId: 'cat-004', categoryName: '乳制品',
        images: ['/api/files/milk-1.jpg'],
        description: '蒙牛纯牛奶250ml*12盒装，保质期7天',
        price: 45.90, vipPrice: 42.00, superVipPrice: 38.50, stock: 100, status: 'on_sale',
        tags: ['乳制品', '品牌', '家庭装'], salesCount: 380,
        createdAt: '2025-03-15T11:20:00Z', updatedAt: '2025-05-06T09:40:00Z'
      },
      {
        id: 'prod-006', sku: 'SKU000006', name: '草莓', categoryId: 'cat-001', categoryName: '生鲜水果',
        images: ['/api/files/strawberry-1.jpg'],
        description: '丹东99草莓，香甜多汁，产地直供',
        price: 35.80, vipPrice: 32.00, superVipPrice: 28.50, stock: 80, status: 'on_sale',
        tags: ['生鲜水果', '新品', '丹东特产'], salesCount: 320,
        createdAt: '2025-03-20T10:00:00Z', updatedAt: '2025-05-05T08:30:00Z'
      },
      {
        id: 'prod-007', sku: 'SKU000007', name: '菠菜', categoryId: 'cat-002', categoryName: '蔬菜',
        images: ['/api/files/spinach-1.jpg'],
        description: '有机菠菜，富含铁元素，农场新鲜采摘',
        price: 5.60, vipPrice: 4.80, superVipPrice: 4.00, stock: 180, status: 'on_sale',
        tags: ['蔬菜', '有机', '铁元素'], salesCount: 290,
        createdAt: '2025-03-25T09:10:00Z', updatedAt: '2025-05-04T15:20:00Z'
      },
      {
        id: 'prod-008', sku: 'SKU000008', name: '鸡胸肉', categoryId: 'cat-003', categoryName: '肉类',
        images: ['/api/files/chicken-1.jpg'],
        description: '冷鲜鸡胸肉，低脂高蛋白，健身首选',
        price: 22.00, vipPrice: 19.50, superVipPrice: 17.00, stock: 120, status: 'on_sale',
        tags: ['肉类', '低脂', '健身'], salesCount: 260,
        createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-05-03T12:10:00Z'
      },
      {
        id: 'prod-009', sku: 'SKU000009', name: '酸奶', categoryId: 'cat-004', categoryName: '乳制品',
        images: ['/api/files/yogurt-1.jpg'],
        description: '光明原味酸奶200ml*6杯，新鲜发酵',
        price: 18.90, vipPrice: 16.50, superVipPrice: 14.80, stock: 200, status: 'on_sale',
        tags: ['乳制品', '酸奶', '品牌'], salesCount: 560,
        createdAt: '2025-01-25T11:00:00Z', updatedAt: '2025-05-02T09:45:00Z'
      },
      {
        id: 'prod-010', sku: 'SKU000010', name: '可口可乐', categoryId: 'cat-005', categoryName: '饮料',
        images: ['/api/files/cola-1.jpg'],
        description: '可口可乐330ml*12罐装，经典口味',
        price: 38.00, vipPrice: 35.00, superVipPrice: 32.00, stock: 300, status: 'on_sale',
        tags: ['饮料', '碳酸', '品牌'], salesCount: 720,
        createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-05-01T16:30:00Z'
      },
      {
        id: 'prod-011', sku: 'SKU000011', name: '葡萄', categoryId: 'cat-001', categoryName: '生鲜水果',
        images: ['/api/files/grape-1.jpg'],
        description: '新疆无籽葡萄，甜度高，颗粒饱满',
        price: 19.80, vipPrice: 17.50, superVipPrice: 15.20, stock: 90, status: 'on_sale',
        tags: ['生鲜水果', '新疆特产', '无籽'], salesCount: 210,
        createdAt: '2025-04-10T10:30:00Z', updatedAt: '2025-05-07T11:00:00Z'
      },
      {
        id: 'prod-012', sku: 'SKU000012', name: '土豆', categoryId: 'cat-002', categoryName: '蔬菜',
        images: ['/api/files/potato-1.jpg'],
        description: '内蒙古土豆，淀粉含量高，适合烹饪',
        price: 3.80, vipPrice: 3.20, superVipPrice: 2.80, stock: 400, status: 'on_sale',
        tags: ['蔬菜', '内蒙古', '淀粉高'], salesCount: 620,
        createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-05-06T14:00:00Z'
      },
      {
        id: 'prod-013', sku: 'SKU000013', name: '牛肉', categoryId: 'cat-003', categoryName: '肉类',
        images: ['/api/files/beef-1.jpg'],
        description: '澳洲进口牛肉，纹理清晰，口感嫩滑',
        price: 58.00, vipPrice: 52.00, superVipPrice: 46.00, stock: 60, status: 'on_sale',
        tags: ['肉类', '进口', '澳洲'], salesCount: 180,
        createdAt: '2025-04-10T08:15:00Z', updatedAt: '2025-05-05T10:20:00Z'
      },
      {
        id: 'prod-014', sku: 'SKU000014', name: '奶酪', categoryId: 'cat-004', categoryName: '乳制品',
        images: ['/api/files/cheese-1.jpg'],
        description: '安佳切达奶酪200g，烘焙料理必备',
        price: 32.00, vipPrice: 28.50, superVipPrice: 25.00, stock: 70, status: 'on_sale',
        tags: ['乳制品', '奶酪', '烘焙'], salesCount: 150,
        createdAt: '2025-03-25T13:00:00Z', updatedAt: '2025-05-04T17:30:00Z'
      },
      {
        id: 'prod-015', sku: 'SKU000015', name: '矿泉水', categoryId: 'cat-005', categoryName: '饮料',
        images: ['/api/files/water-1.jpg'],
        description: '农夫山泉550ml*12瓶装，天然弱碱性',
        price: 24.00, vipPrice: 21.00, superVipPrice: 18.50, stock: 500, status: 'on_sale',
        tags: ['饮料', '矿泉水', '家庭装'], salesCount: 720,
        createdAt: '2025-01-05T07:30:00Z', updatedAt: '2025-05-03T08:15:00Z'
      }
    ],
    banners: [
      { id: 'banner-001', imageUrl: '/api/files/banner-promo1.jpg', linkUrl: '/pages/product/detail?id=prod-001', sortOrder: 1, status: 'active' },
      { id: 'banner-002', imageUrl: '/api/files/banner-promo2.jpg', linkUrl: '/pages/vip/index', sortOrder: 2, status: 'active' }
    ],
    announcements: [
      { id: 'ann-001', title: '五一劳动节促销活动', content: '5月1日-5月5日，全场商品8折优惠，VIP用户额外95折！', type: 'activity', status: 'published', publishAt: '2025-04-28T00:00:00Z', createdAt: '2025-04-25T14:30:00Z' },
      { id: 'ann-002', title: '系统维护通知', content: '5月10日凌晨2:00-4:00进行系统升级，期间服务可能短暂中断', type: 'system', status: 'published', publishAt: '2025-05-08T00:00:00Z', createdAt: '2025-05-07T16:45:00Z' }
    ],
    vipPackages: [
      { id: 'vip-001', name: '月度VIP', level: 'vip', price: 29.90, originalPrice: 39.90, duration: 30, benefits: ['全场95折', '优先配送', '专属客服'], status: 'active' },
      { id: 'vip-002', name: '季度超级VIP', level: 'super_vip', price: 79.90, originalPrice: 119.90, duration: 90, benefits: ['全场9折', '免运费', '优先配送', '专属客服', '生日礼包'], status: 'active' }
    ]
  },

  customerService: {
    orders: [
      {
        id: 'order-001', orderNo: 'ORD202505080001', customerId: 'cust-001', customerName: '张三', customerPhone: '13800138001',
        items: [
          { sku: 'SKU000001', productName: '红富士苹果', quantity: 5, price: 12.99, image: '/api/files/apple-1.jpg' },
          { sku: 'SKU000003', productName: '西红柿', quantity: 3, price: 6.80, image: '/api/files/tomato-1.jpg' }
        ],
        totalAmount: 85.35, payAmount: 80.35, discountAmount: 5.00, status: 'completed',
        payType: 'wechat', payTime: '2025-05-08T14:30:00Z', shipTime: '2025-05-08T16:00:00Z', deliverTime: '2025-05-09T10:15:00Z',
        remark: '请尽快配送',
        operatorLog: [
          { id: 'log-001', operatorId: 'op-001', operatorName: '客服小王', action: '确认订单', remark: '客户要求加急配送', createdAt: '2025-05-08T14:25:00Z' },
          { id: 'log-002', operatorId: 'op-002', operatorName: '配送员李四', action: '完成配送', remark: '客户已签收', createdAt: '2025-05-09T10:20:00Z' }
        ],
        createdAt: '2025-05-08T14:20:00Z'
      },
      {
        id: 'order-002', orderNo: 'ORD202505090002', customerId: 'cust-002', customerName: '李四', customerPhone: '13800138002',
        items: [
          { sku: 'SKU000004', productName: '猪肉', quantity: 2, price: 28.50, image: '/api/files/pork-1.jpg' }
        ],
        totalAmount: 57.00, payAmount: 57.00, discountAmount: 0.00, status: 'shipped',
        payType: 'alipay', payTime: '2025-05-09T09:15:00Z', shipTime: '2025-05-09T11:30:00Z', deliverTime: null,
        remark: '',
        operatorLog: [
          { id: 'log-003', operatorId: 'op-001', operatorName: '客服小王', action: '确认订单', remark: '', createdAt: '2025-05-09T09:20:00Z' }
        ],
        createdAt: '2025-05-09T09:10:00Z'
      },
      {
        id: 'order-003', orderNo: 'ORD202505100003', customerId: 'cust-003', customerName: '王五', customerPhone: '13800138003',
        items: [
          { sku: 'SKU000002', productName: '香蕉', quantity: 3, price: 8.50, image: '/api/files/banana-1.jpg' },
          { sku: 'SKU000005', productName: '蒙牛纯牛奶', quantity: 1, price: 45.90, image: '/api/files/milk-1.jpg' }
        ],
        totalAmount: 71.40, payAmount: 71.40, discountAmount: 0.00, status: 'pending',
        payType: null, payTime: null, shipTime: null, deliverTime: null,
        remark: '希望上午配送',
        operatorLog: [],
        createdAt: '2025-05-10T09:30:00Z'
      },
      {
        id: 'order-004', orderNo: 'ORD202505070004', customerId: 'cust-004', customerName: '赵六', customerPhone: '13800138004',
        items: [
          { sku: 'SKU000001', productName: '红富士苹果', quantity: 2, price: 12.99, image: '/api/files/apple-1.jpg' }
        ],
        totalAmount: 25.98, payAmount: 25.98, discountAmount: 0.00, status: 'cancelled',
        payType: null, payTime: null, shipTime: null, deliverTime: null,
        remark: '不需要了',
        operatorLog: [
          { id: 'log-004', operatorId: 'op-001', operatorName: '客服小王', action: '取消订单', remark: '客户主动取消', createdAt: '2025-05-07T17:00:00Z' }
        ],
        createdAt: '2025-05-07T16:45:00Z'
      },
      {
        id: 'order-005', orderNo: 'ORD202505060005', customerId: 'cust-005', customerName: '孙七', customerPhone: '13800138005',
        items: [
          { sku: 'SKU000004', productName: '猪肉', quantity: 1, price: 28.50, image: '/api/files/pork-1.jpg' }
        ],
        totalAmount: 28.50, payAmount: 28.50, discountAmount: 0.00, status: 'refunded',
        payType: 'wechat', payTime: '2025-05-06T10:00:00Z', shipTime: null, deliverTime: null,
        remark: '',
        operatorLog: [
          { id: 'log-005', operatorId: 'fin-001', operatorName: '财务专员', action: '退款完成', remark: '全额退款28.50元', createdAt: '2025-05-06T14:30:00Z' }
        ],
        createdAt: '2025-05-06T09:50:00Z'
      }
    ],
    afterSales: [
      {
        id: 'as-001', afterSaleNo: 'AS20250510001', orderId: 'order-001', orderNo: 'ORD202505080001',
        type: 'return', status: 'completed', reason: '商品质量问题', description: '苹果有腐烂现象',
        images: ['/api/files/complaint-apple-1.jpg'], refundAmount: 64.95,
        items: [{ sku: 'SKU000001', productName: '红富士苹果', quantity: 5, refundAmount: 64.95 }],
        process: [
          { id: 'proc-001', operatorId: 'cs-001', operatorName: '售后专员', action: '受理申请', remark: '核实商品质量问题', createdAt: '2025-05-08T15:00:00Z' },
          { id: 'proc-002', operatorId: 'cs-001', operatorName: '售后专员', action: '确认收货', remark: '已收到退货', createdAt: '2025-05-09T14:30:00Z' },
          { id: 'proc-003', operatorId: 'fin-001', operatorName: '财务专员', action: '处理退款', remark: '退款已完成', createdAt: '2025-05-10T09:15:00Z' }
        ],
        handlerId: 'cs-001', handlerName: '售后专员', handlerRemark: '商品确实存在质量问题，同意全额退款',
        createdAt: '2025-05-08T14:45:00Z', completedAt: '2025-05-10T09:20:00Z'
      }
    ],
    complaints: [
      {
        id: 'comp-001', complaintNo: 'COMP20250509001', customerId: 'cust-003', customerName: '王五', customerPhone: '13800138003',
        relatedOrderId: 'order-002', type: 'delivery', priority: 'high',
        content: '配送时间严重超时，承诺当天送达但第二天才到，商品已不新鲜',
        images: ['/api/files/delivery-delay-1.jpg'], status: 'processing',
        assigneeId: 'mgr-001', assigneeName: '客服主管',
        process: [
          { id: 'cproc-001', action: '受理客诉', operatorId: 'op-001', operatorName: '客服小王', content: '客户投诉配送超时，已记录并升级处理', createdAt: '2025-05-09T18:30:00Z' },
          { id: 'cproc-002', action: '分配处理', operatorId: 'sys-001', operatorName: '系统', content: '自动分配给客服主管处理', createdAt: '2025-05-09T18:31:00Z' }
        ],
        satisfaction: null, createdAt: '2025-05-09T18:25:00Z', closedAt: null
      }
    ],
    reviews: [
      { id: 'rev-001', orderId: 'order-001', orderNo: 'ORD202505080001', customerId: 'cust-001', customerName: '张三', rating: 4, content: '商品质量不错，配送也很快，就是包装可以再好一点', images: [], status: 'replied', reply: '感谢您的反馈！我们会改进包装质量。', replyBy: '客服小王', replyAt: '2025-05-10T10:30:00Z', createdAt: '2025-05-09T15:20:00Z' }
    ],
    feedbacks: [
      { id: 'fb-001', customerId: 'cust-004', customerName: '赵六', customerPhone: '13800138004', type: 'suggestion', content: '建议增加更多有机蔬菜品种', images: [], status: 'processing', handlerId: 'mgr-002', handlerName: '采购主管', handlerReply: '感谢建议，我们正在联系更多有机蔬菜供应商', createdAt: '2025-05-07T11:45:00Z' }
    ],
    invoices: [
      { id: 'inv-001', invoiceNo: 'INV20250508001', orderId: 'order-001', orderNo: 'ORD202505080001', customerId: 'cust-001', customerName: '张三', type: 'electronic', title: '个人', taxNo: '', amount: 80.35, status: 'issued', address: null, trackingNo: null, approverId: 'fin-002', approverName: '财务审核员', issuerId: 'fin-001', issuerName: '财务专员', createdAt: '2025-05-08T14:50:00Z', issuedAt: '2025-05-08T15:00:00Z' }
    ]
  },

  sales: {
    visits: [
      {
        id: 'visit-001', customerId: 'store-001', customerName: '永辉超市分店', customerType: 'public',
        visitType: 'first', visitMethod: 'onsite', planDate: '2025-05-15', planTime: '10:00',
        subject: '首次拜访 - 永辉超市分店',
        content: '了解客户需求，介绍产品优势，收集反馈意见。客户对红富士苹果和有机蔬菜很感兴趣。',
        images: [{ id: 'img-001', url: '/api/files/visit-store-1.jpg', name: '门店照片.jpg', size: 2048000, type: 'image/jpeg' }],
        feedback: '客户反馈良好，有采购意向。建议跟进红富士苹果相关产品。',
        followUpPlan: '下周再次联系，确认采购数量和时间安排',
        status: 'completed', createdBy: 'sales-001', createdAt: '2025-05-10T09:30:00Z'
      },
      {
        id: 'visit-002', customerId: 'store-002', customerName: '华润万家朝阳店', customerType: 'private',
        visitType: 'regular', visitMethod: 'phone', planDate: '2025-05-12', planTime: null,
        subject: '定期回访 - 华润万家朝阳店',
        content: '电话回访了解近期采购情况，客户对猪肉品质表示满意，希望增加有机蔬菜供应',
        images: [],
        feedback: '客户满意度高，建议增加有机蔬菜品类',
        followUpPlan: '安排产品专员详细介绍有机蔬菜供应方案',
        status: 'in_progress', createdBy: 'sales-002', createdAt: '2025-05-11T14:20:00Z'
      },
      {
        id: 'visit-003', customerId: 'store-004', customerName: '物美超市海淀店', customerType: 'public',
        visitType: 'first', visitMethod: 'onsite', planDate: '2025-05-16', planTime: '14:00',
        subject: '首次拜访 - 物美超市海淀店',
        content: '了解门店经营情况，展示产品样品，洽谈合作意向',
        images: [{ id: 'img-002', url: '/api/files/visit-store-4.jpg', name: '物美门店.jpg', size: 1536000, type: 'image/jpeg' }],
        feedback: null, followUpPlan: null,
        status: 'pending', createdBy: 'sales-001', createdAt: '2025-05-13T08:00:00Z'
      },
      {
        id: 'visit-004', customerId: 'cust-002', customerName: '李四', customerType: 'private',
        visitType: 'regular', visitMethod: 'onsite', planDate: '2025-05-14', planTime: '09:30',
        subject: '定期回访 - 李四超市',
        content: '到店了解销售情况，客户反馈香蕉销量增长明显',
        images: [],
        feedback: '香蕉销售增长30%，建议增加供货频率',
        followUpPlan: '调整香蕉供货为每周两次',
        status: 'completed', createdBy: 'sales-002', createdAt: '2025-05-14T09:30:00Z'
      },
      {
        id: 'visit-005', customerId: 'store-005', customerName: '便利店连锁总部', customerType: 'public',
        visitType: 'key', visitMethod: 'onsite', planDate: '2025-05-17', planTime: '11:00',
        subject: '重点拜访 - 便利店连锁总部',
        content: '与连锁总部采购总监洽谈年度合作框架',
        images: [{ id: 'img-003', url: '/api/files/visit-store-5.jpg', name: '连锁总部.jpg', size: 1800000, type: 'image/jpeg' }],
        feedback: '对方表示有兴趣，但需要提供更详细的报价方案',
        followUpPlan: '三天内提交年度报价方案',
        status: 'in_progress', createdBy: 'sales-001', createdAt: '2025-05-15T11:00:00Z'
      }
    ],
    stores: [
      {
        id: 'store-001', storeName: '永辉超市分店', storeType: 'supermarket',
        address: '北京市朝阳区中山路123号', province: '北京市', city: '朝阳区', district: '朝阳区',
        latitude: 39.9042, longitude: 116.4074, area: 200,
        contactName: '张经理', contactPhone: '13800138101',
        licenses: [
          { id: 'license-1-1', url: '/api/files/license-business-1.jpg', name: '营业执照.jpg', type: '营业执照', expiryDate: '2027-12-31T00:00:00Z' },
          { id: 'license-1-2', url: '/api/files/license-food-1.jpg', name: '食品经营许可证.jpg', type: '食品经营许可证', expiryDate: '2026-06-30T00:00:00Z' }
        ],
        status: 'approved', claimBy: 'sales-001', assignedTo: 'sales-001', reviewBy: 'reviewer-001', rejectReason: null, createdAt: '2025-03-10T08:20:00Z'
      },
      {
        id: 'store-002', storeName: '华润万家朝阳店', storeType: 'supermarket',
        address: '北京市朝阳区建国路88号', province: '北京市', city: '朝阳区', district: '朝阳区',
        latitude: 39.9123, longitude: 116.4567, area: 350,
        contactName: '李经理', contactPhone: '13800138102',
        licenses: [
          { id: 'license-2-1', url: '/api/files/license-business-2.jpg', name: '营业执照.jpg', type: '营业执照', expiryDate: '2028-03-15T00:00:00Z' }
        ],
        status: 'approved', claimBy: 'sales-002', assignedTo: 'sales-002', reviewBy: 'reviewer-001', rejectReason: null, createdAt: '2025-02-15T10:45:00Z'
      },
      {
        id: 'store-003', storeName: '7-Eleven建国门店', storeType: 'convenience',
        address: '北京市朝阳区建国门外大街56号', province: '北京市', city: '朝阳区', district: '朝阳区',
        latitude: 39.9012, longitude: 116.4456, area: 80,
        contactName: '王店长', contactPhone: '13800138103',
        licenses: [],
        status: 'unclaimed', claimBy: null, assignedTo: null, reviewBy: null, rejectReason: null, createdAt: '2025-05-08T16:30:00Z'
      },
      {
        id: 'store-004', storeName: '物美超市海淀店', storeType: 'supermarket',
        address: '北京市海淀区中关村大街1号', province: '北京市', city: '海淀区', district: '海淀区',
        latitude: 39.9542, longitude: 116.3274, area: 280,
        contactName: '赵经理', contactPhone: '13800138104',
        licenses: [
          { id: 'license-4-1', url: '/api/files/license-business-4.jpg', name: '营业执照.jpg', type: '营业执照', expiryDate: '2027-06-30T00:00:00Z' }
        ],
        status: 'pending', claimBy: 'sales-001', assignedTo: null, reviewBy: null, rejectReason: null, createdAt: '2025-05-12T10:00:00Z'
      },
      {
        id: 'store-005', storeName: '便利店连锁总部', storeType: 'convenience_chain',
        address: '北京市丰台区南三环西路16号', province: '北京市', city: '丰台区', district: '丰台区',
        latitude: 39.8585, longitude: 116.3214, area: 150,
        contactName: '陈总监', contactPhone: '13800138105',
        licenses: [],
        status: 'unclaimed', claimBy: null, assignedTo: null, reviewBy: null, rejectReason: null, createdAt: '2025-05-14T09:00:00Z'
      }
    ],
    customers: [
      {
        id: 'cust-001', customerName: '张三', customerType: 'private', storeType: 'restaurant',
        address: '北京市海淀区中关村大街1号', province: '北京市', city: '海淀区', district: '海淀区',
        latitude: 39.9542, longitude: 116.3274, area: 120,
        contactName: '张三', contactPhone: '13800138001',
        businessHours: '08:00-22:00', mainCategories: ['生鲜水果', '蔬菜'], grade: 'A',
        assignedTo: 'sales-001', lastVisitDate: '2025-05-08T14:20:00Z', totalOrderAmount: 85.35,
        status: 'active', createdAt: '2025-01-15T10:30:00Z', updatedAt: '2025-05-08T14:20:00Z'
      },
      {
        id: 'cust-002', customerName: '李四', customerType: 'private', storeType: 'supermarket',
        address: '上海市浦东新区陆家嘴环路1000号', province: '上海市', city: '浦东新区', district: '浦东新区',
        latitude: 31.2304, longitude: 121.4737, area: 200,
        contactName: '李四', contactPhone: '13800138002',
        businessHours: '07:00-23:00', mainCategories: ['肉类', '乳制品'], grade: 'B',
        assignedTo: 'sales-002', lastVisitDate: '2025-05-09T09:10:00Z', totalOrderAmount: 57.00,
        status: 'active', createdAt: '2025-02-20T09:15:00Z', updatedAt: '2025-05-09T09:10:00Z'
      },
      {
        id: 'cust-003', customerName: '王五', customerType: 'public', storeType: 'supermarket',
        address: '广州市天河区天河路385号', province: '广东省', city: '广州市', district: '天河区',
        latitude: 23.1365, longitude: 113.3288, area: 180,
        contactName: '王五', contactPhone: '13800138003',
        businessHours: '08:00-22:00', mainCategories: ['生鲜水果', '饮料'], grade: 'C',
        assignedTo: null, lastVisitDate: null, totalOrderAmount: 0,
        status: 'active', createdAt: '2025-04-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z'
      },
      {
        id: 'cust-004', customerName: '赵六', customerType: 'public', storeType: 'restaurant',
        address: '深圳市福田区福华路88号', province: '广东省', city: '深圳市', district: '福田区',
        latitude: 22.5431, longitude: 114.0579, area: 100,
        contactName: '赵六', contactPhone: '13800138004',
        businessHours: '09:00-21:00', mainCategories: ['蔬菜', '肉类'], grade: 'B',
        assignedTo: null, lastVisitDate: null, totalOrderAmount: 0,
        status: 'active', createdAt: '2025-03-15T14:00:00Z', updatedAt: '2025-03-15T14:00:00Z'
      },
      {
        id: 'cust-005', customerName: '孙七', customerType: 'private', storeType: 'convenience',
        address: '成都市武侯区人民南路四段1号', province: '四川省', city: '成都市', district: '武侯区',
        latitude: 30.5728, longitude: 104.0668, area: 60,
        contactName: '孙七', contactPhone: '13800138005',
        businessHours: '07:00-23:00', mainCategories: ['饮料', '乳制品'], grade: 'A',
        assignedTo: 'sales-001', lastVisitDate: '2025-05-06T09:50:00Z', totalOrderAmount: 28.50,
        status: 'active', createdAt: '2025-01-20T08:30:00Z', updatedAt: '2025-05-06T09:50:00Z'
      }
    ],
    specialStockRequests: [
      { id: 'ssr-001', requestId: 'SSR20250510001', customerId: 'cust-001', customerName: '张三', productName: '进口车厘子', sku: 'SKU000010', quantity: 50, reason: '节日促销需求', status: 'pending', approvedBy: null, fulfilledBy: null, createdAt: '2025-05-10T11:20:00Z', updatedAt: '2025-05-10T11:20:00Z' }
    ],
    blacklist: [
      { id: 'bl-001', customerId: 'cust-005', customerName: '恶意客户', reason: '多次恶意退货', blacklistedBy: 'mgr-001', blacklistedAt: '2025-04-15T14:30:00Z', notes: '已多次沟通无效，列入黑名单' }
    ]
  },

  finance: {
    transactions: [
      { id: 'txn-001', transactionNo: 'TXN20250508001', type: 'income', amount: 80.35, currency: 'CNY', description: '销售收入 - 订单 ORD202505080001', category: 'sales', relatedOrderId: 'order-001', relatedCustomerId: 'cust-001', relatedSupplierId: null, status: 'completed', createdAt: '2025-05-08T14:30:00Z', completedAt: '2025-05-08T14:30:00Z' },
      { id: 'txn-002', transactionNo: 'TXN20250509001', type: 'income', amount: 57.00, currency: 'CNY', description: '销售收入 - 订单 ORD202505090002', category: 'sales', relatedOrderId: 'order-002', relatedCustomerId: 'cust-002', relatedSupplierId: null, status: 'completed', createdAt: '2025-05-09T09:15:00Z', completedAt: '2025-05-09T09:15:00Z' },
      { id: 'txn-003', transactionNo: 'TXN20250510001', type: 'expense', amount: 1200.00, currency: 'CNY', description: '采购支出 - 苹果供应商', category: 'procurement', relatedOrderId: null, relatedCustomerId: null, relatedSupplierId: 'supplier-001', status: 'completed', createdAt: '2025-05-10T10:00:00Z', completedAt: '2025-05-10T10:00:00Z' },
      { id: 'txn-004', transactionNo: 'TXN20250511001', type: 'income', amount: 150.00, currency: 'CNY', description: 'VIP会员费收入', category: 'vip', relatedOrderId: null, relatedCustomerId: 'cust-005', relatedSupplierId: null, status: 'completed', createdAt: '2025-05-11T09:00:00Z', completedAt: '2025-05-11T09:00:00Z' },
      { id: 'txn-005', transactionNo: 'TXN20250512001', type: 'expense', amount: 3500.00, currency: 'CNY', description: '仓储租赁支出', category: 'warehouse', relatedOrderId: null, relatedCustomerId: null, relatedSupplierId: null, status: 'completed', createdAt: '2025-05-12T08:00:00Z', completedAt: '2025-05-12T08:00:00Z' }
    ],
    reconciliations: [
      { id: 'rec-001', reconciliationNo: 'REC20250510001', type: 'customer', relatedId: 'cust-001', startDate: '2025-05-01T00:00:00Z', endDate: '2025-05-10T23:59:59Z', totalAmount: 80.35, matchedAmount: 80.35, unmatchedAmount: 0.00, status: 'completed', createdAt: '2025-05-10T15:00:00Z', completedAt: '2025-05-10T15:05:00Z' }
    ],
    reports: [
      { id: 'rep-001', reportNo: 'REP2025051001', type: 'income_statement', period: 'daily', startDate: '2025-05-10T00:00:00Z', endDate: '2025-05-10T23:59:59Z', data: { totalIncome: 0.00, totalExpense: 1200.00, netProfit: -1200.00, orderCount: 0, customerCount: 0 }, status: 'draft', createdAt: '2025-05-10T16:00:00Z', publishedAt: null }
    ]
  },

  hr: {
    employees: [
      { id: 'emp-001', employeeNo: 'EMP0001', name: '销售代表张', departmentId: 'dept-001', departmentName: '销售部', position: '销售代表', phone: '13800138201', email: 'zhang.sales@crmb.com', hireDate: '2024-03-15T00:00:00Z', status: 'active', avatar: '/api/files/avatar-sales-1.jpg', createdAt: '2024-03-15T09:00:00Z', updatedAt: '2025-01-10T14:30:00Z' },
      { id: 'emp-002', employeeNo: 'EMP0002', name: '仓库管理员李', departmentId: 'dept-002', departmentName: '仓储部', position: '仓库管理员', phone: '13800138202', email: 'li.warehouse@crmb.com', hireDate: '2024-04-20T00:00:00Z', status: 'active', avatar: '/api/files/avatar-warehouse-1.jpg', createdAt: '2024-04-20T09:00:00Z', updatedAt: '2025-02-15T11:20:00Z' },
      { id: 'emp-003', employeeNo: 'EMP0003', name: '客服专员王', departmentId: 'dept-005', departmentName: '客服部', position: '客服专员', phone: '13800138203', email: 'wang.cs@crmb.com', hireDate: '2024-05-10T00:00:00Z', status: 'active', avatar: '/api/files/avatar-cs-1.jpg', createdAt: '2024-05-10T09:00:00Z', updatedAt: '2025-03-20T16:45:00Z' },
      { id: 'emp-004', employeeNo: 'EMP0004', name: '采购专员陈', departmentId: 'dept-003', departmentName: '采购部', position: '采购专员', phone: '13800138204', email: 'chen.procurement@crmb.com', hireDate: '2024-06-01T00:00:00Z', status: 'active', avatar: '/api/files/avatar-proc-1.jpg', createdAt: '2024-06-01T09:00:00Z', updatedAt: '2025-04-10T10:00:00Z' },
      { id: 'emp-005', employeeNo: 'EMP0005', name: '配送员刘', departmentId: 'dept-004', departmentName: '配送部', position: '配送员', phone: '13800138205', email: 'liu.delivery@crmb.com', hireDate: '2024-07-15T00:00:00Z', status: 'active', avatar: '/api/files/avatar-delivery-1.jpg', createdAt: '2024-07-15T09:00:00Z', updatedAt: '2025-05-01T08:30:00Z' }
    ],
    attendanceRecords: [
      { id: 'att-001', employeeId: 'emp-001', employeeName: '销售代表张', date: '2025-05-10', checkInTime: '09:05', checkOutTime: '18:15', status: 'present', leaveType: null, leaveReason: null, createdAt: '2025-05-10T18:20:00Z' },
      { id: 'att-002', employeeId: 'emp-002', employeeName: '仓库管理员李', date: '2025-05-10', checkInTime: '08:55', checkOutTime: '17:50', status: 'present', leaveType: null, leaveReason: null, createdAt: '2025-05-10T18:00:00Z' },
      { id: 'att-003', employeeId: 'emp-003', employeeName: '客服专员王', date: '2025-05-10', checkInTime: null, checkOutTime: null, status: 'leave', leaveType: '病假', leaveReason: '感冒发烧', createdAt: '2025-05-10T08:30:00Z' },
      { id: 'att-004', employeeId: 'emp-004', employeeName: '采购专员陈', date: '2025-05-10', checkInTime: '09:20', checkOutTime: '18:00', status: 'late', leaveType: null, leaveReason: null, createdAt: '2025-05-10T18:05:00Z' },
      { id: 'att-005', employeeId: 'emp-005', employeeName: '配送员刘', date: '2025-05-10', checkInTime: '07:30', checkOutTime: null, status: 'present', leaveType: null, leaveReason: null, createdAt: '2025-05-10T07:30:00Z' }
    ],
    performanceReviews: [
      { id: 'perf-001', employeeId: 'emp-001', employeeName: '销售代表张', reviewerId: 'mgr-003', reviewerName: '销售经理', period: '2025-Q1', score: 4.5, comments: '销售业绩优秀，客户满意度高，建议继续保持', status: 'approved', createdAt: '2025-04-10T14:00:00Z', submittedAt: '2025-04-10T14:00:00Z', approvedAt: '2025-04-15T10:30:00Z' }
    ]
  },

  cloudWarehouse: {
    inventory: [
      { sku: 'SKU000001', productName: '红富士苹果', quantity: 495, reserved: 0, warehouseId: 'WH-001', location: 'A-01-05', batchNo: 'BATCH20250501', expiryDate: '2025-05-20T00:00:00Z' },
      { sku: 'SKU000002', productName: '香蕉', quantity: 300, reserved: 0, warehouseId: 'WH-001', location: 'A-01-06', batchNo: 'BATCH20250502', expiryDate: '2025-05-18T00:00:00Z' },
      { sku: 'SKU000003', productName: '西红柿', quantity: 197, reserved: 3, warehouseId: 'WH-001', location: 'B-02-01', batchNo: 'BATCH20250503', expiryDate: '2025-05-15T00:00:00Z' },
      { sku: 'SKU000004', productName: '猪肉', quantity: 148, reserved: 2, warehouseId: 'WH-001', location: 'C-03-02', batchNo: 'BATCH20250504', expiryDate: '2025-05-12T00:00:00Z' },
      { sku: 'SKU000005', productName: '蒙牛纯牛奶', quantity: 100, reserved: 0, warehouseId: 'WH-001', location: 'D-04-01', batchNo: 'BATCH20250505', expiryDate: '2025-05-17T00:00:00Z' },
      { sku: 'SKU000006', productName: '草莓', quantity: 80, reserved: 5, warehouseId: 'WH-001', location: 'A-01-07', batchNo: 'BATCH20250506', expiryDate: '2025-05-16T00:00:00Z' },
      { sku: 'SKU000007', productName: '菠菜', quantity: 180, reserved: 10, warehouseId: 'WH-002', location: 'B-02-03', batchNo: 'BATCH20250507', expiryDate: '2025-05-14T00:00:00Z' },
      { sku: 'SKU000008', productName: '鸡胸肉', quantity: 120, reserved: 3, warehouseId: 'WH-002', location: 'C-03-04', batchNo: 'BATCH20250508', expiryDate: '2025-05-13T00:00:00Z' }
    ],
    outboundOrders: [
      { id: 'out-001', orderNo: 'OUT20250508001', type: 'sale', items: [{ sku: 'SKU000001', productName: '红富士苹果', quantity: 5, batchNo: 'BATCH20250501' }, { sku: 'SKU000003', productName: '西红柿', quantity: 3, batchNo: 'BATCH20250503' }], status: 'completed', warehouseId: 'WH-001', operatorId: 'emp-002', createdAt: '2025-05-08T14:25:00Z' }
    ],
    inboundOrders: [
      { id: 'in-001', orderNo: 'IN20250510001', type: 'purchase', items: [{ sku: 'SKU000010', productName: '进口车厘子', quantity: 50, batchNo: 'BATCH20250510' }], status: 'pending', warehouseId: 'WH-001', operatorId: 'emp-002', createdAt: '2025-05-10T11:25:00Z' }
    ]
  },

  procurement: {
    suppliers: [
      { id: 'supplier-001', name: '烟台苹果合作社', contactName: '刘经理', contactPhone: '0535-1234567', address: '山东省烟台市栖霞区', qualificationStatus: 'qualified', rating: 'A', category: '生鲜水果', bankAccount: '6222021234567890', bankName: '中国工商银行', createdAt: '2025-01-01T08:00:00Z', updatedAt: '2025-05-10T10:00:00Z' },
      { id: 'supplier-002', name: '菲律宾香蕉贸易公司', contactName: 'Mark Santos', contactPhone: '+63-2-88881234', address: 'Philippines, Davao City', qualificationStatus: 'qualified', rating: 'B', category: '生鲜水果', bankAccount: '6222032345678901', bankName: '中国银行', createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-04-20T14:00:00Z' },
      { id: 'supplier-003', name: '山东有机蔬菜基地', contactName: '王场长', contactPhone: '0531-9876543', address: '山东省济南市历城区', qualificationStatus: 'qualified', rating: 'A', category: '蔬菜', bankAccount: '6222043456789012', bankName: '中国农业银行', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-05-05T16:00:00Z' },
      { id: 'supplier-004', name: '双汇肉业有限公司', contactName: '赵经理', contactPhone: '0395-5556666', address: '河南省漯河市源汇区', qualificationStatus: 'pending', rating: 'C', category: '肉类', bankAccount: '6222054567890123', bankName: '中国建设银行', createdAt: '2025-03-01T07:00:00Z', updatedAt: '2025-05-01T11:00:00Z' },
      { id: 'supplier-005', name: '蒙牛乳业集团', contactName: '李经理', contactPhone: '0471-3368888', address: '内蒙古自治区呼和浩特市和林格尔县', qualificationStatus: 'qualified', rating: 'A', category: '乳制品', bankAccount: '6222065678901234', bankName: '中国招商银行', createdAt: '2025-01-10T08:30:00Z', updatedAt: '2025-05-08T09:00:00Z' }
    ],
    purchaseRequests: [
      { id: 'pr-001', requestNo: 'PR20250510001', productName: '红富士苹果', sku: 'SKU000001', quantity: 500, unit: 'kg', requesterId: 'emp-004', requesterName: '采购专员陈', expectedDate: '2025-05-20', reason: '库存补充', status: 'approved', approvedBy: 'mgr-001', approvedAt: '2025-05-11T10:00:00Z', createdAt: '2025-05-10T08:00:00Z' },
      { id: 'pr-002', requestNo: 'PR20250511002', productName: '草莓', sku: 'SKU000006', quantity: 200, unit: 'kg', requesterId: 'emp-004', requesterName: '采购专员陈', expectedDate: '2025-05-25', reason: '新品采购', status: 'pending', approvedBy: null, approvedAt: null, createdAt: '2025-05-11T09:00:00Z' },
      { id: 'pr-003', requestNo: 'PR20250512003', productName: '鸡胸肉', sku: 'SKU000008', quantity: 300, unit: 'kg', requesterId: 'emp-004', requesterName: '采购专员陈', expectedDate: '2025-05-22', reason: '销量增长补货', status: 'rejected', approvedBy: 'mgr-001', approvedAt: '2025-05-12T15:00:00Z', createdAt: '2025-05-12T08:00:00Z' }
    ],
    purchaseOrders: [
      { id: 'po-001', orderNo: 'PO20250510001', supplierId: 'supplier-001', supplierName: '烟台苹果合作社', items: [{ sku: 'SKU000001', productName: '红富士苹果', quantity: 500, unitPrice: 8.00, totalPrice: 4000.00 }], totalAmount: 4000.00, approvalStatus: 'approved', approvedBy: 'mgr-001', approvedAt: '2025-05-11T14:00:00Z', deliveryDate: '2025-05-20', status: 'in_progress', createdAt: '2025-05-10T16:00:00Z' },
      { id: 'po-002', orderNo: 'PO20250511002', supplierId: 'supplier-003', supplierName: '山东有机蔬菜基地', items: [{ sku: 'SKU000003', productName: '西红柿', quantity: 200, unitPrice: 4.50, totalPrice: 900.00 }, { sku: 'SKU000007', productName: '菠菜', quantity: 150, unitPrice: 3.80, totalPrice: 570.00 }], totalAmount: 1470.00, approvalStatus: 'pending', approvedBy: null, approvedAt: null, deliveryDate: '2025-05-25', status: 'pending', createdAt: '2025-05-11T10:00:00Z' },
      { id: 'po-003', orderNo: 'PO20250512003', supplierId: 'supplier-005', supplierName: '蒙牛乳业集团', items: [{ sku: 'SKU000005', productName: '蒙牛纯牛奶', quantity: 300, unitPrice: 35.00, totalPrice: 10500.00 }], totalAmount: 10500.00, approvalStatus: 'approved', approvedBy: 'mgr-002', approvedAt: '2025-05-13T10:00:00Z', deliveryDate: '2025-05-22', status: 'delivered', createdAt: '2025-05-12T09:00:00Z' }
    ],
    payableAccounts: [
      { id: 'pa-001', supplierId: 'supplier-001', supplierName: '烟台苹果合作社', amount: 4000.00, dueDate: '2025-06-10', status: 'unpaid', purchaseOrderId: 'po-001', createdAt: '2025-05-20T10:00:00Z' },
      { id: 'pa-002', supplierId: 'supplier-005', supplierName: '蒙牛乳业集团', amount: 10500.00, dueDate: '2025-06-15', status: 'paid', purchaseOrderId: 'po-003', paidAt: '2025-05-22T10:00:00Z', createdAt: '2025-05-22T08:00:00Z' }
    ],
    reconciliationData: [
      { id: 'recon-001', reconciliationNo: 'RECON202505001', supplierId: 'supplier-001', supplierName: '烟台苹果合作社', period: '2025-05', totalPurchaseAmount: 4000.00, totalPaidAmount: 0.00, difference: 4000.00, status: 'pending', createdAt: '2025-05-31T10:00:00Z' }
    ]
  },

  payment: {
    merchants: [
      { id: 'merch-001', name: '永辉超市分店', contactName: '张经理', contactPhone: '13800138101', feeRate: 0.02, settlementAccount: '6222021234567890', settlementBank: '中国工商银行', status: 'active', createdAt: '2025-03-10T08:20:00Z', updatedAt: '2025-05-10T10:00:00Z' },
      { id: 'merch-002', name: '华润万家朝阳店', contactName: '李经理', contactPhone: '13800138102', feeRate: 0.015, settlementAccount: '6222032345678901', settlementBank: '中国银行', status: 'active', createdAt: '2025-02-15T10:45:00Z', updatedAt: '2025-05-09T14:00:00Z' },
      { id: 'merch-003', name: '7-Eleven建国门店', contactName: '王店长', contactPhone: '13800138103', feeRate: 0.025, settlementAccount: '6222043456789012', settlementBank: '中国建设银行', status: 'pending', createdAt: '2025-05-08T16:30:00Z', updatedAt: '2025-05-08T16:30:00Z' }
    ],
    receipts: [
      { id: 'rcpt-001', merchantId: 'merch-001', merchantName: '永辉超市分店', amount: 85.35, payMethod: 'wechat', payTime: '2025-05-08T14:30:00Z', orderId: 'order-001', status: 'normal', createdAt: '2025-05-08T14:30:00Z' },
      { id: 'rcpt-002', merchantId: 'merch-002', merchantName: '华润万家朝阳店', amount: 57.00, payMethod: 'alipay', payTime: '2025-05-09T09:15:00Z', orderId: 'order-002', status: 'normal', createdAt: '2025-05-09T09:15:00Z' },
      { id: 'rcpt-003', merchantId: 'merch-001', merchantName: '永辉超市分店', amount: 120.00, payMethod: 'wechat', payTime: '2025-05-10T11:00:00Z', orderId: null, status: 'normal', createdAt: '2025-05-10T11:00:00Z' },
      { id: 'rcpt-004', merchantId: 'merch-002', merchantName: '华润万家朝阳店', amount: 230.50, payMethod: 'bank_card', payTime: '2025-05-11T15:30:00Z', orderId: null, status: 'abnormal', abnormalReason: '金额异常-疑似重复支付', createdAt: '2025-05-11T15:30:00Z' },
      { id: 'rcpt-005', merchantId: 'merch-001', merchantName: '永辉超市分店', amount: 45.00, payMethod: 'wechat', payTime: '2025-05-12T09:00:00Z', orderId: null, status: 'normal', createdAt: '2025-05-12T09:00:00Z' }
    ],
    settlementReports: [
      { id: 'settle-001', period: '2025-05-01至2025-05-10', totalAmount: 262.35, merchantList: [{ merchantId: 'merch-001', merchantName: '永辉超市分店', amount: 205.35, fee: 4.11 }, { merchantId: 'merch-002', merchantName: '华润万家朝阳店', amount: 57.00, fee: 0.86 }], status: 'completed', createdAt: '2025-05-11T08:00:00Z' },
      { id: 'settle-002', period: '2025-05-11至2025-05-20', totalAmount: 275.50, merchantList: [{ merchantId: 'merch-001', merchantName: '永辉超市分店', amount: 45.00, fee: 0.90 }, { merchantId: 'merch-002', merchantName: '华润万家朝阳店', amount: 230.50, fee: 3.46 }], status: 'pending', createdAt: '2025-05-20T08:00:00Z' }
    ],
    settlementConfig: {
      cycle: 'weekly',
      minAmount: 100.00,
      autoSettle: true,
      settleDay: 'Thursday',
      bankCutOffTime: '16:00'
    }
  },

  operations: {
    products: [
      { id: 'ops-prod-001', sku: 'SKU000001', name: '红富士苹果', categoryId: 'cat-001', categoryName: '生鲜水果', price: 12.99, vipPrice: 10.99, stock: 500, status: 'on_sale', image: '/api/files/apple-1.jpg', createdAt: '2025-01-15T10:30:00Z', updatedAt: '2025-05-10T14:20:00Z' },
      { id: 'ops-prod-002', sku: 'SKU000002', name: '香蕉', categoryId: 'cat-001', categoryName: '生鲜水果', price: 8.50, vipPrice: 7.20, stock: 300, status: 'on_sale', image: '/api/files/banana-1.jpg', createdAt: '2025-02-20T09:15:00Z', updatedAt: '2025-05-09T11:45:00Z' },
      { id: 'ops-prod-003', sku: 'SKU000003', name: '西红柿', categoryId: 'cat-002', categoryName: '蔬菜', price: 6.80, vipPrice: 5.80, stock: 200, status: 'on_sale', image: '/api/files/tomato-1.jpg', createdAt: '2025-03-05T08:20:00Z', updatedAt: '2025-05-08T16:30:00Z' },
      { id: 'ops-prod-004', sku: 'SKU000004', name: '猪肉', categoryId: 'cat-003', categoryName: '肉类', price: 28.50, vipPrice: 25.00, stock: 150, status: 'on_sale', image: '/api/files/pork-1.jpg', createdAt: '2025-03-10T07:45:00Z', updatedAt: '2025-05-07T12:15:00Z' },
      { id: 'ops-prod-005', sku: 'SKU000005', name: '蒙牛纯牛奶', categoryId: 'cat-004', categoryName: '乳制品', price: 45.90, vipPrice: 42.00, stock: 100, status: 'off_sale', image: '/api/files/milk-1.jpg', createdAt: '2025-03-15T11:20:00Z', updatedAt: '2025-05-06T09:40:00Z' }
    ],
    categories: [
      { id: 'ops-cat-001', name: '生鲜水果', parentId: null, level: 1, icon: '/api/files/icon-fruit.png', sortOrder: 1, status: 'active' },
      { id: 'ops-cat-002', name: '蔬菜', parentId: null, level: 1, icon: '/api/files/icon-veg.png', sortOrder: 2, status: 'active' },
      { id: 'ops-cat-003', name: '进口水果', parentId: 'ops-cat-001', level: 2, icon: '/api/files/icon-import-fruit.png', sortOrder: 1, status: 'active' },
      { id: 'ops-cat-004', name: '有机蔬菜', parentId: 'ops-cat-002', level: 2, icon: '/api/files/icon-organic-veg.png', sortOrder: 1, status: 'active' }
    ],
    promotions: [
      { id: 'promo-001', name: '五一水果大促', type: 'discount', rule: { discountRate: 0.8, minPurchase: 50 }, startDate: '2025-05-01T00:00:00Z', endDate: '2025-05-05T23:59:59Z', status: 'ended', applicableCategories: ['cat-001'], createdAt: '2025-04-25T10:00:00Z' },
      { id: 'promo-002', name: '夏日清凉特惠', type: 'flash_sale', rule: { discountRate: 0.5, maxQuantity: 100 }, startDate: '2025-06-01T00:00:00Z', endDate: '2025-06-30T23:59:59Z', status: 'upcoming', applicableCategories: ['cat-005', 'cat-004'], createdAt: '2025-05-15T10:00:00Z' }
    ],
    coupons: [
      { id: 'coupon-001', name: '新人专享券', type: 'fixed', amount: 10.00, minPurchase: 50.00, validFrom: '2025-01-01T00:00:00Z', validTo: '2025-12-31T23:59:59Z', totalCount: 1000, usedCount: 450, status: 'active', createdAt: '2025-01-01T08:00:00Z' },
      { id: 'coupon-002', name: '满100减20', type: 'fixed', amount: 20.00, minPurchase: 100.00, validFrom: '2025-05-01T00:00:00Z', validTo: '2025-05-31T23:59:59Z', totalCount: 500, usedCount: 120, status: 'active', createdAt: '2025-04-28T10:00:00Z' },
      { id: 'coupon-003', name: 'VIP95折券', type: 'percentage', amount: 5, minPurchase: 0, validFrom: '2025-03-01T00:00:00Z', validTo: '2025-06-30T23:59:59Z', totalCount: 2000, usedCount: 800, status: 'active', createdAt: '2025-03-01T08:00:00Z' }
    ],
    merchantApplications: [
      { id: 'app-001', merchantName: '百果园朝阳店', contactName: '孙经理', contactPhone: '13800138200', businessType: 'specialty_fruit', qualificationDocs: ['/api/files/qual-fruit-1.jpg', '/api/files/qual-fruit-2.jpg'], reviewStatus: 'pending', appliedAt: '2025-05-12T10:00:00Z', reviewedBy: null, reviewedAt: null, reviewRemark: null },
      { id: 'app-002', merchantName: '鲜丰水果西城店', contactName: '周经理', contactPhone: '13800138201', businessType: 'specialty_fruit', qualificationDocs: ['/api/files/qual-fruit-3.jpg'], reviewStatus: 'approved', appliedAt: '2025-04-20T09:00:00Z', reviewedBy: 'mgr-001', reviewedAt: '2025-04-25T14:00:00Z', reviewRemark: '资质齐全，审核通过' }
    ]
  },

  dataCenter: {
    salesAnalysis: {
      monthly: [
        { month: '2025-01', totalSales: 15000.00, orderCount: 120, avgOrderAmount: 125.00, growthRate: 0.05 },
        { month: '2025-02', totalSales: 18000.00, orderCount: 150, avgOrderAmount: 120.00, growthRate: 0.20 },
        { month: '2025-03', totalSales: 22000.00, orderCount: 180, avgOrderAmount: 122.22, growthRate: 0.22 },
        { month: '2025-04', totalSales: 25000.00, orderCount: 210, avgOrderAmount: 119.05, growthRate: 0.14 },
        { month: '2025-05', totalSales: 28000.00, orderCount: 240, avgOrderAmount: 116.67, growthRate: 0.12 },
        { month: '2025-06', totalSales: 32000.00, orderCount: 280, avgOrderAmount: 114.29, growthRate: 0.14 }
      ],
      topProducts: [
        { productName: '红富士苹果', salesAmount: 5000.00, salesCount: 400 },
        { productName: '蒙牛纯牛奶', salesAmount: 4500.00, salesCount: 150 },
        { productName: '猪肉', salesAmount: 3000.00, salesCount: 120 }
      ]
    },
    userAnalysis: {
      dailyActive: 1200,
      monthlyActive: 8500,
      newUsersToday: 50,
      conversionRate: 0.15,
      retention: {
        day1: 0.45,
        day7: 0.25,
        day30: 0.12
      },
      userDistribution: {
        vip: 800,
        superVip: 200,
        normal: 7500
      }
    },
    productAnalysis: {
      topBySales: [
        { sku: 'SKU000001', name: '红富士苹果', salesCount: 1200, salesAmount: 15588.00 },
        { sku: 'SKU000010', name: '可口可乐', salesCount: 720, salesAmount: 27360.00 },
        { sku: 'SKU000005', name: '蒙牛纯牛奶', salesCount: 380, salesAmount: 17412.00 }
      ],
      categoryDistribution: [
        { category: '生鲜水果', percentage: 35 },
        { category: '蔬菜', percentage: 20 },
        { category: '肉类', percentage: 18 },
        { category: '乳制品', percentage: 15 },
        { category: '饮料', percentage: 12 }
      ]
    },
    channelAnalysis: [
      { channel: '小程序', traffic: 5000, conversion: 0.18, revenue: 15000.00, roi: 3.5 },
      { channel: 'APP', traffic: 3000, conversion: 0.22, revenue: 12000.00, roi: 4.0 },
      { channel: 'H5', traffic: 2000, conversion: 0.10, revenue: 5000.00, roi: 2.5 },
      { channel: '线下门店', traffic: 1500, conversion: 0.30, revenue: 8000.00, roi: 5.0 }
    ],
    reportTemplates: [
      { id: 'tpl-001', name: '日报模板', type: 'daily', fields: ['totalSales', 'orderCount', 'newUsers', 'conversionRate'], format: 'excel', createdAt: '2025-01-01T00:00:00Z' },
      { id: 'tpl-002', name: '周报模板', type: 'weekly', fields: ['totalSales', 'orderCount', 'topProducts', 'channelAnalysis'], format: 'pdf', createdAt: '2025-01-01T00:00:00Z' },
      { id: 'tpl-003', name: '月报模板', type: 'monthly', fields: ['totalSales', 'growthRate', 'userRetention', 'categoryDistribution'], format: 'pdf', createdAt: '2025-01-01T00:00:00Z' }
    ]
  },

  directDelivery: {
    routes: [
      { id: 'route-001', name: '朝阳区域配送线', stations: ['station-001', 'station-002'], deliveryPersonId: 'emp-005', deliveryPersonName: '配送员刘', estimatedTime: 120, status: 'active', createdAt: '2025-03-01T08:00:00Z' },
      { id: 'route-002', name: '海淀区域配送线', stations: ['station-003', 'station-004'], deliveryPersonId: 'emp-005', deliveryPersonName: '配送员刘', estimatedTime: 90, status: 'active', createdAt: '2025-03-15T08:00:00Z' }
    ],
    stations: [
      { id: 'station-001', name: '朝阳大悦城站点', address: '北京市朝阳区朝阳北路101号', latitude: 39.9219, longitude: 116.4736, sortOrder: 1, status: 'active' },
      { id: 'station-002', name: '朝阳门站点', address: '北京市朝阳区朝阳门外大街18号', latitude: 39.9221, longitude: 116.4433, sortOrder: 2, status: 'active' },
      { id: 'station-003', name: '中关村站点', address: '北京市海淀区中关村大街1号', latitude: 39.9542, longitude: 116.3274, sortOrder: 1, status: 'active' },
      { id: 'station-004', name: '五道口站点', address: '北京市海淀区成府路28号', latitude: 39.9929, longitude: 116.3377, sortOrder: 2, status: 'active' }
    ],
    deliveryTasks: [
      { id: 'task-001', orderId: 'order-001', routeId: 'route-001', routeName: '朝阳区域配送线', deliveryPersonId: 'emp-005', deliveryPersonName: '配送员刘', status: 'completed', startTime: '2025-05-08T14:30:00Z', completedTime: '2025-05-09T10:15:00Z', createdAt: '2025-05-08T14:00:00Z' },
      { id: 'task-002', orderId: 'order-002', routeId: 'route-001', routeName: '朝阳区域配送线', deliveryPersonId: 'emp-005', deliveryPersonName: '配送员刘', status: 'in_progress', startTime: '2025-05-09T09:30:00Z', completedTime: null, createdAt: '2025-05-09T09:00:00Z' },
      { id: 'task-003', orderId: 'order-003', routeId: 'route-002', routeName: '海淀区域配送线', deliveryPersonId: 'emp-005', deliveryPersonName: '配送员刘', status: 'pending', startTime: null, completedTime: null, createdAt: '2025-05-10T09:00:00Z' }
    ],
    trackPoints: [
      { taskId: 'task-001', timestamp: '2025-05-08T14:30:00Z', latitude: 39.9042, longitude: 116.4074, action: 'pickup' },
      { taskId: 'task-001', timestamp: '2025-05-08T15:15:00Z', latitude: 39.9219, longitude: 116.4736, action: 'arrive_station' },
      { taskId: 'task-001', timestamp: '2025-05-08T16:00:00Z', latitude: 39.9221, longitude: 116.4433, action: 'arrive_station' },
      { taskId: 'task-001', timestamp: '2025-05-09T10:15:00Z', latitude: 39.9542, longitude: 116.3274, action: 'deliver' },
      { taskId: 'task-002', timestamp: '2025-05-09T09:30:00Z', latitude: 39.9042, longitude: 116.4074, action: 'pickup' },
      { taskId: 'task-002', timestamp: '2025-05-09T10:00:00Z', latitude: 39.9219, longitude: 116.4736, action: 'arrive_station' }
    ]
  },

  supplier: {
    supplierOrders: [
      { id: 'so-001', purchaseOrderId: 'po-001', supplierId: 'supplier-001', supplierName: '烟台苹果合作社', items: [{ sku: 'SKU000001', productName: '红富士苹果', quantity: 500, unitPrice: 8.00 }], confirmStatus: 'confirmed', confirmedAt: '2025-05-11T08:00:00Z', deliveryDeadline: '2025-05-20', createdAt: '2025-05-10T16:00:00Z' },
      { id: 'so-002', purchaseOrderId: 'po-002', supplierId: 'supplier-003', supplierName: '山东有机蔬菜基地', items: [{ sku: 'SKU000003', productName: '西红柿', quantity: 200, unitPrice: 4.50 }, { sku: 'SKU000007', productName: '菠菜', quantity: 150, unitPrice: 3.80 }], confirmStatus: 'pending', confirmedAt: null, deliveryDeadline: '2025-05-25', createdAt: '2025-05-11T10:00:00Z' }
    ],
    shippingOrders: [
      { id: 'ship-001', supplierOrderId: 'so-001', logisticsCompany: '顺丰速运', logisticsNo: 'SF1234567890', shippedAt: '2025-05-18T09:00:00Z', estimatedArrival: '2025-05-20T14:00:00Z', status: 'shipped', createdAt: '2025-05-18T08:00:00Z' },
      { id: 'ship-002', supplierOrderId: 'so-002', logisticsCompany: null, logisticsNo: null, shippedAt: null, estimatedArrival: null, status: 'pending', createdAt: '2025-05-11T10:00:00Z' }
    ],
    reconciliationData: [
      { id: 'sup-recon-001', reconciliationNo: 'SUPRECON202505001', supplierId: 'supplier-001', supplierName: '烟台苹果合作社', period: '2025-05', orderAmount: 4000.00, shippedAmount: 4000.00, difference: 0.00, status: 'confirmed', confirmedAt: '2025-05-25T10:00:00Z', createdAt: '2025-05-31T08:00:00Z' }
    ]
  },

  auth: {
    users: [
      { id: 'user-001', username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', department: '管理层', phone: '13800000001', email: 'admin@crmb.com', status: 'active' },
      { id: 'user-002', username: 'sales_manager', password: 'sales123', name: '销售经理', role: 'sales_manager', department: '销售部', phone: '13800000002', email: 'sm@crmb.com', status: 'active' },
      { id: 'user-003', username: 'procurement', password: 'proc123', name: '采购专员', role: 'procurement', department: '采购部', phone: '13800000003', email: 'proc@crmb.com', status: 'active' },
      { id: 'user-004', username: 'finance', password: 'fin123', name: '财务专员', role: 'finance', department: '财务部', phone: '13800000004', email: 'fin@crmb.com', status: 'active' },
      { id: 'user-005', username: 'operations', password: 'ops123', name: '运营专员', role: 'operations', department: '运营部', phone: '13800000005', email: 'ops@crmb.com', status: 'active' },
      { id: 'user-006', username: 'supplier', password: 'sup123', name: '供应商用户', role: 'supplier', department: '供应商', phone: '13800000006', email: 'sup@crmb.com', status: 'active' }
    ],
    tokenMap: {
      'token-admin-001': { userId: 'user-001', username: 'admin', role: 'admin', name: '系统管理员' },
      'token-sales-001': { userId: 'user-002', username: 'sales_manager', role: 'sales_manager', name: '销售经理' },
      'token-proc-001': { userId: 'user-003', username: 'procurement', role: 'procurement', name: '采购专员' },
      'token-fin-001': { userId: 'user-004', username: 'finance', role: 'finance', name: '财务专员' },
      'token-ops-001': { userId: 'user-005', username: 'operations', role: 'operations', name: '运营专员' },
      'token-sup-001': { userId: 'user-006', username: 'supplier', role: 'supplier', name: '供应商用户' }
    }
  }
};

module.exports = mockData;