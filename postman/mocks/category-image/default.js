const http = require("http");

// Shape from ../pos-api/src/containers/core/setting/services/FileStorage.ts.
// Synthetic tenant and image only; no workspace mock lookup was needed for
// this adjacent local implementation. File contents/auth are not validated.
const key = "fixture-tenant/image/e07cc3533f60a1286679807faae6eaa6.png";
const imagePath = `/public/temp_uploads/${key}`;
http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (req.method === "GET" && req.url === imagePath) {
    res.setHeader("Content-Type", "image/png");
    return res.end(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64"));
  }
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST" && req.url === "/files/upload/image") {
    return res.end(JSON.stringify({ status: "success", filename: "original.png",
      storedFilename: key.split("/").pop(), key, path: key,
      url: `${process.env.CATEGORY_UPLOAD_SIM_ORIGIN}/uploads${imagePath}`, mimeType: "image/png", size: 68 }));
  }
  if (req.method === "DELETE" && req.url === `/files/delete/image/${key.split("/").pop()}`) {
    return res.end(JSON.stringify({ status: "success", deletedPath: key }));
  }
  res.writeHead(501);
  res.end(JSON.stringify({ message: "Endpoint not modeled" }));
}).listen(process.env.PORT);
