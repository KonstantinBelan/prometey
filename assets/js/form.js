document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('input:not([type="submit"])')

  function checkValue(input) {
    if (input.value.trim().length > 0) {
      input.classList.add('value-check')
    } else {
      input.classList.remove('value-check')
    }
  }

  inputs.forEach(function (input) {
    checkValue(input)

    input.addEventListener('input', function () {
      checkValue(this)
    })

    input.addEventListener('change', function () {
      checkValue(this)
    })
  })
})
