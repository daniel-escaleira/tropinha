// Recebe áudio gerado no navegador e grava em assets/audio. Uso interno de produção, só em 127.0.0.1.
// A página de origem guarda {nome, b64} em window.name e navega para /receber.html, que entrega ao /salvar.
import { createServer } from "node:http";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const DEST = resolve(fileURLToPath(new URL("../assets/audio", import.meta.url)));
const PORTA = Number(process.env.PORT) || 4180;
const PAGINA = `<!doctype html><meta charset="utf-8"><title>receptor</title><body style="font:16px system-ui;padding:24px"><p id="s">recebendo…</p><script>
(async () => { const s = document.getElementById("s"); try { const d = JSON.parse(window.name || "{}"); const lista = d.lista || (d.b64 ? [d] : []); if (!lista.length) { s.textContent = "nada para receber"; return; }
  const linhas = []; for (const a of lista) { const r = await fetch("/salvar?nome=" + encodeURIComponent(a.nome), { method: "POST", body: a.b64 }); linhas.push(await r.text()); }
  s.textContent = linhas.join(" | "); window.name = ""; } catch (e) { s.textContent = "erro: " + e.message; } })();
</script>`;
createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (req.method === "GET") { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return res.end(PAGINA); }
  if (req.method === "POST" && u.pathname === "/salvar") {
    const nome = (u.searchParams.get("nome") || "audio.mp3").replace(/[^a-zA-Z0-9._-]/g, "_");
    const partes = []; req.on("data", c => partes.push(c));
    req.on("end", async () => { const buf = Buffer.from(Buffer.concat(partes).toString("utf8"), "base64"); await writeFile(resolve(DEST, nome), buf); res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }); res.end(`gravado ${nome} (${buf.length} bytes)`); });
    return;
  }
  res.writeHead(404); res.end();
}).listen(PORTA, "127.0.0.1", () => console.log("receptor em http://127.0.0.1:" + PORTA));
