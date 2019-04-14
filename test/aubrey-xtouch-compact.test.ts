// import './setup.ts'
import { XTouchCompact, SIDE_ENCODERS, MidiType } from '../src/aubrey-xtouch-compact.control'

let xtouch = new XTouchCompact(host.getMidiInPort(), host.getMidiOutPort())
let userControl
describe('XTouchCompact', () => {
  beforeAll(() => {
    xtouch = new XTouchCompact(host.getMidiInPort(), host.getMidiOutPort())
  })

  test('getInterfaceElement', () => {
    const sideEncoder = xtouch.getUserControl(MidiType.CC, 18)
    expect(sideEncoder.type).toBe(SIDE_ENCODERS)
  })

  test('getUserControls', () => {
    userControl = xtouch.getUserControl(MidiType.CC, 18)
    expect(userControl.testName).toBe(0)
    xtouch.setParameter(userControl, 50)
    expect(userControl.set).toHaveBeenCalledWith(50,128)
  })
})