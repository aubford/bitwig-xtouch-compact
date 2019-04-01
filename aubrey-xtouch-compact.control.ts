loadAPI(8)
// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true)

host.defineController('Behringer',
  'aubrey-xtouch-compact',
  '0.1',
  '07e1d9d2-246b-46a9-b5b5-07cfbf519fa7',
  'Aubrey Ford'
)
host.defineMidiPorts(1, 1)
host.addDeviceNameBasedDiscoveryPair(['X-TOUCH COMPACT'], ['X-TOUCH COMPACT'])

const NOTE = 0x90
const OFF = 0x80
const CC = 0xB0
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

class XTouchCompact {
  mainInterface
  rxInterface
  constructor() {
    const buttonActions = { off: 0, on: 1, blink: 2 }
    const encoderActions = { off: 0, on: [1,13], blink: [14,26], allOn: 27, allBlinking: 28 }
    const offOn = { off: 0, on: 127 }
    const encoderLEDModeActions = { single: 0, pan: 1, fan: 2, spread: 3, trim: 4 }
    this.rxInterface = [
      { name: FADER, range: [1,9], type: CC },
      { name: TRACK_ENCODERS, range: [26,33], type: CC, actions: encoderActions },
      { name: TRACK_ENCODERS_PUSH, range: [18,25], type: CC, encoderLEDModeActions },
      { name: SIDE_ENCODERS, range: [34,41], type: CC, actions: encoderActions },
      { name: SIDE_ENCODERS_PUSH, range: [18,25], type: CC, encoderLEDModeActions },
      { name: BUTTONSA, range: [0, 7], type: NOTE, actions: buttonActions },
      { name: BUTTONSB, range: [8, 15], type: NOTE, actions: buttonActions },
      { name: BUTTONSC, range: [16, 23], type: NOTE, actions: buttonActions },
      { name: BUTTONS_FADER, range: [24, 32], type: NOTE, actions: buttonActions },
      { name: BUTTONS_TRANSPORT, range: [33, 38], type: NOTE, actions: buttonActions },
      { name: FOOT_SW_LED, range: [42, 42], type: CC, actions: offOn },
      { name: FOOT_EXP_LED, range: [43, 43], type: CC, actions: offOn },
    ]
    this.mainInterface = [
      { name: TRACK_ENCODERS, rangeA: [10, 17], rangeB: [37, 44], type: CC },
      { name: TRACK_ENCODERS_PUSH, rangeA: [0, 7], rangeB: [55, 62], type: NOTE },
      { name: SIDE_ENCODERS, rangeA: [18, 25], rangeB: [45, 52], type: CC },
      { name: SIDE_ENCODERS_PUSH, rangeA: [8, 15], rangeB: [63, 70], type: NOTE },
      { name: FADER, rangeA: [1, 9], rangeB: [28, 36], type: CC },
      { name: FADER_TOUCH, rangeA: [101, 109], rangeB: [111, 119], type: CC },
      { name: BUTTONS_FADER, rangeA: [40, 48], rangeB: [95, 103], type: NOTE },
      { name: BUTTONSA, rangeA: [16, 23], rangeB: [71, 78], type: NOTE },
      { name: BUTTONSB, rangeA: [24, 31], rangeB: [79, 86], type: NOTE },
      { name: BUTTONSC, rangeA: [32, 39], rangeB: [87, 94], type: NOTE },
      { name: BUTTONS_TRANSPORT, rangeA: [49, 54], rangeB: [104, 109], type: NOTE }
    ]
  }

}


let transport

function init() {
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