import { readFileAsLines, split } from '../utils/input'
import { display, findNoMove, step, stepDown, stepRight } from './SeaCucumber'

const realInput = readFileAsLines('day25/input.txt')
const input = split`
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`

describe('Sea cucumber', () => {
  it('should step right', () => {
    const grid = stepRight(input)
    display(grid)
  })

  it('should step down', () => {
    const grid = stepDown(input)
    display(grid)
  })

  it('should step n times', () => {
    const grid1 = step(input, 1)
    expect(grid1).toEqual(split`
      ....>.>v.>
      v.v>.>v.v.
      >v>>..>v..
      >>v>v>.>.v
      .>v.v...v.
      v>>.>vvv..
      ..v...>>..
      vv...>>vv.
      >.v.v..v.v
    `)
    const grid50 = step(input, 50)
    expect(grid50).toEqual(split`
      ..>>v>vv.v
      ..v.>>vv..
      v.>>v>>v..
      ..>>>>>vv.
      vvv....>vv
      ..v....>>>
      v>.......>
      .vv>....v>
      .>v.vv.v..
    `)
  })

  it('should first step where there is no move ⭐️', () => {
    expect(findNoMove(input)).toEqual(58)
    expect(findNoMove(realInput)).toEqual(380)
  })
})
