// test-proxy.ts
import { setGlobalDispatcher, ProxyAgent } from "undici";
setGlobalDispatcher(new ProxyAgent("http://127.0.0.1:7890"));

fetch("https://oauth2.googleapis.com/token")
  .then(res => console.log("status:", res.status))
  .catch(err => console.error("失败:", err));