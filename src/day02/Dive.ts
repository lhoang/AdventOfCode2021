import { readFileAsLines } from '../utils/input'

export interface Coords {
  x: number
  y: number
  aim?: number
}

const parse = /(?<direction>[a-z]+) (?<step>\d+)/

export function compute(instructions: string[]): Coords {
  return instructions
    .map(l => {
      const {
        groups: { direction, step },
      } = parse.exec(l)
      switch (direction) {
        case 'forward':
          return { x: +step, y: 0 }
        case 'down':
          return { x: 0, y: +step }
        case 'up':
          return { x: 0, y: -step }
        default:
          return { x: 0, y: 0 }
      }
    })
    .reduce((acc, ins) => ({
      x: acc.x + ins.x,
      y: acc.y + ins.y,
    }))
}

export function part1(): number {
  const { x, y } = compute(readFileAsLines('day02/input.txt'))
  return x * y
}

export function computeAim(instructions: string[]): Coords {
  return instructions
    .map(l => {
      const {
        groups: { direction, step },
      } = parse.exec(l)
      return { direction, step: +step }
    })
    .reduce(
      (acc, { direction, step }) => {
        switch (direction) {
          case 'forward':
            return {
              ...acc,
              x: acc.x + step,
              y: acc.y + step * acc.aim,
            }
          case 'down':
            return {
              ...acc,
              aim: acc.aim + step,
            }
          case 'up':
            return {
              ...acc,
              aim: acc.aim - step,
            }
          default:
            return acc
        }
      },
      { x: 0, y: 0, aim: 0 },
    )
}

export function part2(): number {
  const { x, y } = computeAim(readFileAsLines('day02/input.txt'))
  return x * y
}
