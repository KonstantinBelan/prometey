document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.calculator__slider')
  const thumb = slider.querySelector('.calculator__line-touch')

  // Элементы для вывода цифр
  const costText = document.getElementById('calt-cost')
  // Получаем все <p> внутри .calculator__content по порядку их появления в HTML
  // [0] - Старты, [1] - Прослушивания, [2] - Слушатели
  const statsTexts = document.querySelectorAll('.calculator__content p')

  // --- НАСТРОЙКИ ЗНАЧЕНИЙ (Min / Max) ---
  const settings = {
    budget: { min: 20000, max: 500000, el: costText, prefix: '', suffix: '₽' },
    starts: { min: 1000, max: 50000, el: statsTexts[0], prefix: '+', suffix: '' },
    listens: { min: 5000, max: 200000, el: statsTexts[1], prefix: '+', suffix: '' },
    listeners: { min: 2000, max: 80000, el: statsTexts[2], prefix: '+', suffix: '' },
  }

  let isDragging = false

  // Форматтер чисел (делает пробелы, например 20 000)
  const formatter = new Intl.NumberFormat('ru-RU')

  // --- Основная логика ---

  function calculateValue(min, max, percent) {
    return Math.round(min + (max - min) * (percent / 100))
  }

  function updateView(percent) {
    // 1. Обновляем CSS переменную (визуальная полоска)
    slider.style.setProperty('--width-line', `${percent}%`)

    // 2. Обновляем Бюджет
    const budgetVal = calculateValue(settings.budget.min, settings.budget.max, percent)
    settings.budget.el.textContent = `${settings.budget.prefix}${formatter.format(budgetVal)}${settings.budget.suffix}`

    // 3. Обновляем Статистику (Старты, Прослушивания, Слушатели)
    // Обновляем "Старты"
    const startsVal = calculateValue(settings.starts.min, settings.starts.max, percent)
    settings.starts.el.textContent = `${settings.starts.prefix}${formatter.format(startsVal)}${settings.starts.suffix}`

    // Обновляем "Прослушивания"
    const listensVal = calculateValue(settings.listens.min, settings.listens.max, percent)
    settings.listens.el.textContent = `${settings.listens.prefix}${formatter.format(listensVal)}${settings.listens.suffix}`

    // Обновляем "Слушатели"
    const listenersVal = calculateValue(settings.listeners.min, settings.listeners.max, percent)
    settings.listeners.el.textContent = `${settings.listeners.prefix}${formatter.format(listenersVal)}${settings.listeners.suffix}`
  }

  function getPercentFromClientX(clientX) {
    const sliderRect = slider.getBoundingClientRect()
    let newLeft = clientX - sliderRect.left

    if (newLeft < 0) newLeft = 0
    if (newLeft > sliderRect.width) newLeft = sliderRect.width

    let percentage = (newLeft / sliderRect.width) * 100
    return Math.min(100, Math.max(0, percentage))
  }

  // --- Обработчики событий (Mouse & Touch) ---

  const handleStart = e => {
    isDragging = true
    document.body.style.userSelect = 'none'
    slider.classList.add('is-dragging')

    // Если клик не по самому ползунку, а по линии - сразу прыгаем туда
    if (e.target !== thumb) {
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
      updateView(getPercentFromClientX(clientX))
    }
  }

  const handleMove = e => {
    if (!isDragging) return
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    updateView(getPercentFromClientX(clientX))
  }

  const handleEnd = () => {
    if (isDragging) {
      isDragging = false
      document.body.style.userSelect = ''
      slider.classList.remove('is-dragging')
    }
  }

  // Mouse events
  slider.addEventListener('mousedown', handleStart)
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)

  // Touch events
  slider.addEventListener('touchstart', handleStart, { passive: true })
  document.addEventListener('touchmove', handleMove, { passive: true })
  document.addEventListener('touchend', handleEnd)

  // --- ИНИЦИАЛИЗАЦИЯ (Самое важное для вашей просьбы) ---
  function init() {
    // Считываем значение из style=""
    const styleValue = slider.style.getPropertyValue('--width-line')

    let startPercent = 0 // Значение по умолчанию (если ничего не задано)

    if (styleValue) {
      // Удаляем знак '%' и пробелы, превращаем в число
      startPercent = parseFloat(styleValue)
    }

    // Применяем расчеты сразу при загрузке страницы
    updateView(startPercent)
  }

  init()
})
