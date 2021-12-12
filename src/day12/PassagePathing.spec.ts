import { readFileAsLines, split } from '../utils/input'
import {
  allowedNodes,
  allowedNodesSmallCave,
  bfs,
  countAllPaths,
  countAllPathsWithSmallCave,
  dfs,
  parseLinks,
} from './PassagePathing'

const realInput = readFileAsLines('day12/input.txt')
const input3 = split`
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`

const input2 = split`
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`

const input = split`
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`

describe('Passage Pathing', () => {
  it('should parse links', () => {
    const links = parseLinks(input)
    expect(Object.keys(links)).toHaveLength(6)
    expect(links['A']).toEqual(['start', 'c', 'b', 'end'])
    expect(links['c']).toEqual(['A'])
  })

  it('should find all paths - BFS (slower)', () => {
    const links = parseLinks(input)
    const paths = bfs(links, 'start', 'end', allowedNodes)
    expect(paths).toHaveLength(10)
    expect(paths).toEqual(split`
      start,A,b,A,c,A,end
      start,A,b,A,end
      start,A,b,end
      start,A,c,A,b,A,end
      start,A,c,A,b,end
      start,A,c,A,end
      start,A,end
      start,b,A,c,A,end
      start,b,A,end
      start,b,end
    `)
  })

  it('should find all paths - DFS (faster', () => {
    const links = parseLinks(input2)
    const paths = dfs(links, 'start', 'end', allowedNodes)
    expect(paths).toHaveLength(19)
    expect(paths).toEqual(split`
      start,HN,dc,HN,end
      start,HN,dc,HN,kj,HN,end
      start,HN,dc,end
      start,HN,dc,kj,HN,end
      start,HN,end
      start,HN,kj,HN,dc,HN,end
      start,HN,kj,HN,dc,end
      start,HN,kj,HN,end
      start,HN,kj,dc,HN,end
      start,HN,kj,dc,end
      start,dc,HN,end
      start,dc,HN,kj,HN,end
      start,dc,end
      start,dc,kj,HN,end
      start,kj,HN,dc,HN,end
      start,kj,HN,dc,end
      start,kj,HN,end
      start,kj,dc,HN,end
      start,kj,dc,end
    `)
  })

  it('should find all paths ⭐️', () => {
    expect(countAllPaths(realInput)).toEqual(4573)
  })

  it('should allow next nodes with small cave visited twice', () => {
    const newNodes = ['A', 'b', 'c', 'start', 'end']
    expect(allowedNodesSmallCave(newNodes, ['start', 'A', 'b'])) //
      .toEqual(['A', 'b', 'c', 'end'])

    expect(allowedNodesSmallCave(newNodes, ['start', 'b', 'A', 'b'])) //
      .toEqual(['A', 'c', 'end'])

    expect(allowedNodesSmallCave(['b'], ['start', 'A', 'b', 'd'])) //
      .toEqual(['b'])
  })

  it('should find all paths with small cave visited twice - input', () => {
    expect(countAllPathsWithSmallCave(input)).toEqual(36)
  })

  it('should find all paths with small cave visited twice - input2', () => {
    expect(countAllPathsWithSmallCave(input2)).toEqual(103)
  })

  it('should find all paths with small cave visited twice - input3', () => {
    expect(countAllPathsWithSmallCave(input3)).toEqual(3509)
  })

  it('should find all paths with small cave visited twice ⭐⭐️', () => {
    expect(countAllPathsWithSmallCave(realInput)).toEqual(117509)
  })
})
