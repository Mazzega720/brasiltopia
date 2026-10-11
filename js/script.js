const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.nav-link a:not(.btn-principal)');
const secoes = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    let secaoAtual = '';
    secoes.forEach((secao) =>{
        const topoSecao = secao.offsetTop - 120;
        const alturaSecao = secao.clientHeight;
        if(window.scrollY >= topoSecao && window.scrollY < topoSecao + alturaSecao) {
            secaoAtual = secao.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('ativo');
        if (link.getAttribute('href') === `#${secaoAtual}`) {
            link.classList.add('ativo');
        }
    });
});

const elementosParaRevelar = document.querySelectorAll( 'section, .recursos-item, .galeria-item, .guia-card, .novidade-card, .baixar-tabela-card');

elementosParaRevelar.forEach((elemento) => {
    elemento.classList.add('revelar');
});

const observadorRevelacao = new IntersectionObserver((entradas, observador) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, {
    threshold: 0.15
});

elementosParaRevelar.forEach((elemento) => {
    observadorRevelacao.observe(elemento);
});

const cards3D = document.querySelectorAll('.guia-card, .novidade-card, .recurso-placeholder');

cards3D.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform =  `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        card.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.4)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = '';
    });
});

const gridNovidades = document.querySelector('.novidades-grid');
const REPO = 'Mazzega720/irineu-mod';
async function carregarChangelogGitHub() {
  if (!gridNovidades) return;
  try {
    const resposta = await fetch(`https://api.github.com/repos/${REPO}/releases`);
    
    if (!resposta.ok) {
      throw new Error('Não foi possível obter os releases do GitHub.');
    }
    const releases = await resposta.json();

    if (!releases || releases.length === 0) {
      gridNovidades.innerHTML = `
        <div class="novidade-card" style="grid-column: 1 / -1; text-align: center;">
          <div class="novidade-meta">EM BREVE</div>
          <h3>Nenhum release publicado ainda</h3>
          <p>Fique atento! As notas de atualização aparecerão aqui automaticamente quando o primeiro release for publicado no GitHub.</p>
        </div>
      `;
      return;
    }
    gridNovidades.innerHTML = '';
    const ultimosReleases = releases.slice(0, 2);

    ultimosReleases.forEach((release) => {
      const dataFormatada = new Date(release.published_at).toLocaleDateString('pt-BR');
      const versao = release.tag_name || 'v1.0.0';
      const titulo = release.name || 'Atualização';
      
      
      let conteudoHtml = 'Sem notas de atualização.';
      if (release.body) {
        conteudoHtml = typeof marked !== 'undefined' ? marked.parse(release.body) : release.body;
      }

      const card = document.createElement('div');
      card.className = 'novidade-card';
      card.innerHTML = `
        <div class="novidade-meta">${versao} &bull; ${dataFormatada}</div>
        <h3>${titulo}</h3>
        <div class="novidade-corpo">
          ${conteudoHtml}
        </div>
        <button class="btn-mostrar-mais">Mostrar mais &darr;</button>
      `;

      
      const btnMostrar = card.querySelector('.btn-mostrar-mais');
      const corpo = card.querySelector('.novidade-corpo');

      btnMostrar.addEventListener('click', () => {
        const estaExpandido = corpo.classList.toggle('expandido');
        btnMostrar.innerHTML = estaExpandido ? 'Mostrar menos &uarr;' : 'Mostrar mais &darr;';
      });

      gridNovidades.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao buscar novidades do GitHub:', erro);
  }
}

carregarChangelogGitHub();