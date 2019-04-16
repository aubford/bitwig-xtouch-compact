import { inRange, MainInterface, RxInterface, Range, UserControls, MidiType } from '../framework'

export const TRACK_ENCODERS = 'TRACK_ENCODERS'
export const TRACK_ENCODERS_PUSH = 'TRACK_ENCODERS_PUSH'
export const SIDE_ENCODERS = 'SIDE_ENCODERS'
export const SIDE_ENCODERS_PUSH = 'SIDE_ENCODERS_PUSH'
export const FADER = 'FADER'
export const FADER_TOUCH = 'FADER_TOUCH'
export const BUTTONS_FADER = 'BUTTONS_FADER'
export const BUTTONS1 = 'BUTTONSA'
export const BUTTONS2 = 'BUTTONSB'
export const BUTTONS3 = 'BUTTONSC'
export const BUTTONS_TRANSPORT = 'BUTTONS_TRANSPORT'
export const FOOT_SW_LED = 'FOOT_SW_LED'
export const FOOT_EXP_LED = 'FOOT_EXP_LED'

export class Controller {
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
      {
        range: [8, 15],
        type: BUTTONS2,
        midiType: NOTE,
        actions: buttonActions
      },
      {
        range: [16, 23],
        type: BUTTONS3,
        midiType: NOTE,
        actions: buttonActions
      },
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
        controlsA: new UserControls(1, 9),
        controlsB: new UserControls(28, 36),
        midiType: CC
      },
      {
        type: TRACK_ENCODERS,
        controlsA: new UserControls(10, 17),
        controlsB: new UserControls(37, 44),
        midiType: CC
      },
      {
        type: SIDE_ENCODERS,
        controlsA: new UserControls(18, 25),
        controlsB: new UserControls(45, 52),
        midiType: CC
      },
      {
        type: FADER_TOUCH,
        controlsA: new UserControls(101, 109),
        controlsB: new UserControls(111, 119),
        midiType: CC
      },
      {
        type: TRACK_ENCODERS_PUSH,
        controlsA: new UserControls(0, 7),
        controlsB: new UserControls(55, 62),
        midiType: NOTE
      },
      {
        type: SIDE_ENCODERS_PUSH,
        controlsA: new UserControls(8, 15),
        controlsB: new UserControls(63, 70),
        midiType: NOTE
      },
      {
        type: BUTTONS1,
        controlsA: new UserControls(16, 23),
        controlsB: new UserControls(71, 78),
        midiType: NOTE
      },
      {
        type: BUTTONS2,
        controlsA: new UserControls(24, 31),
        controlsB: new UserControls(79, 86),
        midiType: NOTE
      },
      {
        type: BUTTONS3,
        controlsA: new UserControls(32, 39),
        controlsB: new UserControls(87, 94),
        midiType: NOTE
      },
      {
        type: BUTTONS_FADER,
        controlsA: new UserControls(40, 48),
        controlsB: new UserControls(95, 103),
        midiType: NOTE
      },
      {
        type: BUTTONS_TRANSPORT,
        controlsA: new UserControls(49, 54),
        controlsB: new UserControls(104, 109),
        midiType: NOTE
      }
    ]
    this.midiIn.setMidiCallback(this.onMidi)
  }

  getUserControl = (midiStatus: MidiType, controlKey: number) => {
    const { controlsA, controlsB } = this.getInterfaceElement(
      midiStatus,
      controlKey
    )
    return (
      controlsA.getUserControl(controlKey) ||
      controlsB.getUserControl(controlKey)
    )
  }

  setParameter = (parameter: API.Parameter | false, value: number) => {
    if (!parameter || value < 0 || value > 128) {
      throw new Error('badd parameter')
    }
    parameter.set(value, 128)
  }

  getInterfaceElement = (midiStatus: MidiType, controlKey: number) =>
    this.mainInterface.find(
      ({ controlsA, controlsB, midiType }) =>
        midiStatus === midiType &&
        (inRange(controlKey, controlsA.getRange()) ||
          inRange(controlKey, controlsB.getRange()))
    )

  onMidi = (midiStatus: MidiType, controlKey: number, controlValue: number) => {
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
}
