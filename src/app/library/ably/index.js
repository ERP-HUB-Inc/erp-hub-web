import { Realtime } from "ably/browser/static/ably-commonjs.js";
 
window.Ably = new Realtime("keC0MQ.3Aw0TQ:5I9_irvlIoGdpws9");

window.Ably.connection.on("connected", () => {
  console.log("Connection status:", "Connected");
});

window.Ably.connection.on("failed", () => {
  console.log("Connection status:", "Failed");
});