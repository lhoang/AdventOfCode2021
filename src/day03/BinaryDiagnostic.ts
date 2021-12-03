import { transpose } from 'ramda'

type Bool = '1' | '0'

export function getPowerConsumption(input: string[]): number {
  const gammaBin = transpose(input).map(line =>
    line.filter(c => c === '0').length > input.length / 2 ? '0' : '1',
  )
  const gamma = parseInt(gammaBin.join``, 2)
  const epsilon = parseInt(gammaBin.map(c => (c === '0' ? '1' : '0')).join``, 2)

  return gamma * epsilon
}

export function getLifeSupportRating(input: string[]): number {
  return computeO2Rating(input) * computeCO2Rating(input)
}

function computeRating(
  findCriteria: (_r: string[], _i: number) => Bool,
  input: string[],
) {
  const rec02 = (remaining: string[], index: number): string[] => {
    if (remaining.length === 1) {
      return remaining
    }
    const criteria = findCriteria(remaining, index)
    return rec02(
      remaining.filter(l => l[index] === criteria),
      index + 1,
    )
  }
  const final = rec02(input, 0)[0]
  return parseInt(final, 2)
}

export function computeO2Rating(input: string[]) {
  const criteria = (remaining: string[], index: number): Bool =>
    transpose(remaining)[index].filter(c => c === '1').length >=
    remaining.length / 2
      ? '1'
      : '0'

  return computeRating(criteria, input)
}

export function computeCO2Rating(input: string[]) {
  const criteria = (remaining: string[], index: number): Bool =>
    transpose(remaining)[index].filter(c => c === '0').length <=
    remaining.length / 2
      ? '0'
      : '1'

  return computeRating(criteria, input)
}
