/* -------------------------
  Lista de videos (usa los links que enviaste)
  Cada objeto: { id: "YouTubeID", title: "Título a mostrar" }
  Si quieres cambiar títulos, edita aquí.
--------------------------*/
const videos = [
  { id: "pdHfmklCxbE", title: "Beele - Quédate" } ,
  { id: "FaQiQ3zuzPg", title: "TINI - Pa" },
  { id: "IjODC5sTaWU", title: "Keyvin Ce - El Pecado" },
  { id: "IvvdNxA1fBU", title: "Milo J - M.A.I" } ,
  { id: "eGTeR5gDBis", title: "Enlace extra" },
  { id: "jRB_gMnF2us", title: "Canserbero - Pensando en Ti" },
  { id: "1uK_XAH2nj0", title: "Enlace extra 2" },
  { id: "TO8Wkvq3z8E", title: "Enlace extra 3" },
  { id: "SSNSRcpuchw", title: "Enlace extra 4" }
];

/* -------------------------
  Variables DOM
--------------------------*/
const playlistEl = document.getElementById("playlist");
const galleryGrid = document.getElementById("gallery-grid");
const galleryPreview = document.getElementById("gallery-preview");
const currentTitle = document.getElementById("current-title");
const btnOpenYT = document.getElementById("btn-open-youtube");
const errorMsg = document.getElementById("error-msg");

let player;           // YouTube player instance
let currentIndex = 0; // índice actual

/* -------------------------
  Construir UI: playlist y galería
--------------------------*/
function makeThumbUrl(id){ return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }

videos.forEach((v, i) => {
  // Playlist item
  const li = document.createElement("li");
  li.dataset.index = i;
  li.innerHTML = `
    <div class="thumb"><img src="${makeThumbUrl(v.id)}" alt="${v.title}"></div>
    <div class="meta">
      <strong>${v.title}</strong>
    </div>
  `;
  li.addEventListener("click", () => loadVideoAt(i));
  playlistEl.appendChild(li);

  // Gallery grid card
  const card = document.createElement("div");
  card.className = "video-card";
  card.innerHTML = `<img src="${makeThumbUrl(v.id)}" alt="${v.title}"><p>${v.title}</p>`;
  card.addEventListener("click", () => loadVideoAt(i));
  galleryGrid.appendChild(card);

  // small preview thumb
  const prevImg = document.createElement("img");
  prevImg.src = makeThumbUrl(v.id);
  prevImg.alt = v.title;
  prevImg.title = v.title;
  prevImg.addEventListener("click", () => loadVideoAt(i));
  galleryPreview.appendChild(prevImg);
});

/* -------------------------
  YouTube IFrame API: crear player
  Maneja errores con onError y muestra botón para abrir en YouTube
--------------------------*/
function onYouTubeIframeAPIReady(){
  player = new YT.Player("player", {
    height: "480",
    width: "100%",
    videoId: videos[0].id,
    playerVars: {
      controls: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function onPlayerReady(){
  updateUI(0);
  // Autoplay muted first (some browsers block autoplay with sound)
  // player.playVideo(); // no autoplay to avoid browser blocks
}

function onPlayerStateChange(event){
  // se podría manejar reproducción automática siguiente, etc.
  // Si el video terminó y quieres pasar al siguiente:
  if(event.data === YT.PlayerState.ENDED){
    const next = (currentIndex + 1) % videos.length;
    loadVideoAt(next);
  }
}

function onPlayerError(event){
  console.warn("YT Player Error code:", event.data);
  errorMsg.hidden = false;
  // Mostrar botón para abrir en YouTube
  btnOpenYT.hidden = false;
}

/* -------------------------
  Cargar video en player por índice
--------------------------*/
function loadVideoAt(index){
  if(index < 0 || index >= videos.length) return;
  currentIndex = index;
  const vid = videos[index];
  errorMsg.hidden = true;
  btnOpenYT.hidden = false;
  currentTitle.textContent = vid.title;

  if(player && typeof player.loadVideoById === "function"){
    try {
      player.loadVideoById(vid.id);
    } catch(e){
      console.error("Error cargando video en player:", e);
      errorMsg.hidden = false;
    }
  } else {
    // Si player aún no listo, asignar src directo (fallback)
    const container = document.getElementById("player");
    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${vid.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }

  // actualizar "activo" en playlist visualmente
  document.querySelectorAll("#playlist li").forEach(li => li.classList.remove("active"));
  const activeLi = document.querySelector(`#playlist li[data-index="${index}"]`);
  if(activeLi) activeLi.classList.add("active");

  // botón para abrir en Youtube apunta al video actual
  btnOpenYT.onclick = () => {
    window.open(`https://www.youtube.com/watch?v=${vid.id}`, "_blank");
  };
}

/* -------------------------
  Inicialización sencilla si la API no ha cargado en 2s, cargamos fallback iframe
--------------------------*/
let apiLoaded = false;
function waitForAPIthenLoad(){
  if(window.YT && window.YT.Player){
    apiLoaded = true;
    // onYouTubeIframeAPIReady será invocada por la API directamente
  } else {
    // si en 1500ms no carga la API (bloqueos), hacemos fallback
    setTimeout(() => {
      if(!apiLoaded){
        console.warn("YouTube API no cargó: usando fallback iframe inicial.");
        loadVideoAt(0);
      }
    }, 1500);
  }
}
waitForAPIthenLoad();

/* -------------------------
  Start: listeners y abrir primer video
--------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // activar apertura en YouTube por defecto oculto hasta que se cargue
  btnOpenYT.hidden = false;
  errorMsg.hidden = true;
  // si el API ya llamó onYouTubeIframeAPIReady, player se creará
  // sino fallback handled arriba
});
