import { range } from '../utils/input'
import { transpose } from 'ramda'

type Grid = string[]

export function display(grid: Grid) {
  console.log(grid.join('\n'))
}

export function stepRight(grid: Grid, char = '>'): Grid {
  const width = grid[0].length
  const height = grid.length

  const canMove = (i: number, j: number) =>
    (i < width - 1 ? grid[j][i + 1] : grid[j][0]) === '.'

  const isSC = (i: number, j: number) => grid[j][i] === char

  const lines = range(0, height - 1).map(j => {
    let line = ''
    for (let i = 0; i < width - 1; i++) {
      if (isSC(i, j) && canMove(i, j)) {
        i++
        line += '.' + char
      } else {
        line += grid[j][i]
      }
    }
    if (line.length < width) {
      if (isSC(width - 1, j) && canMove(width - 1, j)) {
        line = char + line.slice(1) + '.'
      } else {
        line += grid[j][width - 1]
      }
    }
    return line
  })
  return lines
}

export function stepDown(grid: Grid): Grid {
  const rotate = (g: Grid): Grid =>
    transpose(g.map(line => [...line])).map(line => line.join(''))
  const rotated = rotate(grid)
  return rotate(stepRight(rotated, 'v'))
}

export function step(grid: Grid, n: number): Grid {
  return range(1, n).reduce(g => stepDown(stepRight(g)), grid)
}

export function findNoMove(grid: Grid): number {
  const isEqual = (g1: Grid, g2: Grid): boolean => g1.join('') === g2.join('')

  const recNoMove = (g: Grid, step: number): number => {
    const newGrid = stepDown(stepRight(g))
    return isEqual(g, newGrid) ? step : recNoMove(newGrid, step + 1)
  }
  return recNoMove(grid, 1)
}
