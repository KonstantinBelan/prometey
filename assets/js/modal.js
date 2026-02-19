// Функция для открытия модального окна
function openModal(modalId) {
  const modal = document.querySelector(`[data-modal-id="${modalId}"]`)
  if (modal) {
    modal.classList.add('visible')
  }
}

// Функция для закрытия модального окна
function closeModal(modal) {
  if (modal) {
    modal.classList.remove('visible')
  }
}

// Находим все элементы с data-modal-open
document.querySelectorAll('[data-modal-open]').forEach(trigger => {
  trigger.addEventListener('click', event => {
    event.preventDefault() // Предотвращаем стандартное поведение для ссылок

    const modalId = trigger.getAttribute('data-modal-open')

    // Если значение data-параметра существует и не пустое
    if (modalId && modalId.trim() !== '') {
      openModal(modalId)
    }
  })
})

// Обработка закрытия модальных окон
document.addEventListener('click', event => {
  // Закрытие по клику на .modal__close
  if (event.target.closest('.modal__close')) {
    const modal = event.target.closest('[data-modal-id]')
    closeModal(modal)
  }

  // Закрытие по клику на .modal (но не на .modal__wrapper)
  if (event.target.classList.contains('modal')) {
    closeModal(event.target)
  }
})

// Дополнительно: закрытие по клавише Escape
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('[data-modal-id].visible').forEach(modal => {
      closeModal(modal)
    })
  }
})
