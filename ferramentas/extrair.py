"""Extrai dos books (origem/*.pdf) o que o site usa.

Saídas:
  assets/p/<id>/pose-NN.webp, expr-N.webp, capa.webp   figuras de cada personagem
  assets/quadra.webp                                   arte de capa do Book do Elenco
  assets/revista/NNN.webp                              cada página dos oito books, em tela única
  data/poses.js                                        nomes de poses e expressões
  data/revista.js                                      capítulos, páginas e áreas tocáveis
Rodar:  uv run --no-project --with pymupdf --with pillow python ferramentas/extrair.py
"""
import io, json, re, sys, pathlib, unicodedata
import pymupdf
from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIG, ASSETS, DATA = RAIZ / "origem", RAIZ / "assets", RAIZ / "data"
LIVROS = [
    ("elenco", "O_Vovo_do_X1_e_sua_Tropinha_Book_do_Elenco_v02", "O elenco"),
    ("vovo", "Book_individual_Vovo_do_X1_v02", "Vovô do X1"),
    ("nanda", "Book_individual_Nanda", "Nanda"),
    ("joia", "Book_individual_Joia_v02", "Joia"),
    ("duda", "Book_individual_Duda", "Duda"),
    ("prancheta", "Book_individual_Prancheta", "Prancheta"),
    ("val", "Book_individual_Val", "Val"),
    ("topete", "Book_individual_Topete", "Topete"),
]
LARG, ALT = 1800, 1272          # tela única da revista (proporção A4 paisagem)
FUNDO = (243, 238, 224)

ACENTOS = {"Tres": "Três", "tres": "três", "Bracos": "Braços", "Comecando": "Começando", "Marcacao": "Marcação",
    "Dominio": "Domínio", "Protecao": "Proteção", "Balancada": "Balançada", "Saida": "Saída", "Coracao": "Coração",
    "proprio": "próprio", "comemoracao": "comemoração", "Frustracao": "Frustração", "chao": "chão",
    "Recepcao": "Recepção", "Finalizacao": "Finalização", "mao": "mão", "pos": "pós"}

def nome_do_zip(arq):
    base = pathlib.Path(arq).stem
    base = re.sub(r"^(E?\d+)_", "", base)
    pal = [ACENTOS.get(p, p) for p in base.split("_")]
    t = " ".join(pal)
    t = re.sub(r"\bolhando a (esquerda|direita)\b", r"olhando à \1", t)
    t = t.replace("pós jogo", "pós-jogo")
    return t

def nomes_zip(pid):
    f = ORIG / f"nomes-{pid}.txt"
    poses, exprs = {}, {}
    if f.exists():
        for l in f.read_text().split("\n"):
            m = re.search(r"Poses/(\d+)_", l)
            if m: poses[int(m.group(1))] = nome_do_zip(l)
            m = re.search(r"Expressoes/E(\d+)_", l)
            if m: exprs[int(m.group(1))] = nome_do_zip(l)
    return poses, exprs

def salvar(img, destino, alt_max, q=82):
    if img.mode not in ("RGB", "RGBA"): img = img.convert("RGB")
    if img.mode == "RGBA":
        fundo = Image.new("RGB", img.size, (255, 255, 255)); fundo.paste(img, mask=img.split()[3]); img = fundo
    if img.height > alt_max:
        img = img.resize((round(img.width * alt_max / img.height), alt_max), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    img.save(destino, "WEBP", quality=q, method=5)
    return img.size

def rotulos(pag, prefixo):
    """Acha 'P13 Abre o portão' pela posição na página: devolve {n: (x, y, texto)}."""
    linhas = []
    for b in pag.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            t = " ".join(s["text"] for s in l["spans"]).strip()
            if t: linhas.append((l["bbox"], t))
    achados = {}
    for bbox, t in linhas:
        m = re.match(rf"^{prefixo}(\d\d)\b\s*(.*)$", t)
        if not m: continue
        n, resto = int(m.group(1)), m.group(2).strip()
        if not resto:      # o nome ficou em outra linha, à direita na mesma altura
            cand = [(abs(b2[1] - bbox[1]), b2[0], t2) for b2, t2 in linhas
                    if b2[0] > bbox[0] and b2[0] - bbox[2] < 200 and abs(b2[1] - bbox[1]) < 8 and not re.match(r"^[PE]\d\d", t2)]
            if cand: resto = sorted(cand)[0][2]
        achados[n] = (bbox[0], bbox[1], resto)
    return achados

def main():
    paginas, capitulos, poses_js = [], [], {}
    for cid, arq, titulo in LIVROS:
        doc = pymupdf.open(ORIG / f"{arq}.pdf")
        capitulos.append({"id": cid, "titulo": titulo, "inicio": len(paginas), "paginas": len(doc)})
        zp, ze = nomes_zip(cid)
        nomes_p, nomes_e, seq_p, seq_e = {}, {}, 0, 0
        for i, pag in enumerate(doc):
            w, h = pag.rect.width, pag.rect.height
            esc = min(LARG / w, ALT / h)
            dx, dy = (LARG - w * esc) / 2, (ALT - h * esc) / 2
            pix = pag.get_pixmap(matrix=pymupdf.Matrix(esc, esc))
            im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            tela = Image.new("RGB", (LARG, ALT), FUNDO); tela.paste(im, (round(dx), round(dy)))
            num = len(paginas) + 1
            tela.save(ASSETS / "revista" / f"{num:03d}.webp", "WEBP", quality=78, method=5)
            areas = []
            if cid != "elenco":
                texto = pag.get_text()
                imgs = []
                for info in pag.get_images(full=True):
                    for r in pag.get_image_rects(info[0]):
                        imgs.append((r, info[0]))
                imgs.sort(key=lambda t: (round(t[0].y0 / 60), t[0].x0))
                e_expr = bool(re.search(r"express", texto, re.I)) and len(imgs) == 6 and "ATLAS" not in texto
                e_atlas = "ATLAS DE POSES" in texto and len(imgs) == 6
                if i == 0 and imgs:
                    maior = max(imgs, key=lambda t: t[0].width * t[0].height)
                    salvar(Image.open(io.BytesIO(doc.extract_image(maior[1])["image"])), ASSETS / "p" / cid / "capa.webp", 1100, 86)
                if e_expr or e_atlas:
                    rot = rotulos(pag, "E" if e_expr else "P")
                    for r, xref in imgs:
                        if e_expr: seq_e += 1; n = seq_e
                        else: seq_p += 1; n = seq_p
                        nome = (ze if e_expr else zp).get(n) or (rot.get(n, (0, 0, ""))[2])
                        (nomes_e if e_expr else nomes_p)[n] = nome
                        arqimg = f"expr-{n}.webp" if e_expr else f"pose-{n:02d}.webp"
                        salvar(Image.open(io.BytesIO(doc.extract_image(xref)["image"])), ASSETS / "p" / cid / arqimg, 620)
                        areas.append({"k": "e" if e_expr else "p", "n": n,
                                      "x": round((r.x0 * esc + dx) / LARG * 100, 2), "y": round((r.y0 * esc + dy) / ALT * 100, 2),
                                      "w": round(r.width * esc / LARG * 100, 2), "h": round(r.height * esc / ALT * 100, 2)})
            else:
                if i == 0:
                    info = max(pag.get_images(full=True), key=lambda t: t[2] * t[3])
                    tam = salvar(Image.open(io.BytesIO(doc.extract_image(info[0])["image"])), ASSETS / "quadra.webp", 1100, 86)
                    print("quadra.webp", tam)
            paginas.append({"c": cid, "a": areas})
        if cid != "elenco":
            poses_js[cid] = {"poses": [nomes_p.get(n, "") for n in range(1, seq_p + 1)],
                             "expr": [nomes_e.get(n, "") for n in range(1, seq_e + 1)]}
            vazios = [n for n in range(1, seq_p + 1) if not nomes_p.get(n)]
            print(f"{cid}: {seq_p} poses, {seq_e} expressões, sem nome: {vazios}")
    DATA.mkdir(exist_ok=True)
    (DATA / "poses.js").write_text("window.POSES = " + json.dumps(poses_js, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    (DATA / "revista.js").write_text("window.REVISTA = " + json.dumps({"larg": LARG, "alt": ALT, "capitulos": capitulos, "paginas": paginas}, ensure_ascii=False) + ";\n", encoding="utf-8")
    print("páginas:", len(paginas), "| capítulos:", [(c["id"], c["inicio"], c["paginas"]) for c in capitulos])

if __name__ == "__main__":
    (ASSETS / "revista").mkdir(parents=True, exist_ok=True)
    main()
