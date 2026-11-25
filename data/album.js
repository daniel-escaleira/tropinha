/* O que aparece primeiro em cada página: o papel, a fala, o que faz na quadra e o lance (replay em quadros).
   O texto completo de cada ficha continua em data/personagens.js.
   Para pôr o vídeo de um personagem no site, acrescente uma linha em VIDEOS com o id dele em "de". */
window.ALBUM = {
  vovo: {
    papel: "O protagonista",
    fala: "Ué. Eu marquei o quê, então?",
    quadra: "Segura a bola sob a sola, espera o marcador se mexer e sai pelo outro lado.",
    lance: { nome: "A balançada", texto: "Ele para a bola com a sola e espera. Quando o marcador se mexe, balança o corpo, sai pelo outro lado e bate.", quadros: [19, 20, 21, 22, 23, 24] }
  },
  nanda: {
    papel: "A desafiante",
    fala: "Então vem. Agora quero ver de perto.",
    quadra: "Lê o drible pelo ombro de quem está com a bola, e chama para o X1.",
    lance: { nome: "O bote", texto: "Do alambrado ela já leu o drible. Aceita o desafio, espera o ombro cair, dá o bote e fica com a bola.", quadros: [14, 17, 18, 26, 19, 21] }
  },
  joia: {
    papel: "O filho que se espelha no pai",
    fala: "Um dia eu faço igual. Depois eu faço melhor.",
    quadra: "Copia a pausa e a sola do pai, treina o próprio giro e quer ser um grande jogador.",
    lance: { nome: "O giro", texto: "Começa como o pai, com a bola sob a sola. Depois faz o que já é dele: recebe, protege, gira e bate.", quadros: [19, 20, 21, 22, 23, 24] }
  },
  duda: {
    papel: "A inventora de lance",
    fala: "Volta Curta. Fui eu que dei o nome.",
    quadra: "Marca o Vovô todo dia e inventou um drible que é só dela: a Volta Curta.",
    lance: { nome: "A Volta Curta", texto: "Planta o pé, ameaça disparar, recolhe a bola meia passada e entra por dentro. Depois dá nome ao que inventou.", quadros: [18, 19, 20, 21, 22, 33] }
  },
  prancheta: {
    papel: "O observador",
    fala: "Espera. Qual foi o pé que ficou?",
    quadra: "Desenha cada lance com uma seta e descobre qual pé ficou no chão.",
    lance: { nome: "A seta", texto: "Chega da escola, puxa a prancheta e põe o lance numa seta. Para o traço quando a jogada muda, e mostra a folha.", quadros: [13, 14, 15, 17, 18, 20] }
  },
  val: {
    papel: "A goleira",
    fala: "Vai querer esse canto de novo?",
    quadra: "Fecha o gol: lê o chute pelo pé de apoio antes de a bola sair.",
    lance: { nome: "A defesa", texto: "Entra na base, lê o pé de apoio de quem chuta, dá o passo e espalma. Depois repõe rasteiro e oferece o canto de novo.", quadros: [16, 17, 18, 22, 23, 24] }
  },
  topete: {
    papel: "O mascote",
    fala: "Um passo à frente. Um canto curto. O campinho inteiro entende.",
    quadra: "É um quero-quero. Protege o ninho no campinho: quem corre atrás da bola tem de dar a volta.",
    lance: { nome: "O aviso", texto: "No ninho, ele ergue a cabeça. Um passo curto, o peito estufado, as asas abertas. Quem vinha correndo dá a volta, e ele volta a sentar.", quadros: [28, 13, 16, 17, 22, 28] }
  }
};

/* Vídeos. O primeiro é o filme do fim da jornada. */
window.VIDEOS = [
  { de: "vovo", titulo: "O anúncio da Tropinha", linha: "Filme 01 · 1 minuto", src: "assets/filme-01.mp4", capa: "assets/filme-01-capa.jpg" }
];

/* Trilhas: três estilos. O visitante escolhe e pode pausar. */
window.TRILHAS = [
  { id: "samba", nome: "Samba", arq: "assets/audio/trilha-samba.mp3" },
  { id: "funk", nome: "Funk", arq: "assets/audio/trilha-funk.mp3" },
  { id: "rap", nome: "Rap", arq: "assets/audio/trilha-rap.mp3" }
];
