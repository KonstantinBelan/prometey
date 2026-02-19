document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header.header')

  if (!header) {
    return
  }

  function handleScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const distanceToBottom = documentHeight - (scrollPosition + windowHeight)

    if (scrollPosition > 500) {
      header.classList.add('active')
      // header.classList.add('opacity')
    } else {
      header.classList.remove('active')
    }

    // if (scrollPosition > 940 && distanceToBottom >= 200) {
    if (scrollPosition > 940) {
      header.classList.add('fixed')
    } else {
      header.classList.remove('fixed')
    }
  }

  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

document.addEventListener('DOMContentLoaded', function () {
  const footerButton = document.querySelector('#footer-button')

  if (!footerButton) {
    return
  }

  function handleScrollButton() {
    const scrollPosition2 = window.scrollY || document.documentElement.scrollTop
    const windowHeight2 = window.innerHeight
    const documentHeight2 = document.documentElement.scrollHeight
    const distanceToBottom2 = documentHeight2 - (scrollPosition2 + windowHeight2)

    if (scrollPosition2 > 940 && distanceToBottom2 >= 200) {
      footerButton.classList.add('visible')
    } else {
      footerButton.classList.remove('visible')
    }
  }

  window.addEventListener('scroll', handleScrollButton)
  handleScrollButton()
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()

    const targetId = this.getAttribute('href')
    const target = document.querySelector(targetId)

    if (!target) return

    let headerOffset = 150
    if (targetId === '#start') {
      headerOffset = 170
    }
    const elementPosition = target.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  })
})
