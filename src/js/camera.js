const telaCamera = document.getElementById("camera");
const abasModo = document.querySelectorAll(".mode-tab[data-mode]");
const labelChip = document.getElementById("chip-label");
const barraZoom = document.getElementById("zoom-bar");
const opcoesZoom = document.querySelectorAll(".zoom-option");
const botoesTopo = document.querySelectorAll(".ctrl-btn");
const overlayGrid = document.getElementById("grid-overlay");
const btnShutter = document.getElementById("btn-shutter");
const btnFlip = document.getElementById("btn-flip");
const btnGaleria = document.getElementById("btn-gallery");
const btnResumo = document.getElementById("btn-resumo");
const btnCopiar = document.getElementById("btn-copiar");
const contadorFotos = document.getElementById("contador-fotos");
const overlayFlash = document.getElementById("overlay-flash");
const videoCam = document.getElementById("video-cam");

const textosChip = {
  ia: "IA · Modo Noite detectado",
  estudo: "IA Auto · Texto detectado",
  noite: "Modo Noite ativo",
  foto: "Modo Foto",
  video: "Gravando vídeo"
};

let modoAtual = "ia";
let fotosTiradas = 0;
let stream = null;
let cameraFrontal = false;

/* ── Mode switching ──────────────────────────── */
function trocarModo(novoModo) {
  if (novoModo === modoAtual) return;

  abasModo.forEach((aba) => aba.classList.remove("mode-tab-ativo"));
  const abaAtiva = document.querySelector(`.mode-tab[data-mode="${novoModo}"]`);
  if (abaAtiva) abaAtiva.classList.add("mode-tab-ativo");

  telaCamera.classList.remove(`camera-${modoAtual}`);
  if (novoModo === "ia" || novoModo === "estudo") {
    telaCamera.classList.add(`camera-${novoModo}`);
  } else {
    telaCamera.classList.add("camera-ia");
  }

  modoAtual = novoModo;
  labelChip.textContent = textosChip[novoModo] || "IA Auto";
}

abasModo.forEach((aba) => {
  aba.addEventListener("click", () => {
    const modo = aba.dataset.mode;
    trocarModo(modo);
  });
});

/* ── Zoom ────────────────────────────────────── */
opcoesZoom.forEach((opcao) => {
  opcao.addEventListener("click", () => {
    opcoesZoom.forEach((o) => o.classList.remove("zoom-option-ativo"));
    opcao.classList.add("zoom-option-ativo");
  });
});

/* ── Top controls ────────────────────────────── */
botoesTopo.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("ctrl-btn-ativo");
    if (btn.dataset.ctrl === "grid") {
      overlayGrid.classList.toggle("hidden");
    }
    if (btn.dataset.ctrl === "settings") {
      window.location.href = "config.html";
    }
  });
});

/* ── Shutter ─────────────────────────────────── */
btnShutter.addEventListener("click", () => {
  overlayFlash.classList.remove("flash-ativo");
  void overlayFlash.offsetWidth;
  overlayFlash.classList.add("flash-ativo");

  fotosTiradas += 1;
  contadorFotos.textContent = `${fotosTiradas} ${fotosTiradas === 1 ? "foto" : "fotos"}`;

  setTimeout(() => {
    alert(`Foto capturada!\nModo: ${modoAtual.toUpperCase()} · Total: ${fotosTiradas}`);
  }, 280);
});

/* ── Flip Camera ─────────────────────────────── */
btnFlip.addEventListener("click", async () => {
  btnFlip.classList.add("flipping");
  setTimeout(() => btnFlip.classList.remove("flipping"), 300);
  cameraFrontal = !cameraFrontal;
  await iniciarCamera();
});

/* ── Gallery ─────────────────────────────────── */
btnGaleria.addEventListener("click", () => {
  if (fotosTiradas === 0) {
    alert("Você ainda não tirou nenhuma foto.");
    return;
  }
  alert(`Galeria · ${fotosTiradas} ${fotosTiradas === 1 ? "foto disponível" : "fotos disponíveis"}.`);
});

/* ── Estudo actions ──────────────────────────── */
btnResumo.addEventListener("click", () => {
  alert("Resumo gerado pela IA:\n\nO conteúdo capturado foi processado e está disponível no seu app de notas.");
});

btnCopiar.addEventListener("click", () => {
  alert("Texto copiado para a área de transferência!");
});

/* ── Camera stream ───────────────────────────── */
async function iniciarCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: cameraFrontal ? "user" : "environment" },
      audio: false
    });
    videoCam.srcObject = stream;
    telaCamera.classList.remove("no-camera");
  } catch (err) {
    telaCamera.classList.add("no-camera");
    console.warn("Câmera indisponível:", err);
  }
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  iniciarCamera();
} else {
  telaCamera.classList.add("no-camera");
}
