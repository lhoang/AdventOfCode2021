import { readFileAsLines, split } from '../utils/input'
import {
  computeScore,
  findLastWinningBoard,
  findWinningBoard,
  getLastWinningBoardScore,
  getWinningBoardScore,
  parse,
  validate,
} from './GiantSquid'

const input = split`
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

describe('Giant Squid', () => {
  it('should parse the input', () => {
    expect(parse(input)).toEqual([
      [
        7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22,
        18, 20, 8, 19, 3, 26, 1,
      ],
      [
        [
          [22, 13, 17, 11, 0],
          [8, 2, 23, 4, 24],
          [21, 9, 14, 16, 7],
          [6, 10, 3, 18, 5],
          [1, 12, 20, 15, 19],
        ],

        [
          [3, 15, 0, 2, 22],
          [9, 18, 13, 17, 5],
          [19, 8, 7, 25, 23],
          [20, 11, 10, 24, 4],
          [14, 21, 16, 12, 6],
        ],
        [
          [14, 21, 17, 24, 4],
          [10, 16, 15, 9, 19],
          [18, 8, 23, 26, 20],
          [22, 11, 13, 6, 5],
          [2, 0, 12, 3, 7],
        ],
      ],
    ])
  })

  it('should parse weird input', () => {
    const test = split`
    1,2,3,4
    
    79 33  4 61 66
    31 49 67 30 98
    43 71 84 72 52
    29 39 81 35 37
     2 95 94 13 14
 `
    expect(parse(test)).toEqual([
      [1, 2, 3, 4],
      [
        [
          [79, 33, 4, 61, 66],
          [31, 49, 67, 30, 98],
          [43, 71, 84, 72, 52],
          [29, 39, 81, 35, 37],
          [2, 95, 94, 13, 14],
        ],
      ],
    ])
  })

  it('should validate board', () => {
    const board = [
      [14, 21, 17, 24, 4],
      [10, 16, 15, 9, 19],
      [18, 8, 23, 26, 20],
      [22, 11, 13, 6, 5],
      [2, 0, 12, 3, 7],
    ]
    const draws = [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21]
    expect(validate(board, draws)).toBeFalsy()

    expect(validate(board, [...draws, 24])).toBeTruthy()
    expect(validate(board, [18, 10, 14, 22, 2])).toBeTruthy()
  })

  it('should find the winning board', () => {
    const [draws, boards] = parse(input)
    expect(findWinningBoard(draws, boards)).toEqual([
      [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24],
      [
        [14, 21, 17, 24, 4],
        [10, 16, 15, 9, 19],
        [18, 8, 23, 26, 20],
        [22, 11, 13, 6, 5],
        [2, 0, 12, 3, 7],
      ],
    ])
  })

  it('should compute final score', () => {
    expect(
      computeScore(
        [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24],
        [
          [14, 21, 17, 24, 4],
          [10, 16, 15, 9, 19],
          [18, 8, 23, 26, 20],
          [22, 11, 13, 6, 5],
          [2, 0, 12, 3, 7],
        ],
      ),
    ).toEqual(4512)
  })

  it('should compute final score ', () => {
    expect(getWinningBoardScore(input)).toEqual(4512)
  })

  it('should compute final score ⭐️', () => {
    expect(getWinningBoardScore(readFileAsLines('day04/input.txt'))).toEqual(
      14093,
    )
  })

  it('should find last winning board', () => {
    const [draws, boards] = parse(input)
    const [draw, board] = findLastWinningBoard(draws, boards)
    expect(draw).toEqual([7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16])
    expect(board).toEqual([
      [3, 15, 0, 2, 22],
      [9, 18, 13, 17, 5],
      [19, 8, 7, 25, 23],
      [20, 11, 10, 24, 4],
      [14, 21, 16, 12, 6],
    ])
    const [realDraw] = findWinningBoard(draws, [board])
    expect(computeScore(realDraw, board)).toEqual(1924)
  })
})

it('should compute final score ⭐️⭐️', () => {
  expect(getLastWinningBoardScore(readFileAsLines('day04/input.txt'))).toEqual(
    17388,
  )
})
