/**
 * Основной JavaScript файл для сайта строительной компании
 * Содержит общую логику: модальные окна, lightbox, инициализация
 */

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initLightbox();
    initFormValidation();
    initScrollToTop();
});

/**
 * Инициализация Lightbox для галереи
 * Использует Bootstrap Modal для отображения изображений
 * Исключает изображения с классом 'service-gallery-item' (они обрабатываются services-gallery.js)
 */
function initLightbox() {
    // Исключаем изображения с классом service-gallery-item, чтобы избежать конфликта
    const galleryItems = document.querySelectorAll('.gallery-item img:not(.service-gallery-item)');
    
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', function() {
            const lightboxModal = document.getElementById('lightboxModal');
            if (!lightboxModal) {
                createLightboxModal();
            }
            
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('lightboxModal'));
            const modalImg = document.getElementById('lightboxImage');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modal.show();
        });
    });
}

/**
 * Создание модального окна для Lightbox
 */
function createLightboxModal() {
    const modalHTML = `
        <div class="modal fade" id="lightboxModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-dark">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-0 text-center">
                        <img id="lightboxImage" src="" alt="" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Инициализация валидации форм
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Открытие модального окна заявки
 * Можно вызывать из любого места на странице
 */
function openOrderModal() {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('orderModal'));
    modal.show();
}

/**
 * Обработка отправки формы заявки
 * ПРИМЕЧАНИЕ: Логика отправки форм перенесена в js/send-form.js
 * Этот обработчик удален, чтобы избежать конфликта с новой логикой отправки в Telegram
 */

/**
 * Плавная прокрутка к секции
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Инициализация кнопки "Наверх"
 * Создает кнопку для быстрой прокрутки страницы наверх
 */
function initScrollToTop() {
    // Создаем кнопку "Наверх"
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scrollToTop';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Прокрутить наверх');
    scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    
    // Добавляем кнопку в body
    document.body.appendChild(scrollButton);
    
    // Обработчик клика - прокрутка наверх
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            // Показываем кнопку после прокрутки на 300px
            scrollButton.classList.add('show');
        } else {
            // Скрываем кнопку вверху страницы
            scrollButton.classList.remove('show');
        }
    });
}

/**
 * Инициализация карты (если используется Яндекс.Карты или Google Maps)
 * TODO: Добавить API ключ и настроить карту
 */
function initMap() {
    // TODO: Инициализировать карту
    // Пример для Google Maps:
    // const map = new google.maps.Map(document.getElementById('map'), { ... });
    
    console.log('Карта будет инициализирована после добавления API ключа');
}






