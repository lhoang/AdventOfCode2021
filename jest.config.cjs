module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
    // "^.+\\.tsx?$": [
    //   "esbuild-jest",
    //   {
    //     sourcemap: true,
    //     loaders: {
    //       '.spec.ts': 'tsx'
    //     }
    //   }
    // ]
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/' ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}
