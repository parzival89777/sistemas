document.addEventListener("DOMContentLoaded", () => {

  const animateBlocks = () => {
    const blocks = document.querySelectorAll("section, article, .md-typeset > *");
    blocks.forEach((el, i) => {
      setTimeout(() => el.classList.add("active"), i * 100);
    });
  };

  // Animar al cargar la página
  animateBlocks();

  // Animación al cambiar de página (navigation.instant)
  document.addEventListener("navigation.end", () => {
    // Reinicia animación
    const blocks = document.querySelectorAll("section, article, .md-typeset > *");
    blocks.forEach(el => el.classList.remove("active"));
    // Re-animar bloques
    setTimeout(animateBlocks, 50);
  });

  // ============================================
  // 🌙 Animación del toggle de modo oscuro
  const toggle = document.querySelector(".md-toggle__button");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    toggle.classList.add("active-anim");
    setTimeout(() => toggle.classList.remove("active-anim"), 600);
  });

});
