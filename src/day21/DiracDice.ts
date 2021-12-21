import { range } from '../utils/input'

const mod = (n: number) => (x: number) => x % n || n
const mod100 = mod(100)
const mod10 = mod(10)

export function diceRoll(n: number): number {
  const t = (n - 1) * 3 + 1
  return [t, t + 1, t + 2].map(mod100).reduce((a, b) => a + b)
}

export function play(p1: number, p2: number) {
  let p1Score = 0
  let p2Score = 0
  let pos1 = p1
  let pos2 = p2
  let count = 1
  while (p1Score < 1000 && p2Score < 1000) {
    pos1 = mod10(pos1 + diceRoll(count))
    p1Score += pos1
    if (p1Score < 1000) {
      count++
      pos2 = mod10(pos2 + diceRoll(count))
      p2Score += pos2
      if (p2Score < 1000) {
        count++
      }
    }
  }
  return {
    p1Score,
    p2Score,
    rolls: count * 3,
  }
}

// For 3 consecutive rolls
// Ex: 4 can occur 3 times
// {
//   "3": 1,
//   "4": 3,
//   "5": 6,
//   "6": 7,
//   "7": 6,
//   "8": 3,
//   "9": 1
// }
// prettier-ignore
export const possibleOutcomes: Record<string, number> =
  range(1, 3).flatMap(i =>
    range(1, 3).flatMap(j =>
      range(1, 3).flatMap(k =>
        i + j + k)
  ),
).reduce( (acc, i) => {
    if (acc[i]) {
      acc[i]++
    } else acc[i] = 1
    return acc
  }, {})

type Wins = [number, number]

export function findMultiverseWinner(pos1: number, pos2: number): number {
  const buildKey = (
    pos1: number,
    pos2: number,
    p1Score: number,
    p2Score: number,
  ): string => [pos1, pos2, p1Score, p2Score].join('|')

  const cache = new Map<string, Wins>()

  const recMultiverse = (
    pos1: number,
    pos2: number,
    p1Score: number,
    p2Score: number,
  ): Wins => {
    const key = buildKey(pos1, pos2, p1Score, p2Score)
    if (cache.has(key)) {
      return cache.get(key)
    }
    // Check if previous player has won
    if (p2Score > 20) {
      return [0, 1]
    }
    const [p1, p2] = Object.entries(possibleOutcomes).reduce(
      ([p1Wins, p2Wins], [move, occurrences]) => {
        const newPos1 = mod10(pos1 + +move)
        const newP1Score = p1Score + newPos1
        // Swich p1 and p2 for the new turn
        const [p2, p1] = recMultiverse(pos2, newPos1, p2Score, newP1Score)
        cache.set(buildKey(pos2, newPos1, p2Score, newP1Score), [p2, p1])
        return [p1Wins + p1 * occurrences, p2Wins + p2 * occurrences]
      },
      [0, 0],
    )
    return [p1, p2]
  }

  const [p1, p2] = recMultiverse(pos1, pos2, 0, 0)
  return Math.max(p1, p2)
}
