/**
 * Фильтрация портфолио
 * 
 * Этот модуль управляет фильтрацией изображений в галерее портфолио.
 * При клике на кнопку фильтра показываются только изображения с соответствующей категорией.
 */

(function() {
    'use strict';

    /**
     * Инициализация фильтрации портфолио
     * Добавляет обработчики событий на все кнопки фильтрации
     * При загрузке страницы автоматически применяет фильтр для первой кнопки
     */
    function initPortfolioFilter() {
        // Получаем все кнопки с атрибутом data-filter
        const filterButtons = document.querySelectorAll('[data-filter]');
        
        if (filterButtons.length === 0) {
            console.warn('Кнопки фильтрации не найдены');
            return;
        }

        // Добавляем обработчик клика на каждую кнопку
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Получаем выбранную категорию из атрибута data-filter
                const selectedCategory = this.getAttribute('data-filter');
                
                // Применяем фильтр
                applyFilter(selectedCategory);
                
                // Обновляем активную кнопку
                updateActiveButton(this);
            });
        });

        // При загрузке страницы применяем фильтр для первой кнопки (Малярные работы)
        // Находим первую кнопку с классом active или просто первую кнопку
        const firstButton = document.querySelector('[data-filter].active') || filterButtons[0];
        if (firstButton) {
            const defaultCategory = firstButton.getAttribute('data-filter');
            applyFilter(defaultCategory);
            updateActiveButton(firstButton);
        }
    }

    /**
     * Применяет фильтр к элементам галереи
     * Фильтрация работает по атрибуту data-category на изображениях
     * @param {string} category - Категория для фильтрации ('all' показывает все)
     */
    function applyFilter(category) {
        // Получаем все элементы портфолио
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (portfolioItems.length === 0) {
            console.warn('Элементы портфолио не найдены');
            return;
        }

        portfolioItems.forEach(item => {
            // Получаем изображение внутри элемента
            const img = item.querySelector('img');
            
            if (!img) {
                // Если изображения нет, скрываем элемент
                item.style.display = 'none';
                return;
            }

            // Получаем категорию изображения из атрибута data-category
            const imgCategory = img.getAttribute('data-category');
            
            // Маппинг категорий для совместимости с кнопками фильтрации
            // Кнопка "electricity_plumbing" должна показывать и "electric", и "plumbing"
            let shouldShow = false;
            
            if (category === 'all') {
                // Показываем все элементы
                shouldShow = true;
            } else if (category === 'electricity_plumbing') {
                // Для кнопки "electricity_plumbing" показываем и electric, и plumbing
                shouldShow = imgCategory === 'electric' || imgCategory === 'plumbing';
            } else {
                // Для остальных категорий проверяем точное совпадение
                // Поддерживаем все категории: painting, facade, flooring, tiling, construction, paving, concrete, roofing, rough_finish, electric, plumbing
                shouldShow = imgCategory === category;
            }
            
            // Показываем или скрываем элемент
            if (shouldShow) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Обновляет активную кнопку фильтрации
     * @param {HTMLElement} activeButton - Кнопка, которую нужно сделать активной
     */
    function updateActiveButton(activeButton) {
        // Убираем класс active со всех кнопок
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем класс active к выбранной кнопке
        activeButton.classList.add('active');
    }

    // Инициализация фильтрации при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioFilter);
    } else {
        // DOM уже загружен
        initPortfolioFilter();
    }
})();

