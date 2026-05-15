package main

import (
	"log"
	"strconv"

	"crmb-backend/internal/config"
	"crmb-backend/internal/middleware"
	"crmb-backend/internal/model"
	"crmb-backend/internal/router"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()

	gin.SetMode(cfg.Server.Mode)
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	db, err := gorm.Open(mysql.Open(cfg.Database.DSN()), &gorm.Config{})
	if err != nil {
		log.Println("DB connection failed, running without database: ", err)
		db = nil
	} else {
		autoMigrate(db)
		log.Println("Database connected and migrated successfully")
	}

	router.Setup(r, db, cfg)

	log.Printf("Server starting on port %d...", cfg.Server.Port)
	if err := r.Run(":" + strconv.Itoa(cfg.Server.Port)); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func autoMigrate(db *gorm.DB) {
	db.AutoMigrate(
		&model.User{},
		&model.Visit{}, &model.VisitImage{}, &model.Store{}, &model.StoreLicense{},
		&model.Customer{}, &model.SpecialStockRequest{}, &model.BlacklistCustomer{},
		&model.Employee{}, &model.AttendanceRecord{}, &model.PerformanceReview{},
		&model.Product{}, &model.ProductImage{}, &model.ProductTag{}, &model.Category{},
		&model.Cart{}, &model.CartItem{}, &model.Order{}, &model.OrderItem{},
		&model.ShippingAddress{}, &model.AfterSale{}, &model.AfterSaleImage{},
		&model.VipPackage{}, &model.VipPackageBenefit{}, &model.UserVip{},
		&model.Banner{}, &model.Announcement{}, &model.Feedback{}, &model.FeedbackImage{},
		&model.CSOrder{}, &model.CSOrderItem{}, &model.CSAfterSale{},
		&model.CSComplaint{}, &model.CSComplaintProcess{}, &model.CSReview{}, &model.CSInvoice{},
		&model.CWInventory{}, &model.CWInboundOrder{}, &model.CWInboundItem{},
		&model.CWOutboundOrder{}, &model.CWOutboundItem{}, &model.CWInventoryCheck{},
		&model.CWUnloadingTask{}, &model.CWUnloadingItem{},
		&model.ProcSupplier{}, &model.PurchaseRequest{}, &model.PurchaseOrder{},
		&model.PurchaseOrderItem{}, &model.PayableAccount{}, &model.ProcReconciliation{},
		&model.ProcPaymentRequest{},
		&model.FinTransaction{}, &model.FinReconciliation{}, &model.FinReport{}, &model.FinReportData{},
		&model.PayMerchant{}, &model.PayReceipt{}, &model.PaySettlementConfig{}, &model.PaySettlementReport{},
		&model.OpsProduct{}, &model.OpsCategory{}, &model.OpsPromotion{}, &model.OpsPromotionCategory{},
		&model.OpsCoupon{}, &model.OpsSeckillConfig{}, &model.OpsSeckillProduct{}, &model.OpsMerchantApplication{},
		&model.DCQuery{}, &model.DCRealtimeData{}, &model.DCSalesAnalysis{},
		&model.DCUserAnalysis{}, &model.DCProductAnalysis{}, &model.DCChannelAnalysis{},
		&model.DCReportTemplate{}, &model.DCReport{}, &model.DCAutoExportConfig{},
		&model.DDRoute{}, &model.DDRouteStation{}, &model.DDStation{},
		&model.DDDeliveryTask{}, &model.DDDeliveryTaskItem{}, &model.DDTrackPoint{}, &model.DDException{},
		&model.SupplierOrder{}, &model.SupplierOrderItem{},
		&model.SupplierShipment{}, &model.SupplierReconciliation{},
	)
}