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
        if (card.parentNode) {
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
        element.innerHTML = `
            <div class="card" style="padding:16px; text-align:center; align-items:center;">
                <p style="margin-bottom:10px; color:#c0c0c0;">
                    Не удалось загрузить блок страницы.
                </p>
                <button
                    type="button"
                    style="padding:10px 14px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.06); color:#fff; cursor:pointer;"
                    onclick="loadComponent('${elementId}','${filePath}')"
                >
                    Повторить
                </button>
            </div>
        `;
    }
}

// --- 3. ЗАГРУЗЧИКИ ОТДЕЛЬНЫХ БЛОКОВ ---

// ВАЖНО: Проверьте, где лежат ваши файлы!
// Если вы перенесли их в components, оставьте пути как ниже.
// Если они все еще в папке site, поменяйте 'components/' на 'site/'

async function loadHeader() {
    await loadComponent('header-container', 'components/header.html');
}

async function loadMenu(activePage) {
    await loadComponent('menu-container', 'components/menu.html');
}

async function loadServices() {
    await loadComponent('services-container', 'components/services.html');
}

async function loadFooter() {
    await loadComponent('footer-container', 'components/footer.html');
} // <--- БЫЛО site/footer.html




async function initPage(activePage) {
    await Promise.all([
        loadHeader(),
        loadMenu(activePage),
        loadServices(),
        loadFooter()
    ]);

    initSpotlight();
}

/*
// --- 5. ЭФФЕКТ "ЖАР ЗА СТЕКЛОМ"  ---
    function ignitePermanentFire() {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;

    // 1. Выбираем случайную карточку
    const targetCard = cards[Math.floor(Math.random() * cards.length)];

    // 2. Создаем контейнер очага
    const fireContainer = document.createElement('div');
    fireContainer.className = 'fireplace-container';

    // 3. Задаем случайную ширину очага от 100px до 250px (примерно 3-7 см)
    const fireWidth = 100 + Math.random() * 150;
    fireContainer.style.width = fireWidth + 'px';

    // 4. Гарантированно рандомная позиция от левого до правого края карточки.
    // clientWidth берем именно в момент выполнения, когда стили уже применены.
    const maxLeft = targetCard.clientWidth - fireWidth;

    // Защита от отрицательных значений на мобильных устройствах (если карточка узкая)
    const leftPos = maxLeft > 0 ? (Math.random() * maxLeft) : 0;

    fireContainer.style.left = leftPos + 'px';

    // Вставляем огонь на задний план карточки
    targetCard.insertBefore(fireContainer, targetCard.firstChild);

    // Палитра огня
    const fireColors = [
    'rgba(255, 200, 50, 0.8)',
    'rgba(255, 120, 0, 0.7)',
    'rgba(255, 50, 0, 0.5)',
    'rgba(180, 10, 0, 0.3)'
    ];

    function spawnParticle() {
    const particle = document.createElement('div');
    particle.className = 'fire-particle';

    const size = 30 + Math.random() * 40;
    const left = Math.random() * 100; // Позиция искры внутри ширины самого очага (%)
    const color = fireColors[Math.floor(Math.random() * fireColors.length)];
    const duration = 2000 + Math.random() * 2000;

    const sway1 = (Math.random() - 0.5) * 20 + 'px';
    const sway2 = (Math.random() - 0.5) * 40 + 'px';
    const sway3 = (Math.random() - 0.5) * 60 + 'px';

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = `calc(${left}% - ${size/2}px)`;
    particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 60%)`;

    particle.style.setProperty('--sway-1', sway1);
    particle.style.setProperty('--sway-2', sway2);
    particle.style.setProperty('--sway-3', sway3);

    particle.style.animation = `fireplace-burn ${duration}ms cubic-bezier(0.42, 0, 0.58, 1) forwards`;

    fireContainer.appendChild(particle);

    // Удаляем только саму отработавшую искру, чтобы не переполнять память браузера
    setTimeout(() => {
    if (particle.parentNode) particle.remove();
}, duration);
}

    // 5. Огонь горит бесконечно. Интервалы не очищаем.
    setInterval(() => {
    spawnParticle();
    // С вероятностью 40% генерируем дополнительную искру для плотности
    if (Math.random() > 0.6) spawnParticle();
}, 120);
}

    window.addEventListener('load', () => {
    // Запускаем через секунду после загрузки контента, чтобы все ширины посчитались корректно
    setTimeout(ignitePermanentFire, 1000);
});
*/