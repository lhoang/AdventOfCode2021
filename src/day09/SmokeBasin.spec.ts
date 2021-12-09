import { readFileAsLines, split } from '../utils/input'
import {
  display,
  find3LargestBasinsProduct,
  findBasin,
  findLowPoints,
  neighbourHills,
  neighbours,
  parse,
  riskLevelsSum,
} from './SmokeBasin'

const input = split`
2199943210
3987894921
9856789892
8767896789
9899965678
`

const realInput = readFileAsLines('day09/input.txt')

describe('Smoke Basin', () => {
  it('should parse grid', () => {
    const grid = parse(input)
    expect(grid).toHaveLength(5)
    expect(grid[3][2]).toEqual(6)
  })

  it('should find neighbours', () => {
    const grid = parse(input)
    expect(neighbours({ x: 2, y: 3 }, grid)).toEqual([5, 9, 7, 7])
    expect(neighbours({ x: 0, y: 2 }, grid)).toEqual([3, 8, 8])
    expect(neighbours({ x: 0, y: 0 }, grid)).toEqual([3, 1])
    expect(neighbours({ x: 9, y: 0 }, grid)).toEqual([1, 1])
    expect(neighbours({ x: 0, y: 4 }, grid)).toEqual([8, 8])
    expect(neighbours({ x: 9, y: 4 }, grid)).toEqual([9, 7])
  })

  it('should find low points', () => {
    const grid = parse(input)
    expect(findLowPoints(grid)).toEqual([
      { x: 1, y: 0 },
      { x: 9, y: 0 },
      { x: 2, y: 2 },
      { x: 6, y: 4 },
    ])
  })

  it('should compute risk levels sum ⭐️', () => {
    expect(riskLevelsSum(parse(input))).toEqual(15)
    expect(riskLevelsSum(parse(realInput))).toEqual(508)
  })

  it('should find neighbours Point', () => {
    const grid = parse(input)
    expect(neighbourHills({ x: 1, y: 0, v: 1 }, grid)).toEqual([
      { x: 0, y: 0, v: 2 },
    ])
    expect(neighbourHills({ x: 0, y: 0, v: 2 }, grid)).toEqual([
      { x: 0, y: 1, v: 3 },
    ])
    expect(neighbourHills({ x: 2, y: 1, v: 8 }, grid)).toEqual([])
  })

  it('should find basin size', () => {
    const grid = parse(input)
    expect(findBasin({ x: 1, y: 0 }, grid)).toHaveLength(3)
    expect(findBasin({ x: 9, y: 0 }, grid)).toHaveLength(9)
    expect(findBasin({ x: 2, y: 2 }, grid)).toHaveLength(14)
    expect(findBasin({ x: 6, y: 4 }, grid)).toHaveLength(9)
  })

  it('should find 3 largest basins', () => {
    expect(find3LargestBasinsProduct(parse(input))).toEqual(1134)
    expect(find3LargestBasinsProduct(parse(realInput))).toEqual(1564640)
  })

  it('should display grid', () => {
    const grid = parse(realInput)
    const basins = findLowPoints(grid).flatMap(p => findBasin(p, grid))
    display(grid, basins)
  })
})
