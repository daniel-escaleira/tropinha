"""Reescreve, dentro dos PDFs dos books, os trechos sobre o Joia: ele é o filho que se espelha no pai
e quer ser um grande jogador. Sai o "narrador da quadra".

Não mexe nos originais: lê origem/<nome>.pdf e grava origem/<nome>_v02.pdf.
O texto antigo é removido do PDF (sem pintar por cima) e o novo entra com a mesma fonte, corpo, cor e entrelinha.
Rodar:  uv run --no-project --with pymupdf --with fonttools python ferramentas/reescrever_joia.py
        (para refazer só alguns livros, passe parte do nome: ... reescrever_joia.py Nanda Val)
Os books da Nanda e da Val usam Open Sans; os demais, Barlow. As fontes ficam em ferramentas/fontes/.
"""
import pathlib, sys
import pymupdf

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIG, FONTES = RAIZ / "origem", RAIZ / "ferramentas" / "fontes"
ARQ = {"Barlow-Regular": "Barlow-Regular.ttf", "Barlow-SemiBold": "Barlow-SemiBold.ttf", "Barlow-Italic": "Barlow-Italic.ttf",
       "BarlowCondensed-ExtraBol": "BarlowCondensed-ExtraBold.ttf", "BarlowCondensed-ExtraBold": "BarlowCondensed-ExtraBold.ttf",
       "OpenSans": "OpenSans-Regular.ttf"}
FONTE = {k: pymupdf.Font(fontfile=str(FONTES / v)) for k, v in ARQ.items()}

JOIA = [
    (1, "A festa da quadra", "O craque que vem aí"),
    (1, "Ele entra com a pose", "Aprendeu a pausa olhando o pai. Entra com pose de craque e sonha jogar como ele."),
    (3, "Sobrancelhas escuras que sobem", "Sobrancelhas escuras que sobem perto do centro, olhos castanhos e franja curta platinada. A cabeça e o corpo têm proporções próximas às fotos. As bochechas sobem quando ele comemora."),
    (4, "Quando o grito sai cedo", "De olho no pai"),
    (4, "Quer inventar uma comemoração", "Quer ser um grande jogador. No dia em que chamarem o Vovô de “o pai do Joia”, ele vai saber que chegou lá."),
    (4, "Fazer um giro que mereça", "Acertar na quadra o lance que viu o pai fazer e ouvir dele: “faz de novo”. A primeira tentação é pular a pausa e sair correndo."),
    (4, "Na ficção, teme que", "Na ficção, teme ficar sendo só “o filho do Vovô”, sem um lance que seja dele. Por isso treina o giro quando a quadra esvazia."),
    (4, "Se adianta ao lance", "A pressa de ser craque. Pula a pausa que o pai tanto treina, e a comemoração às vezes chega antes da bola."),
    (4, "Lê a energia da quadra", "Observa tudo o que o pai faz e aprende rápido: sabe onde a sola para e onde o ombro cai. Torce pelos outros: chama Prancheta para o jogo e aplaude a defesa de Val."),
    (4, "No começo, ele quer aplauso", "No começo, ele copia o pai gesto por gesto. No fim, descobre a própria saída, o giro, e é o pai quem pede para ver de novo. A pose de craque continua a mesma."),
    (5, "A passada, a narração", "A passada, a pose de craque e o sinal com a mão são recursos de cena. O rosto em repouso dá espaço para que o entusiasmo apareça só quando acontece alguma coisa."),
    (5, "Bryan inspira o filho de Anselmo", "Bryan inspira o filho de Anselmo na Tropinha. Em cena, Joia copia a pausa do pai, e o pai tenta imitar a passada do filho. Um ri do outro. Depois, os dois treinam o giro até acertar."),
    (5, "A mãe pede que ele conte", "A mãe marca o filho como marca o marido, sem facilitar. Ele tenta a pausa do pai e ela lê na hora. Na segunda, arrisca o próprio giro."),
    (5, "Duda inventa, Joia chama", "Duda inventa e Joia quer aprender: o nome do lance fica com ela. Quando Val espalma o chute, ele baixa os braços, aplaude e pede outra bola."),
    (5, "Na entrada, alonga a vogal", "Em quadra fala pouco, como o pai: primeiro o toque, depois a frase. Quando acerta, a voz sobe. Quando o pai explica um lance, fica quieto e olha o pé."),
    (5, "“Pai, vê se pega a passada.”", "“Pai, vê se pega a passada.” • “Prancheta, você vem comigo.” • “Um dia eu faço igual. Depois eu faço melhor.” A última é dita olhando para o pai."),
    (12, "O narrador muda a direção", "Ele vira o tronco para quem fez o lance, seja o pai, seja a goleira. Ao chamar o colega para jogar, baixa a voz e aproxima a mão."),
    (12, "Entrada anunciada", "Entrada de craque"),
    (12, "Voz de locutor", "Chamando o pai"),
    (12, "Dedicando o gol", "Dedicando o gol ao pai"),
    (12, "Anunciando a defesa", "Reconhecendo a defesa"),
    (13, "O primeiro plano apresenta", "O primeiro plano apresenta Joia como jogador. O último mostra com quem ele aprende."),
    (13, "Ele termina de amarrar a chuteira", "Ele termina de amarrar a chuteira e dá a passada, de olho no pai. Vovô imita o último passo. Joia responde com um sorriso pequeno."),
    (13, "04   O anúncio", "04   De novo"),
    (13, "Ele gira para a goleira", "Ele abre os braços para a goleira e reconhece a defesa. Val devolve a bola. O pai só diz “de novo”. Dessa vez, Joia faz a pausa antes de bater."),
]
ELENCO = [
    (2, "A festa da quadra", "O craque que vem aí"),
    (5, "A festa da quadra", "O craque que vem aí"),
    (5, "Bryan inspira o Joia", "Bryan inspira o Joia, filho de Nanda e do Vovô. Ele cresceu vendo o pai segurar o lance e quer ser um grande jogador como ele. Entra com passada de craque e repete o gesto do pai até sair do jeito dele."),
    (5, "Quer que a jogada ganhe", "Quer acertar o lance que viu o pai fazer e ouvir dele “faz de novo”. A pressa de ser craque faz a comemoração chegar antes da bola. Sua melhor qualidade: observa, aprende rápido e aplaude quem jogou melhor."),
    (5, "Ele enche o peito", "Ele prende a bola sob a sola, igual ao pai, e conta a pausa em voz baixa. Sai pelo lado certo e comemora antes da hora: Val espalma. Do banco, o Vovô só diz “de novo”."),
    (5, "“Que gooo", "“Um dia eu faço igual. Depois eu faço melhor.”"),
    # Topete: por que um quero-quero é o mascote (pedido do Daniel em 25/11/2026)
    (9, "O quero-quero fez ninho", "O quero-quero é o bicho do futebol brasileiro: faz o ninho no chão do gramado e defende o pedaço. Fez o dele no campinho ao lado e virou o mascote da Tropinha: um passo dele desvia quem vem correndo."),
    (10, "Ele já tem o grito de gol", "Ele já comemorava o gol; ela fechou o canto. O filho do Vovô baixa os braços, aplaude a defesa e pede outra bola."),
    (10, "Ela desafia o filho a narrar", "Ela marca o filho como marca o marido, sem facilitar. Joia tenta a pausa do pai e ela lê na hora. Na segunda, ele arrisca o próprio giro."),
    (11, "Nanda rola a bola.", "Nanda rola a bola. Vovô prende com a sola. Duda avança para marcar. Do banco, Joia prende outra bola sob a sola, igual ao pai."),
    (11, "Vovô finge a saída", "Vovô finge a saída pelo banco e chuta no outro canto. Val já está lá. Joia, que já comemorava, baixa os braços e aplaude. Nanda pede a bola para a próxima."),
    (13, "Joia dá a passada de queixo", "Joia dá a passada de queixo erguido, com um pé à frente. Na segunda estampa, prende a bola sob a sola, como o pai. A dupla conta o caminho da pose de craque ao lance treinado."),
]
VOVO = [
    (5, "Fazer o marcador pisar", "Fazer o marcador pisar para o lado errado. Consegue esperar com a sola parada mesmo quando Joia já começou a comemorar o gol. Às vezes espera um toque a mais e perde a bola."),
]
NANDA = [
    (4, "O filho anuncia a mãe", "O filho tenta nela a pausa que aprendeu com o pai, e ela lê na hora. Na segunda, ele arrisca o próprio giro. Ela sorri antes de dar o bote."),
]
VAL = [
    (4, "Ele troca o grito de gol", "Ele já comemorava o gol quando ela fechou o canto. Joia baixa os braços e aplaude. Val dá uma reverência curta com as luvas e já se vira para a reposição."),
]
LIVROS = [("Book_individual_Joia", JOIA), ("O_Vovo_do_X1_e_sua_Tropinha_Book_do_Elenco_VFINAL", ELENCO), ("Book_individual_Vovo_do_X1", VOVO),
          ("Book_individual_Nanda", NANDA), ("Book_individual_Val", VAL)]


def linhas(pg):
    out = []
    for b in pg.get_text("dict")["blocks"]:
        if b["type"] != 0: continue
        for l in b["lines"]:
            t = "".join(s["text"] for s in l["spans"])
            if t.strip(): out.append({"t": t.strip(), "r": pymupdf.Rect(l["bbox"]), "s": l["spans"][0], "y": l["spans"][0]["origin"][1]})
    return out


def quebra(fonte, corpo, texto, larg):
    """Quebra por palavra na largura dada; devolve as linhas."""
    out, atual = [], ""
    for pal in texto.split(" "):
        tenta = (atual + " " + pal).strip()
        if fonte.text_length(tenta, fontsize=corpo) <= larg or not atual: atual = tenta
        else: out.append(atual); atual = pal
    if atual: out.append(atual)
    return out


def trocar(pg, ancora, novo):
    L = linhas(pg)
    i = next((k for k, l in enumerate(L) if l["t"].startswith(ancora)), None)
    if i is None: raise SystemExit(f"não achei: {ancora!r} na página {pg.number + 1}")
    s = L[i]["s"]; grupo = [L[i]]
    for l in L[i + 1:]:
        ant = grupo[-1]
        mesmo = l["s"]["font"] == s["font"] and abs(l["s"]["size"] - s["size"]) < .1 and abs(l["r"].x0 - L[i]["r"].x0) < 2
        if mesmo and 0 < l["y"] - ant["y"] < s["size"] * 1.75: grupo.append(l)
        else: break
    fonte, corpo = FONTE[s["font"]], s["size"]
    cor = tuple(((s["color"] >> d) & 255) / 255 for d in (16, 8, 0))
    entre = (grupo[1]["y"] - grupo[0]["y"]) if len(grupo) > 1 else corpo * 1.3
    x0, y0 = grupo[0]["r"].x0, grupo[0]["y"]
    larg = max(l["r"].width for l in grupo) + (10 if len(grupo) > 1 else 0)
    if len(grupo) == 1: larg = max(larg, fonte.text_length(novo, fontsize=corpo) + 1)
    novas = [novo] if len(grupo) == 1 else quebra(fonte, corpo, novo, larg)
    if len(novas) > len(grupo):                      # tenta de novo com um pouco mais de largura antes de reclamar
        novas = quebra(fonte, corpo, novo, larg + 14)
    sobra = len(novas) - len(grupo)
    for l in grupo: pg.add_redact_annot(l["r"] + (-1, -1, 1, 1), fill=False)
    return {"x": x0, "y": y0, "entre": entre, "fonte": s["font"], "corpo": corpo, "cor": cor, "linhas": novas, "sobra": sobra, "antes": len(grupo), "ancora": ancora}


def main():
    so = sys.argv[1:]                                # opcional: só os livros cujo nome contém um destes termos
    for nome, lista in LIVROS:
        if so and not any(t.lower() in nome.lower() for t in so): continue
        doc = pymupdf.open(ORIG / f"{nome}.pdf")
        for num in sorted({p for p, _, _ in lista}):
            pg = doc[num - 1]
            feitos = [trocar(pg, a, n) for p, a, n in lista if p == num]
            pg.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)
            for f in feitos:
                alias = "T" + f["fonte"].replace("-", "")
                pg.insert_font(fontname=alias, fontfile=str(FONTES / ARQ[f["fonte"]]))
                for k, t in enumerate(f["linhas"]):
                    pg.insert_text((f["x"], f["y"] + k * f["entre"]), t, fontname=alias, fontsize=f["corpo"], color=f["cor"])
                aviso = "" if f["sobra"] <= 0 else f"   <-- {f['sobra']} linha(s) A MAIS"
                print(f"{nome[:22]:22} p{num:02d} {f['antes']}→{len(f['linhas'])} linhas  {f['ancora'][:34]}{aviso}")
        try: doc.subset_fonts()
        except Exception as e: print("sem subconjunto de fontes:", e)
        saida = ORIG / f"{nome.replace('_VFINAL', '')}_v02.pdf"
        doc.save(saida, garbage=4, deflate=True)
        print("gravado", saida.name, saida.stat().st_size)


if __name__ == "__main__":
    main()
