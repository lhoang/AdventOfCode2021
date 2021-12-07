import { readFile, readFileAsNumArray } from '../utils/input'
import {
  computeMinFuelConsumption,
  computeMinFuelConsumptionCrab,
  findAverage,
  findMedian,
  getFuelConsumption,
  getFuelConsumptionCrab,
  getRepartition,
  trigular,
} from './TreacheryWhale'

const input = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]
const realInput = readFileAsNumArray('day07/input.txt')

describe('TreacheryWhale', () => {
  it('should get repartition and median', () => {
    const rep = getRepartition(input)
    const median = findMedian(rep, input.length)

    expect(median).toEqual(2)
  })

  it('should get repartition and median (real)', () => {
    const rep = getRepartition(realInput)
    const median = findMedian(rep, realInput.length)

    expect(median).toEqual(329)
  })

  it('should get fuel consumption', () => {
    const rep = getRepartition(input)
    expect(getFuelConsumption(rep, 2)).toEqual(37)
    expect(getFuelConsumption(rep, 1)).toEqual(41)
    expect(getFuelConsumption(rep, 3)).toEqual(39)
    expect(getFuelConsumption(rep, 10)).toEqual(71)

    expect(computeMinFuelConsumption(input)).toEqual(37)
  })

  it('should compute the miniman fuel consumption ⭐️', () => {
    expect(computeMinFuelConsumption(realInput)).toEqual(340052)
  })

  it('should find average', () => {
    const rep = getRepartition(input)
    expect(findAverage(rep, input.length)).toEqual(5)
  })

  it('should compute triangular numbers', () => {
    expect(trigular(0)).toEqual(0)
    expect(trigular(1)).toEqual(1)
    expect(trigular(3)).toEqual(6)
    expect(trigular(1000)).toEqual(500500)
  })

  it('should get fuel consumption Crab way', () => {
    const rep = getRepartition(input)
    expect(getFuelConsumptionCrab(rep, 5)).toEqual(168)
    expect(getFuelConsumptionCrab(rep, 2)).toEqual(206)

    expect(computeMinFuelConsumptionCrab(input)).toEqual(168)
  })

  it('should compute the miniman fuel consumption ⭐⭐️', () => {
    expect(computeMinFuelConsumptionCrab(realInput)).toEqual(92_948_968)
  })
})
