import { readFile } from '../utils/input'
import {
  applyStepN,
  countAfterNStep,
  parse,
  step,
} from './ExtendedPolymerization'

const realInput = readFile('day14/input.txt')

const input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`

const [, rules] = parse(input)

describe('Extended Polymerization', () => {
  it('should parse', () => {
    const [start, rules] = parse(input)
    expect(start).toEqual('NNCB')
    expect(rules.size).toEqual(16)
    expect(rules.get('HH')).toEqual('N')
  })

  it('should apply step', () => {
    const applyStep = step(rules)
    expect(applyStep('NNCB')).toEqual('NCNBCHB')
    expect(applyStep('NBBBCNCCNBBNBNBBCHBHHBCHB')).toEqual(
      'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB',
    )
  })

  it('should apply step n times', () => {
    expect(applyStepN(rules, 'NNCB', 4)).toEqual(
      'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB',
    )
  })

  it('should count diff max min occurrences after 10 steps ⭐️', () => {
    expect(countAfterNStep(input, 10)).toEqual(1588)
    expect(countAfterNStep(realInput, 10)).toEqual(3247)
  })

  it('should count diff max min occurrences after 40 steps ⭐⭐️️', () => {
    //expect(countAfterNStep(input, 40)).toEqual(2_188_189_693_529)
  })
})
