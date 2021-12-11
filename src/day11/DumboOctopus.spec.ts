import { split } from '../utils/input'
import {
  applyStep,
  findAllFlash,
  findFlashingOctopuses,
  flash,
  increaseEnergy,
  parse,
  step,
} from './DumboOctopus'

const realInput = split`
2238518614
4552388553
2562121143
2666685337
7575518784
3572534871
8411718283
7742668385
1235133231
2546165345
`

const input = split`
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

const g = (s: TemplateStringsArray) => parse(split(s))

describe('Dumbo Octopus', () => {
  it('should increase energy', () => {
    const test = split`
      34543
      40004
      50905
      40004
      34543
    `
    const grid = parse(test)
    increaseEnergy(grid)
    expect(grid).toEqual([
      [4, 5, 6, 5, 4],
      [5, 1, 1, 1, 5],
      [6, 1, 10, 1, 6],
      [5, 1, 1, 1, 5],
      [4, 5, 6, 5, 4],
    ])
  })

  it('should flash neighbours', () => {
    const test = split`
      34543
      49004
      50005
      40004
      34543
    `
    const expected = g`
      45643
      50104
      61105
      40004
      34543
    `
    expected[1][1] = -1
    const grid = parse(test)
    flash({ x: 1, y: 1 }, grid)
    expect(grid).toEqual(expected)
  })

  it('should find flashing octopusses', () => {
    const test = split`
      11111
      19991
      19191
      19991
      11111
    `
    const grid = parse(test)
    const zero = findFlashingOctopuses(grid)
    expect(zero).toHaveLength(0)
    increaseEnergy(grid)
    expect(findFlashingOctopuses(grid)).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ])
  })

  it('should apply 1 step', () => {
    const test = split`
      11111
      19991
      19191
      19991
      11111
    `
    const grid = parse(test)
    const afterStep1 = step(grid)
    expect(afterStep1).toEqual(9)
    expect(grid).toEqual(g`
      34543
      40004
      50005
      40004
      34543
    `)

    const afterStep2 = step(grid)
    expect(afterStep2).toEqual(0)
    expect(grid).toEqual(g`
      45654
      51115
      61116
      51115
      45654
    `)
  })

  it('should apply n steps ⭐️', () => {
    const grid = parse(input)
    const res = applyStep(100, grid)
    expect(res).toEqual(1656)

    const realGrid = parse(realInput)
    const realRes = applyStep(100, realGrid)
    expect(realRes).toEqual(1723)
  })

  it('should find all flash ⭐️⭐️', () => {
    const grid = parse(input)
    expect(findAllFlash(200, grid)).toEqual(195)

    const realGrid = parse(realInput)
    expect(findAllFlash(350, realGrid)).toEqual(327)
  })
})
