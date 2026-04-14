#!/usr/bin/env bash
set -euo pipefail

# ASIS v5.0 — GCP VM deployment script
# Run this on the asis-backend VM directly, or via:
#   gcloud compute ssh asis-backend --zone=us-central1-f -- 'bash -s' < deploy.sh

APP_DIR="/opt/asis-v5"
REPO_URL="https://github.com/akshatb848/asis-base44.git"
BRANCH="claude/replicate-asis-v5-h5mWO"
IMAGE="asis-v5:latest"
CONTAINER="asis-v5"

echo "=== ASIS v5.0 Deployment ==="

# Install Docker if missing
if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
  newgrp docker
fi

# Clone or update repo
if [ -d "$APP_DIR/.git" ]; then
  echo "Updating existing repo..."
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  echo "Cloning repo..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# Write .env if env vars are set (optional — app works without them in demo mode)
if [ -n "${VITE_SUPABASE_URL:-}" ]; then
  cat > "$APP_DIR/.env" <<EOF
VITE_SUPABASE_URL=$VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY:-}
VITE_ANTHROPIC_API_KEY=${VITE_ANTHROPIC_API_KEY:-}
EOF
  echo ".env written."
fi

echo "Building Docker image..."
docker build -t "$IMAGE" "$APP_DIR"

echo "Stopping old container (if any)..."
docker stop "$CONTAINER" 2>/dev/null || true
docker rm   "$CONTAINER" 2>/dev/null || true

echo "Starting container..."
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  -p 80:80 \
  "$IMAGE"

echo ""
echo "=== Deployment complete ==="
echo "App is running at http://$(curl -s ifconfig.me 2>/dev/null || echo '<VM_IP>')"
