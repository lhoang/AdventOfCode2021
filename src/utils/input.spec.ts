import { range, readFileAsLines, split } from './input'

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

  it('should generate range', () => {
    expect(range(2, 5)).toEqual([2, 3, 4, 5])
  })
})
