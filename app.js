//   Stack4U — Navegação entre páginas
//   app.js




const pageTitles = {
    feed: 'Feed da Comunidade',
    forum: 'Fórum de Dúvidas',
    codigo: 'Compartilhamento de Código',
    monitores: 'Monitores Disponíveis',
    ranking: 'Ranking Stack4U'
};

// Cache das páginas já carregadas
const pageCache = {};

async function navigateTo(pageId) {
    // Desativa todos os itens do menu
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Ativa o item do menu correto
    const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (navItem) navItem.classList.add('active');

    // Atualiza o título do topbar
    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = pageTitles[pageId] || '';

    // Se já carregou antes, só exibe do cache
    const content = document.getElementById('content');
    if (pageCache[pageId]) {
        content.innerHTML = pageCache[pageId];
        return;
    }

    // Mapeia o id da página pro nome do arquivo correto
    const fileMap = {
        feed: 'feed.html',
        forum: 'forum.html',
        codigo: 'codigo.html',
        monitores: 'monitores.html',
        ranking: 'hanking.html'
    };

    try {
        const response = await fetch(fileMap[pageId]);
        const html = await response.text();

        // Extrai só o conteúdo do <body> se o arquivo tiver estrutura HTML completa
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const pageContent = bodyMatch ? bodyMatch[1] : html;

        pageCache[pageId] = pageContent;
        content.innerHTML = pageContent;
    } catch (err) {
        content.innerHTML = `<p style="color:red">Erro ao carregar a página: ${pageId}</p>`;
        console.error(err);
    }
}

// Vincula cliques nos itens do menu
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
        navigateTo(item.dataset.page);
    });
});

// Abas do fórum — delegação no document para funcionar após navegação
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-tab')) {
        const allTabs = e.target.closest('.filter-tabs').querySelectorAll('.filter-tab');
        allTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
    }
});

// Carrega o feed ao iniciar
navigateTo('feed');