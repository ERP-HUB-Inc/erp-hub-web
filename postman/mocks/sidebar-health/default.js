const http = require("http");

// Only the status field consumed by the UI is needed from the observed health
// response. Failure shapes below are synthetic resilience fixtures.
http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET" || !/^\/(?:failure\/|unknown\/|slow\/)?health$/.test(req.url)) {
    res.writeHead(501);
    return res.end(JSON.stringify({ error: "Endpoint not modeled" }));
  }
  if (req.url === "/failure/health") {
    res.writeHead(503);
    return res.end(JSON.stringify({ status: "unavailable" }));
  }
  if (req.url === "/unknown/health") return res.end(JSON.stringify({ status: "unrecognized" }));
  setTimeout(() => res.end(JSON.stringify({ status: "ok" })), req.url === "/slow/health" ? 500 : 0);
}).listen(process.env.PORT);
