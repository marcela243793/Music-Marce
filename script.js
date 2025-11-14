// LISTA DE VIDEOS ACTUALIZADA
const videos = [
  { id: "pdHfmklCxbE", title: "Beele - Quédate" },

  // Reemplazo de Eminem por Anuel
  { id: "9OQBDAGhNqo", title: "Anuel AA - Sola (Remix)" },
  { id: "dJpZ7bBDn0M", title: "Anuel AA - Keii" },

  { id: "FaQiQ3zuzPg", title: "TINI - Pa" },
  { id: "IjODC5sTaWU", title: "Keyvin Ce - El Pecado" },
  { id: "IvvdNxA1fBU", title: "Milo J - M.A.I" },

  { id: "eGTeR5gDBis", title: "Extra" },
  { id: "jRB_gMnF2us", title: "Canserbero - Pensando en Ti" },
  { id: "1uK_XAH2nj0", title: "Extra 2" },
  { id: "TO8Wkvq3z8E", title: "Extra 3" },
  { id: "SSNSRcpuchw", title: "Extra 4" }
];

// CARGAR LISTA
const songList = document.getElementById("songList");
const mainVideo = document.getElementById("mainVideo");
const mainTitle = document.getElementById("mainTitle");

videos.forEach(video => {
  const item = document.createElement("div");
  item.classList.add("song-item");
  item.textContent = video.title;

  item.addEventListener("click", () => {
    mainVideo.src = `https://www.youtube.com/embed/${video.id}`;
    mainTitle.textContent = video.title;
  });

  songList.appendChild(item);
});
