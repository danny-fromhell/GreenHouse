export function renderHome() {
  const app = document.querySelector("#app");

  if (!app) return;

  app.innerHTML = `
    <section class="hero">
      <div class="hero-card">
        <h1>Green House</h1>
        <p>Build your Green House</p>
        <a href="plants.html" class="btn-primary">Explorar plantas</a>
      </div>
    </section>

    <section class="info-section">
      <article class="info-card">
        <div class="info-icon">
          <i class="fas fa-users"></i>
        </div>
        <h2>¿Quiénes somos?</h2>
        <p>
          Green House es una plataforma digital para consultar características,
          cuidados y recomendaciones sobre plantas de interior y exterior.
        </p>
      </article>

      <article class="info-card">
        <div class="info-icon">
          <i class="fas fa-bullseye"></i>
        </div>
        <h2>Misión</h2>
        <p>
          Facilitar el cuidado de plantas mediante información clara, visual
          y accesible para todo tipo de usuarios.
        </p>
      </article>

      <article class="info-card">
        <div class="info-icon">
          <i class="fas fa-eye"></i>
        </div>
        <h2>Visión</h2>
        <p>
          Convertirnos en una guía digital confiable para personas interesadas
          en crear espacios verdes en casa.
        </p>
      </article>
    </section>
  `;
}