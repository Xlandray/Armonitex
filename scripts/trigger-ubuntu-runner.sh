#!/usr/bin/env bash
# =============================================================================
# Mac Command Center Trigger Script
# Triggers the Ubuntu Master Orchestrator Agent remotely via SSH or Git hook.
# =============================================================================

UBUNTU_HOST="${UBUNTU_HOST:-ubuntu-server.armonitex.internal}"
UBUNTU_USER="${UBUNTU_USER:-deploy}"
REMOTE_PROJECT_PATH="${REMOTE_PROJECT_PATH:-/var/www/armonitex}"

echo "🖥️ [Mac Command Center] Initiating remote trigger to Ubuntu QA Orchestrator..."
echo "📡 Target: ${UBUNTU_USER}@${UBUNTU_HOST}:${REMOTE_PROJECT_PATH}"

# Execute runner script on Ubuntu host via SSH
ssh -o StrictHostKeyChecking=no "${UBUNTU_USER}@${UBUNTU_HOST}" "cd ${REMOTE_PROJECT_PATH} && bash scripts/ubuntu-runner.sh"

echo "✨ Remote orchestration trigger dispatched successfully."
