document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    const lazyElements = document.querySelectorAll('[data-src]')

    lazyElements.forEach(element => {
      loadResource(element)
    })
  }, 200)
})

function loadResource(element) {
  const tagName = element.tagName.toLowerCase()

  if (tagName === 'img' || tagName === 'iframe') {
    if (element.dataset.src) {
      element.src = element.dataset.src
    }

    element.onload = () => {
      element.classList.add('is-loaded')
    }

    if (tagName === 'img' && element.complete) {
      element.classList.add('is-loaded')
    }
  }

  if (tagName === 'video') {
    const sources = element.querySelectorAll('source')
    sources.forEach(source => {
      if (source.dataset.src) {
        source.src = source.dataset.src
      }
    })

    if (element.dataset.src) {
      element.src = element.dataset.src
    }

    if (element.dataset.poster) {
      element.poster = element.dataset.poster
    }

    element.load()

    element.onloadeddata = () => {
      element.classList.add('is-loaded')
    }
  }
}
