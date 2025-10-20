const fs = require("fs");
const path = require("path");

const dirs = [
  "app/core/guards",
  "app/core/interceptors",
  "app/core/services",
  "app/core/models",
  "app/core/utils",
  "app/shared/components",
  "app/shared/directives",
  "app/shared/pipes",
  "app/layout/admin-layout",
  "app/layout/auth-layout",
  "app/features/auth/pages",
  "app/features/auth/services",
  "app/features/dashboard",
  "app/features/booking",
  "app/features/merchant",
  "app/features/loyalty",
  "assets/images",
  "assets/fonts",
  "assets/icons",
  "styles",
];

dirs.forEach((dir) => {
  fs.mkdirSync(path.join("src", dir), { recursive: true });
  console.log("Created:", dir);
});

// Tạo các file SCSS cơ bản
["variables", "mixins", "themes", "main"].forEach((file) => {
  fs.writeFileSync(path.join("src/styles", `_${file}.scss`), "");
});

console.log("✅ Structure generated!");
