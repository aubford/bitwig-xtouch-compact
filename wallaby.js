process.env.NODE_ENV = 'test'
module.exports = function(wallaby) {
  return {
    files: [
      'test/setup.ts',
      'test/tsconfig.json',
      'src/**/*.ts'
    ],
    tests: [
      'test/**/*.test.ts'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    debug: true,
    //compilers: {
    //  '**/*.ts': wallaby.compilers.typeScript({
    //    useStandardDefaults: true,
    //    module: 'commonjs'
    //  })
    //},
    //workers: {
    //  initial: 1,
    //  regular: 1,
    //  restart: true
    //},
    delays: {
      run: 1000
    },
    reportConsoleErrorAsError: true,
    maxConsoleMessagesPerTest: 10000,
    runAllTestsInAffectedTestFile: true
  }
}
