import { readFileAsLines, split } from '../utils/input'
import {
  countSafeAreas,
  display,
  generatePoints,
  genId,
  isDiagonal,
  parseLine,
} from './HydrothermalVenture'
import { countBy } from 'ramda'

const input = split`
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`

const realInput = readFileAsLines('day05/input.txt')

describe('Hydrothermal Venture', () => {
  it('should parse lines', () => {
    expect(
      parseLine(['0,9 -> 5,9', '8,0 -> 0,8', '239,412 -> 334,444']),
    ).toEqual([
      { x1: 0, y1: 9, x2: 5, y2: 9 },
      { x1: 8, y1: 0, x2: 0, y2: 8 },
      { x1: 239, y1: 412, x2: 334, y2: 444 },
    ])
  })

  it('should generate points (horizontal & vertical)', () => {
    expect(generatePoints({ x1: 1, y1: 1, x2: 1, y2: 3 })).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ])

    expect(generatePoints({ x1: 9, y1: 7, x2: 7, y2: 7 })).toEqual([
      { x: 9, y: 7 },
      { x: 8, y: 7 },
      { x: 7, y: 7 },
    ])
  })

  it('should generate Point id', () => {
    expect(genId({ x: 123, y: 456 })).toEqual('123;456')
  })

  it('should find safe areas', () => {
    expect(
      countSafeAreas({
        input,
      }),
    ).toEqual(5)
  })

  it('should find safe areas ⭐️', () => {
    expect(
      countSafeAreas({
        input: realInput,
      }),
    ).toEqual(5280)
  })

  it('should tell if a line is a diagonal', () => {
    expect(isDiagonal({ x1: 1, y1: 1, x2: 3, y2: 3 })).toBeTruthy()
    expect(isDiagonal({ x1: 9, y1: 7, x2: 7, y2: 9 })).toBeTruthy()
    expect(isDiagonal({ x1: 9, y1: 7, x2: 7, y2: 3 })).toBeFalsy()
  })

  it('should generate points (diagonale)', () => {
    const withDiagonal = true
    expect(
      generatePoints({ x1: 1, y1: 1, x2: 3, y2: 3 }, withDiagonal),
    ).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ])

    expect(
      generatePoints({ x1: 9, y1: 7, x2: 7, y2: 9 }, withDiagonal),
    ).toEqual([
      { x: 7, y: 9 },
      { x: 8, y: 8 },
      { x: 9, y: 7 },
    ])

    expect(
      generatePoints({ x1: 6, y1: 4, x2: 2, y2: 0 }, withDiagonal),
    ).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 2 },
      { x: 5, y: 3 },
      { x: 6, y: 4 },
    ])
  })

  it('should find safe areas with diagonals', () => {
    expect(
      countSafeAreas({
        input,
        withDiagonal: true,
        displayGrid: true,
      }),
    ).toEqual(12)
  })

  it('should find safe areas with diagonals ⭐️⭐️', () => {
    expect(
      countSafeAreas({
        input: realInput,
        withDiagonal: true,
        displayGrid: false,
      }),
    ).toEqual(16716)
  })

  it('should display grid', () => {
    const points = parseLine(input) //
      .flatMap(line => generatePoints(line, true))
    const pointsByOverlap = countBy(genId)(points)
    console.log(display(pointsByOverlap))
  })
})
