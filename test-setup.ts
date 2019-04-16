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

global['host'] = {
  getMidiInPort: num => ({
    setMidiCallback: jest.fn()
  }),
  getMidiOutPort: num => ({
    sendMidi: jest.fn()
  }),
  createUserControls: num => new UserControlsTest(num)
}