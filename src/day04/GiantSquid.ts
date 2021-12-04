import { splitByEmptyLine } from '../utils/input'
import { transpose } from 'ramda'

export type Draws = number[]
export type Board = Array<number[]>

export function parse(lines: string[]): [Draws, Board[]] {
  const [draws, ...boards] = splitByEmptyLine(lines)

  return [
    draws[0].split(',').map(i => +i),
    boards.map(
      board =>
        board.map(
          line =>
            line
              .trim()
              .split(/ +/)
              .map(i => +i), //
        ) as Board,
    ),
  ]
}

export function validate(board: Board, draws: Draws): boolean {
  const byRow = board.some(line => line.every(i => draws.includes(i)))
  const cols = transpose(board)
  const byCol = cols.some(line => line.every(i => draws.includes(i)))
  return byRow || byCol
}

export function findWinningBoard(
  draws: Draws,
  boards: Board[],
): [Draws, Board] {
  // Optimized implementation
  //
  // let turn = 0
  // let found: Board = null
  // let currentDraws: Draws = []
  // while (!found) {
  //   currentDraws = draws.slice(0, turn + 1)
  //   found = boards.find(board => validate(board, currentDraws))
  //   //console.log(`Turn ${turn}`)
  //   turn++
  // }
  // return [currentDraws, found]

  // Tail Rec implementation
  const recFind = (turn: number): [Draws, Board] => {
    const currentDraws = draws.slice(0, turn)
    const found = boards.find(board => validate(board, currentDraws))
    return found ? [currentDraws, found] : recFind(turn + 1)
  }
  return recFind(0)
}

export function computeScore(draws: Draws, board: Board): number {
  const unmarkedSum = board
    .flat() //
    .filter(i => !draws.includes(i)) //
    .reduce((a, b) => a + b)
  return unmarkedSum * draws[draws.length - 1]
}

export function getWinningBoardScore(input: string[]): number {
  const [draws, boards] = parse(input)
  console.log(`# draws: ${draws.length}, # boards : ${boards.length}`)
  const [draw, board] = findWinningBoard(draws, boards)
  return computeScore(draw, board)
}

export function findLastWinningBoard(
  draws: Draws,
  boards: Board[],
): [Draws, Board] {
  let turn = 0
  let currentDraws: Draws = []
  let remainingBoards = boards
  while (remainingBoards.length > 1) {
    currentDraws = draws.slice(0, turn + 1)
    remainingBoards = remainingBoards.filter(
      board => !validate(board, currentDraws),
    )
    turn++
  }
  return [currentDraws, remainingBoards[0]]
}

export function getLastWinningBoardScore(input: string[]): number {
  const [draws, boards] = parse(input)
  const [, board] = findLastWinningBoard(draws, boards)
  // needs to find the winning draw for the last board
  const [draw] = findWinningBoard(draws, [board])
  return computeScore(draw, board)
}
