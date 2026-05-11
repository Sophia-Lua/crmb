#!/bin/bash

# 启动所有开发服务
echo "🚀 启动 CRMB 开发环境..."

# 启动 Mock Server (后台)
cd apps/mock-server && pnpm dev &
MOCK_PID=$!

echo "📦 Mock Server 启动中... (PID: $MOCK_PID)"

# 等待 Mock Server 启动
sleep 3

# 启动 Admin Server (前台)
echo "🖥️  启动 Admin Server..."
cd ../admin-server && pnpm dev

# 清理
trap "kill $MOCK_PID" EXIT