module.exports = {
  testPathIgnorePatterns: [
    "/.idea/"
  ],
  roots: [
    "<rootDir>/src",
    "<rootDir>/test"
  ],
  transform: {
    "^.+\.ts$": "ts-jest"
  },
  preset: "ts-jest",
  moduleFileExtensions: [
    "ts",
    "json",
    "js",
    "node"
  ],
  setupFiles: ['./test/setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: './test/tsconfig.json'
    }
  }
}