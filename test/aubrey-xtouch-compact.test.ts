// import './setup.ts'
import { MidiType, SIDE_ENCODERS, XTouchCompact } from '../src/aubrey-xtouch-compact.control'

let xtouch = new XTouchCompact(host.getMidiInPort(0), host.getMidiOutPort(0))
let userControl
describe('XTouchCompact', () => {
  beforeAll(() => {
    xtouch = new XTouchCompact(host.getMidiInPort(0), host.getMidiOutPort(0))
  })

  test('getInterfaceElement', () => {
    const sideEncoder = xtouch.getInterfaceElement(MidiType.CC, 18)
    expect(sideEncoder.type).toBe(SIDE_ENCODERS)
  })

  test('getUserControls first index', () => {
    userControl = xtouch.getUserControl(MidiType.CC, 18)
    expect(userControl.testName).toBe(0)
    xtouch.setParameter(userControl, 50)
    expect(userControl.set).toHaveBeenCalledWith(50,128)
  })

  test('getUserControls last index', () => {
    userControl = xtouch.getUserControl(MidiType.CC, 25)
    expect(userControl.testName).toBe(7)
    xtouch.setParameter(userControl, 50)
    expect(userControl.set).toHaveBeenCalledWith(50,128)
  })

  test('onMidi', () => {
    xtouch.onMidi(MidiType.NOTE, 54, 128)
    const ctrl = xtouch.mainInterface[10].controlsA.getControlAtIndex(5)
    expect(ctrl.set).toHaveBeenCalledWith(128, 128)
  })
})