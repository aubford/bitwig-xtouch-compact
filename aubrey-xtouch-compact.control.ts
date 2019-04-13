loadAPI(8)
// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true)

host.defineController(
  'Behringer',
  'aubrey-xtouch-compact',
  '0.1',
  '07e1d9d2-246b-46a9-b5b5-07cfbf519fa7',
  'Aubrey Ford'
)
host.defineMidiPorts(1, 1)
host.addDeviceNameBasedDiscoveryPair(['X-TOUCH COMPACT'], ['X-TOUCH COMPACT'])

enum MidiType {
  NOTE = 0x90,
  NOTE_OFF = 0x80,
  CC = 0xb0
}

const TRACK_ENCODERS = 'TRACK_ENCODERS'
const TRACK_ENCODERS_PUSH = 'TRACK_ENCODERS_PUSH'
const SIDE_ENCODERS = 'SIDE_ENCODERS'
const SIDE_ENCODERS_PUSH = 'SIDE_ENCODERS_PUSH'
const FADER = 'FADER'
const FADER_TOUCH = 'FADER_TOUCH'
const BUTTONS_FADER = 'BUTTONS_FADER'
const BUTTONS1 = 'BUTTONSA'
const BUTTONS2 = 'BUTTONSB'
const BUTTONS3 = 'BUTTONSC'
const BUTTONS_TRANSPORT = 'BUTTONS_TRANSPORT'
const FOOT_SW_LED = 'FOOT_SW_LED'
const FOOT_EXP_LED = 'FOOT_EXP_LED'

type Range = [number, number]
type RxActions = { [x: string]: number }
interface RxInterface {
  type: string
  range: Range
  midiType: MidiType
  actions?: RxActions
}
interface MainInterface {
  controlsA: UserControls
  controlsB: UserControls
  type: string
  midiType: MidiType
}

const inRange = (val, range) => range[0] <= val <= range[1]
const encoderActionInRange = val => inRange(val, [0, 12])

class UserControls {
  rangeStart: number
  rangeEnd: number
  controls: API.UserControlBank
  constructor(rangeStart, rangeEnd) {
    this.rangeStart = rangeStart
    this.rangeEnd = rangeEnd
    this.controls = host.createUserControls(rangeEnd - rangeStart)
  }

  getUserControlIndex = (controlKey: number) => {
      if (controlKey >= this.rangeStart && controlKey <= this.rangeEnd) {
        return this.rangeEnd - controlKey
      }
      return null
  }

  getUserControl = (controlKey: number) => {
    const controlIndex = this.getUserControlIndex(controlKey)
    if (controlIndex !== null) {
      return this.controls.getControl(controlIndex)
    }
    return false
  }
}

class XTouchCompact {
  mainInterface: MainInterface[]
  rxInterface: RxInterface[]
  midiIn: API.MidiIn
  midiOut: API.MidiOut

  constructor(midiIn, midiOut) {
    this.midiIn = midiIn
    this.midiOut = midiOut

    const buttonActions = { off: 0, on: 1, blink: 2 }
    const encoderActions = {
      off: 0,
      onOffset: 1,
      blinkOffset: 14,
      allOn: 27,
      allBlinking: 28
    }
    const offOn = { off: 0, on: 127 }
    const encoderLEDModeActions = {
      single: 0,
      pan: 1,
      fan: 2,
      spread: 3,
      trim: 4
    }
    const { NOTE, CC } = MidiType
    this.rxInterface = [
      { range: [1, 9], type: FADER, midiType: CC },
      {
        range: [10, 17],
        type: TRACK_ENCODERS_PUSH,
        midiType: CC,
        actions: encoderLEDModeActions
      },
      {
        range: [18, 25],
        type: SIDE_ENCODERS_PUSH,
        midiType: CC,
        actions: encoderLEDModeActions
      },
      {
        range: [26, 33],
        type: TRACK_ENCODERS,
        midiType: CC,
        actions: encoderActions
      },
      {
        range: [34, 41],
        type: SIDE_ENCODERS,
        midiType: CC,
        actions: encoderActions
      },
      { range: [42, 42], type: FOOT_SW_LED, midiType: CC, actions: offOn },
      { range: [43, 43], type: FOOT_EXP_LED, midiType: CC, actions: offOn },
      { range: [0, 7], type: BUTTONS1, midiType: NOTE, actions: buttonActions },
      { range: [8, 15], type: BUTTONS2, midiType: NOTE, actions: buttonActions },
      { range: [16, 23], type: BUTTONS3, midiType: NOTE, actions: buttonActions },
      {
        range: [24, 32],
        type: BUTTONS_FADER,
        midiType: NOTE,
        actions: buttonActions
      },
      {
        range: [33, 38],
        type: BUTTONS_TRANSPORT,
        midiType: NOTE,
        actions: buttonActions
      }
    ]
    this.mainInterface = [
      {
        type: FADER,
        controlsA: new UserControls(1,9),
        controlsB: new UserControls(28,36),
        midiType: CC
      },
      {
        type: TRACK_ENCODERS,
        controlsA: new UserControls(10,17),
        controlsB: new UserControls(37,44),
        midiType: CC,
      },
      {
        type: SIDE_ENCODERS,
        controlsA: new UserControls(18,25),
        controlsB: new UserControls(45,52),
        midiType: CC
      },
      {
        type: FADER_TOUCH,
        controlsA: new UserControls(101,109),
        controlsB: new UserControls(111,119),
        midiType: CC
      },
      {
        type: TRACK_ENCODERS_PUSH,
        controlsA: new UserControls(0,7),
        controlsB: new UserControls(55,62),
        midiType: NOTE
      },
      {
        type: SIDE_ENCODERS_PUSH,
        controlsA: new UserControls(8,15),
        controlsB: new UserControls(63,70),
        midiType: NOTE
      },
      {
        type: BUTTONS1,
        controlsA: new UserControls(16,23),
        controlsB: new UserControls(71,78),
        midiType: NOTE
      },
      {
        type: BUTTONS2,
        controlsA: new UserControls(24,31),
        controlsB: new UserControls(79,86),
        midiType: NOTE
      },
      {
        type: BUTTONS3,
        controlsA: new UserControls(32,39),
        controlsB: new UserControls(87,94),
        midiType: NOTE
      },
      {
        type: BUTTONS_FADER,
        controlsA: new UserControls(40,48),
        controlsB: new UserControls(95,103),
        midiType: NOTE
      },
      {
        type: BUTTONS_TRANSPORT,
        controlsA: new UserControls(49,54),
        controlsB: new UserControls(104,109),
        midiType: NOTE
      }
    ]
    this.midiIn.setMidiCallback(this.onMidi)
  }

  onMidi(midiStatus: MidiType, controlKey: number, controlValue: number) {
    this.setParameter(this.getUserControl(midiStatus, controlKey), controlValue)
  }

  actionValueRange = [0, 12]
  sendRx = (
    type: string,
    controlKey: number,
    actionName: string,
    actionValue?: number
  ) => {
    if (actionValue && !inRange(actionValue, this.actionValueRange)) {
      throw new Error('bad actionValue for sendRx')
    }

    const { midiType, range, actions } = this.rxInterface.find(
      rx => rx.type === type
    )
    const outIndex = controlKey + range[0]
    if (!inRange(outIndex, range)) {
      throw new Error('bad controlIndex value for sendRx')
    }

    const action: number = actions[actionName]
    this.midiOut.sendMidi(
      midiType,
      outIndex,
      actionValue ? action + actionValue : action
    )
  }

  getInterfaceElement = (midiStatus: MidiType, controlKey: number) =>
    this.mainInterface.find(
      ({ controlsA, controlsB, midiType }) =>
        midiStatus === midiType &&
        (inRange(controlKey, controlsA) || inRange(controlKey, controlsB))
    )

  getUserControl = (midiStatus: MidiType, controlKey: number) => {
    const { controlsA, controlsB } = this.getInterfaceElement(midiStatus, controlKey)
    return controlsA.getUserControl(controlKey) || controlsB.getUserControl(controlKey)
  }

  setParameter = (parameter: API.Parameter | false, value: number) => {
    if (!parameter) {
      throw new Error('badd parameter')
    }
    parameter.setImmediately(value / 128)
  }
}

let hardware
let transport
function init() {
  hardware = new XTouchCompact(host.getMidiInPort(0), host.getMidiOutPort(0))
  transport = host.createTransport()
}

function flush() {
  // TODO: Flush any output to your controller here.
}

function exit() {}
