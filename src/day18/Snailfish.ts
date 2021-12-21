import { countBy } from 'ramda'

interface PairParams {
  id: string
  left: number | Pair
  right: number | Pair
  depth: number
  parent: string
}

export class Pair {
  id: string
  left: number | Pair
  right: number | Pair
  depth: number
  parent: string

  static contentRgx = /\[(.*)\]/
  constructor({ left, right, depth, id, parent }: PairParams) {
    this.left = left
    this.right = right
    this.depth = depth
    this.id = id
    this.parent = parent
  }

  static parse(s: string): Pair {
    const split = (str: string): [string, string] => {
      let count = 0
      for (let i = 0; i < str.length; i++) {
        if (count === 0 && str[i] === ',') {
          return [str.slice(0, i), str.slice(i + 1)]
        }
        if (str[i] === '[') count++
        if (str[i] === ']') count--
      }
      throw new Error('Not splittable: ' + str)
    }

    const recParse = (
      str: string,
      depth: number,
      isLeft: boolean,
      parent: string,
    ): number | Pair => {
      const g = str.match(Pair.contentRgx)
      if (!g) return +str
      const content = g[1]
      const [left, right] = split(content)
      const id =
        isLeft == null
          ? 'root'
          : isLeft
          ? (parent == 'root' ? '' : parent) + 'L'
          : (parent == 'root' ? '' : parent) + 'R'
      return new Pair({
        parent,
        id,
        depth,
        left: recParse(left, depth + 1, true, id),
        right: recParse(right, depth + 1, false, id),
      })
    }
    const res = recParse(s, 0, null, null)

    return res as Pair
  }

  isLeft(): boolean {
    return this.id.endsWith('L')
  }
  isRight(): boolean {
    return !this.isLeft()
  }

  toString(): string {
    return `[${this.left.toString()},${this.right.toString()}]`
  }

  leftToRight(): string[] {
    const str = (s: number | Pair): string => {
      if (isNumber(s)) {
        return ''
      }
      const p = s as Pair
      const res = isNumber(p.left)
        ? `${p.id}|${str(p.right)}`
        : isNumber(p.right)
        ? `${str(p.left)}|${p.id}`
        : `${str(p.left)}|${str(p.right)}`
      return res
    }

    return str(this).split('|').filter(Boolean)
  }

  reduce() {
    const hasExploded = explode(this)
    let hasSplitted = false
    if (!hasExploded) {
      hasSplitted = split(this)
      //console.log(`splitted:${this.toString()}`)
    } else {
      // console.log(`exploded:${this.toString()}`)
    }

    if (hasSplitted || hasExploded) {
      this.reduce()
    }
  }

  magnitude(): number {
    const mag = (n: number | Pair): number =>
      isNumber(n) ? (n as number) : (n as Pair).magnitude()

    return 3 * mag(this.left) + 2 * mag(this.right)
  }

  countDepth() {
    const map = register(this)
    const count = countBy(([, v]) => v.depth, [...map.entries()])
    return JSON.stringify(count)
  }
}

function isNumber(n: number | Pair): boolean {
  return !Number.isNaN(Number(n))
}

export function register(p: Pair): Map<string, Pair> {
  const map = new Map<string, Pair>()
  const recMap = (pair: Pair) => {
    map.set(pair.id, pair)
    if (!isNumber(pair.left)) {
      recMap(pair.left as Pair)
    }
    if (!isNumber(pair.right)) {
      recMap(pair.right as Pair)
    }
  }
  recMap(p)
  return map
}

export function explode(pair: Pair): boolean {
  const map = register(pair)
  const neighbours = pair.leftToRight()

  const filtered = [...map.entries()]
    .map(([, value]) => value)
    .filter(
      p =>
        p.depth > 3 &&
        isNumber(p.left) &&
        isNumber(p.right) &&
        neighbours.includes(p.id),
    )
    .sort((a, b) => neighbours.indexOf(a.id) - neighbours.indexOf(b.id))
  const found = filtered?.[0]

  const findNeighbours = (current: Pair) => {
    const index = neighbours.indexOf(current.id)

    let leftId: string
    let rightId: string
    if (index > 0) {
      leftId = neighbours[index - 1]
    }
    if (index < neighbours.length - 1) {
      rightId = neighbours[index + 1]
    }
    return [leftId, rightId]
  }

  if (found) {
    const [leftId, rightId] = findNeighbours(found)

    const leftNeighbour = map.get(leftId)
    const rightNeighbour = map.get(rightId)

    if (leftNeighbour) {
      if (isNumber(leftNeighbour.right)) {
        leftNeighbour.right =
          (leftNeighbour.right as number) + (found.left as number)
      } else {
        leftNeighbour.left =
          (leftNeighbour.left as number) + (found.left as number)
      }
    }

    if (rightNeighbour) {
      if (isNumber(rightNeighbour.left)) {
        rightNeighbour.left =
          (rightNeighbour.left as number) + (found.right as number)
      } else {
        rightNeighbour.right =
          (rightNeighbour.right as number) + (found.right as number)
      }
    }

    const parent = map.get(found.parent)
    if (found.isLeft()) {
      parent.left = 0
    } else {
      parent.right = 0
    }

    return true
  }
  return false
}

export function split(pair: Pair) {
  const map = register(pair)
  const neighbours = pair.leftToRight()

  const tooBig = (p: number | Pair) => {
    return isNumber(p) && p > 9
  }

  const found = [...map.entries()]
    .map(([, value]) => value)
    .filter(p => tooBig(p.left) || tooBig(p.right))
    .sort((a, b) => neighbours.indexOf(a.id) - neighbours.indexOf(b.id))?.[0]

  if (found) {
    if (tooBig(found.left)) {
      const value = found.left as number
      found.left = new Pair({
        left: Math.floor(value / 2),
        right: Math.ceil(value / 2),
        parent: found.id,
        id: found.id + 'L',
        depth: found.depth + 1,
      })
    } else if (tooBig(found.right)) {
      const value = found.right as number
      found.right = new Pair({
        left: Math.floor(value / 2),
        right: Math.ceil(value / 2),
        parent: found.id,
        id: found.id + 'R',
        depth: found.depth + 1,
      })
    }
    return true
  }
  return false
}

export function add(pair1: Pair, pair2: Pair): Pair {
  const str = `[${pair1.toString()},${pair2.toString()}]`
  const pair = Pair.parse(str)
  pair.reduce()
  return pair
}

export function finalSum(input: string[]): Pair {
  return input.map(Pair.parse).reduce(add)
}

export function findLargestMagnitude(input: string[]): number {
  const allMagnitudes = input.flatMap(line =>
    input
      .filter(l => l !== line)
      .map(l => add(Pair.parse(line), Pair.parse(l)).magnitude()),
  )
  return Math.max(...allMagnitudes)
}
