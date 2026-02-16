FROM gitpod/workspace-full

# 安装 Electron 运行依赖
RUN sudo apt-get update && sudo apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libasound2 \
    libxss1 \
    libxtst6 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libgbm1 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    libglu1-mesa \
    xvfb

# 安装 pnpm
RUN npm install -g pnpm
