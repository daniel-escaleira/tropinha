"""Acrescenta ao book do Topete a página "O mascote da Tropinha" (por que um quero-quero), logo depois da capa,
e renumera as páginas seguintes. Lê origem/Book_individual_Topete.pdf e grava origem/Book_individual_Topete_v02.pdf.

A página nova é uma cópia da página 3 (mesma grade de quatro blocos) com o texto trocado.
Títulos e números usam as fontes que já estão embutidas no PDF (Open Sans Condensed Bold e Bold): como são
subconjuntos, só têm as letras que o book já usava, e por isso os títulos foram escritos com essas letras
(não há hífen nem "é" na condensada). O texto corrido usa ferramentas/fontes/OpenSans-Regular.ttf.
Rodar:  uv run --no-project --with pymupdf python ferramentas/pagina_topete.py
"""
import pathlib, re
import pymupdf

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIG, FONTES = RAIZ / "origem", RAIZ / "ferramentas" / "fontes"
REG = pymupdf.Font(fontfile=str(FONTES / "OpenSans-Regular.ttf"))
ALT = 595.0

CABECA = "TOPETE  /  MASCOTE"
TITULO = "O mascote da Tropinha"
SUB = "Por que um quero-quero: três razões para ele estar na turma, e o que fica de fora."
BLOCOS = [
    ("O bicho do futebol brasileiro", "O quero-quero faz o ninho no chão, em gramado aberto, e dá rasante em quem chega perto dos ovos. Por isso aparece em tanto campo pelo país. Em 2024, um filhote parou um jogo da Copa do Brasil em Itajaí."),
    ("O único que dribla o Vovô", "Vovô vive de fazer o marcador mudar de caminho. Com Topete é o contrário: um passo curto da ave, e quem abre a curva é o jogador. É a ideia da série vista de baixo."),
    ("O nome vem do desenho", "Topete é a crista escura virada para trás. Com o peito erguido, ela mantém a silhueta legível em tamanho pequeno, numa estampa ou num boneco."),
    ("O que fica de fora", "Ele não fala e não joga bola. É um bicho de verdade no meio da pelada: tem o canto, o passo e o ninho. A graça vem daí."),
]


class Embutida:
    """Fonte simples já embutida no PDF: converte texto em códigos do subconjunto e mede a largura."""
    def __init__(self, doc, pagina, base):
        f = next(f for f in pagina.get_fonts(full=True) if f[3].endswith("+" + base))
        self.xref, self.nome = f[0], f[4]
        obj = doc.xref_object(self.xref)
        self.primeiro = int(re.search(r"/FirstChar (\d+)", obj).group(1))
        self.larg = [float(x) for x in re.search(r"/Widths\s*\[([^\]]*)\]", obj, re.S).group(1).split()]
        cmap = doc.xref_stream(int(re.search(r"/ToUnicode (\d+) 0 R", obj).group(1))).decode("latin-1")
        self.cod = {}
        for bloco in re.findall(r"beginbfchar(.*?)endbfchar", cmap, re.S):
            for c, u in re.findall(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", bloco): self.cod.setdefault(chr(int(u, 16)), int(c, 16))
        for bloco in re.findall(r"beginbfrange(.*?)endbfrange", cmap, re.S):
            for a, b, u in re.findall(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", bloco):
                for k in range(int(b, 16) - int(a, 16) + 1): self.cod.setdefault(chr(int(u, 16) + k), int(a, 16) + k)

    def codigos(self, texto):
        falta = sorted({c for c in texto if c not in self.cod})
        if falta: raise SystemExit(f"a fonte {self.nome} não tem: {falta!r} (em {texto!r})")
        return [self.cod[c] for c in texto]

    def largura(self, texto, corpo):
        return sum(self.larg[c - self.primeiro] for c in self.codigos(texto)) * corpo / 1000

    def desenha(self, texto, x, y, corpo, cor):
        r, g, b = (((cor >> d) & 255) / 255 for d in (16, 8, 0))
        hexa = "".join(f"{c:02X}" for c in self.codigos(texto))
        return f"q BT {r:.4f} {g:.4f} {b:.4f} rg /{self.nome} {corpo:g} Tf 1 0 0 1 {x:.3f} {ALT - y:.3f} Tm <{hexa}> Tj ET Q\n"


def garante_fonte(doc, pg, f):
    """Recoloca a fonte nos recursos da página: ao apagar todo o texto de uma fonte, o PyMuPDF tira a referência a ela."""
    t, v = doc.xref_get_key(pg.xref, "Resources")
    rx, base = (int(v.split()[0]), "") if t == "xref" else (pg.xref, "Resources/")
    t, v = doc.xref_get_key(rx, base + "Font")
    fx, fb = (int(v.split()[0]), "") if t == "xref" else (rx, base + "Font/")
    doc.xref_set_key(fx, fb + f.nome, f"{f.xref} 0 R")


def linhas(pg):
    out = []
    for b in pg.get_text("dict")["blocks"]:
        if b["type"] != 0: continue
        for l in b["lines"]:
            t = "".join(s["text"] for s in l["spans"]).strip(); s = l["spans"][0]
            if t: out.append({"t": t, "r": pymupdf.Rect(l["bbox"]), "f": s["font"], "c": s["size"], "x": s["origin"][0], "y": s["origin"][1], "cor": s["color"]})
    return out


def quebra(texto, corpo, larg):
    out, atual = [], ""
    for pal in texto.split(" "):
        tenta = (atual + " " + pal).strip()
        if REG.text_length(tenta, fontsize=corpo) <= larg or not atual: atual = tenta
        else: out.append(atual); atual = pal
    return out + ([atual] if atual else [])


def apaga(pg, alvo):
    for l in alvo: pg.add_redact_annot(l["r"] + (-1, -1, 1, 1), fill=False)
    pg.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)


def cor3(c): return tuple(((c >> d) & 255) / 255 for d in (16, 8, 0))


def main():
    doc = pymupdf.open(ORIG / "Book_individual_Topete.pdf")
    assert len(doc) == 13 and doc[0].rect.height == ALT
    doc.fullcopy_page(2, 1)                              # cópia da página 3, posta logo depois da capa
    nova = doc[1]
    L = linhas(nova)
    fica = [l for l in L if l["t"].startswith("O VOVÔ DO X1") or l["t"].startswith("DIREÇÃO DE PERSONAGEM")]
    assert len(fica) == 2
    cab = next(l for l in L if l["t"].startswith("TOPETE"))
    tit = next(l for l in L if l["c"] > 30)
    sub = next(l for l in L if abs(l["c"] - 11) < .1)
    heads = sorted((l for l in L if abs(l["c"] - 20) < .1), key=lambda l: (round(l["y"]), l["x"]))
    corpo0 = [next(l for l in L if abs(l["c"] - 12) < .1 and abs(l["x"] - h["x"]) < 2 and 0 < l["y"] - h["y"] < 30) for h in heads]
    pitch = 19.0
    assert len(heads) == 4
    cond, bold = Embutida(doc, nova, "OpenSans-CondensedBold"), Embutida(doc, nova, "OpenSans-Bold")
    apaga(nova, [l for l in L if l not in fica])
    nova.wrap_contents()
    garante_fonte(doc, nova, cond); garante_fonte(doc, nova, bold)
    s = bold.desenha(CABECA, cab["r"].x1 - bold.largura(CABECA, cab["c"]), cab["y"], cab["c"], cab["cor"])
    s += cond.desenha(TITULO, tit["x"], tit["y"], tit["c"], tit["cor"])
    for h, (t, _) in zip(heads, BLOCOS): s += cond.desenha(t, h["x"], h["y"], h["c"], h["cor"])
    pymupdf.TOOLS._insert_contents(nova, s.encode("latin-1"), True)
    nova.insert_font(fontname="TOSReg", fontfile=str(FONTES / "OpenSans-Regular.ttf"))
    nova.insert_text((sub["x"], sub["y"]), SUB, fontname="TOSReg", fontsize=sub["c"], color=cor3(sub["cor"]))
    for h, b0, (_, txt) in zip(heads, corpo0, BLOCOS):
        ls = quebra(txt, b0["c"], 354)
        assert len(ls) <= 5, (len(ls), txt)
        for k, t in enumerate(ls): nova.insert_text((b0["x"], b0["y"] + k * pitch), t, fontname="TOSReg", fontsize=b0["c"], color=cor3(b0["cor"]))
        print(f"bloco {h['t'][:18]!r:22} → {len(ls)} linhas")

    # numeração: a página nova vira 02 e as seguintes sobem uma
    for i in range(1, len(doc)):
        pg = doc[i]
        num = [l for l in linhas(pg) if re.fullmatch(r"\d\d", l["t"]) and l["y"] > 570 and l["x"] > 760]
        if i == 1: num_ref = {"x": 780.3, "y": 580.0, "c": 10.0, "cor": 0x102a24} if not num else num[0]
        if i > 1 and not num: raise SystemExit(f"página {i + 1}: não achei o número")
        ref = num[0] if num else num_ref
        b = Embutida(doc, pg, "OpenSans-Bold")
        if num: apaga(pg, num)
        pg.wrap_contents()
        garante_fonte(doc, pg, b)
        pymupdf.TOOLS._insert_contents(pg, b.desenha(f"{i + 1:02d}", ref["x"], ref["y"], ref["c"], ref["cor"]).encode("latin-1"), True)
    try: doc.subset_fonts()
    except Exception as e: print("sem subconjunto de fontes:", e)
    saida = ORIG / "Book_individual_Topete_v02.pdf"
    doc.save(saida, garbage=4, deflate=True)
    print("gravado", saida.name, saida.stat().st_size, "páginas:", len(doc))


if __name__ == "__main__":
    main()
