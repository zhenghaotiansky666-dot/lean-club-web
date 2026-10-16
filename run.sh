#!/usr/bin/env bash
# Lean Club 启动脚本
# 本机没有系统 Node，这里自动使用 Codex 运行时自带的 Node + pnpm。
#
# 用法：
#   ./run.sh            启动开发服务器（http://localhost:3000）
#   ./run.sh dev        同上
#   ./run.sh build      生产构建
#   ./run.sh start      运行生产构建（先执行一次 ./run.sh build）
#   ./run.sh test       运行 Playwright 冒烟测试
#   ./run.sh lint       运行 ESLint

set -euo pipefail

NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if [ ! -x "$NODE_BIN/node" ]; then
  echo "未找到 Codex 自带的 Node（$NODE_BIN/node）。"
  echo "请确认本机已安装 Node.js 18+，或改用你系统里的 node。"
  exit 1
fi
export PATH="$NODE_BIN:$PATH"

cd "$(dirname "$0")"

CMD="${1:-dev}"
case "$CMD" in
  dev)   pnpm dev ;;
  build) pnpm build ;;
  start) pnpm start ;;
  test)  pnpm test:e2e ;;
  lint)  pnpm lint ;;
  *)     echo "未知命令：$CMD"; exit 1 ;;
esac
