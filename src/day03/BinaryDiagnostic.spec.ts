import {
  computeCO2Rating,
  computeO2Rating,
  getLifeSupportRating,
  getPowerConsumption,
} from './BinaryDiagnostic'
import { readFileAsLines, split } from '../utils/input'

describe('Binary Diagnostic', () => {
  const report = split`
    00100
    11110
    10110
    10111
    10101
    01111
    00111
    11100
    10000
    11001
    00010
    01010
  `

  it('should get the power consumption', () => {
    expect(getPowerConsumption(report)).toEqual(198)
  })

  it('should get the power consumption ⭐️', () => {
    expect(getPowerConsumption(readFileAsLines('day03/input.txt'))).toBe(
      4139586,
    )
  })

  it('should compute 02 rating', () => {
    expect(computeO2Rating(report)).toEqual(23)
  })

  it('should compute C02 rating', () => {
    expect(computeCO2Rating(report)).toEqual(10)
  })

  it('should get life support rating ⭐', () => {
    expect(getLifeSupportRating(readFileAsLines('day03/input.txt'))).toBe(
      1800151,
    )
  })
})
