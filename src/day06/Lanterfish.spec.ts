import { parse, naiveReproduceForDays, reproduceForDays } from './Lanterfish'
import { readFileAsLines } from '../utils/input'

const input = ['3,4,3,1,2']
const realInput = readFileAsLines('day06/input.txt')

describe('Lanterfish', () => {
  it('should parse input', () => {
    expect(parse(input)).toEqual([3, 4, 3, 1, 2])
  })

  // it('should reproduce fishes in 1 day', () => {
  //   expect(reproduce(parse(input))).toEqual([2, 3, 2, 0, 1])
  //   expect(reproduce([2, 3, 2, 0, 1])).toEqual([1, 2, 1, 6, 0, 8])
  //
  //   expect(
  //     reproduce([
  //       0, 1, 0, 5, 6, 0, 1, 2, 2, 3, 0, 1, 2, 2, 2, 3, 3, 4, 4, 5, 7, 8,
  //     ]),
  //   ).toEqual([
  //     6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8, 8,
  //     8,
  //   ])
  // })

  it('should reproduce fishes for 1 day', () => {
    const fishes = parse(input)
    naiveReproduceForDays(fishes, 1)
    expect(fishes).toEqual([2, 3, 2, 0, 1])
  })

  it('should reproduce fishes for 18 days', () => {
    const fishes = parse(input)
    naiveReproduceForDays(fishes, 18)
    expect(fishes).toEqual([
      6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8, 8,
      8,
    ])
  })

  it('should reproduce fishes for 80 days ⭐️', () => {
    const fishes = parse(realInput)
    naiveReproduceForDays(fishes, 80)
    expect(fishes).toHaveLength(393019)
  })

  it('should reproduce fishes for 80 days - new impl ⭐️', () => {
    const fishes = parse(realInput)
    expect(reproduceForDays(fishes, 80)).toEqual(393019n)
  })

  it('should reproduce fishes for 80 days - new impl ⭐️⭐', () => {
    const fishes = parse(realInput)
    expect(reproduceForDays(fishes, 256)).toEqual(1_757_714_216_975n)
  })
})
