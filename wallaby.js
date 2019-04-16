process.env.NODE_ENV = 'test'
module.exports = function(wallaby) {
  wallaby.defaults.files.load = false
  return {
    files: [
      'test-setup.ts',
      'tsconfig.json',
      'jest.config.js',
      'src/**/*.ts',
      '!src/**/*test.ts'
    ],
    tests: [
      'src/**/*test.ts'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    debug: true,
    //compilers: {
    //  '**/*.ts': wallaby.compilers.typeScript({
    //    //useStandardDefaults: true,
    //    //module: 'commonjs',
    //    //isolatedModules: true,
    //    //typescript: require('typescript')
    //  })
    //},
    //workers: {
    //  initial: 1,
    //  regular: 1,
    //  restart: true
    //},
    //delays: {
    //  run: 1000
    //},
    reportConsoleErrorAsError: true,
    //maxConsoleMessagesPerTest: 10000,
    runAllTestsInAffectedTestFile: true
  }
}
