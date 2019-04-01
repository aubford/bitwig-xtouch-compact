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

enum MidiStatus {
  NOTE = 0x90,
  OFF = 0x80,
  CC = 0xB0
}

const TRACK_ENCODERS = 'TRACK_ENCODERS'
const TRACK_ENCODERS_PUSH = 'TRACK_ENCODERS_PUSH'
const SIDE_ENCODERS = 'SIDE_ENCODERS'
const SIDE_ENCODERS_PUSH = 'SIDE_ENCODERS_PUSH'
const FADER = 'FADER'
const FADER_TOUCH = 'FADER_TOUCH'
const BUTTONS_FADER = 'BUTTONS_FADER'
const BUTTONSA = 'BUTTONSA'
const BUTTONSB = 'BUTTONSB'
const BUTTONSC = 'BUTTONSC'
const BUTTONS_TRANSPORT = 'BUTTONS_TRANSPORT'
const FOOT_SW_LED = 'FOOT_SW_LED'
const FOOT_EXP_LED = 'FOOT_EXP_LED'

type Range = [number, number]
interface RxInterface {
  type: string,
  range: Range,
  midi: MidiStatus,
  actions?: { [x: string]: number }
}
interface MainInterface {
  rangeA: [number, number],
  rangeB: [number, number],
  type: string,
  midi: MidiStatus
}

const inRange = (val, range) => range[0] <= val <= range[1]
const encoderActionInRange = val => inRange(val, [0,12])

class XTouchCompact {
  mainInterface: MainInterface[]
  rxInterface: RxInterface[]
  midiIn: API.MidiIn
  midiOut: API.MidiOut

  constructor(midiIn, midiOut) {
    this.midiIn = midiIn
    this.midiOut = midiOut

    const buttonActions = { off: 0, on: 1, blink: 2 }
    const encoderActions = { off: 0, on: 1 /* offset */, blink: 14 /* offset */, allOn: 27, allBlinking: 28 }
    const offOn = { off: 0, on: 127 }
    const encoderLEDModeActions = { single: 0, pan: 1, fan: 2, spread: 3, trim: 4 }
    const { NOTE, CC } = MidiStatus
    this.rxInterface = [
      { range: [1, 9], type: FADER, midi: CC },
      { range: [10, 17], type: TRACK_ENCODERS_PUSH, midi: CC, actions: encoderLEDModeActions },
      { range: [18, 25], type: SIDE_ENCODERS_PUSH, midi: CC, actions: encoderLEDModeActions },
      { range: [26, 33], type: TRACK_ENCODERS, midi: CC, actions: encoderActions },
      { range: [34, 41], type: SIDE_ENCODERS, midi: CC, actions: encoderActions },
      { range: [42, 42], type: FOOT_SW_LED, midi: CC, actions: offOn },
      { range: [43, 43], type: FOOT_EXP_LED, midi: CC, actions: offOn },
      { range: [0, 7], type: BUTTONSA, midi: NOTE, actions: buttonActions },
      { range: [8, 15], type: BUTTONSB, midi: NOTE, actions: buttonActions },
      { range: [16, 23], type: BUTTONSC, midi: NOTE, actions: buttonActions },
      { range: [24, 32], type: BUTTONS_FADER, midi: NOTE, actions: buttonActions },
      { range: [33, 38], type: BUTTONS_TRANSPORT, midi: NOTE, actions: buttonActions }
    ]
    this.mainInterface = [
      {
        rangeA: [1, 9],
        rangeB: [28, 36], type: FADER, midi: CC
      },
      {
        rangeA: [10, 17],
        rangeB: [37, 44], type: TRACK_ENCODERS, midi: CC
      },
      {
        rangeA: [18, 25],
        rangeB: [45, 52], type: SIDE_ENCODERS, midi: CC
      },
      {
        rangeA: [101, 109],
        rangeB: [111, 119], type: FADER_TOUCH, midi: CC
      },
      {
        rangeA: [0, 7],
        rangeB: [55, 62], type: TRACK_ENCODERS_PUSH, midi: NOTE
      },
      {
        rangeA: [8, 15],
        rangeB: [63, 70], type: SIDE_ENCODERS_PUSH, midi: NOTE
      },
      {
        rangeA: [16, 23],
        rangeB: [71, 78], type: BUTTONSA, midi: NOTE
      },
      {
        rangeA: [24, 31],
        rangeB: [79, 86], type: BUTTONSB, midi: NOTE
      },
      {
        rangeA: [32, 39],
        rangeB: [87, 94], type: BUTTONSC, midi: NOTE
      },
      {
        rangeA: [40, 48],
        rangeB: [95, 103], type: BUTTONS_FADER, midi: NOTE
      },
      {
        rangeA: [49, 54],
        rangeB: [104, 109], type: BUTTONS_TRANSPORT, midi: NOTE
      }
    ]
  }

  actionValueRange = [0,12]
  sendRx = (type: string, index: number, actionName: string, actionValue?: number) => {
    const { midi, range, actions } = this.rxInterface.find(rx => rx.type === type)
    const outIndex = index + range[0]
    if (!inRange(outIndex, range)) {
      throw new Error('bad index value for sendRx')
    }
    if (actionValue && !inRange(actionValue, this.actionValueRange)) {
      throw new Error('bad actionValue for sendRx')
    }
    const action: number = actions[actionName]
    this.midiOut.sendMidi(midi, outIndex, actionValue ? action + actionValue : action)
  }

  getType = (status, data1) => this.mainInterface.find(({ rangeA, rangeB, midi }) =>
    status === midi && (inRange(data1, rangeA) || inRange(data1, rangeB))).type

}


let transport
let hardware
function init() {
  hardware = new XTouchCompact(host.getMidiInPort(0), host.getMidiOutPort(0))
  transport = host.createTransport()
  host.getMidiInPort(0).setMidiCallback(onMidi)

  // TODO: Perform further initialization here.
  println('aubrey-xtouch-compact initialized!')
}

// Called when a short MIDI message is received on MIDI input port 0.
function onMidi(status, data1, data2) {
  // TODO: Implement your MIDI input handling code here.
}

function flush() {
  // TODO: Flush any output to your controller here.
}

function exit() {

}