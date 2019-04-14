
// interface UserControlBank {
//   getControl(index: number): any
// }

class UserControls {
  controls
  constructor(num) {
    this.controls = []
    let i = 0
    while (i++ < num) {
      this.controls.push({
        testName: i,
        set: jest.fn()
      })
    }
  }

  getControl = (index: number) => this.controls[index]
}

const loadAPI = (num) => {}

const host = {
  getMidiInPort: () => ({
    setMidiCallBack: jest.fn()
  }),
  getMidiOutPort: () => ({
    sendMidi: jest.fn()
  }),
  defineController: jest.fn(),
  defineMidiPorts: jest.fn(),
  createUserControls: num => new UserControls(num),
  setShouldFailOnDeprecatedUse(value: boolean): any {},
  addDeviceNameBasedDiscoveryPair(inputs: string[], outputs: string[]): any {}
}

global['host'] = host
global['loadAPI'] = loadAPI
global['API'] = API