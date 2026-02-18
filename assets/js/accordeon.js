/**
 * FAQ Accordion functionality
 * Handles opening/closing of FAQ items with smooth animation
 */

document.addEventListener('DOMContentLoaded', function () {
  initFaqAccordion()
})

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item')

  if (!faqItems.length) return

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question')

    question.addEventListener('click', () => toggleFaqItem(item))
  })
}

function toggleFaqItem(item) {
  // Check if item is currently open
  const isOpen = item.dataset.open === 'true'

  // Close all other items
  closeAllFaqItems()

  // Toggle current item
  item.dataset.open = (!isOpen).toString()

  // Optional: Add animation class
  const answer = item.querySelector('.faq__answer')
  if (answer) {
    if (!isOpen) {
      // Opening animation
      answer.style.display = 'block'
      answer.style.height = '0'
      answer.style.overflow = 'hidden'
      answer.style.transition = 'height 0.3s ease'

      // Get full height
      const fullHeight = answer.scrollHeight + 'px'
      answer.style.height = fullHeight

      // Clean up after animation
      setTimeout(() => {
        answer.style.height = ''
        answer.style.overflow = ''
        answer.style.transition = ''
      }, 300)
    }
  }
}

function closeAllFaqItems() {
  const faqItems = document.querySelectorAll('.faq__item')

  faqItems.forEach(item => {
    if (item.dataset.open === 'true') {
      item.dataset.open = 'false'

      // Optional: Animate closing
      const answer = item.querySelector('.faq__answer')
      if (answer) {
        answer.style.height = answer.scrollHeight + 'px'
        answer.style.overflow = 'hidden'
        answer.style.transition = 'height 0.3s ease'

        // Force reflow
        answer.offsetHeight

        answer.style.height = '0'

        setTimeout(() => {
          answer.style.display = ''
          answer.style.height = ''
          answer.style.overflow = ''
          answer.style.transition = ''
        }, 300)
      }
    }
  })
}

// Alternative lightweight version without animations
function initFaqAccordionSimple() {
  const faqItems = document.querySelectorAll('.faq__item')

  if (!faqItems.length) return

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question')

    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.dataset.open = 'false'
        }
      })

      // Toggle current item
      const isOpen = item.dataset.open === 'true'
      item.dataset.open = (!isOpen).toString()
    })
  })
}

// Export for use in modules (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initFaqAccordion, initFaqAccordionSimple }
}
