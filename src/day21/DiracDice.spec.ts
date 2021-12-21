import {
  diceRoll,
  findMultiverseWinner,
  play,
  possibleOutcomes,
} from './DiracDice'

describe('Dirac Dice', () => {
  it('should generate dice roll', () => {
    expect(diceRoll(1)).toEqual(6)
    expect(diceRoll(2)).toEqual(15)
    expect(diceRoll(31)).toEqual(276)
    // 97, 98, 99
    expect(diceRoll(33)).toEqual(294)
    // 100, 1, 2
    expect(diceRoll(34)).toEqual(103)
    // 99, 100, 1
    expect(diceRoll(67)).toEqual(200)
  })

  it('should play until a player reaches 1000', () => {
    const res = play(4, 8)
    expect(res).toEqual({
      p1Score: 1000,
      p2Score: 745,
      rolls: 993,
    })
    expect(res.p2Score * res.rolls).toEqual(739785)
  })

  it('should play until a player reaches 1000 ⭐️', () => {
    const res = play(2, 5)
    expect(res).toEqual({
      p1Score: 620,
      p2Score: 1005,
      rolls: 930,
    })
    expect(res.p1Score * res.rolls).toEqual(576600)
  })

  it('should compute all the outcomes for 3 rolls', () => {
    expect(possibleOutcomes).toEqual({
      '3': 1,
      '4': 3,
      '5': 6,
      '6': 7,
      '7': 6,
      '8': 3,
      '9': 1,
    })
  })

  it('should compute the multiverse winner', () => {
    expect(findMultiverseWinner(4, 8)).toEqual(444_356_092_776_315)
  })

  it('should compute the multiverse winner ⭐️⭐️', () => {
    expect(findMultiverseWinner(2, 5)).toEqual(131_888_061_854_776)
  })
})
