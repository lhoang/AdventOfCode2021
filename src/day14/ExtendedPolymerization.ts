import { range, split } from '../utils/input'
import { countBy, identity } from 'ramda'

export function parse(input: string): [string, Map<string, string>] {
  const [start, rulesPart] = input.split(`\n\n`)

  const rules = new Map<string, string>(
    split(rulesPart).map(line => {
      const [k, v] = line.split(' -> ')
      return [k, v]
    }),
  )

  return [start, rules]
}

export const step =
  (rules: Map<string, string>) =>
  (s: string): string => {
    return (
      range(0, s.length - 2)
        .map(i => s[i] + s[i + 1])
        .map(pair => [pair[0], rules.get(pair)].join(''))
        .join('') + s[s.length - 1]
    )
  }

export function applyStepN(
  rules: Map<string, string>,
  start: string,
  n: number,
): string {
  const applyStep = step(rules)
  return range(1, n).reduce((acc, _) => applyStep(acc), start)
}

export function countAfterNStep(input: string, n: number): number {
  const [start, rules] = parse(input)
  const res = applyStepN(rules, start, n)
  const countMap = countBy(identity, [...res])
  const values = Object.values(countMap)
  return Math.max(...values) - Math.min(...values)
}
