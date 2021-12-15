import { stdout } from 'process'
import { range, readFileAsLines, split } from '../utils/input'
import { color, colors, sleep } from '../utils/display'

const { min, max } = Math
export type Grid = number[][]
export interface Coord {
  x: number
  y: number
}
export interface Chiton extends Coord {
  risk: number
}
type Path = Chiton[]

const serialize = ({ x, y }: Coord): string => `${x},${y}`
const deserialize = (s: string): Coord => {
  const [x, y] = s.split(',').map(i => +i)
  return { x, y }
}

// TODO: remove
export function parse(input: string[]): Grid {
  return input.map(line => line.split('').map(i => +i))
}

export function parseToNodes(
  input: string[],
): [Map<string, number>, number, number] {
  const width = input[0].length
  const height = input.length
  return [
    new Map<string, number>(
      input.flatMap((line, j) =>
        line.split('').map((v, i) => [serialize({ x: i, y: j }), +v]),
      ),
    ),
    width,
    height,
  ]
}

export function neighbours(
  nodeId: string,
  width: number,
  height: number,
): string[] {
  const { x, y } = deserialize(nodeId)

  return [
    y > 0 ? serialize({ x, y: y - 1 }) : null,
    y < height - 1 ? serialize({ x, y: y + 1 }) : null,
    x > 0 ? serialize({ x: x - 1, y }) : null,
    x < width - 1 ? serialize({ x: x + 1, y }) : null,
  ].filter(i => i !== null)
}

export interface NodeInfo {
  distance: number
  parent: string
}

export function shortestPath(input: string[]): [number, string[]] {
  const [riskMap, width, height] = parseToNodes(input)
  const grid = parse(input)

  const start = '0,0'
  const finish = serialize({ x: width - 1, y: height - 1 })
  const nodeInfos: Record<string, NodeInfo> = Object.assign(
    {},
    ...[...riskMap.keys()].map(nodeId => ({
      [nodeId]: {
        distance: Infinity,
        parent: start,
      },
    })),
  )
  // Init : start node and current neighbours
  nodeInfos[start] = {
    distance: 0,
    parent: null,
  }
  const visitedNodes: string[] = []
  // neighbours('0,0', width, height).forEach(nodeId => {
  //   nodeInfos[nodeId] = riskMap.get(nodeId)
  // })

  let currentNode = start
  let end = false

  let count = 0
  while (!end) {
    // Update distance for all the neighbours
    const neighbourNodes = neighbours(currentNode, width, height)
    const { distance } = nodeInfos[currentNode]
    neighbourNodes.forEach(nodeId => {
      const newDistance = distance + riskMap.get(nodeId)
      const previousDistance = nodeInfos[nodeId].distance
      // update distance if smaller
      if (newDistance < previousDistance) {
        nodeInfos[nodeId] = {
          distance: newDistance,
          parent: currentNode,
        }
      }
    })
    // Tag as visited
    visitedNodes.push(currentNode)

    // select new closest node
    const nextNodes = Object.entries(nodeInfos)
      .filter(([nodeId]) => !visitedNodes.includes(nodeId))
      .sort(([, a], [, b]) => a.distance - b.distance)

    if (!nextNodes.length) {
      end = true
    } else {
      currentNode = nextNodes[0][0]
      if (currentNode === finish) {
        end = true
      }
    }

    // display temp
    count++
    if (count % 1 == 0) {
      display(grid, buildPath(currentNode, nodeInfos))
    }
  }
  const risk = nodeInfos[finish].distance
  return [risk, buildPath(finish, nodeInfos)]
}

export function buildPath(
  head: string,
  nodeInfos: Record<string, NodeInfo>,
): string[] {
  const path: string[] = [head]

  let { parent } = nodeInfos[head]
  while (parent) {
    path.push(parent)
    parent = nodeInfos[parent].parent
  }
  return path
}

export function display(grid: Grid, path: string[]) {
  if (stdout.cursorTo) {
    stdout.cursorTo(0, 0)
    //const pathMap = path.map(chiton => [serialize(chiton), chiton.risk])
    const width = grid[0].length - 1
    const height = grid.length - 1

    const fullGrid = Array(height + 1)
      .fill(0)
      .map((_j, j) =>
        Array(width + 1)
          .fill(0)
          .map((_i, i) => ({ v: grid[j][i], path: false })),
      )

    path.map(deserialize).forEach(({ x, y }) => (fullGrid[y][x].path = true))
    const rows = fullGrid
      .map(row =>
        row
          .map(p =>
            p.path ? color(p.v, colors.bg.yellow, colors.fg.black) : p.v,
          )
          .join(''),
      )
      .join('\n')

    stdout.write(rows)
  }
}

async function run() {
  console.clear()
  const input = split`
    1163751742
    1381373672
    2136511328
    3694931569
    7463417111
    1319128137
    1359912421
    3125421639
    1293138521
    2311944581
  `
  const realInput = readFileAsLines('../src/day15/input.txt')
  const [risk, path] = shortestPath(realInput)
  // const asyncStep = async () => {
  //   // await stepWithDisplay(grid)
  //   display(grid)
  //   await sleep(200)
  // }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // for (const _ of range(1, 206)) {
  //   await asyncStep()
  // }
  //display(grid, [])
}

run()
