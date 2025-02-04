#!/bin/bash

# 1. 创建 entitlements 文件（关键权限配置）
cat > entitlements.plist <<EOL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
</dict>
</plist>
EOL

# 2. 签名主程序
codesign --force --sign "MySelfSignedCert" \
  --options runtime \
  --entitlements entitlements.plist \
  --timestamp \
  "./out/origin-darwin-arm64/origin.app"

# 3. 递归签名所有可执行代码（精确控制范围）
find "./out/origin-darwin-arm64/origin.app" -type \( \
  -name "*.dylib" -o \
  -name "*.so" -o \
  -name "*.node" -o \
  -name "*.framework" -o \
  -perm +111 \
\) -exec codesign --force --sign "MySelfSignedCert" \
  --options runtime \
  --entitlements entitlements.plist \
  --timestamp {} \;

# 4. 验证签名
codesign -dv  "./out/origin-darwin-arm64/origin.app"
spctl -a -v "./out/origin-darwin-arm64/origin.app"