import {
  explode,
  finalSum,
  findLargestMagnitude,
  Pair,
  register,
  split,
} from './Snailfish'
import { readFileAsLines, split as splitInput } from '../utils/input'

const realInput = readFileAsLines('day18/input.txt')
const input = splitInput`
      [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
      [[[5,[2,8]],4],[5,[[9,9],0]]]
      [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
      [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
      [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
      [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
      [[[[5,4],[7,7]],8],[[8,3],8]]
      [[9,3],[[9,9],[6,[4,9]]]]
      [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
      [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
    `

describe('Snailfish', () => {
  const test = '[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]] '
  const testPair = Pair.parse(test)

  it('should build Pair', () => {
    const testPair = Pair.parse(test)
    expect(testPair).toEqual({
      depth: 0,
      id: 'root',
      left: {
        depth: 1,
        id: 'L',
        left: 3,
        parent: 'root',
        right: {
          depth: 2,
          id: 'LR',
          left: 2,
          parent: 'L',
          right: {
            depth: 3,
            id: 'LRR',
            left: 1,
            parent: 'LR',
            right: {
              depth: 4,
              id: 'LRRR',
              left: 7,
              parent: 'LRR',
              right: 3,
            },
          },
        },
      },
      parent: null,
      right: {
        depth: 1,
        id: 'R',
        left: 6,
        parent: 'root',
        right: {
          depth: 2,
          id: 'RR',
          left: 5,
          parent: 'R',
          right: {
            depth: 3,
            id: 'RRR',
            left: 4,
            parent: 'RR',
            right: {
              depth: 4,
              id: 'RRRR',
              left: 3,
              parent: 'RRR',
              right: 2,
            },
          },
        },
      },
    })
  })

  it('should register', () => {
    const map = register(testPair)
    expect(map.size).toEqual(9)
  })

  it('should get ids from left to right', () => {
    expect(testPair.leftToRight()).toEqual([
      'L',
      'LR',
      'LRR',
      'LRRR',
      'R',
      'RR',
      'RRR',
      'RRRR',
    ])

    const test1 = Pair.parse('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]')
    expect(test1.leftToRight()).toEqual(['LLL', 'LL', 'LR', 'LRRL', 'LRR', 'R'])
  })

  it('should explode', () => {
    const root = Pair.parse(test)
    let res = explode(root)
    expect(res).toBeTruthy()
    expect(root.toString()).toEqual('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]')
    res = explode(root)
    expect(res).toBeTruthy()
    expect(root.toString()).toEqual('[[3,[2,[8,0]]],[9,[5,[7,0]]]]')
    res = explode(root)
    expect(res).toBeFalsy()

    const test1 = Pair.parse('[[[[[9,8],1],2],3],4]')
    explode(test1)
    expect(test1.toString()).toEqual('[[[[0,9],2],3],4]')

    const test2 = Pair.parse('[7,[6,[5,[4,[3,2]]]]]')
    explode(test2)
    expect(test2.toString()).toEqual('[7,[6,[5,[7,0]]]]')
  })

  it('should explode', () => {
    const test = Pair.parse('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')
    let res = explode(test)
    expect(test.toString()).toEqual('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]')
    res = explode(test)
    expect(test.toString()).toEqual('[[[[0,7],4],[15,[0,13]]],[1,1]]')
    res = explode(test)
    expect(res).toBeFalsy()
  })

  it('should split', () => {
    const test1 = Pair.parse('[[[[0,7],4],[15,[0,13]]],[1,1]]')
    let res = split(test1)
    expect(res).toBeTruthy()
    expect(test1.toString()).toEqual('[[[[0,7],4],[[7,8],[0,13]]],[1,1]]')
    res = split(test1)
    expect(res).toBeTruthy()
    expect(test1.toString()).toEqual('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')
    res = split(test1)
    expect(res).toBeFalsy()
  })

  it('should split 2', () => {
    const test = Pair.parse(
      '[[[[7,6],[0,6]],[[20,14],[14,0]]],[[2,[11,10]],[[0,8],[8,0]]]]',
    )
    split(test)
    expect(test.toString()).toEqual(
      '[[[[7,6],[0,6]],[[[10,10],14],[14,0]]],[[2,[11,10]],[[0,8],[8,0]]]]',
    )
  })

  it('should reduce', () => {
    const test = Pair.parse('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]')
    test.reduce()
    expect(test.toString()).toEqual('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')
  })

  it('should compute final sum', () => {
    const test1 = finalSum(splitInput`
      [1,1]
      [2,2]
      [3,3]
      [4,4]
      [5,5]
      [6,6]
    `)
    expect(test1.toString()).toEqual('[[[[5,0],[7,4]],[5,5]],[6,6]]')
  })

  it('should compute final sum - bigger', () => {
    const test1 = finalSum(splitInput`
      [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
      [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
      [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
      [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
      [7,[5,[[3,8],[1,4]]]]
      [[2,[2,2]],[8,[8,1]]]
      [2,9]
      [1,[[[9,3],9],[[9,0],[0,7]]]]
      [[[5,[7,4]],7],1]
      [[[[4,2],2],6],[8,7]]
    `)

    expect(test1.toString()).toEqual(
      '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]',
    )

    const test2 = finalSum(input)

    expect(test2.toString()).toEqual(
      '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]',
    )
  })

  it('should compute magnitude', () => {
    expect(Pair.parse('[[1,2],[[3,4],5]]').magnitude()).toEqual(143)
    expect(
      Pair.parse(
        '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]',
      ).magnitude(),
    ).toEqual(3488)

    expect(
      Pair.parse(
        '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]',
      ).magnitude(),
    ).toEqual(4140)
  })

  it('should compute real magnitude ⭐️', () => {
    expect(finalSum(realInput).magnitude()).toEqual(4033)
  })

  it.skip('should check magnitude ', () => {
    const lines = input
      .map(Pair.parse)
      .sort((a, b) => a.magnitude() - b.magnitude())
      .map(
        pair =>
          `${pair.magnitude()} - ${pair.countDepth()} - ${pair.toString()}`,
      )
      .join('\n')

    console.log(lines)
  })

  it('should find the largest magnitude', () => {
    expect(findLargestMagnitude(input)).toEqual(3993)
  })

  it('should find the largest magnitude ⭐️⭐️', () => {
    expect(findLargestMagnitude(realInput)).toEqual(4864)
  })
})
