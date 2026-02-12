const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')

const inputDir = path.join(__dirname, '../assets/images')
const outputDir = path.join(__dirname, '../assets/images/webp')

async function convertImages() {
  try {
    // Создаём папки, если их нет
    await fs.mkdir(outputDir, { recursive: true })

    const files = await fs.readdir(inputDir)

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file))

    console.log(`🔍 Найдено изображений: ${imageFiles.length}`)

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file)
      const outputName = path.parse(file).name + '.webp'
      const outputPath = path.join(outputDir, outputName)

      await sharp(inputPath)
        .webp({
          quality: 80, // Качество (0-100), по умолч. 80
          lossless: true, // True — без потерь (качество игнорируется)
          nearLossless: false, // Режим почти без потерь
          alphaQuality: 100, // Качество прозрачности (0-100)
          effort: 4, // Скорость кодирования (0-6), 6 — медленнее/лучше
          loop: 0, // Количество повторов анимации (0 — бесконечно)
          delay: 100, // Задержка между кадрами (анимация)
        })
        .toFile(outputPath)

      console.log(`✅ ${file} → ${outputName}`)
    }

    console.log('🎉 Все файлы сконвертированы!')
  } catch (err) {
    console.error('❌ Ошибка:', err)
  }
}

convertImages()
