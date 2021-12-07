import { countBy, identity } from 'ramda'
import { range } from '../utils/input'

export function getRepartition(input: number[]): Record<number, number> {
  return countBy(identity, input)
}

export function findMedian(rep: Record<number, number>, size: number): number {
  let median = 0
  let count = 0
  for (const entry of Object.entries(rep)) {
    const [key, value] = entry
    count += value
    median = +key
    if (count >= size / 2) {
      break
    }
  }
  return median
}

export function findAverage(rep: Record<number, number>, size: number): number {
  return Math.ceil(
    Object.entries(rep).reduce(
      (
        acc,
        [key, value], //
      ) => acc + value * +key,
      0,
    ) / size,
  )
}

export function getFuelConsumption(
  rep: Record<number, number>,
  position: number,
): number {
  return Object.entries(rep).reduce(
    (
      acc,
      [key, value], //
    ) => acc + Math.abs(position - +key) * value,
    0,
  )
}

export function getFuelConsumptionCrab(
  rep: Record<number, number>,
  position: number,
  cache: Map<number, number> = new Map<number, number>(),
): number {
  return Object.entries(rep).reduce(
    (
      acc,
      [key, value], //
    ) => {
      const steps = Math.abs(position - +key)
      let fuel = 0
      if (cache.has(steps)) {
        fuel = cache.get(steps)
      } else {
        fuel = trigular(steps)
        cache.set(steps, fuel)
      }
      return acc + fuel * value
    },
    0,
  )
}

export function trigular(n: number): number {
  return range(0, n).reduce((acc, i) => acc + i)
}

export function computeMinFuelConsumption(input: number[]): number {
  const rep = getRepartition(input)
  const median = findMedian(rep, input.length)
  return getFuelConsumption(rep, median)
}

export function computeMinFuelConsumptionCrab(input: number[]): number {
  const rep = getRepartition(input)
  const avg = findAverage(rep, input.length)
  const cache = new Map<number, number>()

  return Math.min(
    getFuelConsumptionCrab(rep, avg - 1, cache),
    getFuelConsumptionCrab(rep, avg, cache),
  )
}
