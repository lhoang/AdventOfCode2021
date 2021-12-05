import * as fs from 'fs'
import * as path from 'path'
import dedent from 'dedent-js'

/**
 * Read file as array of lines
 * @param filename path from src/
 */
export function readFileAsLines(filename: string): Array<string> {
  return fs
    .readFileSync(path.resolve(__dirname, '..', filename), {
      encoding: 'utf-8',
    })
    .replace(/\n$/, '')
    .split('\n')
}

/**
 * Split template string into string array (removes indentation).
 * Useful to copy paste examples from description.
 * @param str template string
 */
export function split(str: string | TemplateStringsArray): Array<string> {
  return dedent(str).split('\n')
}

export function splitByEmptyLine(arr: Array<string>): Array<Array<string>> {
  return arr
    .reduce(
      (acc, line) => {
        if (line === '') {
          acc.push([])
        } else {
          acc[acc.length - 1].push(line)
        }
        return acc
      },
      [[]],
    )
    .filter(d => d.length)
}

/**
 * Generator of range (closed).
 * Ex: range(2, 5) === [2, 3, 4, 5]
 */
export function range(start: number, end: number): Array<number> {
  return start <= end
    ? new Array(end - start + 1).fill(0).map((_, i) => i + start)
    : new Array(start - end + 1).fill(0).map((_, i) => start - i)
}
