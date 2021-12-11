import { color, colors } from '../utils/string'
import { range } from '../utils/input'

const { min, max } = Math

export type Grid = number[][]
export type Coord = {
  x: number
  y: number
}

export function parse(input: string[]): Grid {
  return input.map(line => line.split('').map(i => +i))
}

// TOdO use ?
export function toString(grid: Grid): string {
  return grid.map(line => line.join('')).join('\n')
}

export function flash({ x, y }: Coord, grid: Grid) {
  const width = grid[0].length - 1
  const height = grid.length - 1

  range(max(y - 1, 0), min(y + 1, height)).flatMap(j =>
    range(max(x - 1, 0), min(x + 1, width)).map(i => {
      if (!(i == x && j == y) && grid[j][i] > -1) grid[j][i]++
    }),
  )
  grid[y][x] = -1
}

function traverse<T>(grid: Grid, apply: (_: Coord) => T): T[] {
  const width = grid[0].length - 1
  const height = grid.length - 1
  return range(0, height).flatMap(j =>
    range(0, width)
      .map(i => apply({ x: i, y: j }))
      .filter(v => v !== null),
  )
}

export function increaseEnergy(grid: Grid) {
  traverse(grid, ({ x, y }) => grid[y][x]++)
}

export function findFlashingOctopuses(grid: Grid): Coord[] {
  return traverse(grid, p => (grid[p.y][p.x] > 9 ? p : null))
}

export function resetFlashingOctopuses(grid: Grid) {
  traverse(grid, ({ x, y }) => (grid[y][x] == -1 ? (grid[y][x] = 0) : null))
}

export function step(grid: Grid): number {
  increaseEnergy(grid)

  const recFlash = (count: number): number => {
    const octopuses = findFlashingOctopuses(grid)
    if (!octopuses.length) {
      return count
    } else {
      octopuses.forEach(octo => flash(octo, grid))
      return recFlash(count + octopuses.length)
    }
  }
  const count = recFlash(0)
  resetFlashingOctopuses(grid)

  return count
}

export function applyStep(n: number, grid: Grid): number {
  return range(1, n)
    .map(() => step(grid))
    .reduce((a, b) => a + b)
}

export function findAllFlash(n: number, grid: Grid): number {
  const check = () => grid.flat().every(c => c === 0)

  return range(1, n).find(() => {
    step(grid)
    return check()
  })
}
