module.exports = {
  testPathIgnorePatterns: [
    "./.idea/",
    "./ControlSurfaceScripts"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  preset: "ts-jest",
  moduleFileExtensions: [
    "ts",
    "json",
    "js",
    "node"
  ],
  setupFiles: ['./test-setup.ts'],
  //globals: {
  //  'ts-jest': {
  //    tsConfig: './tsconfig.json'
  //  }
  //}
}