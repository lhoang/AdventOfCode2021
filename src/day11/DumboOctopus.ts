import { color, colors, sleep } from '../utils/display'
import { range, split } from '../utils/input'
import { stdout } from 'process'

const { min, max } = Math

export type Grid = number[][]
export type Coord = {
  x: number
  y: number
}

export function parse(input: string[]): Grid {
  return input.map(line => line.split('').map(i => +i))
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

export function display(grid: Grid) {
  if (stdout.cursorTo) {
    stdout.cursorTo(0, 0)
    const log = grid
      .map(line =>
        line
          .map(c =>
            // Ready to flash
            c > 9
              ? color('⚉', colors.fg.red, colors.bright)
              : // has flashed
              c == -1
              ? color('☀', colors.fg.yellow, colors.bright)
              : // tired
              c == 0
              ? color(c, colors.fg.yellow, colors.dim)
              : c < 3
              ? color(c, colors.fg.grey, colors.dim)
              : c < 6
              ? color(c, colors.fg.white, colors.dim)
              : c < 8
              ? color(c, colors.dim)
              : color(c, colors.bright),
          )
          .join(' '),
      )
      .join('\r\n')
    stdout.write(log)
  }
}

export async function stepWithDisplay(grid: Grid): Promise<number> {
  increaseEnergy(grid)

  const recFlash = async (count: number): Promise<number> => {
    const octopuses = findFlashingOctopuses(grid)
    if (!octopuses.length) {
      return count
    } else {
      octopuses.forEach(octo => flash(octo, grid))
      display(grid)
      await sleep(50)
      return await recFlash(count + octopuses.length)
    }
  }
  const count = await recFlash(0)
  resetFlashingOctopuses(grid)

  return count
}

async function run() {
  console.clear()
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
  const grid = parse(input)
  const asyncStep = async () => {
    await stepWithDisplay(grid)
    display(grid)
    await sleep(200)
  }
  for (const _ of range(1, 206)) {
    await asyncStep()
  }
}

run()
