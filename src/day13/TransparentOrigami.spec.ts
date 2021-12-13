import {
  display,
  fold,
  foldPaper,
  parse,
  removeDuplicates,
} from './TransparentOrigami'
import { readFile } from '../utils/input'

const realInput = readFile('day13/input.txt')
const input = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`

describe('Transparent Origami', () => {
  it('should parse input', () => {
    const [points, instructions] = parse(input)

    expect(points).toHaveLength(18)
    expect(points[5]).toEqual({ x: 4, y: 11 })

    expect(instructions).toEqual([
      {
        axis: 'y',
        value: 7,
      },
      {
        axis: 'x',
        value: 5,
      },
    ])
  })

  it('should remove duplicates', () => {
    expect(
      removeDuplicates([
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ]),
    ).toEqual([
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 1 },
    ])
  })

  it('should fold', () => {
    const [points, instructions] = parse(input)
    const fold1 = fold(points, instructions[0])
    display(fold1)
    expect(fold1).toHaveLength(17)
    const fold2 = fold(fold1, instructions[1])
    display(fold2)
    expect(fold2).toHaveLength(16)
  })

  it('should fold once ⭐️', () => {
    const [points, instructions] = parse(realInput)
    const fold1 = fold(points, instructions[0])
    expect(fold1).toHaveLength(790)
  })

  it('should fold once ⭐️', () => {
    const paper = foldPaper(realInput)
    display(paper) // PGHZBFJC
    expect(paper).toHaveLength(96)
  })
})
