export function naiveReproduce(fishes: number[]) {
  let newFishes = 0

  for (let i = 0; i < fishes.length; i++) {
    if (fishes[i] === 0) {
      newFishes++
      fishes[i] = 6
    } else {
      fishes[i]--
    }
  }
  fishes.push(...Array(newFishes).fill(8))
}

export function naiveReproduceForDays(
  fishes: number[],
  days: number,
): number[] {
  for (let i = 0; i < days; i++) {
    naiveReproduce(fishes)
    //console.log(`Day ${i + 1}: ${fishes.length}`)
  }
  return fishes
}

export function reproduceForDays(input: number[], days: number): BigInt {
  const fishes = Array(9)
    .fill(0)
    .map(() => BigInt(0))

  input.forEach(fish => (fishes[fish] = fishes[fish] + 1n))

  const repro = () => {
    const born = fishes[0]
    for (let i = 1; i < 9; i++) {
      fishes[i - 1] = fishes[i]
    }
    fishes[8] = born
    fishes[6] = fishes[6] + born
  }

  const count = () =>
    fishes.reduce((acc, i) => {
      return acc + i
    })

  for (let i = 0; i < days; i++) {
    repro()
    // console.log(`Day ${i + 1}: ${count()}`)
  }
  return count()
}
