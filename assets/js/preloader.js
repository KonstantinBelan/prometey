class MusicPreloader {
  constructor(options = {}) {
    this.options = {
      minDuration: options.minDuration || 2500, // мин. время показа (мс)
      hideDelay: options.hideDelay || 300, // задержка перед скрытием
      simulateProgress: options.simulateProgress !== false,
      onStart: options.onStart || null,
      onProgress: options.onProgress || null,
      onComplete: options.onComplete || null,
    }

    this.el = document.getElementById('preloader')
    this.progressBar = document.getElementById('preloaderProgress')
    this.percentText = document.getElementById('preloaderPercent')

    this.progress = 0
    this.targetProgress = 0
    this.isComplete = false
    this.startTime = Date.now()
    this.rafId = null
    this.resources = { total: 0, loaded: 0 }

    this.init()
  }

  init() {
    if (!this.el) return

    // Блокируем скролл
    document.body.style.overflow = 'hidden'

    if (this.options.onStart) this.options.onStart()

    // Считаем ресурсы
    this.trackResources()

    // Запускаем анимацию прогресса
    this.animate()

    // Слушаем полную загрузку
    window.addEventListener('load', () => this.onWindowLoad())

    // Fallback — скрыть через 8 сек в любом случае
    this.fallbackTimer = setTimeout(() => {
      if (!this.isComplete) {
        console.warn('[Preloader] Fallback: force hiding')
        this.complete()
      }
    }, 8000)
  }

  /**
   * Отслеживаем загрузку изображений, видео, шрифтов
   */
  trackResources() {
    const images = document.querySelectorAll('img[src]')
    const videos = document.querySelectorAll('video source[src]')

    this.resources.total = images.length + videos.length + 1 // +1 для DOM

    // Изображения
    images.forEach(img => {
      if (img.complete) {
        this.resourceLoaded()
      } else {
        img.addEventListener('load', () => this.resourceLoaded())
        img.addEventListener('error', () => this.resourceLoaded())
      }
    })

    // Видео
    videos.forEach(video => {
      const parent = video.closest('video')
      if (parent) {
        parent.addEventListener('canplaythrough', () => this.resourceLoaded(), { once: true })
        parent.addEventListener('error', () => this.resourceLoaded(), { once: true })
      }
    })

    // Шрифты
    if (document.fonts && document.fonts.ready) {
      this.resources.total++
      document.fonts.ready.then(() => this.resourceLoaded())
    }

    // DOM ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      this.resourceLoaded()
    } else {
      document.addEventListener('DOMContentLoaded', () => this.resourceLoaded())
    }
  }

  resourceLoaded() {
    this.resources.loaded++
    const realProgress = this.resources.total > 0 ? (this.resources.loaded / this.resources.total) * 100 : 0
    this.targetProgress = Math.max(this.targetProgress, Math.min(realProgress, 95))
  }

  /**
   * Анимация плавного прогресса
   */
  animate() {
    const elapsed = Date.now() - this.startTime

    // Симуляция прогресса (если реальный загрузка медленная)
    if (this.options.simulateProgress) {
      const simulated = this.easeOutQuart(Math.min(elapsed / (this.options.minDuration * 1.5), 1)) * 85
      this.targetProgress = Math.max(this.targetProgress, simulated)
    }

    // Плавная интерполяция
    const diff = this.targetProgress - this.progress
    this.progress += diff * 0.08

    // Обновляем DOM
    this.updateUI(Math.round(this.progress))

    // Колбэк
    if (this.options.onProgress) {
      this.options.onProgress(Math.round(this.progress))
    }

    if (!this.isComplete) {
      this.rafId = requestAnimationFrame(() => this.animate())
    }
  }

  updateUI(value) {
    const clamped = Math.min(value, 100)

    if (this.progressBar) {
      this.progressBar.style.width = `${clamped}%`
    }

    if (this.percentText) {
      this.percentText.textContent = `${clamped}%`
    }
  }

  onWindowLoad() {
    this.targetProgress = 100

    const elapsed = Date.now() - this.startTime
    const remaining = Math.max(0, this.options.minDuration - elapsed)

    setTimeout(() => this.complete(), remaining)
  }

  /**
   * Финальное завершение
   */
  complete() {
    if (this.isComplete) return
    this.isComplete = true

    clearTimeout(this.fallbackTimer)

    // Догоняем до 100%
    this.targetProgress = 100
    this.progress = 100
    this.updateUI(100)

    // Скрываем
    setTimeout(() => {
      this.hide()
    }, this.options.hideDelay)
  }

  hide() {
    if (!this.el) return

    // Добавляем класс скрытия (запуск CSS-анимации)
    this.el.classList.add('is-hidden')

    // Разблокируем скролл
    document.body.style.overflow = ''

    // Удаляем из DOM после анимации
    this.el.addEventListener(
      'transitionend',
      () => {
        cancelAnimationFrame(this.rafId)
        this.el.remove()

        if (this.options.onComplete) {
          this.options.onComplete()
        }
      },
      { once: true },
    )

    // Fallback удаления
    setTimeout(() => {
      if (this.el && this.el.parentNode) {
        cancelAnimationFrame(this.rafId)
        this.el.remove()
      }
    }, 1500)
  }

  // Easing функция
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4)
  }
}

// ============================================
// Инициализация
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const preloader = new MusicPreloader({
    minDuration: 2500, // минимум 2.5 сек показа
    hideDelay: 400, // пауза перед уходом
    simulateProgress: true, // симуляция, если ресурсов мало

    onStart() {
      console.log('🎵 Preloader started')
    },

    onProgress(percent) {
      // Можно добавить доп. логику, например менять текст статуса
      const statusEl = document.querySelector('.preloader__status')
      if (!statusEl) return

      if (percent < 30) {
        statusEl.textContent = 'Загружаем вайб'
      } else if (percent < 60) {
        statusEl.textContent = 'Настраиваем частоту'
      } else if (percent < 85) {
        statusEl.textContent = 'Сводим треки'
      } else {
        statusEl.textContent = 'Почти готово'
      }
    },

    onComplete() {
      console.log('🎶 Preloader complete — welcome!')
      // Здесь можно запустить GSAP-анимации появления контента
    },
  })
})
