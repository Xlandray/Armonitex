#!/usr/bin/env bash
# =============================================================================
# Armonitex Ubuntu Runner Script (Master Orchestrator Integration)
# Executed autonomously on the Ubuntu server upon receiving Mac git push trigger.
# =============================================================================

set -e

echo "🚀 [Ubuntu Runner] Starting Automated Test & Quality Assurance Workflow..."

# Step 1: Pull Latest Code Base from Git Repository
echo "📦 [1/4] Pulling latest repository updates..."
git pull origin main || echo "Git pull warning: proceeding with local workspace build."

# Step 2: Spin Up Isolated Docker Test Environment
echo "🐳 [2/4] Building and launching isolated Docker container stack (API, DB, Admin, Web)..."
docker compose down -v || true
docker compose up -d --build

# Step 3: Run Playwright E2E Test Suite
echo "🎭 [3/4] Running Playwright End-to-End browser test suite..."
cd armonitex-web
npm run build || true
npx playwright test --reporter=json:agent-report/test-results.json || echo "Playwright tests completed with code findings."
cd ..

# Step 4: Execute Master Orchestrator Agent (Claude AI Audit)
echo "🤖 [4/4] Invoking Master Orchestrator Agent for autonomous decision analysis..."
python3 scripts/master_orchestrator.py

echo "✅ [Ubuntu Runner] Autonomous Quality Assurance pipeline execution completed."
