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
