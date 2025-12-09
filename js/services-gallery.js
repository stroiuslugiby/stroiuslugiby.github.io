/**
 * services-gallery.js
 * 
 * Модуль для управления галереями изображений на страницах услуг.
 * Обеспечивает функционал lightbox для просмотра изображений в полноэкранном режиме.
 * 
 * Использование:
 * 1. Добавьте класс 'service-gallery-item' к элементам img внутри галереи
 * 2. Подключите этот файл к странице услуг
 * 3. Галерея автоматически инициализируется при загрузке страницы
 */

(function() {
    'use strict';

    /**
     * Инициализация галереи услуг
     * Создает модальное окно для lightbox и настраивает обработчики событий
     */
    function initServiceGallery() {
        // Создаем модальное окно для lightbox, если его еще нет
        if (!document.getElementById('serviceGalleryModal')) {
            createGalleryModal();
        }

        // Находим все изображения в галерее услуг
        const galleryItems = document.querySelectorAll('.service-gallery-item');
        
        if (galleryItems.length === 0) {
            console.warn('Галерея услуг: изображения с классом "service-gallery-item" не найдены');
            return;
        }

        // Добавляем обработчик клика для каждого изображения
        galleryItems.forEach((img, index) => {
            // Убеждаемся, что изображение кликабельно
            img.style.cursor = 'pointer';
            
            // Добавляем обработчик клика
            img.addEventListener('click', function() {
                openImageInLightbox(this.src, this.alt, index, galleryItems);
            });

            // Добавляем визуальную индикацию при наведении
            img.addEventListener('mouseenter', function() {
                this.style.opacity = '0.9';
            });

            img.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
            });
        });

        console.log(`Галерея услуг: инициализировано ${galleryItems.length} изображений`);
    }

    /**
     * Создает модальное окно Bootstrap для отображения изображений в lightbox
     */
    function createGalleryModal() {
        /**
         * Создает HTML структуру модального окна для галереи услуг
         * 
         * Использует класс modal-lg для десктопной версии (60% ширины экрана по умолчанию Bootstrap)
         * На мобильных устройствах размер модалки контролируется через CSS медиазапрос (95% ширины)
         * Изображения имеют класс w-100 для растягивания на 100% ширины контейнера с сохранением пропорций
         */
        const modalHTML = `
            <div class="modal fade" id="serviceGalleryModal" tabindex="-1" aria-labelledby="serviceGalleryModalLabel" aria-hidden="true">
                <!-- modal-lg для десктопа, на мобильных переопределяется через CSS -->
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content bg-dark">
                        <div class="modal-header border-0">
                            <h5 class="modal-title text-white" id="serviceGalleryModalLabel">Просмотр изображения</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                        </div>
                        <div class="modal-body p-0 text-center">
                            <!-- w-100: растягивает изображение на 100% ширины контейнера, сохраняя пропорции -->
                            <!-- object-fit: contain - сохраняет пропорции изображения при растягивании -->
                            <img id="serviceGalleryImage" src="" alt="" class="img-fluid w-100" style="max-height: 70vh; object-fit: contain;">
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <button type="button" class="btn btn-secondary" id="serviceGalleryPrev" aria-label="Предыдущее изображение">
                                <i class="bi bi-chevron-left"></i> Назад
                            </button>
                            <span class="text-white mx-3" id="serviceGalleryCounter">1 / 1</span>
                            <button type="button" class="btn btn-secondary" id="serviceGalleryNext" aria-label="Следующее изображение">
                                Вперед <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Открывает изображение в lightbox
     * @param {string} imageSrc - URL изображения
     * @param {string} imageAlt - Alt текст изображения
     * @param {number} currentIndex - Текущий индекс изображения в галерее
     * @param {NodeList} allImages - Все изображения в галерее
     */
    function openImageInLightbox(imageSrc, imageAlt, currentIndex, allImages) {
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('serviceGalleryModal'));
        const modalImage = document.getElementById('serviceGalleryImage');
        const counter = document.getElementById('serviceGalleryCounter');
        const prevBtn = document.getElementById('serviceGalleryPrev');
        const nextBtn = document.getElementById('serviceGalleryNext');

        // Устанавливаем текущее изображение
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        
        // Сохраняем текущий индекс в data-атрибуте модального окна
        const modalElement = document.getElementById('serviceGalleryModal');
        modalElement.setAttribute('data-current-index', currentIndex);
        modalElement.setAttribute('data-total-images', allImages.length);

        // Обновляем счетчик
        updateCounter(currentIndex + 1, allImages.length);

        // Настраиваем кнопки навигации
        setupNavigationButtons(currentIndex, allImages, prevBtn, nextBtn, modalImage, counter);

        // Обработка навигации с клавиатуры
        setupKeyboardNavigation(currentIndex, allImages, modalImage, counter);

        // Показываем модальное окно
        modal.show();
    }

    /**
     * Настраивает кнопки навигации (Назад/Вперед)
     * @param {number} currentIndex - Текущий индекс
     * @param {NodeList} allImages - Все изображения
     * @param {HTMLElement} prevBtn - Кнопка "Назад"
     * @param {HTMLElement} nextBtn - Кнопка "Вперед"
     * @param {HTMLElement} modalImage - Элемент изображения в модальном окне
     * @param {HTMLElement} counter - Элемент счетчика
     */
    function setupNavigationButtons(currentIndex, allImages, prevBtn, nextBtn, modalImage, counter) {
        // Очищаем предыдущие обработчики
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

        // Настройка кнопки "Назад"
        if (currentIndex > 0) {
            newPrevBtn.style.display = 'inline-block';
            newPrevBtn.addEventListener('click', function() {
                const prevIndex = currentIndex - 1;
                const prevImage = allImages[prevIndex];
                modalImage.src = prevImage.src;
                modalImage.alt = prevImage.alt;
                updateCounter(prevIndex + 1, allImages.length);
                setupNavigationButtons(prevIndex, allImages, newPrevBtn, newNextBtn, modalImage, counter);
            });
        } else {
            newPrevBtn.style.display = 'none';
        }

        // Настройка кнопки "Вперед"
        if (currentIndex < allImages.length - 1) {
            newNextBtn.style.display = 'inline-block';
            newNextBtn.addEventListener('click', function() {
                const nextIndex = currentIndex + 1;
                const nextImage = allImages[nextIndex];
                modalImage.src = nextImage.src;
                modalImage.alt = nextImage.alt;
                updateCounter(nextIndex + 1, allImages.length);
                setupNavigationButtons(nextIndex, allImages, newPrevBtn, newNextBtn, modalImage, counter);
            });
        } else {
            newNextBtn.style.display = 'none';
        }
    }

    /**
     * Настраивает навигацию с клавиатуры (стрелки влево/вправо)
     * @param {number} currentIndex - Текущий индекс
     * @param {NodeList} allImages - Все изображения
     * @param {HTMLElement} modalImage - Элемент изображения
     * @param {HTMLElement} counter - Элемент счетчика
     */
    function setupKeyboardNavigation(currentIndex, allImages, modalImage, counter) {
        const modalElement = document.getElementById('serviceGalleryModal');
        
        // Удаляем предыдущий обработчик, если есть
        const existingHandler = modalElement._keyboardHandler;
        if (existingHandler) {
            document.removeEventListener('keydown', existingHandler);
        }

        // Создаем новый обработчик
        const keyboardHandler = function(event) {
            // Проверяем, что модальное окно открыто
            if (!modalElement.classList.contains('show')) {
                return;
            }

            if (event.key === 'ArrowLeft' && currentIndex > 0) {
                // Переход к предыдущему изображению
                const prevIndex = currentIndex - 1;
                const prevImage = allImages[prevIndex];
                modalImage.src = prevImage.src;
                modalImage.alt = prevImage.alt;
                updateCounter(prevIndex + 1, allImages.length);
                setupKeyboardNavigation(prevIndex, allImages, modalImage, counter);
                setupNavigationButtons(prevIndex, allImages, 
                    document.getElementById('serviceGalleryPrev'), 
                    document.getElementById('serviceGalleryNext'), 
                    modalImage, counter);
            } else if (event.key === 'ArrowRight' && currentIndex < allImages.length - 1) {
                // Переход к следующему изображению
                const nextIndex = currentIndex + 1;
                const nextImage = allImages[nextIndex];
                modalImage.src = nextImage.src;
                modalImage.alt = nextImage.alt;
                updateCounter(nextIndex + 1, allImages.length);
                setupKeyboardNavigation(nextIndex, allImages, modalImage, counter);
                setupNavigationButtons(nextIndex, allImages, 
                    document.getElementById('serviceGalleryPrev'), 
                    document.getElementById('serviceGalleryNext'), 
                    modalImage, counter);
            } else if (event.key === 'Escape') {
                // Закрытие модального окна по Escape
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
        };

        // Сохраняем ссылку на обработчик для возможности удаления
        modalElement._keyboardHandler = keyboardHandler;
        document.addEventListener('keydown', keyboardHandler);

        // Удаляем обработчик при закрытии модального окна
        modalElement.addEventListener('hidden.bs.modal', function() {
            document.removeEventListener('keydown', keyboardHandler);
            delete modalElement._keyboardHandler;
        }, { once: true });
    }

    /**
     * Обновляет счетчик изображений в модальном окне
     * @param {number} current - Текущий номер изображения
     * @param {number} total - Общее количество изображений
     */
    function updateCounter(current, total) {
        const counter = document.getElementById('serviceGalleryCounter');
        if (counter) {
            counter.textContent = `${current} / ${total}`;
        }
    }

    /**
     * Инициализация при загрузке DOM
     * Галерея автоматически инициализируется, когда DOM готов
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServiceGallery);
    } else {
        // DOM уже загружен
        initServiceGallery();
    }

    // Экспорт функции для ручной инициализации (если нужно)
    window.initServiceGallery = initServiceGallery;

})();

