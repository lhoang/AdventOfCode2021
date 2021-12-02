import { compute, computeAim, part1, part2 } from './Dive'

describe('Dive', () => {
  const instructions = [
    'forward 5',
    'down 5',
    'forward 8',
    'up 3',
    'down 8',
    'forward 2',
  ]
  it('should find coords', () => {
    expect(compute(instructions)).toEqual({
      x: 15,
      y: 10,
    })
  })

  it('should find destination coords ⭐️', () => {
    expect(part1()).toEqual(1604850)
  })

  it('should find coords with aim', () => {
    expect(computeAim(instructions)).toEqual({
      x: 15,
      y: 60,
      aim: 10,
    })
  })

  it('should find destination coords ⭐⭐️', () => {
    expect(part2()).toEqual(1685186100)
  })
})
