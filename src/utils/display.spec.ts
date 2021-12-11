import { color, colors } from './display'

describe('String Utils', () => {
  it('should color string ', () => {
    console.log(color('Text in red', colors.fg.red))
    console.log(color('Yellow on cyan', colors.fg.yellow, colors.bg.cyan))
    console.log(color('Yellow', colors.fg.yellow))
    console.log(color('Yellow bright', colors.fg.yellow, colors.bright))
    console.log(color('Yellow dim', colors.fg.yellow, colors.dim))
    console.log(color('Yellow reverse', colors.fg.yellow, colors.reverse))
  })
})
