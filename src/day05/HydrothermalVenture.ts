import { range } from '../utils/input'
import { countBy } from 'ramda'

export interface Coord {
  x: number
  y: number
}
export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export function parseLine(input: string[]): Line[] {
  const regex = /(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)/
  return input.map(line => {
    const {
      groups: { x1, x2, y1, y2 },
    } = regex.exec(line)
    return {
      x1: +x1,
      y1: +y1,
      x2: +x2,
      y2: +y2,
    }
  })
}

export function generatePoints(line: Line, withDiagonal = false): Coord[] {
  const { x1, x2, y1, y2 } = line
  if (x1 === x2) {
    return range(y1, y2).map(y => ({ x: x1, y }))
  } else if (y1 === y2) {
    return range(x1, x2).map(x => ({ x, y: y1 }))
  } else if (withDiagonal && isDiagonal(line)) {
    const a = (y2 - y1) / (x2 - x1)
    let startX = x1
    let endX = x2
    let startY = y1
    if (x1 > x2) {
      startX = x2
      endX = x1
      startY = y2
    }

    return range(startX, endX).map((x, i) => ({
      x,
      y: startY + a * i,
    }))
  } else {
    return []
  }
}

export function genId({ x, y }: Coord): string {
  return `${x};${y}`
}

interface CountParams {
  input: string[]
  withDiagonal?: boolean
  displayGrid?: boolean
}

export function countSafeAreas({
  input,
  withDiagonal = false,
  displayGrid = false,
}: CountParams): number {
  const points = parseLine(input).flatMap(line =>
    generatePoints(line, withDiagonal),
  )
  const pointsByOverlap = countBy(genId)(points)
  if (displayGrid) {
    console.log(display(pointsByOverlap))
  }
  return Object.entries(pointsByOverlap) //
    .filter(([, v]) => v > 1).length
}

export function isDiagonal({ x1, x2, y1, y2 }: Line): boolean {
  return Math.abs((y2 - y1) / (x2 - x1)) === 1
}

export function display(pointsMap: Record<string, number>) {
  const map = new Map(Object.entries(pointsMap))
  const { width, height } = Object.keys(pointsMap)
    .map(c => c.split(';').map(i => +i))
    .reduce(
      ({ width, height }, c) => {
        return {
          width: Math.max(width, c[0]),
          height: Math.max(height, c[1]),
        }
      },
      { width: 0, height: 0 },
    )

  return range(0, height)
    .map(j =>
      range(0, width)
        .map(i => {
          const found = map.get(genId({ x: i, y: j }))
          return found ? '' + found : '.'
        })
        .join(''),
    )
    .join('\n')
}
