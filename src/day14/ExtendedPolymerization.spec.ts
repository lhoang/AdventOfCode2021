import { readFile } from '../utils/input'
import {
  applyStepN,
  countAfterNStep,
  countAfterNStepRepartition,
  diffMaxMin,
  optimizedStep,
  parse,
  parseRepartition,
  repartitionAfterNStep,
  step,
  stepRepartition,
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

  it('should apply step (Optimized)', () => {
    const applyStep = optimizedStep(rules)
    const start1 = [...'NNCB']
    applyStep(start1)
    expect(start1.join('')).toEqual('NCNBCHB')
    const start2 = [...'NBBBCNCCNBBNBNBBCHBHHBCHB']
    applyStep(start2)
    expect(start2.join('')).toEqual(
      'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB',
    )
  })

  it('should apply step n times', () => {
    expect(applyStepN(rules, 'NNCB', 4)).toEqual(
      'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB',
    )
  })

  it('should get repartition after n steps', () => {
    const rep3 = repartitionAfterNStep(rules, 'NNCB', 3)
    expect(rep3).toEqual({ N: 5, B: 11, C: 5, H: 4 })

    const rep4 = repartitionAfterNStep(rules, 'NNCB', 4)
    expect(rep4).toEqual({ N: 11, B: 23, C: 10, H: 5 })

    const rep10 = repartitionAfterNStep(rules, 'NNCB', 10)
    expect(rep10).toEqual({ N: 865, B: 1749, C: 298, H: 161 })
  })

  it('should count diff max min occurrences after 10 steps ⭐️', () => {
    expect(countAfterNStep(input, 10)).toEqual(1588)
    expect(countAfterNStep(realInput, 10)).toEqual(3247)
  })

  it('should parse repartition', () => {
    const [repartition, rules] = parseRepartition(input)
    expect(rules.size).toEqual(16)
    expect(rules.get('HH')).toEqual(['HN', 'NH'])
    expect(rules.get('NC')).toEqual(['NB', 'BC'])
    expect(repartition).toEqual(
      expect.objectContaining({
        NN: 1,
        NC: 1,
        CB: 1,
        BC: 0,
      }),
    )
  })

  it('should apply step for repartition', () => {
    const [repartition, rules] = parseRepartition(input)
    // NNCB
    const rep1 = stepRepartition(rules, repartition)
    // NCNBCHB
    // console.log({ rep1 })
    expect(rep1).toEqual(
      expect.objectContaining({
        NC: 1,
        CN: 1,
        NB: 1,
        BC: 1,
        CH: 1,
        HB: 1,
        CB: 0,
      }),
    )
    const rep2 = stepRepartition(rules, rep1)
    // NBCCNBBBCBHCB
    expect(rep2).toEqual(
      expect.objectContaining({
        CB: 2,
        BC: 2,
        BH: 1,
      }),
    )
    const rep3 = stepRepartition(rules, rep2)
    // NBBBCNCCNBBNBNBBCHBHHBCHB
    // { N: 5, B: 11, C: 5, H: 4 }
    expect(rep3).toEqual(
      expect.objectContaining({
        BB: 4,
        BC: 3,
        BH: 1,
      }),
    )
  })

  it('should count diff max min from repartition', () => {
    // NBBBCNCCNBBNBNBBCHBHHBCHB
    // { N: 5, B: 11, C: 5, H: 4 }
    const repartition = {
      CB: 0,
      BH: 1,
      HC: 0,
      HH: 1,
      HN: 0,
      NH: 0,
      HB: 3,
      BC: 3,
      CC: 1,
      CN: 2,
      NB: 4,
      CH: 2,
      BB: 4,
      BN: 2,
      NC: 1,
    }

    expect(diffMaxMin(repartition)).toEqual(7)
  })

  it('should count diff max min occurrences after 10 steps ⭐ (repartition)️', () => {
    expect(countAfterNStepRepartition(input, 10)).toEqual(1588)
    expect(countAfterNStepRepartition(realInput, 10)).toEqual(3247)
  })

  it('should count diff max min occurrences after 40 steps ⭐⭐ (repartition)️', () => {
    expect(countAfterNStepRepartition(input, 40)).toEqual(2_188_189_693_529)

    const superRes = countAfterNStepRepartition(realInput, 40)
    expect(superRes).toEqual(4_110_568_157_153)
  })
})
