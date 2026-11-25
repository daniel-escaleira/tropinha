# O Vovô do X1 e sua Tropinha — site de apresentação

Site estático que apresenta os sete personagens ao Anselmo como uma jornada em rolagem, em três passos e sem jogo:

1. **Conhecer os sete.** Cada personagem tem uma página com a mesma estrutura: imagem, papel, uma fala, o que faz na quadra, quatro pontos (o que quer, qualidade, defeito, o que esperar), os seis rostos, as 36 poses e o texto completo.
2. **Ver o lance de cada um.** Um replay em seis quadros, com as poses do próprio book. Botão "Ver o lance" ou toque num quadro. Não há acerto nem erro.
3. **Assistir ao filme.** No fim, o Filme 01 ("O anúncio da Tropinha", o vídeo que vai para o Instagram). Conforme a pessoa passa pelas páginas, o rosto de cada um acende na barra e a figurinha aparece ao lado do filme. O filme nunca fica trancado.

Depois vêm "Juntos", a revista com os oito books (com tela cheia) e "Sua vez", que monta a leitura do Anselmo numa mensagem de WhatsApp. A música tem três estilos (samba, funk e rap) e botão de pausa, na capa e na barra.

Criação e direção: Effective Bussiness Consulting. Edição para aprovação.

Esta é a terceira versão do site. As anteriores ficam em `versoes/`, fora do repositório.

## Ver na máquina

```
node ferramentas/servir.mjs
```

Abre em http://127.0.0.1:4173.

## O que é o quê

| Pasta | Conteúdo |
|---|---|
| `index.html`, `css/album.css`, `js/album.js` | O site. Sem etapa de montagem |
| `data/album.js` | O texto curto de cada página (papel, fala, "na quadra", o lance e os seus seis quadros), a lista de vídeos e as trilhas. **Para pôr o vídeo de outro personagem, acrescente uma linha em `VIDEOS`** |
| `data/personagens.js` | As fichas completas e os encontros de "Juntos". **Corrija aqui o texto longo** |
| `data/poses.js`, `data/revista.js` | Gerados por `ferramentas/extrair.py`: nomes das poses e páginas da revista |
| `assets/p/<id>/` | 36 poses, 6 expressões e a capa de cada personagem, tiradas dos books |
| `assets/revista/` | As 110 páginas dos oito books |
| `assets/quadra.webp` | Arte de capa do Book do Elenco, usada na capa do site |
| `assets/filme-01.mp4` | Filme 01, versão 08 leve |
| `assets/audio/` | Três trilhas de 1 min 15 s em laço (`trilha-samba`, `trilha-funk`, `trilha-rap`) e o som de virar página. Geradas no ElevenLabs em 25/11/2026 |
| `vendor/page-flip.browser.js` | Biblioteca de virar página (StPageFlip 2.0.7, MIT) |
| `ferramentas/reescrever_joia.py` | Reescreve nos PDFs os trechos sobre o Joia e grava versões `_v02` |
| `origem/` | Os PDFs dos books e os áudios originais. Fora do repositório público |

## O Joia

O Joia é o filho que se espelha no pai e quer ser um grande jogador: "O craque que vem aí". Esse texto está na página dele, no book individual, no Book do Elenco e numa frase do book do Vovô. Os PDFs com esse texto são `origem/*_v02.pdf`, gerados por `ferramentas/reescrever_joia.py`; os PDFs anteriores não são alterados. Duas frases nos books da Nanda e da Val ainda trazem a caracterização antiga: esses dois usam a fonte Open Sans, que é preciso ter na máquina para refazê-las.

## Refazer as imagens depois de trocar um book

Ponha o PDF novo em `origem/` com o nome que está em `LIVROS`, dentro de `ferramentas/extrair.py`, e rode:

```
uv run --no-project --with pymupdf --with pillow python ferramentas/extrair.py
```

## Regras do universo que o site segue

- A grafia é pega *la vision*; só o Vovô chama, no replay dele.
- Quem inventa a jogada mostra como fez e escolhe o nome.
- Nos personagens inspirados em gente real, sonhos, medos e falas são de ficção.
- Os bonecos têm fundo branco: aparecem sempre sobre palco claro, com mistura por multiplicação.
