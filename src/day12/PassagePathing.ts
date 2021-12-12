import { reduceBy } from 'ramda'

/**
 * Exemple of Links :
 * ```
 {
  start: ['A', 'b'],
  A: ['start', 'c', 'b', 'end'],
  b: ['start', 'A', 'd', 'end'],
  c: ['A'],
  d: ['b'],
  end: ['A', 'b'],
}
 ```
 */
export type Links = Record<string, string[]>

export function parseLinks(input: string[]): Links {
  const allLinks = input.flatMap(line => {
    const pair = line.split('-')
    return [[...pair], [...pair.reverse()]]
  })
  return reduceBy(
    (acc, [, node]) => [...acc, node],
    [],
    ([node]) => node,
    allLinks,
  )
}

interface Item {
  current: string
  nodes: string[]
}

/**
 * Breath-First Search
 */
export function bfs(
  links: Links,
  start: string,
  end: string,
  condition: (_nodes: string[], _builtPath: string[]) => string[],
): string[] {
  const queue: Item[] = [{ current: start, nodes: [] }]
  const paths: Array<string[]> = []
  while (queue.length) {
    const { current, nodes } = queue.shift()
    const builtPath = [...nodes, current]

    if (current == end) {
      paths.push(builtPath)
    } else {
      const nextNodes = condition(links[current], builtPath)
      queue.push(
        ...nextNodes.map(node => ({ current: node, nodes: builtPath })),
      )
    }
  }
  return paths.map(p => p.join(',')).sort()
}

const smallCaveRegex = /[a-z]+/
const isSmallCave = (node: string) => smallCaveRegex.test(node)

/**
 * Depth-First Search
 */
export function dfs(
  links: Links,
  start: string,
  end: string,
  condition: (_nodes: string[], _builtPath: string[]) => string[],
): string[] {
  const stack: Item[] = [{ current: start, nodes: [] }]
  const paths: Array<string[]> = []
  while (stack.length) {
    const { current, nodes } = stack.pop()
    const builtPath = [...nodes, current]

    if (current == end) {
      paths.push(builtPath)
    } else {
      const nextNodes = condition(links[current], builtPath)
      stack.push(
        ...nextNodes.map(node => ({ current: node, nodes: builtPath })),
      )
    }
  }
  return paths.map(p => p.join(',')).sort()
}

export function allowedNodes(nodes: string[], builtPath: string[]): string[] {
  return nodes.filter(node => !builtPath.filter(isSmallCave).includes(node))
}

export function allowedNodesSmallCave(
  nodes: string[],
  builtPath: string[],
): string[] {
  const smallCaves = builtPath.filter(
    node => isSmallCave(node) && 'start' !== node,
  )
  const visitedTwice = smallCaves.length > new Set(smallCaves).size

  return nodes.filter(node => {
    return visitedTwice
      ? !builtPath.filter(isSmallCave).includes(node)
      : node !== 'start'
  })
}

export function countAllPaths(input: string[]): number {
  const links = parseLinks(input)
  const paths = dfs(links, 'start', 'end', allowedNodes)
  return paths.length
}

export function countAllPathsWithSmallCave(input: string[]): number {
  const links = parseLinks(input)
  const paths = dfs(links, 'start', 'end', allowedNodesSmallCave)
  return paths.length
}
