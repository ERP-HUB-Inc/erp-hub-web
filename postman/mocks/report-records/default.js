const http = require("http");

// Synthetic fixtures for the GET list/detail shapes consumed by the existing
// LocationService and VendorService. No customer or production records.
http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const match = url.pathname.match(/^\/(locations|vendors)(?:\/(\d+))?$/);
  if (req.method !== "GET" || !match) {
    res.writeHead(501);
    return res.end(JSON.stringify({ error: "Endpoint not modeled" }));
  }
  const noun = match[1] === "locations" ? "Store" : "Supplier";
  if (match[2]) {
    return res.end(JSON.stringify({ data: { id: Number(match[2]), name: `Restored ${noun}` } }));
  }
  const search = url.searchParams.get("search") || "";
  if (search === "failure") {
    res.writeHead(500);
    return res.end(JSON.stringify({ error: "Synthetic option failure" }));
  }
  const id = search ? 99 : 1;
  const rows = search === "missing" ? [] : [{ id, name: `${search || "Initial"} ${noun}` }];
  const reply = () => res.end(JSON.stringify({ data: rows }));
  setTimeout(reply, search === "slow" ? 700 : 0);
}).listen(process.env.PORT);
