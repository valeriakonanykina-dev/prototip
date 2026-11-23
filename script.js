// ===== МОБИЛЬНОЕ МЕНЮ =====
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// ===== СОХРАНЕНИЕ ПРОГРЕССА ЧЕК-ЛИСТОВ =====
document.addEventListener('DOMContentLoaded', () => {
    const checklists = document.querySelectorAll('.checklist');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (!progressFill || !progressText || checklists.length === 0) return;

    // Уникальный ключ для страницы (по заголовку)
    const pageTitle = document.querySelector('.procedure-header__title')?.textContent.trim() || 
                      window.location.pathname;
    const storageKey = 'health_checklist_' + pageTitle;

    // Загрузка сохранённых состояний
    let savedState = {};
    try {
        savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
        savedState = {};
    }

    const allCheckboxes = [];

    checklists.forEach(checklist => {
        const sectionId = checklist.dataset.checklist;
        const checkboxes = checklist.querySelectorAll('.checklist__input');
        
        checkboxes.forEach((cb, index) => {
            const id = sectionId + '_' + index;
            cb.dataset.id = id;
            allCheckboxes.push(cb);

            // Восстанавливаем состояние
            if (savedState[id]) {
                cb.checked = true;
            }

            // Обработчик изменения
            cb.addEventListener('change', () => {
                savedState[id] = cb.checked;
                localStorage.setItem(storageKey, JSON.stringify(savedState));
                updateProgress(allCheckboxes, progressFill, progressText);
            });
        });
    });

    // Обновляем прогресс при загрузке
    updateProgress(allCheckboxes, progressFill, progressText);
});

// ===== ОБНОВЛЕНИЕ ПРОГРЕСС-БАРА =====
function updateProgress(checkboxes, fillEl, textEl) {
    const total = checkboxes.length;
    const checked = checkboxes.filter(cb => cb.checked).length;
    const percent = total ? Math.round((checked / total) * 100) : 0;

    fillEl.style.width = percent + '%';
    textEl.textContent = percent + '% выполнено';

    if (percent === 100) {
        textEl.textContent = '✅ Всё готово! Вы молодец';
    } else if (percent === 0) {
        textEl.textContent = '0% выполнено';
    }
}

// ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ (для главной) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Закрываем мобильное меню
            if (nav) nav.classList.remove('open');
        }
    });
});