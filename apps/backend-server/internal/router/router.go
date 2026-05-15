package router

import (
	"crmb-backend/internal/config"
	"crmb-backend/internal/handler"
	"crmb-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	r.GET("/api/health", handler.HealthCheck)

	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/login", handler.Login(db, cfg))
		authGroup.GET("/userinfo", middleware.AuthMiddleware(&cfg.JWT), handler.UserInfo(db))
	}

	registerSalesRoutes(r, db, cfg)
	registerHRRoutes(r, db, cfg)
	registerMallRoutes(r, db, cfg)
	registerCSRoutes(r, db, cfg)
	registerCWRoutes(r, db, cfg)
	registerProcRoutes(r, db, cfg)
	registerFinRoutes(r, db, cfg)
	registerPayRoutes(r, db, cfg)
	registerOpsRoutes(r, db, cfg)
	registerDCRoutes(r, db, cfg)
	registerDDRoutes(r, db, cfg)
	registerSupplierRoutes(r, db, cfg)
}

func registerSalesRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/sales")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/visits", handler.ListVisits(db))
		g.GET("/visits/statistics", handler.VisitStatistics(db))
		g.GET("/visits/:id", handler.GetVisit(db))
		g.POST("/visits", handler.CreateVisit(db))
		g.PUT("/visits/:id", handler.UpdateVisit(db))
		g.DELETE("/visits/:id", handler.DeleteVisit(db))

		g.GET("/stores", handler.ListStores(db))
		g.GET("/stores/unclaimed", handler.UnclaimedStores(db))
		g.GET("/stores/review", handler.ReviewStores(db))
		g.GET("/stores/:id", handler.GetStore(db))
		g.POST("/stores/:id/claim", handler.ClaimStore(db))
		g.POST("/stores/:id/review", handler.ReviewStore(db))
		g.POST("/stores/:id/assign", handler.AssignStore(db))
		g.GET("/stores/statistics", handler.StoreStatistics(db))

		g.GET("/customers/public", handler.PublicCustomers(db))
		g.GET("/customers/private", handler.PrivateCustomers(db))
		g.GET("/customers/search", handler.SearchCustomers(db))
		g.GET("/customers/:id", handler.GetCustomer(db))
		g.POST("/customers/:id/claim", handler.ClaimCustomer(db))
		g.POST("/customers/:id/return", handler.ReturnCustomer(db))
		g.POST("/customers/:id/transfer", handler.TransferCustomer(db))

		g.GET("/special-stock-requests", handler.ListSpecialStockRequests(db))
		g.GET("/blacklist", handler.ListBlacklist(db))
	}
}

func registerHRRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/hr")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/employees", handler.ListEmployees(db))
		g.GET("/attendance", handler.ListAttendance(db))
		g.GET("/performance", handler.ListPerformance(db))
		g.POST("/attendance/check-in", handler.CheckIn(db))
		g.POST("/attendance/check-out", handler.CheckOut(db))
	}
}

func registerMallRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/mall")
	{
		g.GET("/products", handler.ListProducts(db))
		g.GET("/products/:id", handler.GetProduct(db))
		g.GET("/categories", handler.ListCategories(db))
		g.GET("/home/banner", handler.ListBanners(db))
		g.GET("/home/announcements", handler.ListAnnouncements(db))
		g.GET("/home/recommend", handler.RecommendProducts(db))

		authed := g.Group("")
		authed.Use(middleware.AuthMiddleware(&cfg.JWT))
		{
			authed.GET("/cart", handler.GetCart(db))
			authed.POST("/cart/items", handler.AddCartItem(db))
			authed.PUT("/cart/items/:id", handler.UpdateCartItem(db))
			authed.DELETE("/cart/items/:id", handler.DeleteCartItem(db))
			authed.GET("/orders", handler.ListMallOrders(db))
			authed.GET("/orders/:id", handler.GetMallOrder(db))
			authed.POST("/orders", handler.CreateMallOrder(db))
			authed.POST("/orders/:id/pay", handler.PayOrder(db))
			authed.GET("/after-sales", handler.ListMallAfterSales(db))
			authed.POST("/after-sales", handler.CreateMallAfterSale(db))
			authed.POST("/vip/purchase", handler.PurchaseVip(db))
			authed.GET("/vip/info", handler.GetVipInfo(db))
			authed.GET("/customer-service/phone", handler.GetCSPhone())
			authed.POST("/customer-service/feedback", handler.CreateFeedback(db))
		}
	}
}

func registerCSRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/customer-service")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/orders", handler.ListCSOrders(db))
		g.GET("/orders/:id", handler.GetCSOrder(db))
		g.PUT("/orders/:id/confirm", handler.ConfirmCSOrder(db))
		g.PUT("/orders/:id/cancel", handler.CancelCSOrder(db))
		g.POST("/orders/:id/remark", handler.CSOrderRemark(db))

		g.GET("/after-sales", handler.ListCSAfterSales(db))
		g.GET("/after-sales/:id", handler.GetCSAfterSale(db))
		g.PUT("/after-sales/:id/approve", handler.ApproveCSAfterSale(db))
		g.PUT("/after-sales/:id/receive", handler.ReceiveCSAfterSale(db))
		g.PUT("/after-sales/:id/refund", handler.RefundCSAfterSale(db))

		g.GET("/complaints", handler.ListCSComplaints(db))
		g.GET("/complaints/:id", handler.GetCSComplaint(db))
		g.PUT("/complaints/:id/accept", handler.AcceptCSComplaint(db))
		g.PUT("/complaints/:id/process", handler.ProcessCSComplaint(db))
		g.PUT("/complaints/:id/close", handler.CloseCSComplaint(db))

		g.GET("/reviews", handler.ListCSReviews(db))
		g.POST("/reviews/:id/reply", handler.ReplyCSReview(db))

		g.GET("/feedbacks", handler.ListCSFeedbacks(db))
		g.GET("/invoices", handler.ListCSInvoices(db))
	}
}

func registerCWRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/cloud-warehouse")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/inventory", handler.ListCWInventory(db))
		g.GET("/outbound", handler.ListCWOutbound(db))
		g.GET("/inbound", handler.ListCWInbound(db))
		g.POST("/outbound", handler.CreateCWOutbound(db))
		g.POST("/inbound", handler.CreateCWInbound(db))
		g.POST("/inventory/check", handler.CWInventoryCheck(db))
		g.GET("/admin/unloading", handler.ListCWUnloading(db))
	}
}

func registerProcRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/procurement")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/suppliers", handler.ListProcSuppliers(db))
		g.GET("/suppliers/:id", handler.GetProcSupplier(db))
		g.POST("/suppliers", handler.CreateProcSupplier(db))
		g.PUT("/suppliers/:id", handler.UpdateProcSupplier(db))
		g.PUT("/suppliers/:id/audit", handler.AuditProcSupplier(db))
		g.GET("/suppliers/:id/rating", handler.GetProcSupplierRating(db))

		g.GET("/purchase-requests", handler.ListPurchaseRequests(db))
		g.POST("/purchase-requests", handler.CreatePurchaseRequest(db))
		g.PUT("/purchase-requests/:id/approve", handler.ApprovePurchaseRequest(db))

		g.GET("/purchase-orders", handler.ListPurchaseOrders(db))
		g.POST("/purchase-orders", handler.CreatePurchaseOrder(db))
		g.PUT("/purchase-orders/:id/approve", handler.ApprovePurchaseOrder(db))
		g.GET("/purchase-orders/:id/track", handler.TrackPurchaseOrder(db))

		g.GET("/payable-accounts", handler.ListPayableAccounts(db))
		g.POST("/reconciliation/generate", handler.GenerateReconciliation(db))
		g.PUT("/reconciliation/:id/confirm", handler.ConfirmReconciliation(db))
		g.POST("/payment-requests", handler.CreatePaymentRequest(db))
		g.PUT("/payment-requests/:id/approve", handler.ApprovePaymentRequest(db))
		g.PUT("/payment-requests/:id/execute", handler.ExecutePaymentRequest(db))
	}
}

func registerFinRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/finance")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/transactions", handler.ListFinTransactions(db))
		g.GET("/reconciliations", handler.ListFinReconciliations(db))
		g.GET("/reports", handler.ListFinReports(db))
		g.POST("/reports/generate", handler.GenerateFinReport(db))
	}
}

func registerPayRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/payment")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/merchants", handler.ListPayMerchants(db))
		g.GET("/merchants/:id", handler.GetPayMerchant(db))
		g.POST("/merchants", handler.CreatePayMerchant(db))
		g.PUT("/merchants/:id", handler.UpdatePayMerchant(db))
		g.PUT("/merchants/:id/fee-rate", handler.UpdatePayMerchantFeeRate(db))
		g.PUT("/merchants/:id/settlement-account", handler.UpdatePayMerchantSettlement(db))

		g.GET("/receipts", handler.ListPayReceipts(db))
		g.GET("/receipts/:id", handler.GetPayReceipt(db))
		g.GET("/receipts/daily-summary", handler.PayReceiptDailySummary(db))
		g.GET("/receipts/monthly-summary", handler.PayReceiptMonthlySummary(db))
		g.PUT("/receipts/:id/mark-abnormal", handler.MarkPayReceiptAbnormal(db))
		g.PUT("/receipts/:id/process-abnormal", handler.ProcessPayReceiptAbnormal(db))

		g.GET("/settlement/config", handler.GetPaySettlementConfig(db))
		g.GET("/settlement/reports", handler.ListPaySettlementReports(db))
		g.POST("/settlement/execute", handler.ExecutePaySettlement(db))
		g.POST("/settlement/notify", handler.NotifyPaySettlement(db))
	}
}

func registerOpsRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/operations")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/products", handler.ListOpsProducts(db))
		g.GET("/products/:id", handler.GetOpsProduct(db))
		g.POST("/products", handler.CreateOpsProduct(db))
		g.PUT("/products/:id", handler.UpdateOpsProduct(db))
		g.PUT("/products/:id/status", handler.UpdateOpsProductStatus(db))

		g.GET("/categories", handler.ListOpsCategories(db))
		g.POST("/categories", handler.CreateOpsCategory(db))
		g.PUT("/categories/:id", handler.UpdateOpsCategory(db))

		g.GET("/promotions", handler.ListOpsPromotions(db))
		g.POST("/promotions", handler.CreateOpsPromotion(db))
		g.PUT("/promotions/:id", handler.UpdateOpsPromotion(db))
		g.GET("/promotions/:id/statistics", handler.OpsPromotionStatistics(db))

		g.GET("/coupons", handler.ListOpsCoupons(db))
		g.POST("/coupons", handler.CreateOpsCoupon(db))

		g.GET("/seckill/config", handler.GetOpsSeckillConfig(db))
		g.GET("/merchant-applications", handler.ListOpsMerchantApplications(db))
		g.GET("/merchant-applications/:id", handler.GetOpsMerchantApplication(db))
		g.PUT("/merchant-applications/:id/review", handler.ReviewOpsMerchantApplication(db))
	}
}

func registerDCRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/data-center")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.POST("/query", handler.DCQuery(db))
		g.GET("/realtime", handler.DCRealtime(db))
		g.GET("/history", handler.DCHistory(db))
		g.GET("/analysis/sales", handler.DCSalesAnalysis(db))
		g.GET("/analysis/user", handler.DCUserAnalysis(db))
		g.GET("/analysis/product", handler.DCProductAnalysis(db))
		g.GET("/analysis/channel", handler.DCChannelAnalysis(db))
		g.GET("/report/templates", handler.ListDCReportTemplates(db))
		g.POST("/report/generate", handler.GenerateDCReport(db))
		g.GET("/report/:id/export", handler.ExportDCReport(db))
		g.GET("/auto-export/config", handler.GetDCAutoExportConfig(db))
		g.PUT("/auto-export/config", handler.UpdateDCAutoExportConfig(db))
	}
}

func registerDDRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/direct-delivery")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/routes", handler.ListDDRoutes(db))
		g.POST("/routes", handler.CreateDDRoute(db))
		g.PUT("/routes/:id", handler.UpdateDDRoute(db))
		g.POST("/routes/optimize", handler.OptimizeDDRoute(db))

		g.GET("/stations", handler.ListDDStations(db))
		g.POST("/stations", handler.CreateDDStation(db))

		g.GET("/tasks", handler.ListDDTasks(db))
		g.POST("/tasks/assign", handler.AssignDDTask(db))
		g.POST("/tasks/auto-assign", handler.AutoAssignDDTask(db))
		g.PUT("/tasks/:id/status", handler.UpdateDDTaskStatus(db))
		g.POST("/tasks/:id/exception", handler.CreateDDException(db))
		g.PUT("/tasks/:id/confirm", handler.ConfirmDDTask(db))

		g.GET("/tracking/realtime/:taskId", handler.DDRealtimeTracking(db))
		g.GET("/tracking/history/:taskId", handler.DDHistoryTracking(db))
	}
}

func registerSupplierRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	g := r.Group("/api/supplier")
	g.Use(middleware.AuthMiddleware(&cfg.JWT))
	{
		g.GET("/orders", handler.ListSupplierOrders(db))
		g.GET("/orders/:id", handler.GetSupplierOrder(db))
		g.PUT("/orders/:id/ship", handler.ShipSupplierOrder(db))
		g.GET("/reconciliation", handler.ListSupplierReconciliations(db))
	}
}