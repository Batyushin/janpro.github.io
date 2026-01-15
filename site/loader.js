document.addEventListener("DOMContentLoaded", function() {

    // --- ЗАГРУЗЧИК КОМПОНЕНТОВ (Fetch & Inject) ---
    function loadComponent(id, file) {
        const element = document.getElementById(id);
        if (element) {
            fetch(file)
                .then(response => {
                    if (!response.ok) throw new Error(`Не удалось загрузить ${file}`);
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;

                    // Если загрузили МЕНЮ -> настраиваем кнопку Связаться/Домой
                    if (id === 'menu-container') {
                        setupNavigation();
                    }

                    // Инициализируем эффект прожектора для всех загруженных карточек
                    initSpotlight();
                })
                .catch(err => console.error(err));
        }
    }

    // --- ЛОГИКА КНОПКИ (ГЛАВНАЯ vs ВНУТРЕННИЕ) ---
    function setupNavigation() {
        const path = window.location.pathname;
        // Проверка: главная ли это страница (учитываем разные варианты путей)
        const isHome = path.endsWith('index.html') || path.endsWith('/') || path.length < 2;

        const navBtn = document.getElementById('nav-action-btn');
        if (!navBtn) return;

        // Базовые стили для кнопки (центрирование контента)
        navBtn.style.display = 'flex';
        navBtn.style.alignItems = 'center';
        navBtn.style.justifyContent = 'center';
        navBtn.style.position = 'relative';
        navBtn.style.overflow = 'hidden';

        // Переменные для отступов стрелки
        const dBottom = "20px"; // Десктоп низ
        const dRight = "24px";  // Десктоп право
        const mBottom = "10px"; // Мобилка низ (опустили еще ниже)
        const mRight = "15px";  // Мобилка право

        // Адаптивные стили и анимация назад
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
                /* Сдвиг на мобильных устройствах, чтобы не накладывалось на текст */
                @media (max-width: 768px) {
                    .nav-arrow {
                        right: ${mRight} !important;
                        bottom: ${mBottom} !important;
                        font-size: 1rem !important;
                    }
                }
                /* Анимация для кнопки Домой (движение влево) */
                #nav-action-btn:hover .arrow-back-move {
                    transform: rotate(180deg) translateX(8px) !important;
                }
            </style>
        `;

        if (isHome) {
            // --- РЕЖИМ ГЛАВНОЙ СТРАНИЦЫ ---
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
            // --- РЕЖИМ ЛЮБОЙ ДРУГОЙ СТРАНИЦЫ ---
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

    // Загружаем основные части сайта
    loadComponent("header-container", "components/header.html");
    loadComponent("menu-container", "components/menu.html");
    loadComponent("footer-container", "components/footer.html");
});

// --- ЭФФЕКТ ПРОЖЕКТОРА (Spotlight) ---
function initSpotlight() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}