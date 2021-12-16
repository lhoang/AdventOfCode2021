import { readFile } from '../utils/input'
import {
  compute,
  decode,
  readLiteralValue,
  readOperator,
  sumVersions,
  toBin,
  versionAndTypeId,
} from './PacketDecoder'

const realInput = readFile('day16/input.txt')

describe('Packet Decoder', () => {
  it('should decode to binary', () => {
    expect(toBin('4')).toEqual('0100')
    expect(toBin('0F')).toEqual('00001111')
  })

  it('should read version and type id', () => {
    expect(versionAndTypeId('110100101111111000101000')).toEqual([
      6,
      4,
      '101111111000101000',
    ])
  })

  it('should read literal value', () => {
    expect(readLiteralValue('101111111000101000')).toEqual([2021, '000'])
    expect(readLiteralValue('01010')).toEqual([10, ''])
    expect(readLiteralValue('1000100100')).toEqual([20, ''])
  })

  it('should read operatorwith total length', () => {
    // 00111000000000000110111101000101001010010001001000000000
    // VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB
    expect(
      readOperator('00000000000110111101000101001010010001001000000000'),
    ).toEqual([
      [
        {
          value: 10,
          version: 6,
          typeId: 4,
        },
        {
          value: 20,
          version: 2,
          typeId: 4,
        },
      ],
      '0000000',
    ])
  })

  it('should read operator with number of subpackets', () => {
    // 11101110000000001101010000001100100000100011000001100000
    // VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC
    expect(
      readOperator('10000000001101010000001100100000100011000001100000'),
    ).toEqual([
      [
        {
          value: 1,
          version: 2,
          typeId: 4,
        },
        {
          value: 2,
          version: 4,
          typeId: 4,
        },
        {
          value: 3,
          version: 1,
          typeId: 4,
        },
      ],
      '00000',
    ])
  })

  it('should decode packet ', () => {
    const res = decode('EE00D40C823060')
    expect(res.packets).toHaveLength(3)
    expect(sumVersions(res)).toEqual(14)

    const res2 = decode('8A004A801A8002F478')
    expect(sumVersions(res2)).toEqual(16)

    const res5 = decode('A0016C880162017C3686B18A3D4780')
    expect(sumVersions(res5)).toEqual(31)
  })

  it('should decode packet ⭐️', () => {
    const res = decode(realInput)
    expect(sumVersions(res)).toEqual(873)
  })

  it('should compute packet', () => {
    expect(compute(decode('C200B40A82'))).toEqual(3)
    expect(compute(decode('04005AC33890'))).toEqual(54)
    expect(compute(decode('880086C3E88112'))).toEqual(7)
    expect(compute(decode('CE00C43D881120'))).toEqual(9)
    expect(compute(decode('D8005AC2A8F0'))).toEqual(1)
    expect(compute(decode('F600BC2D8F'))).toEqual(0)
    expect(compute(decode('9C005AC2F8F0'))).toEqual(0)
    expect(compute(decode('9C0141080250320F1802104A08'))).toEqual(1)
  })

  it('should compute packet ⭐️⭐️', () => {
    expect(compute(decode(realInput))).toEqual(402817863665)
  })
})
