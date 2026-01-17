/* site/loader.js */

// --- 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function setupNavigation() {
    const navBtn = document.getElementById('nav-action-btn');
    if (!navBtn) return;

    const path = window.location.pathname;
    const isHome = path.endsWith('index.html') || path.endsWith('/') || path.length < 2;

    navBtn.style.display = 'flex';
    navBtn.style.alignItems = 'center';
    navBtn.style.justifyContent = 'center';
    navBtn.style.position = 'relative';
    navBtn.style.overflow = 'hidden';

    const dBottom = "20px";
    const dRight = "24px";
    const mBottom = "10px";
    const mRight = "15px";

    const adaptiveStyle = `
        <style>
            .nav-arrow {
                position: absolute;
                right: ${dRight};
                bottom: ${dBottom};
                font-size: 1.2rem;
                line-height: 1;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            @media (max-width: 768px) {
                .nav-arrow {
                    right: ${mRight} !important;
                    bottom: ${mBottom} !important;
                    font-size: 1rem !important;
                }
            }
            #nav-action-btn:hover .arrow-back-move {
                transform: rotate(180deg) translateX(8px) !important;
            }
        </style>
    `;

    if (isHome) {
        navBtn.setAttribute('href', 'contacts.html');
        navBtn.innerHTML = `
            ${adaptiveStyle}
            <span style="display: flex; align-items: center; gap: 10px;">
                <img src="site/img/contact.png" class="btn-icon-img" alt="Contact">
                <span style="font-weight: 500;">Связаться</span>
            </span>
            <div class="arrow-icon nav-arrow">➔</div>
        `;
    } else {
        navBtn.setAttribute('href', 'index.html');
        navBtn.innerHTML = `
            ${adaptiveStyle}
            <span style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">🏠</span>
                <span style="font-weight: 500;">Домой</span>
            </span>
            <div class="arrow-icon nav-arrow arrow-back-move" 
                 style="transform: rotate(180deg); display: block;">
                 ➔
            </div>
        `;
    }
}

function initSpotlight() {
    document.querySelectorAll('.card').forEach(card => {
        const newCard = card.cloneNode(true);
        if(card.parentNode) {
            card.parentNode.replaceChild(newCard, card);
        }

        newCard.addEventListener('mousemove', e => {
            const rect = newCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            newCard.style.setProperty('--mouse-x', `${x}px`);
            newCard.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}


// --- 2. ГЛАВНАЯ ФУНКЦИЯ ЗАГРУЗКИ ---

async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return; // Если контейнера нет, просто выходим

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        element.innerHTML = html;

        if (elementId === 'menu-container') {
            setupNavigation();
        }

    } catch (error) {
        console.error(`Ошибка загрузки компонента ${filePath}:`, error);
    }
}

// --- 3. ЗАГРУЗЧИКИ ОТДЕЛЬНЫХ БЛОКОВ ---

// ВАЖНО: Проверьте, где лежат ваши файлы!
// Если вы перенесли их в components, оставьте пути как ниже.
// Если они все еще в папке site, поменяйте 'components/' на 'site/'

async function loadHeader() { await loadComponent('header-container', 'components/header.html'); }
async function loadMenu(activePage) { await loadComponent('menu-container', 'components/menu.html'); }
async function loadServices() { await loadComponent('services-container', 'components/services.html'); }
async function loadFooter() { await loadComponent('footer-container', 'components/footer.html'); } // <--- БЫЛО site/footer.html


// --- 4. ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ---

async function initPage(activePage) {
    await Promise.all([
        loadHeader(),
        loadMenu(activePage),
        loadServices(),
        loadFooter()
    ]);

    initSpotlight();
}