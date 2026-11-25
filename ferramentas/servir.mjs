// Servidor local mínimo para ver o site: node ferramentas/servir.mjs  →  http://127.0.0.1:4173
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
const RAIZ = resolve(fileURLToPath(new URL("..", import.meta.url)));
const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp4": "video/mp4" };
const PORTA = Number(process.env.PORT) || 4173;
createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const arq = normalize(join(RAIZ, p));
    if (arq !== RAIZ && !arq.startsWith(RAIZ + sep)) { res.writeHead(403); return res.end(); }
    const s = await stat(arq);
    const tipo = TIPOS[extname(arq)] || "application/octet-stream";
    const faixa = /bytes=(\d+)-(\d*)/.exec(req.headers.range || "");
    const dados = await readFile(arq);
    if (faixa) {
      const ini = +faixa[1], fim = faixa[2] ? +faixa[2] : s.size - 1;
      res.writeHead(206, { "Content-Type": tipo, "Content-Range": `bytes ${ini}-${fim}/${s.size}`, "Accept-Ranges": "bytes", "Content-Length": fim - ini + 1 });
      return res.end(dados.subarray(ini, fim + 1));
    }
    res.writeHead(200, { "Content-Type": tipo, "Content-Length": s.size, "Accept-Ranges": "bytes", "Cache-Control": "no-store" });
    res.end(dados);
  } catch (e) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("não encontrado"); }
}).listen(PORTA, "127.0.0.1", () => console.log("site em http://127.0.0.1:" + PORTA));
