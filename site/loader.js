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
        // Проверка на главную страницу
        const isHome = path.endsWith('index.html') || path.endsWith('/') || path.length < 2;

        const navBtn = document.getElementById('nav-action-btn');
        if (!navBtn) return;

        // Базовые стили для центровки текста в кнопке
        navBtn.style.display = 'flex';
        navBtn.style.alignItems = 'center';
        navBtn.style.justifyContent = 'center';
        navBtn.style.position = 'relative';

        // Идеальные отступы для стрелки в углу
        const commonBottom = "20px";
        const commonRight = "24px";

        if (isHome) {
            // --- ГЛАВНАЯ СТРАНИЦА ---
            navBtn.setAttribute('href', 'contacts.html');
            navBtn.innerHTML = `
                <span style="display: flex; align-items: center; gap: 10px;">
                    <img src="site/img/contact.png" class="btn-icon-img" alt="Contact">
                    <span style="font-weight: 500;">Связаться</span>
                </span>
                <div class="arrow-icon" style="position: absolute; right: ${commonRight}; bottom: ${commonBottom}; font-size: 1.2rem; line-height: 1;">➔</div>
            `;
        } else {
            // --- ЛЮБАЯ ДРУГАЯ СТРАНИЦА ---
            navBtn.setAttribute('href', 'index.html');

            // CSS-стиль для движения развернутой стрелки ВЛЕВО при наведении
            navBtn.innerHTML = `
                <style>
                    #nav-action-btn:hover .arrow-back-move {
                        /* Сдвигаем по X, что при повороте 180 превращается в движение влево */
                        transform: rotate(180deg) translateX(8px) !important;
                    }
                </style>
                <span style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">🏠</span>
                    <span style="font-weight: 500;">Домой</span>
                </span>
                <div class="arrow-icon arrow-back-move" 
                     style="position: absolute; 
                            right: ${commonRight}; 
                            bottom: ${commonBottom}; 
                            font-size: 1.2rem; 
                            line-height: 1; 
                            transform: rotate(180deg); 
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                            display: block;">
                     ➔
                </div>
            `;
        }
    }

    // Запуск загрузки всех частей сайта
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