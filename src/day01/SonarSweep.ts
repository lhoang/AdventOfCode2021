import { range, readFileAsLines } from '../utils/input'

export function countIncreases(measures: number[]): number {
  return range(1, measures.length - 1)
    .map(i => measures[i] - measures[i - 1])
    .filter(m => m > 0).length
}

export function part1(): number {
  const measures = readFileAsLines('day01/input.txt').map(i => +i)
  return countIncreases(measures)
}

export function slidingWindow(measures: number[]): number[] {
  return range(0, measures.length - 3).map(
    i => measures[i] + measures[i + 1] + measures[i + 2],
  )
}

export function part2(): number {
  const measures = readFileAsLines('day01/input.txt').map(i => +i)
  return countIncreases(slidingWindow(measures))
}
