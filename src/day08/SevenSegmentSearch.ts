import { countBy, identity } from 'ramda'

export function parse(line: string): [string[], string[]] {
  const [patterns, output] = line.split(' | ').map(words => words.split(' '))
  return [patterns, output]
}

export function countEasyDigits(input: string[]): number {
  return input
    .map(parse)
    .map(
      ([, output]) =>
        output.filter(w => [2, 3, 4, 7].includes(w.length)).length,
    )
    .reduce((a, b) => a + b)
}

export function analyseSegments(patterns: string[]) {
  const find = (n: number) => patterns.find(p => p.length === n)
  const maybe = (n: number) => patterns.filter(p => p.length === n)
  const common = (s: string[]) =>
    [...s[0]].filter(c => s.every(word => word.includes(c))).join('')
  const missing = (s: string[]) => {
    const rep = countBy(
      identity,
      s.flatMap(w => [...w]),
    )
    return Object.entries(rep)
      .filter(([, v]) => v === 1)
      .map(([k]) => k)
      .join('')
  }

  const exclude = (s: string, minus: string) =>
    [...s].filter(c => !minus.includes(c)).join('')
  const idNumber = (
    maybeNums: string[],
    segment: string,
  ): [string, string[]] => [
    maybeNums.find(w => [...w].includes(segment)),
    maybeNums.filter(w => ![...w].includes(segment)),
  ]
  const idNumberNot = (
    maybeNums: string[],
    segment: string,
  ): [string, string[]] => [
    maybeNums.find(w => ![...w].includes(segment)),
    maybeNums.filter(w => [...w].includes(segment)),
  ]

  const num1 = find(2)
  const num7 = find(3)
  const num4 = find(4)
  const num8 = find(7)

  const maybe2or3or5 = maybe(5)
  const maybe0or6or9 = maybe(6)

  //    \          1   7   4   2   3   5   0   6   9    8
  // top               x       x   x   x   x   x   x    x
  // topLeft               x           x   x   x   x    x
  // topRight      x   x   x   x   x       x       x    x
  // middle                x   x   x   x       x   x    x
  // bottomLeft                x           x   x        x
  // bottomRight   x   x   x       x   x   x   x   x    x
  // bottom                    x   x   x   x   x   x    x

  // const top = exclude(num7, num1)[0]
  const topLeftBottomRight = common([...maybe0or6or9, num8, num4])
  const topLeft = exclude(topLeftBottomRight, num1)

  const [num5, may2or3] = idNumber(maybe2or3or5, topLeft)

  const middle = exclude(num4, num1 + topLeft)
  const [num0, maybe6or9] = idNumberNot(maybe0or6or9, middle)

  const topRightBottomLeft = missing([num5, ...maybe6or9])

  const topRight = common([num1, topRightBottomLeft])
  const bottomLeft = exclude(topRightBottomLeft, topRight)
  //const bottomRight = exclude(num1, topRight)

  const [num6, [num9]] = idNumberNot(maybe6or9, topRight)

  const [num2, [num3]] = idNumber(may2or3, bottomLeft)

  return Object.assign(
    {},
    ...Object.entries({
      num0,
      num1,
      num2,
      num3,
      num4,
      num5,
      num6,
      num7,
      num8,
      num9,
    }).map(([valueStr, code]) => {
      const sortedCode = [...code].sort().join('')
      const value = +valueStr.substr(3)
      return {
        [sortedCode]: value,
      }
    }),
  )
}

export function decode([patterns, output]: [string[], string[]]): number {
  const numbers = analyseSegments(patterns)
  return +output
    .map(w => [...w].sort().join(''))
    .map(w => numbers[w])
    .join('')
}

export function decodeAllLinesAndSum(input: string[]): number {
  return input
    .map(parse)
    .map(decode)
    .reduce((a, b) => a + b)
}
