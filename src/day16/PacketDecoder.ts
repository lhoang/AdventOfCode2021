import { range } from '../utils/input'

export function toBin(hex: string): string {
  return [...hex]
    .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join('')
}

export const toDec = (bin: string): number => parseInt(bin, 2)

export interface Packet {
  value?: number
  packets?: Packet[]
  typeId: number
  version: number
}

export function readLiteralValue(bin: string): [number, string] {
  const rec = (acc: string, i: number): [number, string] => {
    const value = bin.slice(i + 1, i + 5)
    if (bin[i] === '0') {
      return [toDec(acc + value), bin.slice(i + 5)]
    } else {
      return rec(acc + value, i + 5)
    }
  }
  return rec('', 0)
}

export function readOperator(bin: string): [Packet[], string] {
  const lenghTypeId = +bin[0]

  if (lenghTypeId === 0) {
    const totalLength = toDec(bin.slice(1, 16))
    const tail = bin.slice(16)

    const recLength = (
      acc: Packet[],
      remaining: string,
      length: number,
    ): [Packet[], string] => {
      if (!remaining.length || length >= totalLength) {
        return [acc, remaining]
      } else {
        const [packet, newTail] = readPacket(remaining)
        const l = length + (remaining.length - newTail.length)
        return recLength([...acc, packet], newTail, l)
      }
    }
    return recLength([], tail, 0)
  } else {
    // subpackets
    const nbSubpackets = toDec(bin.slice(1, 12))
    const tail = bin.slice(12)

    return range(1, nbSubpackets).reduce(
      ([acc, remaining]) => {
        const [packet, newTail] = readPacket(remaining)
        return [[...acc, packet], newTail]
      },
      [[] as Packet[], tail] as [Packet[], string],
    )
  }
}

export function versionAndTypeId(bin: string): [number, number, string] {
  const version = toDec(bin.slice(0, 3))
  const typeId = toDec(bin.slice(3, 6))
  return [version, typeId, bin.slice(6)]
}

export function readPacket(bin: string): [Packet, string] {
  const [version, typeId, remaining] = versionAndTypeId(bin)

  let value: number
  let packets: Packet[]
  let tail: string
  if (typeId === 4) {
    ;[value, tail] = readLiteralValue(remaining)
  } else {
    ;[packets, tail] = readOperator(remaining)
  }

  return [
    {
      version,
      typeId,
      value,
      packets,
    },
    tail,
  ]
}

export function decode(hex: string): Packet {
  return readPacket(toBin(hex))[0]
}

export function sumVersions(packet: Packet): number {
  const recSum = (p: Packet): number => {
    if (!p?.packets) {
      return p.version
    } else {
      const number = p.packets.map(pack => recSum(pack)).reduce((a, b) => a + b)
      return p.version + number
    }
  }
  return recSum(packet)
}

export function compute(packet: Packet): number {
  const apply = (p: Packet): number => {
    let res: number
    switch (p.typeId) {
      case 0:
        res = p.packets.map(apply).reduce((a, b) => a + b, 0)
        break
      case 1:
        res = p.packets.map(apply).reduce((a, b) => a * b, 1)
        break
      case 2:
        res = Math.min(...p.packets.map(apply))
        break
      case 3:
        res = Math.max(...p.packets.map(apply))
        break
      case 4:
        res = p.value
        break
      case 5: {
        const [a, b] = p.packets.map(apply)
        res = a > b ? 1 : 0
        break
      }
      case 6: {
        const [a, b] = p.packets.map(apply)
        res = a < b ? 1 : 0
        break
      }
      case 7: {
        const [a, b] = p.packets.map(apply)
        res = a == b ? 1 : 0
        break
      }
    }
    return res
  }
  return apply(packet)
}
