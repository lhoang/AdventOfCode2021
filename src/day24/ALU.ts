import { splitByEmptyLine } from '../utils/input'

export class Alu {
  input: string
  index = 0
  w = 0
  x = 0
  y = 0
  z = 0
  logs: string[] = []

  constructor(input: string) {
    this.input = input
  }

  print() {
    return [this.w, this.x, this.y, this.z].join(',')
  }

  parse(instructions: string[], debug = false) {
    const val = (b: string) => (isNumber(b) ? +b : this[b])

    instructions.forEach(line => {
      const [inst, a, b] = line.split(' ')
      switch (inst) {
        case 'inp':
          this[a] = +this.input[this.index]
          this.index++
          break

        case 'add':
          this[a] += val(b)
          break

        case 'mul':
          this[a] *= val(b)
          break

        case 'div':
          this[a] = Math.floor(this[a] / val(b))
          break

        case 'mod':
          this[a] = this[a] % val(b)
          break

        case 'eql':
          this[a] = this[a] === val(b) ? 1 : 0
          break
      }
      if (debug) {
        this.logs.push(`State: ${this.print()} after ${line}`)
      }
    })
  }
}

function isNumber(n: number | string): boolean {
  return !Number.isNaN(Number(n))
}

export function monad(serial: string, instructions: string[]) {
  const alu = new Alu(serial)
  alu.parse(instructions, true)
  //console.log(alu.logs)
  return alu.z
}

interface SimplifiedInst {
  divZ: number
  addX: number
  addY: number
}
export function parseByPosition(input: string[]): SimplifiedInst[] {
  const newInput = input.flatMap(line =>
    line.startsWith('inp') ? ['', line] : [line],
  )
  const res = splitByEmptyLine(newInput).map(inst => {
    const all = inst.join(';')
    const regex =
      /.+;div z (?<divZ>\d+);add x (?<addX>-?\d+).+;add y (?<addY>-?\d+).+/
    const t = regex.exec(all)
    const {
      groups: { divZ, addX, addY },
    } = t
    return { divZ: +divZ, addX: +addX, addY: +addY }
  })
  return res
}

export function findHighest(input: string[]): string {
  const instructions = parseByPosition(input)

  // stack of <w, addY> pushed every time divZ == 1
  const stack: Array<[number, number]> = []
  const serial: number[] = []
  instructions.forEach(({ divZ, addX, addY }) => {
    if (divZ == 1) {
      serial.push(9)
      stack.push([9, addY])
    } else {
      // pop previous element
      // and find the matching w so that w == x
      // w = x = prevW + prevAddY + addX
      // the previous W has to be ajusted if it is lest than 10
      // otherwise adjust only the new w
      const [prevW, prevAddY] = stack.pop()
      const newPrevW = 9 - prevAddY - addX
      if (newPrevW < 10) {
        serial.pop()
        serial.push(newPrevW)
        serial.push(9)
      } else {
        const w = prevW + prevAddY + addX
        serial.push(w)
      }
    }
  })
  return serial.join('')
}

export function findLowest(input: string[]): string {
  const instructions = parseByPosition(input)

  // stack of <w, addY, position> pushed every time divZ == 1
  const stack: Array<[number, number, number]> = []
  const serial: number[] = []
  instructions.forEach(({ divZ, addX, addY }, i) => {
    if (divZ == 1) {
      serial.push(1)
      stack.push([1, addY, i])
    } else {
      // pop previous element
      // and find the matching w so that w == x
      // w = x = prevW + prevAddY + addX
      const [prevW, prevAddY, index] = stack.pop()
      const w = prevW + prevAddY + addX

      if (w > 0) {
        serial.push(w)
      } else {
        // this time, we modify the previous element in the stack
        serial[index] = 1 - prevAddY - addX
        serial.push(1)
      }
    }
  })
  return serial.join('')
}
