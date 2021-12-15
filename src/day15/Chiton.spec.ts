import { readFileAsLines, split } from '../utils/input'
import {
  buildPath,
  display,
  neighbours,
  NodeInfo,
  parse,
  parseToNodes,
  shortestPath,
} from './Chiton'

const realInput = readFileAsLines('day15/input.txt')

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
describe('Chiton', () => {
  it('should parse', () => {
    const grid = parse(input)
    expect(grid).toHaveLength(10)
    expect(grid[1][2]).toEqual(8)
  })

  it('should parse to nodes', () => {
    const [nodesMap, width, height] = parseToNodes(input)
    expect(nodesMap.size).toEqual(100)
    expect(nodesMap.get('2,1')).toEqual(8)
    expect(width).toEqual(10)
    expect(height).toEqual(10)
  })

  it('should find neighbours', () => {
    const [, width, height] = parseToNodes(input)
    expect(neighbours('2,3', width, height)).toEqual([
      '2,2',
      '2,4',
      '1,3',
      '3,3',
    ])
    expect(neighbours('0,2', width, height)).toEqual(['0,1', '0,3', '1,2'])
  })

  it('should display grid', () => {
    const grid = parse(input)
    display(grid, ['0,0', '0,1', '0,2', '1,2', '2,2'])
  })

  it('should build path', () => {
    const nodeInfos: Record<string, NodeInfo> = {
      '9,9': {
        distance: 45,
        parent: '8,9',
        heuristic: 0,
      },
      '8,9': {
        distance: 40,
        parent: '8,8',
        heuristic: 0,
      },
      '8,8': {
        distance: 35,
        parent: '0,0',
        heuristic: 0,
      },
      '0,0': {
        distance: 0,
        parent: null,
        heuristic: 0,
      },
    }

    expect(buildPath('9,9', nodeInfos)).toEqual(['9,9', '8,9', '8,8', '0,0'])
  })

  it('should find shortest path', () => {
    const [risk, path] = shortestPath(input)
    const grid = parse(input)
    display(grid, path)
    expect(risk).toEqual(40)
  })

  it('should find shortest path ⭐', () => {
    const [risk, path] = shortestPath(realInput)
    const grid = parse(realInput)
    display(grid, path)
    expect(risk).toEqual(373)
  })
})
