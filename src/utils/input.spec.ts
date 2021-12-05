import { range, readFileAsLines, split, splitByEmptyLine } from './input'

describe('Input utils', () => {
  it('should read file as lines', () => {
    const res = readFileAsLines('utils/test.txt')
    expect(res).toEqual(['Hello', 'World'])
  })

  it('should split in string[]', () => {
    const str = `
      hello
      world
      !
    `
    expect(split(str)).toEqual(['hello', 'world', '!'])
  })

  it('should split string[] by empty string', () => {
    const str = split`
      hello
      world
      
      Yo
      
      12345
      
    `

    expect(splitByEmptyLine(str)).toEqual([
      ['hello', 'world'],
      ['Yo'],
      ['12345'],
    ])
  })

  it('should generate range', () => {
    expect(range(2, 5)).toEqual([2, 3, 4, 5])
    expect(range(5, 2)).toEqual([5, 4, 3, 2])
  })
})
