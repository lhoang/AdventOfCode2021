import { readFileAsLines, split } from '../utils/input'
import {
  analyseSegments,
  countEasyDigits,
  decode,
  decodeAllLinesAndSum,
  parse,
} from './SevenSegmentSearch'

const input = split`
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`
const ex =
  'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'

const realInput = readFileAsLines('day08/input.txt')

describe('Seven Segment Search', () => {
  it('should parse input', () => {
    const [patterns, output] = parse(input[0])
    expect(patterns).toHaveLength(10)
    expect(output).toEqual(['fdgacbe', 'cefdb', 'cefbgd', 'gcbe'])
  })

  it('should count easy digits ⭐️', () => {
    expect(countEasyDigits(input)).toEqual(26)
    expect(countEasyDigits(realInput)).toEqual(369)
  })

  it('should analyse segments', () => {
    const [patterns] = parse(ex)

    const numbers = analyseSegments(patterns)
    expect(numbers).toEqual({
      ab: 1,
      abcdef: 9,
      abcdefg: 8,
      abcdeg: 0,
      abcdf: 3,
      abd: 7,
      abef: 4,
      acdfg: 2,
      bcdef: 5,
      bcdefg: 6,
    })
  })

  it('should decode', () => {
    expect(decode(parse(ex))).toEqual(5353)
    expect(decode(parse(input[0]))).toEqual(8394)
    expect(decode(parse(input[1]))).toEqual(9781)
    expect(decode(parse(input[2]))).toEqual(1197)
    expect(decode(parse(input[3]))).toEqual(9361)
    expect(decode(parse(input[4]))).toEqual(4873)
    expect(decode(parse(input[5]))).toEqual(8418)
    expect(decode(parse(input[6]))).toEqual(4548)
    expect(decode(parse(input[7]))).toEqual(1625)
    expect(decode(parse(input[8]))).toEqual(8717)
    expect(decode(parse(input[9]))).toEqual(4315)
  })

  it('should decode all lines and sum ⭐️', () => {
    expect(decodeAllLinesAndSum(input)).toEqual(61229)
    expect(decodeAllLinesAndSum(realInput)).toEqual(1031553)
  })
})
