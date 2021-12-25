import { Alu, findHighest, findLowest, monad, parseByPosition } from './ALU'
import { range, readFileAsLines, split } from '../utils/input'

const realInst = readFileAsLines('day24/input.txt')

describe('Arithmetic Logic Unit', () => {
  let alu: Alu
  beforeEach(() => {
    alu = new Alu('123456789')
  })

  it('should print', () => {
    expect(alu.print()).toEqual('0,0,0,0')
  })

  it('should parse instructions - inp', () => {
    alu.parse(['inp x', 'inp w'])
    expect(alu.print()).toEqual('2,1,0,0')
  })

  it('should parse instructions - add, mul', () => {
    // prettier-ignore
    alu.parse([
      'inp x', 'inp w',
      'add x -4',
      'add w x',
      'add y x',
      'mul y -2',
      ]
    )
    expect(alu.print()).toEqual('-1,-3,6,0')
  })

  it('should parse instructions - div, mod, eql', () => {
    // prettier-ignore
    alu.parse([
        'inp w', 'inp x', 'inp y', 'inp z',
        'div z x',
        'div y 2',
        'inp w',
        'mod w z'
      ]
    )
    expect(alu.print()).toEqual('1,2,1,2')
    alu.parse(['eql x z', 'eql w z'])
    expect(alu.print()).toEqual('0,1,1,2')
  })

  it('should convert to binary', () => {
    const alu1 = new Alu('7')
    const inst = split`
      inp w
      add z w
      mod z 2
      div w 2
      add y w
      mod y 2
      div w 2
      add x w
      mod x 2
      div w 2
      mod w 2
    `
    alu1.parse(inst, true)
    expect(alu1.print()).toEqual('0,1,1,1')
    console.log(alu1.logs)
  })

  it('should verify monad', () => {
    expect(monad('99995969919326', realInst)).toEqual(0)
    expect(monad('11111111111111', realInst)).not.toEqual(0)
  })

  it('should find best w for step', () => {
    const alu1 = new Alu('7')
    const inst = split`
      inp w
      mul x 0
      add x z
      mod x 26
      div z 1
      add x 10
      eql x w
      eql x 0
      mul y 0
      add y 25
      mul y x
      add y 1
      mul z y
      mul y 0
      add y w
      add y 10
      mul y x
      add z y
      inp w
      mul x 0
      add x z
      mod x 26
      div z 1
      add x 13
      eql x w
      eql x 0
      mul y 0
      add y 25
      mul y x
      add y 1
      mul z y
      mul y 0
      add y w
      add y 5
      mul y x
      add z y
     `
    const res = range(11, 99)
      .filter(i => i % 10 != 0)
      .map(i => new Alu('' + i))
      .map(alu => {
        alu.parse(inst)
        return alu
      })
      .map(alu => alu.input + ' / z: ' + alu.z)
    console.log(res.join('\n'))
  })

  it('should parse by position', () => {
    const res = parseByPosition(realInst)
    expect(res).toHaveLength(14)
  })

  it('should apply simplified Instructions', () => {
    //              0    5 7  A
    const serial = '48111514719111'
    // const serial = '99995969919326'

    const simplifiedInsts = parseByPosition(realInst)
    const logs = []
    const res = simplifiedInsts.reduce((z, { divZ, addX, addY }, i) => {
      const w = +serial[i]
      const x = (z % 26) + addX
      const newZ = Math.floor(z / divZ)
      const res = x !== w ? 26 * newZ + w + addY : newZ
      logs.push(`#${i} : w=${w},z=${res} (${divZ}, ${addX}, ${addY}}`)
      return res
    }, 0)
    // console.log(logs.join('\n'))
    // expect(logs).toEqual([])
    expect(res).toEqual(0)
  })

  it('should find highest serial number ⭐️', () => {
    const res = findHighest(realInst)
    expect(res).toEqual('99995969919326')
  })

  it('should find lowest serial number ⭐️⭐️', () => {
    const res = findLowest(realInst)
    expect(res).toEqual('48111514719111')
  })
})
