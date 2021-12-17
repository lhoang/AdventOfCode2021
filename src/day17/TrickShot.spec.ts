import {
  display,
  findAllValidTrajectories,
  findHighestYTrajectory,
  parseArea,
  step,
  trajectory,
} from './TrickShot'

const realInput = 'target area: x=150..171, y=-129..-70'
const input = 'target area: x=20..30, y=-10..-5'

describe('Trick Shot', () => {
  it('should parse area', () => {
    expect(parseArea(input)).toEqual([
      { x: 20, y: -5 },
      { x: 30, y: -10 },
    ])
  })

  it.skip('should display', () => {
    const area = parseArea(input)
    const path = [
      { x: 6, y: 3 },
      { x: 11, y: 5 },
      { x: 15, y: 6 },
      { x: 18, y: 6 },
      { x: 20, y: 5 },
      { x: 21, y: 3 },
      { x: 21, y: 0 },
      { x: 21, y: -4 },
      { x: 21, y: -9 },
    ]
    display(area, path)
  })

  it('should compute step', () => {
    const s1 = { point: { x: 0, y: 0 }, velocity: { x: 6, y: 3 } }
    expect(step(s1)).toEqual({
      point: { x: 6, y: 3 },
      velocity: { x: 5, y: 2 },
    })

    const s2 = { point: { x: 6, y: 3 }, velocity: { x: 5, y: 2 } }
    expect(step(s2)).toEqual({
      point: { x: 11, y: 5 },
      velocity: { x: 4, y: 1 },
    })
  })

  it('should compute trajectory', () => {
    const area = parseArea(input)
    const path = trajectory(area, { x: 6, y: 3 })
    expect(path).toEqual([
      { x: 0, y: 0 },
      { x: 6, y: 3 },
      { x: 11, y: 5 },
      { x: 15, y: 6 },
      { x: 18, y: 6 },
      { x: 20, y: 5 },
      { x: 21, y: 3 },
      { x: 21, y: 0 },
      { x: 21, y: -4 },
      { x: 21, y: -9 },
    ])
    display(area, path)

    const path2 = trajectory(area, { x: 17, y: -4 })
    display(area, path2)
  })

  it.skip('should display the real input', () => {
    const area = parseArea(realInput)
    const path = trajectory(area, { x: 17, y: 104 })
    display(area, path)
  })

  it('should find the highest trajectory', () => {
    expect(findHighestYTrajectory(input)).toEqual(45)
    expect(findHighestYTrajectory(realInput)).toEqual(8256)
  })

  it('should find all valid trajectories', () => {
    expect(findAllValidTrajectories(input)).toEqual(112)
    expect(findAllValidTrajectories(realInput)).toEqual(2326) //2207
  })
})
