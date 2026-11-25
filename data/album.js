/* O que aparece primeiro em cada página: o papel, a fala, o que faz na quadra, o jargão (caixa colorida) e o lance (replay em quadros).
   No jargão, o trecho entre asteriscos sai em itálico: pega *la vision*.
   O texto completo de cada ficha continua em data/personagens.js.
   Para pôr o vídeo de um personagem no site, acrescente uma linha em VIDEOS com o id dele em "de". */
window.ALBUM = {
  vovo: {
    papel: "O protagonista",
    fala: "Ué. Eu marquei o quê, então?",
    jargao: { frase: "pega *la vision*",
      porque: "É como ele chama o replay. Quando o lance tem um detalhe que enganou o marcador, ele para tudo e manda olhar de novo. Fala em espanhol: “vision”, nunca “visão”.",
      quando: "Só ele diz, e no máximo uma vez por história. Se a jogada foi de outra pessoa, ele chama o replay e quem fez explica." },
    quadra: "Segura a bola sob a sola, espera o marcador se mexer e sai pelo outro lado.",
    lance: { nome: "A balançada", texto: "Ele para a bola com a sola e espera. Quando o marcador se mexe, balança o corpo, sai pelo outro lado e bate.", quadros: [19, 20, 21, 22, 23, 24] }
  },
  nanda: {
    papel: "A desafiante",
    fala: "Eu ia dizer esquerda. Ainda bem que eu calei.",
    jargao: { frase: "Então vem.",
      porque: "É a resposta dela para quem fala do alambrado “essa eu fazia”. Em duas palavras, a conversa vira X1. Soa como convite e é desafio.",
      quando: "Antes do duelo, com a mão aberta pedindo a bola." },
    quadra: "Lê o drible pelo ombro de quem está com a bola, e chama para o X1.",
    lance: { nome: "O bote", texto: "Do alambrado ela já leu o drible. Aceita o desafio, espera o ombro cair, dá o bote e fica com a bola.", quadros: [14, 17, 18, 26, 19, 21] }
  },
  joia: {
    papel: "O filho que se espelha no pai",
    fala: "Um dia eu faço igual. Depois eu faço melhor.",
    jargao: { frase: "Um, dois… fui!",
      porque: "O pai segura a bola e espera em silêncio. O Joia ainda não tem essa paciência, então conta a pausa em voz baixa para não sair antes da hora. Quando pula o “dois”, perde a bola. No dia em que não precisar mais contar, virou craque.",
      quando: "Com a bola sob a sola, igual ao pai, antes de sair para o giro. É uma contagem que a tropa pode fazer junto." },
    quadra: "Copia a pausa e a sola do pai, treina o próprio giro e quer ser um grande jogador.",
    lance: { nome: "O giro", texto: "Começa como o pai, com a bola sob a sola. Depois faz o que já é dele: recebe, protege, gira e bate.", quadros: [19, 20, 21, 22, 23, 24] }
  },
  duda: {
    papel: "A inventora de lance",
    fala: "Olha meu pé aqui. Agora olha de novo.",
    jargao: { frase: "Fui eu que dei o nome.",
      porque: "Na Tropinha, quem inventa a jogada escolhe o nome. O medo dela é que contem a história como se só tivesse repetido o lance de um adulto. O jargão é a assinatura de autora.",
      quando: "Depois da Volta Curta, quando alguém pergunta que drible foi aquele." },
    quadra: "Marca o Vovô todo dia e inventou um drible que é só dela: a Volta Curta.",
    lance: { nome: "A Volta Curta", texto: "Planta o pé, ameaça disparar, recolhe a bola meia passada e entra por dentro. Depois dá nome ao que inventou.", quadros: [18, 19, 20, 21, 22, 33] }
  },
  prancheta: {
    papel: "O observador",
    fala: "Deixa essa seta aberta. Agora é a minha vez.",
    jargao: { frase: "Qual pé ficou?",
      porque: "É a pergunta que explica qualquer drible: o pé que fica no chão mostra para onde o corpo vai. Ele repara no que a arquibancada perde, e a pergunta põe todo mundo olhando para o lugar certo.",
      quando: "Com o lápis parado no meio da seta, logo depois de um “espera”." },
    quadra: "Desenha cada lance com uma seta e descobre qual pé ficou no chão.",
    lance: { nome: "A seta", texto: "Chega da escola, puxa a prancheta e põe o lance numa seta. Para o traço quando a jogada muda, e mostra a folha.", quadros: [13, 14, 15, 17, 18, 20] }
  },
  val: {
    papel: "A goleira",
    fala: "Foi o sol. Tá, foi seu pé. Outra?",
    jargao: { frase: "Vai querer esse canto?",
      porque: "Ela deixa um canto do gol à vista de propósito, para ver se o chute vem. A pergunta é armadilha e convite ao mesmo tempo, e vale igual para qualquer jogador.",
      quando: "Antes do chute, oferecendo o canto. Depois da defesa, com a bola já segura, vira ironia." },
    quadra: "Fecha o gol: lê o chute pelo pé de apoio antes de a bola sair.",
    lance: { nome: "A defesa", texto: "Entra na base, lê o pé de apoio de quem chuta, dá o passo e espalma. Depois repõe rasteiro e oferece o canto de novo.", quadros: [16, 17, 18, 22, 23, 24] }
  },
  topete: {
    papel: "O mascote",
    fala: "Um passo à frente. Um canto curto. O campinho inteiro entende.",
    jargao: { frase: "Quero-quero!",
      porque: "Ele não fala: o canto é o jargão. É o aviso de que ali tem ninho, e é o som que dá nome à ave. Quem ouve já sabe que precisa dar a volta.",
      quando: "Quando um sapato chega perto demais do capim." },
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
