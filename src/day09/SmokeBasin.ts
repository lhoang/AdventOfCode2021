import { range } from '../utils/input'
import { uniqBy } from 'ramda'
import { color, colors } from '../utils/display'

export type Grid = number[][]
export type Coord = {
  x: number
  y: number
}
export type Point = Coord & {
  v: number
}

export function parse(input: string[]): Grid {
  return input.map(line => line.split('').map(i => +i))
}

export function neighbours({ x, y }: Coord, grid: Grid): number[] {
  const width = grid[0].length - 1
  const height = grid.length - 1

  return [
    y > 0 ? grid[y - 1][x] : null,
    y < height ? grid[y + 1][x] : null,
    x > 0 ? grid[y][x - 1] : null,
    x < width ? grid[y][x + 1] : null,
  ].filter(i => i !== null)
}

export function findLowPoints(grid: Grid): Coord[] {
  const width = grid[0].length - 1
  const height = grid.length - 1

  return range(0, height)
    .flatMap(j =>
      range(0, width).map(i => {
        const point = { x: i, y: j }
        const value = grid[j][i]
        return neighbours(point, grid).every(v => v > value) ? point : null
      }),
    )
    .filter(i => i !== null)
}

export function riskLevelsSum(grid: Grid): number {
  return findLowPoints(grid)
    .map(({ x, y }) => grid[y][x] + 1)
    .reduce((a, b) => a + b)
}

export function neighbourHills({ x, y, v: v0 }: Point, grid: Grid): Point[] {
  const width = grid[0].length - 1
  const height = grid.length - 1

  const neighbours = [
    y > 0
      ? {
          x,
          y: y - 1,
          v: grid[y - 1][x],
        }
      : null,
    y < height
      ? {
          x,
          y: y + 1,
          v: grid[y + 1][x],
        }
      : null,
    x > 0
      ? {
          x: x - 1,
          y,
          v: grid[y][x - 1],
        }
      : null,
    x < width
      ? {
          x: x + 1,
          y,
          v: grid[y][x + 1],
        }
      : null,
  ].filter(p => p !== null)
  return neighbours.filter(({ v }) => v > v0 && v < 9)
}

const id = ({ x, y }: Point) => `${x};${y}`

export function findBasin({ x, y }: Coord, grid: Grid): Point[] {
  const recHills = (p: Point): Point[] => {
    const hills = neighbourHills(p, grid)
    if (!hills.length) {
      return [p]
    } else {
      return [p, ...hills.flatMap(hill => recHills(hill))]
    }
  }
  return uniqBy(id, recHills({ x, y, v: grid[y][x] }))
}

export function find3LargestBasinsProduct(grid: Grid): number {
  const res = findLowPoints(grid)
    .map(p => findBasin(p, grid).length)
    .sort((a, b) => b - a)
    .slice(0, 3)

  return res.reduce((a, b) => a * b)
}

export function display(grid: Grid, basin: Point[]) {
  const width = grid[0].length - 1
  const height = grid.length - 1

  const fullGrid = Array(height + 1)
    .fill(0)
    .map((_j, j) =>
      Array(width + 1)
        .fill(0)
        .map((_i, i) => ({ v: grid[j][i], basin: false })),
    )

  basin.forEach(({ x, y }) => (fullGrid[y][x].basin = true))

  const rows = fullGrid
    .map(row =>
      row
        .map(p =>
          p.basin ? color(p.v, colors.bg.yellow, colors.fg.black) : p.v,
        )
        .join(''),
    )
    .join('\n')

  console.log(rows)
}
