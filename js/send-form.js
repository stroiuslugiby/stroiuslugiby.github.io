/**
 * Отправка заявок из форм сайта в Telegram-бот
 * 
 * Этот модуль обрабатывает отправку заявок из всех форм сайта:
 * - Форма обратной связи на странице контактов (contactForm)
 * - Формы в модальных окнах (orderForm)
 * 
 * Все заявки отправляются в Telegram-бот @stroiuslugiby_bot
 */

(function() {
    'use strict';

    // Конфигурация Telegram-бота
    const TELEGRAM_BOT_TOKEN = '8285852782:AAH46yRNKZKG7PfNWD3w7AaetIrmj8gm2pc';
    const TELEGRAM_CHAT_ID = '2043581943';
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    /**
     * Отправка сообщения в Telegram-бот
     * @param {string} text - Текст сообщения для отправки
     * @returns {Promise<boolean>} - true если успешно, false если ошибка
     */
    async function sendToTelegram(text) {
        try {
            const response = await fetch(TELEGRAM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'HTML'
                })
            });

            const data = await response.json();
            
            if (response.ok && data.ok) {
                console.log('Заявка отправлена');
                return true;
            } else {
                console.error('Ошибка отправки:', data);
                return false;
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return false;
        }
    }

    /**
     * Формирование текста сообщения для Telegram
     * @param {string} name - Имя клиента
     * @param {string} phone - Телефон клиента
     * @param {string} message - Сообщение клиента
     * @param {boolean} isModal - Флаг, указывающий что форма из модального окна
     * @returns {string} - Сформированный текст сообщения
     */
    function formatMessage(name, phone, message, isModal = false) {
        let text = 'Заявка с сайта:\n\n';
        
        if (isModal) {
            text += 'Заявка из модального окна\n\n';
        }
        
        text += `Имя: ${name}\n`;
        text += `Телефон: ${phone}\n`;
        text += `Сообщение: ${message || 'Не указано'}`;
        
        return text;
    }

    /**
     * Обработка отправки формы обратной связи на странице контактов
     * Форма имеет id="contactForm" с полями:
     * - contactName (id="contactName")
     * - contactPhone (id="contactPhone")
     * - contactMessage (id="contactMessage")
     */
    function handleContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            return; // Форма не найдена на этой странице
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Проверяем валидность формы
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            // Получаем значения полей формы
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Формируем сообщение (форма НЕ из модального окна)
            const messageText = formatMessage(name, phone, message, false);

            // Отправляем в Telegram
            const success = await sendToTelegram(messageText);

            if (success) {
                // Показываем сообщение об успехе
                alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                
                // Очищаем форму
                this.reset();
                this.classList.remove('was-validated');
            } else {
                // Показываем сообщение об ошибке
                alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
            }
        });
    }

    /**
     * Обработка отправки формы заявки из модального окна
     * Форма имеет id="orderForm" с полями:
     * - clientName (id="clientName")
     * - clientPhone (id="clientPhone")
     * - clientMessage (id="clientMessage")
     */
    function handleOrderForm() {
        const orderForm = document.getElementById('orderForm');
        
        if (!orderForm) {
            return; // Форма не найдена на этой странице
        }

        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Проверяем валидность формы
            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            // Получаем значения полей формы
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const message = document.getElementById('clientMessage').value.trim();

            // Формируем сообщение (форма ИЗ модального окна)
            const messageText = formatMessage(name, phone, message, true);

            // Отправляем в Telegram
            const success = await sendToTelegram(messageText);

            if (success) {
                // Показываем сообщение об успехе
                alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
                
                // Закрываем модальное окно
                const modalElement = document.getElementById('orderModal');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                    }
                }
                
                // Очищаем форму
                this.reset();
                this.classList.remove('was-validated');
            } else {
                // Показываем сообщение об ошибке
                alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
            }
        });
    }

    /**
     * Инициализация обработчиков форм
     * Вызывается при загрузке DOM
     */
    function initFormHandlers() {
        // Обрабатываем форму обратной связи на странице контактов
        handleContactForm();
        
        // Обрабатываем форму заявки из модального окна
        handleOrderForm();
    }

    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormHandlers);
    } else {
        // DOM уже загружен
        initFormHandlers();
    }
})();

