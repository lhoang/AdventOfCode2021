import { range, splitByEmptyLine } from '../utils/input'
import { color, colors } from '../utils/display'

export function parse(input: string[]): [string, string[]] {
  const [algoPart, image] = splitByEmptyLine(input)
  return [algoPart[0], image]
}

export function display(image: string[]) {
  const log = image
    .map(line =>
      line.replaceAll('#', color('#', colors.bg.yellow, colors.fg.black)),
    )
    .join('\n')
  console.log(log)
}

export function readPixel(
  x: number,
  y: number,
  image: string[],
  outPixel = 0,
): string {
  const width = image[0].length
  const height = image.length

  return range(y - 1, y + 1)
    .flatMap(j => {
      return range(x - 1, x + 1).map(i => {
        return i < 0 || i > width - 1 || j < 0 || j > height - 1
          ? outPixel
          : image[j][i] === '#'
          ? 1
          : 0
      })
    })
    .join('')
}

export function decodePixel(
  x: number,
  y: number,
  image: string[],
  algo: string,
  outPixel = 0,
): string {
  const bin = readPixel(x, y, image, outPixel)
  const dec = parseInt(bin, 2)
  return algo[dec]
}

export function enhance(image: string[], algo: string, outPixel = 0) {
  const width = image[0].length
  const height = image.length
  const padding = 2

  return range(0 - padding, height + padding - 1).map(j =>
    range(0 - padding, width + padding - 1)
      .map(i => decodePixel(i, j, image, algo, outPixel))
      .join(''),
  )
}

export function enhanceNTimes(
  image: string[],
  algo: string,
  n: number,
  outpx = (_: number) => 0,
): string[] {
  return range(1, n).reduce((img, i) => enhance(img, algo, outpx(i)), image)
}

export function countLitPixels(image: string[]): number {
  return [...image.join('')].filter(c => c === '#').length
}
