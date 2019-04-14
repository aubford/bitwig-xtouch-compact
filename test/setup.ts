class UserControlsTest {
  controls
  constructor(num) {
    this.controls = []
    let i = 0
    do {
      this.controls.push({
        testName: i,
        set: jest.fn()
      })
    } while (num >= i++)
  }

  getControl = (index: number) => this.controls[index]
}

var loadAPI = (num) => {}

var host = {
  getMidiInPort: num => ({
    setMidiCallback: jest.fn()
  }),
  getMidiOutPort: num => ({
    sendMidi: jest.fn()
  }),
  defineController: jest.fn(),
  defineMidiPorts: jest.fn(),
  createUserControls: num => new UserControlsTest(num),
  setShouldFailOnDeprecatedUse(value: boolean): any {},
  addDeviceNameBasedDiscoveryPair(inputs: string[], outputs: string[]): any {}
}

global['host'] = host
global['loadAPI'] = loadAPI