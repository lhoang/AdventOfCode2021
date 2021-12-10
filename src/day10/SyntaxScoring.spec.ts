import { readFileAsLines, split } from '../utils/input'
import { errorScore, middleScore, parseLine, scoreLine } from './SyntaxScoring'

const input = split`
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

const realInput = readFileAsLines('day10/input.txt')

describe('Syntax Scoring', () => {
  it('should parse corrupted lines', () => {
    const [, corrupted1] = parseLine('{([(<{}[<>[]}>{[]{[(<()>')
    expect(corrupted1).toEqual('}')

    const [, corrupted2] = parseLine('[[<[([]))<([[{}[[()]]]')
    expect(corrupted2).toEqual(')')

    const [, corrupted3] = parseLine('[{[{({}]{}}([{[{{{}}([]')
    expect(corrupted3).toEqual(']')

    const [, corrupted4] = parseLine('[<(<(<(<{}))><([]([]()')
    expect(corrupted4).toEqual(')')

    const [, corrupted5] = parseLine('<{([([[(<>()){}]>(<<{{')
    expect(corrupted5).toEqual('>')

    const [, notCorrupted] = parseLine('[({(<(())[]>[[{[]{<()<>>')
    expect(notCorrupted).toEqual('')
  })

  it('should compute error score ⭐ ', () => {
    expect(errorScore(input)).toEqual(26397)
    expect(errorScore(realInput)).toEqual(392421)
  })

  it('should complete missing lines', () => {
    const [missing1] = parseLine('[({(<(())[]>[[{[]{<()<>>')
    expect(missing1).toEqual('}}]])})]')
  })

  it('should compute line score', () => {
    expect(scoreLine('}}]])})]')).toEqual(288957)
  })

  it('should compute middle score ⭐️⭐️', () => {
    expect(middleScore(input)).toEqual(288957)
    expect(middleScore(realInput)).toEqual(2769449099)
  })
})
