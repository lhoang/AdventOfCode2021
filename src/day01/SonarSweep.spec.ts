import { countIncreases, part1, part2, slidingWindow } from './SonarSweep'
import { split } from '../utils/input'

describe('Depth Measurement', () => {
  const measures = split`
    199
    200
    208
    210
    200
    207
    240
    269
    260
    263
    `.map(i => +i)

  it('should count increases', () => {
    expect(countIncreases(measures)).toBe(7)
  })

  it('should find ⭐️ answer', () => {
    expect(part1()).toBe(1559)
  })

  it('should compute the 3-sliding window', () => {
    expect(slidingWindow(measures)).toEqual([
      607, 618, 618, 617, 647, 716, 769, 792,
    ])
  })

  it('should count increases in sliding window', () => {
    expect(countIncreases(slidingWindow(measures))).toBe(5)
  })

  it('should find ⭐⭐️ answer', () => {
    expect(part2()).toBe(1600)
  })
})
