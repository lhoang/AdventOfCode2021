import { readFileAsLines, split } from '../utils/input'
import {
  countLitPixels,
  decodePixel,
  display,
  enhance,
  enhanceNTimes,
  parse,
  readPixel,
} from './TrenchMap'

const realInput = readFileAsLines('day20/input.txt')

const input = split`
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`
const [algo, image] = parse(input)

describe('Trench Map', () => {
  it('should parse input', () => {
    const [algo, image] = parse(input)
    expect(algo.slice(0, 5)).toEqual('..#.#')
    expect(image[0]).toEqual('#..#.')
    display(image)
  })

  it('should read pixel', () => {
    expect(readPixel(2, 2, image)).toEqual('000100010')
    expect(readPixel(0, 0, image)).toEqual('000010010')
    expect(readPixel(-1, -1, image)).toEqual('000000001')
    expect(readPixel(4, 4, image)).toEqual('000110000')
    expect(readPixel(5, 5, image)).toEqual('100000000')
    expect(readPixel(-1, 1, image)).toEqual('001001001')

    expect(readPixel(0, 10, image)).toEqual('000000000')
    expect(readPixel(0, 10, image)).toEqual('000000000')
    expect(readPixel(10, 10, image)).toEqual('000000000')
  })

  it('should decode pixel', () => {
    expect(decodePixel(2, 2, image, algo)).toEqual('#')
    expect(decodePixel(0, 0, image, algo)).toEqual('.')
    expect(decodePixel(-1, -1, image, algo)).toEqual('.')
    expect(decodePixel(4, 4, image, algo)).toEqual('.')
    expect(decodePixel(5, 5, image, algo)).toEqual('.')
  })

  it('should enhance twice and count lit pixels', () => {
    const enhanced1 = enhance(image, algo)
    display(enhanced1)
    const enhanced2 = enhance(enhanced1, algo)
    display(enhanced2)
    expect(countLitPixels(enhanced2)).toEqual(35)
  })

  it('should enhance twice and count lit pixels ⭐️', () => {
    const [algo, image] = parse(realInput)
    const enhanced1 = enhance(image, algo, 0)
    // display(enhanced1)
    const enhanced2 = enhance(enhanced1, algo, 1)
    // display(enhanced2)
    expect(countLitPixels(enhanced2)).toEqual(5583)
  })

  it('should enhance 50 times', () => {
    const enhanced1 = enhanceNTimes(image, algo, 50)
    expect(countLitPixels(enhanced1)).toEqual(3351)
  })

  it('should enhance 50 times  ⭐️⭐️', () => {
    const [algo, image] = parse(realInput)
    const enhanced1 = enhanceNTimes(image, algo, 50, i => (i % 2 == 0 ? 1 : 0))
    expect(countLitPixels(enhanced1)).toEqual(19592)
  })
})
