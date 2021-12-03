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

/**
 * Generator of range (closed).
 * Ex: range(2, 5) === [2, 3, 4, 5]
 */
export function range(start: number, end: number): Array<number> {
  return new Array(end - start + 1).fill(0).map((_, i) => i + start)
}
