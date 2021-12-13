import { range, split } from '../utils/input'
import { color, colors } from '../utils/display'

type Coord = {
  x: number
  y: number
}

export interface Fold {
  axis: 'x' | 'y'
  value: number
}

const serialize = ({ x, y }: Coord): string => `${x},${y}`
const deserialize = (s: string): Coord => {
  const [x, y] = s.split(',').map(i => +i)
  return { x, y }
}

export function parse(input: string): [Coord[], Fold[]] {
  const [pointsPart, instructionsPart] = input.split(`\n\n`)
  const points = split(pointsPart).map(deserialize)
  const instructions = split(instructionsPart).map(line => {
    const [axis, value] = line.split(' ')[2].split('=')
    return {
      axis,
      value: +value,
    } as Fold
  })

  return [points, instructions]
}

export function fold(points: Coord[], { axis, value }: Fold): Coord[] {
  const newPoints = points.map(({ x, y }) =>
    axis == 'x'
      ? {
          x: x < value ? x : 2 * value - x,
          y,
        }
      : {
          x,
          y: y < value ? y : 2 * value - y,
        },
  )
  return removeDuplicates(newPoints)
}

export function removeDuplicates(points: Coord[]): Coord[] {
  return [...new Set(points.map(serialize))].map(deserialize)
}

export function foldPaper(input: string): Coord[] {
  const [points, instructions] = parse(input)
  return instructions.reduce(fold, points)
}

export function display(points: Coord[]) {
  const set = new Set(points.map(serialize))
  const { width, height } = points.reduce(
    ({ width, height }, { x, y }) => {
      return {
        width: Math.max(width, x),
        height: Math.max(height, y),
      }
    },
    { width: 0, height: 0 },
  )
  const log = range(0, height)
    .map(j =>
      range(0, width)
        .map(i =>
          set.has(serialize({ x: i, y: j }))
            ? color('█', colors.fg.green)
            : ' ',
        )
        .join(''),
    )
    .join('\n')
  console.log(log)
}
