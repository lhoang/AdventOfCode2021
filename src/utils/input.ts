import * as fs from 'fs'
import * as path from 'path'

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
 * Generator of range
 */
export function range(start: number, end: number): Array<number> {
  return new Array(end - start + 1).fill(0).map((_, i) => i + start)
}
