import { range } from '../utils/input'
import { color, colors } from '../utils/display'

export type Coord = {
  x: number
  y: number
}

const areaRegex = /.*x=(?<x1>\d+)\.\.(?<x2>\d+), y=-(?<y2>\d+)\.\.-(?<y1>\d+)/
export function parseArea(input: string): [Coord, Coord] {
  const {
    groups: { x1, x2, y1, y2 },
  } = areaRegex.exec(input)
  return [
    { x: +x1, y: -y1 },
    { x: +x2, y: -y2 },
  ]
}

export function isInArea({ x, y }: Coord, [a1, a2]: [Coord, Coord]): boolean {
  return x >= a1.x && y <= a1.y && x <= a2.x && y >= a2.y
}

export function isOut({ x, y }: Coord, [a1, a2]: [Coord, Coord]): boolean {
  return x > a2.x || y < a2.y
}

const serialize = ({ x, y }: Coord): string => `${x},${y}`

export function display(area: [Coord, Coord], path: Coord[]) {
  const set = new Set(path.map(serialize))

  const width = Math.max(area[1].x, ...path.map(p => p.x))
  const maxY = Math.max(0, ...path.map(p => p.y))
  const minY = Math.min(area[1].y, ...path.map(p => p.y))

  const lines = range(maxY, minY)
    .map(j =>
      range(0, width)
        .map(i =>
          i == 0 && j == 0
            ? color('S', colors.fg.green)
            : set.has(serialize({ x: i, y: j }))
            ? color('#', colors.fg.yellow)
            : isInArea({ x: i, y: j }, area)
            ? color('T', colors.fg.red)
            : '.',
        )
        .join(''),
    )
    .join('\n')
  console.log(lines)
}

type Step = { point: Coord; velocity: Coord }
export function step({ point, velocity }: Step): Step {
  return {
    point: {
      x: point.x + velocity.x,
      y: point.y + velocity.y,
    },
    velocity: {
      x: velocity.x > 0 ? velocity.x - 1 : velocity.x < 0 ? velocity.x + 1 : 0,
      y: velocity.y - 1,
    },
  }
}

export function trajectory(area: [Coord, Coord], velocity: Coord): Coord[] {
  const recTraj = (current: Step, path: Coord[]): Coord[] => {
    if (isInArea(current.point, area) || isOut(current.point, area)) {
      return [...path, current.point]
    } else {
      return recTraj(step(current), [...path, current.point])
    }
  }

  return recTraj({ point: { x: 0, y: 0 }, velocity }, [])
}

export function findHighestYTrajectory(input: string): number {
  const area = parseArea(input)

  const ys = range(1, Math.round(area[0].x / 2)).flatMap(x =>
    range(area[1].y, -1 * area[1].y).map(y => {
      const path = trajectory(area, { x, y })
      return isInArea(path[path.length - 1], area)
        ? Math.max(...path.map(p => p.y))
        : 0
    }),
  )
  return Math.max(...ys)
}

export function findAllValidTrajectories(input: string): number {
  const area = parseArea(input)

  const valid = range(1, area[1].x)
    .flatMap(x =>
      range(area[1].y, -1 * area[1].y).map(y => {
        const path = trajectory(area, { x, y })
        return isInArea(path[path.length - 1], area) ? { x, y } : null
      }),
    )
    .filter(Boolean)
  return valid.length
}
