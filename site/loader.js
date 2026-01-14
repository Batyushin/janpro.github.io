// site/loader.js

async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Ошибка загрузки ${filePath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

async function initPage(currentPage) {
    // 1. Загружаем Шапку и Футер
    await loadComponent('header-container', 'components/header.html');
    await loadComponent('footer-container', 'components/footer.html');

    // 2. Загружаем Меню и настраиваем 4-ю кнопку
    await loadComponent('menu-container', 'components/menu.html');
    setupMenuButton(currentPage);

    // 3. Запускаем "Эффект прожектора" (потому что элементы появились только сейчас)
    initSpotlight();
}

// Настройка кнопки меню (Связаться vs Домой)
function setupMenuButton(page) {
    const btn = document.getElementById('nav-action-btn');
    if (!btn) return;

    if (page === 'home') {
        // Мы на главной -> Кнопка "Связаться"
        btn.setAttribute('href', 'contacts.html');
        btn.innerHTML = `<span><img src="site/img/contact.png" class="btn-icon-img" alt="Contact">Связаться</span>`;
        // Если хотите выделить её цветом, как в прошлом варианте:
        // btn.style.border = "none";
    } else if (page === 'contacts') {
        // Мы в контактах -> Кнопка "Домой"
        btn.setAttribute('href', 'index.html');
        btn.style.border = "1px solid rgba(229, 57, 53, 0.5)";
        btn.innerHTML = `
            <span style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="font-size: 1.5rem; color: #e53935;">←</span> Домой
            </span>`;
    }
}

// Эффект прожектора
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