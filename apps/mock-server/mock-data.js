// Mock data for all modules based on design specifications

const mockData = {
  // === MALL MODULE (商城模块) ===
  mall: {
    // Categories
    categories: [
      { id: 'cat-001', code: 'fresh_fruit', name: '生鲜水果', parentId: null, icon: '/api/files/icon-fruit.png', sortOrder: 1, status: 'active' },
      { id: 'cat-002', code: 'vegetables', name: '蔬菜', parentId: null, icon: '/api/files/icon-veg.png', sortOrder: 2, status: 'active' },
      { id: 'cat-003', code: 'meat', name: '肉类', parentId: null, icon: '/api/files/icon-meat.png', sortOrder: 3, status: 'active' },
      { id: 'cat-004', code: 'dairy', name: '乳制品', parentId: null, icon: '/api/files/icon-dairy.png', sortOrder: 4, status: 'active' },
      { id: 'cat-005', code: 'beverages', name: '饮料', parentId: null, icon: '/api/files/icon-drink.png', sortOrder: 5, status: 'active' }
    ],
    
    // Products
    products: [
      {
        id: 'prod-001',
        sku: 'SKU000001',
        name: '红富士苹果',
        categoryId: 'cat-001',
        categoryName: '生鲜水果',
        images: ['/api/files/apple-1.jpg', '/api/files/apple-2.jpg'],
        description: '新鲜优质红富士苹果，山东烟台产地直供，甜脆多汁',
        price: 12.99,
        vipPrice: 10.99,
        superVipPrice: 8.99,
        stock: 500,
        status: 'on_sale',
        tags: ['生鲜水果', '热销', '山东特产'],
        salesCount: 1200,
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-05-10T14:20:00Z'
      },
      {
        id: 'prod-002',
        sku: 'SKU000002',
        name: '香蕉',
        categoryId: 'cat-001',
        categoryName: '生鲜水果',
        images: ['/api/files/banana-1.jpg'],
        description: '进口香蕉，香甜可口，菲律宾直供',
        price: 8.50,
        vipPrice: 7.20,
        superVipPrice: 6.50,
        stock: 300,
        status: 'on_sale',
        tags: ['生鲜水果', '新品', '进口水果'],
        salesCount: 800,
        createdAt: '2025-02-20T09:15:00Z',
        updatedAt: '2025-05-09T11:45:00Z'
      },
      {
        id: 'prod-003',
        sku: 'SKU000003',
        name: '西红柿',
        categoryId: 'cat-002',
        categoryName: '蔬菜',
        images: ['/api/files/tomato-1.jpg'],
        description: '有机西红柿，无农药残留，本地农场直供',
        price: 6.80,
        vipPrice: 5.80,
        superVipPrice: 4.90,
        stock: 200,
        status: 'on_sale',
        tags: ['蔬菜', '有机', '本地直供'],
        salesCount: 650,
        createdAt: '2025-03-05T08:20:00Z',
        updatedAt: '2025-05-08T16:30:00Z'
      },
      {
        id: 'prod-004',
        sku: 'SKU000004',
        name: '猪肉',
        categoryId: 'cat-003',
        categoryName: '肉类',
        images: ['/api/files/pork-1.jpg'],
        description: '冷鲜猪肉，检疫合格，当日屠宰',
        price: 28.50,
        vipPrice: 25.00,
        superVipPrice: 22.00,
        stock: 150,
        status: 'on_sale',
        tags: ['肉类', '冷鲜', '检疫合格'],
        salesCount: 420,
        createdAt: '2025-03-10T07:45:00Z',
        updatedAt: '2025-05-07T12:15:00Z'
      },
      {
        id: 'prod-005',
        sku: 'SKU000005',
        name: '蒙牛纯牛奶',
        categoryId: 'cat-004',
        categoryName: '乳制品',
        images: ['/api/files/milk-1.jpg'],
        description: '蒙牛纯牛奶250ml*12盒装，保质期7天',
        price: 45.90,
        vipPrice: 42.00,
        superVipPrice: 38.50,
        stock: 100,
        status: 'on_sale',
        tags: ['乳制品', '品牌', '家庭装'],
        salesCount: 380,
        createdAt: '2025-03-15T11:20:00Z',
        updatedAt: '2025-05-06T09:40:00Z'
      }
    ],
    
    // Banners
    banners: [
      {
        id: 'banner-001',
        imageUrl: '/api/files/banner-promo1.jpg',
        linkUrl: '/pages/product/detail?id=prod-001',
        sortOrder: 1,
        status: 'active'
      },
      {
        id: 'banner-002',
        imageUrl: '/api/files/banner-promo2.jpg',
        linkUrl: '/pages/vip/index',
        sortOrder: 2,
        status: 'active'
      }
    ],
    
    // Announcements
    announcements: [
      {
        id: 'ann-001',
        title: '五一劳动节促销活动',
        content: '5月1日-5月5日，全场商品8折优惠，VIP用户额外95折！',
        type: 'activity',
        status: 'published',
        publishAt: '2025-04-28T00:00:00Z',
        createdAt: '2025-04-25T14:30:00Z'
      },
      {
        id: 'ann-002',
        title: '系统维护通知',
        content: '5月10日凌晨2:00-4:00进行系统升级，期间服务可能短暂中断',
        type: 'system',
        status: 'published',
        publishAt: '2025-05-08T00:00:00Z',
        createdAt: '2025-05-07T16:45:00Z'
      }
    ],
    
    // VIP Packages
    vipPackages: [
      {
        id: 'vip-001',
        name: '月度VIP',
        level: 'vip',
        price: 29.90,
        originalPrice: 39.90,
        duration: 30,
        benefits: ['全场95折', '优先配送', '专属客服'],
        status: 'active'
      },
      {
        id: 'vip-002',
        name: '季度超级VIP',
        level: 'super_vip',
        price: 79.90,
        originalPrice: 119.90,
        duration: 90,
        benefits: ['全场9折', '免运费', '优先配送', '专属客服', '生日礼包'],
        status: 'active'
      }
    ]
  },
  
  // === CUSTOMER SERVICE MODULE (客服模块) ===
  customerService: {
    // Orders (enhanced with operation logs)
    orders: [
      {
        id: 'order-001',
        orderNo: 'ORD202505080001',
        customerId: 'cust-001',
        customerName: '张三',
        customerPhone: '13800138001',
        items: [
          {
            sku: 'SKU000001',
            productName: '红富士苹果',
            quantity: 5,
            price: 12.99,
            image: '/api/files/apple-1.jpg'
          },
          {
            sku: 'SKU000003',
            productName: '西红柿',
            quantity: 3,
            price: 6.80,
            image: '/api/files/tomato-1.jpg'
          }
        ],
        totalAmount: 85.35,
        payAmount: 80.35,
        discountAmount: 5.00,
        status: 'completed',
        payType: 'wechat',
        payTime: '2025-05-08T14:30:00Z',
        shipTime: '2025-05-08T16:00:00Z',
        deliverTime: '2025-05-09T10:15:00Z',
        remark: '请尽快配送',
        operatorLog: [
          {
            id: 'log-001',
            operatorId: 'op-001',
            operatorName: '客服小王',
            action: '确认订单',
            remark: '客户要求加急配送',
            createdAt: '2025-05-08T14:25:00Z'
          },
          {
            id: 'log-002',
            operatorId: 'op-002',
            operatorName: '配送员李四',
            action: '完成配送',
            remark: '客户已签收',
            createdAt: '2025-05-09T10:20:00Z'
          }
        ],
        createdAt: '2025-05-08T14:20:00Z'
      },
      {
        id: 'order-002',
        orderNo: 'ORD202505090002',
        customerId: 'cust-002',
        customerName: '李四',
        customerPhone: '13800138002',
        items: [
          {
            sku: 'SKU000004',
            productName: '猪肉',
            quantity: 2,
            price: 28.50,
            image: '/api/files/pork-1.jpg'
          }
        ],
        totalAmount: 57.00,
        payAmount: 57.00,
        discountAmount: 0.00,
        status: 'shipped',
        payType: 'alipay',
        payTime: '2025-05-09T09:15:00Z',
        shipTime: '2025-05-09T11:30:00Z',
        deliverTime: null,
        remark: '',
        operatorLog: [
          {
            id: 'log-003',
            operatorId: 'op-001',
            operatorName: '客服小王',
            action: '确认订单',
            remark: '',
            createdAt: '2025-05-09T09:20:00Z'
          }
        ],
        createdAt: '2025-05-09T09:10:00Z'
      }
    ],
    
    // After Sales
    afterSales: [
      {
        id: 'as-001',
        afterSaleNo: 'AS20250510001',
        orderId: 'order-001',
        orderNo: 'ORD202505080001',
        type: 'return',
        status: 'completed',
        reason: '商品质量问题',
        description: '苹果有腐烂现象',
        images: ['/api/files/complaint-apple-1.jpg'],
        refundAmount: 64.95,
        items: [
          {
            sku: 'SKU000001',
            productName: '红富士苹果',
            quantity: 5,
            refundAmount: 64.95
          }
        ],
        process: [
          {
            id: 'proc-001',
            operatorId: 'cs-001',
            operatorName: '售后专员',
            action: '受理申请',
            remark: '核实商品质量问题',
            createdAt: '2025-05-08T15:00:00Z'
          },
          {
            id: 'proc-002',
            operatorId: 'cs-001',
            operatorName: '售后专员',
            action: '确认收货',
            remark: '已收到退货',
            createdAt: '2025-05-09T14:30:00Z'
          },
          {
            id: 'proc-003',
            operatorId: 'fin-001',
            operatorName: '财务专员',
            action: '处理退款',
            remark: '退款已完成',
            createdAt: '2025-05-10T09:15:00Z'
          }
        ],
        handlerId: 'cs-001',
        handlerName: '售后专员',
        handlerRemark: '商品确实存在质量问题，同意全额退款',
        createdAt: '2025-05-08T14:45:00Z',
        completedAt: '2025-05-10T09:20:00Z'
      }
    ],
    
    // Complaints
    complaints: [
      {
        id: 'comp-001',
        complaintNo: 'COMP20250509001',
        customerId: 'cust-003',
        customerName: '王五',
        customerPhone: '13800138003',
        relatedOrderId: 'order-002',
        type: 'delivery',
        priority: 'high',
        content: '配送时间严重超时，承诺当天送达但第二天才到，商品已不新鲜',
        images: ['/api/files/delivery-delay-1.jpg'],
        status: 'processing',
        assigneeId: 'mgr-001',
        assigneeName: '客服主管',
        process: [
          {
            id: 'cproc-001',
            action: '受理客诉',
            operatorId: 'op-001',
            operatorName: '客服小王',
            content: '客户投诉配送超时，已记录并升级处理',
            createdAt: '2025-05-09T18:30:00Z'
          },
          {
            id: 'cproc-002',
            action: '分配处理',
            operatorId: 'sys-001',
            operatorName: '系统',
            content: '自动分配给客服主管处理',
            createdAt: '2025-05-09T18:31:00Z'
          }
        ],
        satisfaction: null,
        createdAt: '2025-05-09T18:25:00Z',
        closedAt: null
      }
    ],
    
    // Reviews
    reviews: [
      {
        id: 'rev-001',
        orderId: 'order-001',
        orderNo: 'ORD202505080001',
        customerId: 'cust-001',
        customerName: '张三',
        rating: 4,
        content: '商品质量不错，配送也很快，就是包装可以再好一点',
        images: [],
        status: 'replied',
        reply: '感谢您的反馈！我们会改进包装质量。',
        replyBy: '客服小王',
        replyAt: '2025-05-10T10:30:00Z',
        createdAt: '2025-05-09T15:20:00Z'
      }
    ],
    
    // Feedback
    feedbacks: [
      {
        id: 'fb-001',
        customerId: 'cust-004',
        customerName: '赵六',
        customerPhone: '13800138004',
        type: 'suggestion',
        content: '建议增加更多有机蔬菜品种',
        images: [],
        status: 'processing',
        handlerId: 'mgr-002',
        handlerName: '采购主管',
        handlerReply: '感谢建议，我们正在联系更多有机蔬菜供应商',
        createdAt: '2025-05-07T11:45:00Z'
      }
    ],
    
    // Invoices
    invoices: [
      {
        id: 'inv-001',
        invoiceNo: 'INV20250508001',
        orderId: 'order-001',
        orderNo: 'ORD202505080001',
        customerId: 'cust-001',
        customerName: '张三',
        type: 'electronic',
        title: '个人',
        taxNo: '',
        amount: 80.35,
        status: 'issued',
        address: null,
        trackingNo: null,
        approverId: 'fin-002',
        approverName: '财务审核员',
        issuerId: 'fin-001',
        issuerName: '财务专员',
        createdAt: '2025-05-08T14:50:00Z',
        issuedAt: '2025-05-08T15:00:00Z'
      }
    ]
  },
  
  // === SALES MODULE (销售模块) ===
  sales: {
    // Visits
    visits: [
      {
        id: 'visit-001',
        customerId: 'store-001',
        customerName: '永辉超市分店',
        customerType: 'public',
        visitType: 'first',
        visitMethod: 'onsite',
        planDate: '2025-05-15',
        planTime: '10:00',
        subject: '首次拜访 - 永辉超市分店',
        content: '了解客户需求，介绍产品优势，收集反馈意见。客户对红富士苹果和有机蔬菜很感兴趣。',
        images: [
          {
            id: 'img-001',
            url: '/api/files/visit-store-1.jpg',
            name: '门店照片.jpg',
            size: 2048000,
            type: 'image/jpeg'
          }
        ],
        feedback: '客户反馈良好，有采购意向。建议跟进红富士苹果相关产品。',
        followUpPlan: '下周再次联系，确认采购数量和时间安排',
        status: 'completed',
        createdBy: 'sales-001',
        createdAt: '2025-05-10T09:30:00Z'
      },
      {
        id: 'visit-002',
        customerId: 'store-002',
        customerName: '华润万家朝阳店',
        customerType: 'private',
        visitType: 'regular',
        visitMethod: 'phone',
        planDate: '2025-05-12',
        planTime: null,
        subject: '定期回访 - 华润万家朝阳店',
        content: '电话回访了解近期采购情况，客户对猪肉品质表示满意，希望增加有机蔬菜供应',
        images: [],
        feedback: '客户满意度高，建议增加有机蔬菜品类',
        followUpPlan: '安排产品专员详细介绍有机蔬菜供应方案',
        status: 'in_progress',
        createdBy: 'sales-002',
        createdAt: '2025-05-11T14:20:00Z'
      }
    ],
    
    // Stores
    stores: [
      {
        id: 'store-001',
        storeName: '永辉超市分店',
        storeType: 'supermarket',
        address: '北京市朝阳区中山路123号',
        province: '北京市',
        city: '朝阳区',
        district: '朝阳区',
        latitude: 39.9042,
        longitude: 116.4074,
        area: 200,
        contactName: '张经理',
        contactPhone: '13800138101',
        licenses: [
          {
            id: 'license-1-1',
            url: '/api/files/license-business-1.jpg',
            name: '营业执照.jpg',
            type: '营业执照',
            expiryDate: '2027-12-31T00:00:00Z'
          },
          {
            id: 'license-1-2',
            url: '/api/files/license-food-1.jpg',
            name: '食品经营许可证.jpg',
            type: '食品经营许可证',
            expiryDate: '2026-06-30T00:00:00Z'
          }
        ],
        status: 'approved',
        claimBy: 'sales-001',
        assignedTo: 'sales-001',
        reviewBy: 'reviewer-001',
        rejectReason: null,
        createdAt: '2025-03-10T08:20:00Z'
      },
      {
        id: 'store-002',
        storeName: '华润万家朝阳店',
        storeType: 'supermarket',
        address: '北京市朝阳区建国路88号',
        province: '北京市',
        city: '朝阳区',
        district: '朝阳区',
        latitude: 39.9123,
        longitude: 116.4567,
        area: 350,
        contactName: '李经理',
        contactPhone: '13800138102',
        licenses: [
          {
            id: 'license-2-1',
            url: '/api/files/license-business-2.jpg',
            name: '营业执照.jpg',
            type: '营业执照',
            expiryDate: '2028-03-15T00:00:00Z'
          }
        ],
        status: 'approved',
        claimBy: 'sales-002',
        assignedTo: 'sales-002',
        reviewBy: 'reviewer-001',
        rejectReason: null,
        createdAt: '2025-02-15T10:45:00Z'
      },
      {
        id: 'store-003',
        storeName: '7-Eleven建国门店',
        storeType: 'convenience',
        address: '北京市朝阳区建国门外大街56号',
        province: '北京市',
        city: '朝阳区',
        district: '朝阳区',
        latitude: 39.9012,
        longitude: 116.4456,
        area: 80,
        contactName: '王店长',
        contactPhone: '13800138103',
        licenses: [],
        status: 'unclaimed',
        claimBy: null,
        assignedTo: null,
        reviewBy: null,
        rejectReason: null,
        createdAt: '2025-05-08T16:30:00Z'
      }
    ],
    
    // Customers
    customers: [
      {
        id: 'cust-001',
        customerName: '张三',
        customerType: 'private',
        storeType: 'restaurant',
        address: '北京市海淀区中关村大街1号',
        province: '北京市',
        city: '海淀区',
        district: '海淀区',
        latitude: 39.9542,
        longitude: 116.3274,
        area: 120,
        contactName: '张三',
        contactPhone: '13800138001',
        businessHours: '08:00-22:00',
        mainCategories: ['生鲜水果', '蔬菜'],
        grade: 'A',
        assignedTo: 'sales-001',
        lastVisitDate: '2025-05-08T14:20:00Z',
        totalOrderAmount: 85.35,
        status: 'active',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-05-08T14:20:00Z'
      },
      {
        id: 'cust-002',
        customerName: '李四',
        customerType: 'private',
        storeType: 'supermarket',
        address: '上海市浦东新区陆家嘴环路1000号',
        province: '上海市',
        city: '浦东新区',
        district: '浦东新区',
        latitude: 31.2304,
        longitude: 121.4737,
        area: 200,
        contactName: '李四',
        contactPhone: '13800138002',
        businessHours: '07:00-23:00',
        mainCategories: ['肉类', '乳制品'],
        grade: 'B',
        assignedTo: 'sales-002',
        lastVisitDate: '2025-05-09T09:10:00Z',
        totalOrderAmount: 57.00,
        status: 'active',
        createdAt: '2025-02-20T09:15:00Z',
        updatedAt: '2025-05-09T09:10:00Z'
      }
    ],
    
    // Special Stock Requests
    specialStockRequests: [
      {
        id: 'ssr-001',
        requestId: 'SSR20250510001',
        customerId: 'cust-001',
        customerName: '张三',
        productName: '进口车厘子',
        sku: 'SKU000010',
        quantity: 50,
        reason: '节日促销需求',
        status: 'pending',
        approvedBy: null,
        fulfilledBy: null,
        createdAt: '2025-05-10T11:20:00Z',
        updatedAt: '2025-05-10T11:20:00Z'
      }
    ],
    
    // Blacklist
    blacklist: [
      {
        id: 'bl-001',
        customerId: 'cust-005',
        customerName: '恶意客户',
        reason: '多次恶意退货',
        blacklistedBy: 'mgr-001',
        blacklistedAt: '2025-04-15T14:30:00Z',
        notes: '已多次沟通无效，列入黑名单'
      }
    ]
  },
  
  // === FINANCE MODULE (财务模块) ===
  finance: {
    // Financial Transactions
    transactions: [
      {
        id: 'txn-001',
        transactionNo: 'TXN20250508001',
        type: 'income',
        amount: 80.35,
        currency: 'CNY',
        description: '销售收入 - 订单 ORD202505080001',
        category: 'sales',
        relatedOrderId: 'order-001',
        relatedCustomerId: 'cust-001',
        relatedSupplierId: null,
        status: 'completed',
        createdAt: '2025-05-08T14:30:00Z',
        completedAt: '2025-05-08T14:30:00Z'
      },
      {
        id: 'txn-002',
        transactionNo: 'TXN20250509001',
        type: 'income',
        amount: 57.00,
        currency: 'CNY',
        description: '销售收入 - 订单 ORD202505090002',
        category: 'sales',
        relatedOrderId: 'order-002',
        relatedCustomerId: 'cust-002',
        relatedSupplierId: null,
        status: 'completed',
        createdAt: '2025-05-09T09:15:00Z',
        completedAt: '2025-05-09T09:15:00Z'
      },
      {
        id: 'txn-003',
        transactionNo: 'TXN20250510001',
        type: 'expense',
        amount: 1200.00,
        currency: 'CNY',
        description: '采购支出 - 苹果供应商',
        category: 'procurement',
        relatedOrderId: null,
        relatedCustomerId: null,
        relatedSupplierId: 'supplier-001',
        status: 'completed',
        createdAt: '2025-05-10T10:00:00Z',
        completedAt: '2025-05-10T10:00:00Z'
      }
    ],
    
    // Reconciliation Records
    reconciliations: [
      {
        id: 'rec-001',
        reconciliationNo: 'REC20250510001',
        type: 'customer',
        relatedId: 'cust-001',
        startDate: '2025-05-01T00:00:00Z',
        endDate: '2025-05-10T23:59:59Z',
        totalAmount: 80.35,
        matchedAmount: 80.35,
        unmatchedAmount: 0.00,
        status: 'completed',
        createdAt: '2025-05-10T15:00:00Z',
        completedAt: '2025-05-10T15:05:00Z'
      }
    ],
    
    // Financial Reports
    reports: [
      {
        id: 'rep-001',
        reportNo: 'REP2025051001',
        type: 'income_statement',
        period: 'daily',
        startDate: '2025-05-10T00:00:00Z',
        endDate: '2025-05-10T23:59:59Z',
        data: {
          totalIncome: 0.00,
          totalExpense: 1200.00,
          netProfit: -1200.00,
          orderCount: 0,
          customerCount: 0
        },
        status: 'draft',
        createdAt: '2025-05-10T16:00:00Z',
        publishedAt: null
      }
    ]
  },
  
  // === HR MODULE (人事模块) ===
  hr: {
    // Employees
    employees: [
      {
        id: 'emp-001',
        employeeNo: 'EMP0001',
        name: '销售代表张',
        departmentId: 'dept-001',
        departmentName: '销售部',
        position: '销售代表',
        phone: '13800138201',
        email: 'zhang.sales@crmb.com',
        hireDate: '2024-03-15T00:00:00Z',
        status: 'active',
        avatar: '/api/files/avatar-sales-1.jpg',
        createdAt: '2024-03-15T09:00:00Z',
        updatedAt: '2025-01-10T14:30:00Z'
      },
      {
        id: 'emp-002',
        employeeNo: 'EMP0002',
        name: '仓库管理员李',
        departmentId: 'dept-002',
        departmentName: '仓储部',
        position: '仓库管理员',
        phone: '13800138202',
        email: 'li.warehouse@crmb.com',
        hireDate: '2024-04-20T00:00:00Z',
        status: 'active',
        avatar: '/api/files/avatar-warehouse-1.jpg',
        createdAt: '2024-04-20T09:00:00Z',
        updatedAt: '2025-02-15T11:20:00Z'
      },
      {
        id: 'emp-003',
        employeeNo: 'EMP0003',
        name: '客服专员王',
        departmentId: 'dept-005',
        departmentName: '客服部',
        position: '客服专员',
        phone: '13800138203',
        email: 'wang.cs@crmb.com',
        hireDate: '2024-05-10T00:00:00Z',
        status: 'active',
        avatar: '/api/files/avatar-cs-1.jpg',
        createdAt: '2024-05-10T09:00:00Z',
        updatedAt: '2025-03-20T16:45:00Z'
      }
    ],
    
    // Attendance Records
    attendanceRecords: [
      {
        id: 'att-001',
        employeeId: 'emp-001',
        employeeName: '销售代表张',
        date: '2025-05-10',
        checkInTime: '09:05',
        checkOutTime: '18:15',
        status: 'present',
        leaveType: null,
        leaveReason: null,
        createdAt: '2025-05-10T18:20:00Z'
      },
      {
        id: 'att-002',
        employeeId: 'emp-002',
        employeeName: '仓库管理员李',
        date: '2025-05-10',
        checkInTime: '08:55',
        checkOutTime: '17:50',
        status: 'present',
        leaveType: null,
        leaveReason: null,
        createdAt: '2025-05-10T18:00:00Z'
      },
      {
        id: 'att-003',
        employeeId: 'emp-003',
        employeeName: '客服专员王',
        date: '2025-05-10',
        checkInTime: null,
        checkOutTime: null,
        status: 'leave',
        leaveType: '病假',
        leaveReason: '感冒发烧',
        createdAt: '2025-05-10T08:30:00Z'
      }
    ],
    
    // Performance Reviews
    performanceReviews: [
      {
        id: 'perf-001',
        employeeId: 'emp-001',
        employeeName: '销售代表张',
        reviewerId: 'mgr-003',
        reviewerName: '销售经理',
        period: '2025-Q1',
        score: 4.5,
        comments: '销售业绩优秀，客户满意度高，建议继续保持',
        status: 'approved',
        createdAt: '2025-04-10T14:00:00Z',
        submittedAt: '2025-04-10T14:00:00Z',
        approvedAt: '2025-04-15T10:30:00Z'
      }
    ]
  },
  
  // === CLOUD WAREHOUSE MODULE (云仓模块) ===
  cloudWarehouse: {
    // Inventory
    inventory: [
      {
        sku: 'SKU000001',
        productName: '红富士苹果',
        quantity: 495,
        reserved: 0,
        warehouseId: 'WH-001',
        location: 'A-01-05',
        batchNo: 'BATCH20250501',
        expiryDate: '2025-05-20T00:00:00Z'
      },
      {
        sku: 'SKU000002',
        productName: '香蕉',
        quantity: 300,
        reserved: 0,
        warehouseId: 'WH-001',
        location: 'A-01-06',
        batchNo: 'BATCH20250502',
        expiryDate: '2025-05-18T00:00:00Z'
      },
      {
        sku: 'SKU000003',
        productName: '西红柿',
        quantity: 197,
        reserved: 3,
        warehouseId: 'WH-001',
        location: 'B-02-01',
        batchNo: 'BATCH20250503',
        expiryDate: '2025-05-15T00:00:00Z'
      },
      {
        sku: 'SKU000004',
        productName: '猪肉',
        quantity: 148,
        reserved: 2,
        warehouseId: 'WH-001',
        location: 'C-03-02',
        batchNo: 'BATCH20250504',
        expiryDate: '2025-05-12T00:00:00Z'
      },
      {
        sku: 'SKU000005',
        productName: '蒙牛纯牛奶',
        quantity: 100,
        reserved: 0,
        warehouseId: 'WH-001',
        location: 'D-04-01',
        batchNo: 'BATCH20250505',
        expiryDate: '2025-05-17T00:00:00Z'
      }
    ],
    
    // Outbound Orders
    outboundOrders: [
      {
        id: 'out-001',
        orderNo: 'OUT20250508001',
        type: 'sale',
        items: [
          {
            sku: 'SKU000001',
            productName: '红富士苹果',
            quantity: 5,
            batchNo: 'BATCH20250501'
          },
          {
            sku: 'SKU000003',
            productName: '西红柿',
            quantity: 3,
            batchNo: 'BATCH20250503'
          }
        ],
        status: 'completed',
        warehouseId: 'WH-001',
        operatorId: 'emp-002',
        createdAt: '2025-05-08T14:25:00Z'
      }
    ],
        status: 'completed',
        warehouseId: 'WH-001',
        operatorId: 'emp-002',
        createdAt: '2025-05-08T14:25:00Z'
      }
    ],
    
    // Inbound Orders
    inboundOrders: [
      {
        id: 'in-001',
        orderNo: 'IN20250510001',
        type: 'purchase',
        items: [
          {
            sku: 'SKU000010',
            productName: '进口车厘子',
            quantity: 50,
            batchNo: 'BATCH20250510'
          }
        ],
        status: 'pending',
        warehouseId: 'WH-001',
        operatorId: 'emp-002',
        createdAt: '2025-05-10T11:25:00Z'
      }
    ]
        status: 'pending',
        warehouseId: 'WH-001',
        operatorId: 'emp-002',
        createdAt: '2025-05-10T11:25:00Z'
      }
    ]
  }
};

module.exports = mockData;