import { stdout } from 'process'
import { color, colors } from '../utils/string'
import { split } from '../utils/input'

const errorScoreMap = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const scoreMap = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

export function parseLine(line: string): [string, string] {
  let missing = ''
  let corrupted = ''

  const check = (c: string) => {
    if (missing[0] === c) {
      missing = missing.slice(1)
    } else {
      corrupted = corrupted + c
    }
  }

  for (const c of line) {
    switch (c) {
      case '(':
        missing = ')' + missing
        break
      case '[':
        missing = ']' + missing
        break
      case '{':
        missing = '}' + missing
        break
      case '<':
        missing = '>' + missing
        break
      case ')':
      case ']':
      case '}':
      case '>':
        check(c)
        break
    }
    if (corrupted) break
  }

  return [missing, corrupted]
}

export function errorScore(input: string[]): number {
  return input
    .map(parseLine)
    .map(([, corrupted]) =>
      errorScoreMap[corrupted] ? errorScoreMap[corrupted] : 0,
    )
    .reduce((a, b) => a + b)
}

export function scoreLine(missing: string): number {
  return [...missing].reduce((acc, c) => {
    return acc * 5 + scoreMap[c]
  }, 0)
}

export function middleScore(input: string[]): number {
  const goodLines = input.map(parseLine).filter(([, corrupted]) => !corrupted)

  const scores = goodLines
    .map(([missing]) => scoreLine(missing))
    .sort((a, b) => a - b)

  return scores[Math.floor(goodLines.length / 2)]
}

export async function visualizeLine(line: string): Promise<void> {
  let missing = ''
  let corrupted: string

  const map = {
    '{': '}',
    '(': ')',
    '[': ']',
    '<': '>',
  }

  const check = (i: number, c: string) => {
    if (missing[0] === c) {
      missing = missing.slice(1)
    } else {
      corrupted = c
    }
    display(i, c, missing, corrupted)
  }
  const sleep = ms =>
    new Promise(resolve => {
      setTimeout(resolve, ms)
    })

  function display(i: number, c: string, missing: string, corrupted?: string) {
    const current = corrupted
      ? color(c, colors.fg.red)
      : color(c, colors.fg.yellow)

    const log =
      line.slice(0, i) +
      current +
      color(line.slice(i + 1), colors.fg.grey) +
      color(missing, colors.fg.cyan) +
      '\r'

    stdout.write(log)
  }

  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if ('([{<'.includes(c)) {
      missing = map[c] + missing
      display(i, c, missing)
    } else {
      check(i, c)
    }
    if (corrupted) break
    await sleep(50)
  }
  stdout.write('\n')
}

async function run() {
  console.clear()
  console.log('Syntax Check')
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
  for (const line of input) {
    await visualizeLine(line)
  }
}

// esbuild --bundle src/day10/SyntaxScoring.ts --outdir=dist --platform=node && node dist/SyntaxScoring.js
run()
