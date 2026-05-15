const grade = document.getElementById("grade-modos");
const btnEditar = document.getElementById("btn-editar");
const abasInferiores = document.querySelectorAll("#bottom-tabs .mode-tab[data-mode]");

let editando = false;

function ativarItem(item) {
  item.dataset.active = "true";
  const badge = item.querySelector(".badge");
  badge.classList.remove("badge-adicionar");
  badge.classList.add("badge-remover");
  badge.textContent = "✕";
  badge.setAttribute("aria-label", "Remover");

  const divisor = grade.querySelector(".divisor-secao");
  if (divisor) {
    grade.insertBefore(item, divisor);
  }
}

function desativarItem(item) {
  item.dataset.active = "false";
  const badge = item.querySelector(".badge");
  badge.classList.remove("badge-remover");
  badge.classList.add("badge-adicionar");
  badge.textContent = "+";
  badge.setAttribute("aria-label", "Adicionar");

  grade.appendChild(item);
}

function criarModoCustom(nome) {
  const item = document.createElement("article");
  item.className = "item-modo item-custom";
  item.dataset.name = nome;
  item.dataset.active = "true";

  item.innerHTML = `
    <button class="badge badge-remover" aria-label="Remover">✕</button>
    <div class="icone-modo icone-ia">
      <span class="estrela-ia">✦</span>
    </div>
    <p class="label-modo label-azul">${nome}</p>
  `;

  const divisor = grade.querySelector(".divisor-secao");
  if (divisor) {
    grade.insertBefore(item, divisor);
  } else {
    grade.appendChild(item);
  }
  registrarBadge(item.querySelector(".badge"));
}

function registrarBadge(badge) {
  badge.addEventListener("click", (e) => {
    e.stopPropagation();
    const item = badge.closest(".item-modo");
    const nome = item.dataset.name;

    if (badge.classList.contains("badge-remover")) {
      const confirmar = confirm(`Remover o modo "${nome}" da câmera?`);
      if (!confirmar) return;

      if (item.classList.contains("item-custom") && (nome !== "IA" && nome !== "Estudo")) {
        item.remove();
        alert(`Modo "${nome}" excluído permanentemente.`);
      } else {
        desativarItem(item);
        alert(`Modo "${nome}" movido para Outros Modos.`);
      }
    } else {
      ativarItem(item);
      alert(`Modo "${nome}" adicionado à câmera.`);
    }
  });
}

document.querySelectorAll(".badge").forEach(registrarBadge);

btnEditar.addEventListener("click", () => {
  editando = !editando;

  if (editando) {
    btnEditar.textContent = "Concluído";
    const nome = prompt("Nome do novo modo customizado:");
    if (nome === null) {
      editando = false;
      btnEditar.textContent = "Editar";
      return;
    }
    const nomeTratado = nome.trim();
    if (nomeTratado.length < 2) {
      alert("Nome muito curto. O modo não foi criado.");
      editando = false;
      btnEditar.textContent = "Editar";
      return;
    }
    const jaExiste = Array.from(grade.querySelectorAll(".item-modo"))
      .some((item) => item.dataset.name.toLowerCase() === nomeTratado.toLowerCase());
    if (jaExiste) {
      alert(`Já existe um modo chamado "${nomeTratado}".`);
      editando = false;
      btnEditar.textContent = "Editar";
      return;
    }
    criarModoCustom(nomeTratado);
    alert(`Modo "${nomeTratado}" criado!`);
    editando = false;
    btnEditar.textContent = "Editar";
  }
});

abasInferiores.forEach((aba) => {
  aba.addEventListener("click", () => {
    abasInferiores.forEach((a) => a.classList.remove("mode-tab-ativo"));
    aba.classList.add("mode-tab-ativo");
  });
});
