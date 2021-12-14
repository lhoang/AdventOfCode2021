import { range, split } from '../utils/input'
import { add, countBy, identity, mergeWith } from 'ramda'
import { performance } from 'perf_hooks'

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

/**
 * Naive approach : work on the string
 * Works only for part 1.
 * Step : 17; Acc size : 196609; Time: 0.03435437500476837 s
 * Step : 24; Acc size : 25165825; Time: 6.9526850829720495 ms
 */
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
  return range(1, n).reduce((acc, i) => {
    const startTime = performance.now()
    const res = applyStep(acc)
    const endTime = performance.now()
    console.log(
      `Step : ${i}; Acc size : ${acc.length}; Time: ${
        (endTime - startTime) / 1000
      } s`,
    )
    return res
  }, start)
}

/**
 * Use of splice
 * Not optimized...
 * Step : 17; Acc size : 393217; Time: 11.481643917024135 s
 */
export const optimizedStep = (rules: Map<string, string>) => (s: string[]) => {
  for (let i = 0; i < s.length - 1; i = i + 2) {
    const insert = rules.get(s[i] + s[i + 1])
    s.splice(i + 1, 0, insert)
  }
}

export function applyOptimizedStepN(
  rules: Map<string, string>,
  start: string,
  n: number,
): string {
  const applyStep = optimizedStep(rules)
  const acc = [...start]
  range(1, n).forEach(i => {
    const startTime = performance.now()
    applyStep(acc)
    const endTime = performance.now()
    console.log(
      `Step : ${i}; Acc size : ${acc.length}; Time: ${
        (endTime - startTime) / 1000
      } s`,
    )
  })
  return acc.join('')
}

/**
 * Split / Map / Reduce
 * Not optimized...
 * Step 17 : Time: 0.13946350002288818 s
 */
export function repartitionAfterNStep(
  rules: Map<string, string>,
  start: string,
  n: number,
) {
  const limit = 1000

  const applyStep = step(rules)

  const recRep = (steps: number, str: string): Record<string, number> => {
    if (steps == 0) {
      return countBy(identity, [...str])
    }
    const newStr = applyStep(str)
    if (newStr.length < limit) {
      return recRep(steps - 1, newStr)
    } else {
      const t1 = newStr.substr(0, Math.ceil(newStr.length / 2))
      const splitIndex = Math.floor(newStr.length / 2)
      const t2 = newStr.substr(splitIndex)
      const s1 = recRep(steps - 1, t1)
      const s2 = recRep(steps - 1, t2)
      const sum = mergeWith(add, s1, s2)
      sum[newStr[splitIndex]]--
      return sum
    }
  }
  return recRep(n, start)
}

export function countAfterNStep(input: string, n: number): number {
  const [start, rules] = parse(input)
  const res = applyStepN(rules, start, n)
  const countMap = countBy(identity, [...res])
  const values = Object.values(countMap)
  return Math.max(...values) - Math.min(...values)
}

/**
 * Work on the pairs, not the string.
 */
export function parseRepartition(
  input: string,
): [Record<string, number>, Map<string, string[]>] {
  const [start, rulesPart] = input.split(`\n\n`)

  const rules = new Map<string, string[]>(
    split(rulesPart).map(line => {
      const [pair, insert] = line.split(' -> ')
      return [pair, [pair[0] + insert, insert + pair[1]]]
    }),
  )

  const repartition = Object.fromEntries([...rules.keys()].map(key => [key, 0]))

  range(0, start.length - 2)
    .map(i => start[i] + start[i + 1])
    .forEach(pair => repartition[pair]++)

  return [repartition, rules]
}

function reduceAsObject(letterCount: Array<[string, number]>) {
  return letterCount.reduce((acc, [key, value]) => {
    if (acc[key]) {
      acc[key] = acc[key] + value
    } else {
      acc[key] = value
    }
    return acc
  }, {})
}

export function stepRepartition(
  rules: Map<string, string[]>,
  repartition: Record<string, number>,
): Record<string, number> {
  const newPairCount = Object.entries(repartition).flatMap(([pair, count]) => {
    return rules.get(pair).map(newPair => [newPair, count] as [string, number])
  })
  return reduceAsObject(newPairCount)
}

export function diffMaxMin(repartition: Record<string, number>): number {
  const letterCount = Object.entries(repartition).flatMap(([pair, count]) => {
    return [...pair].map(l => [l, count] as [string, number])
  })

  const res: Record<string, number> = reduceAsObject(letterCount)

  const halfRes = Object.fromEntries(
    Object.entries(res) //
      .map(([pair, count]) => [pair, Math.ceil(count / 2)]),
  )
  const values = Object.values(halfRes)
  return Math.max(...values) - Math.min(...values)
}

// 40 steps : 3ms
export function countAfterNStepRepartition(input: string, n: number): number {
  const startTime = performance.now()
  const [repartition, rules] = parseRepartition(input)
  const finalRep = range(1, n).reduce(
    acc => stepRepartition(rules, acc),
    repartition,
  )
  const diff = diffMaxMin(finalRep)
  const endTime = performance.now()
  console.log(`Time: ${endTime - startTime} ms`)
  return diff
}
