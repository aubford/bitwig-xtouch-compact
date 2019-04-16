export enum MidiType {
  NOTE = 0x90,
  NOTE_OFF = 0x80,
  CC = 0xb0
}

export type Range = [number, number]
export type GetRange = () => Range
export type RxActions = { [x: string]: number }
export interface RxInterface {
  type: string
  range: Range
  midiType: MidiType
  actions?: RxActions
}
export interface MainInterface {
  controlsA: any
  controlsB: any
  type: string
  midiType: MidiType
}

abstract class UserControlsBase {
  constructor(rangeStart: number, rangeEnd: number){}
  rangeStart: number
  rangeEnd: number
  numControls: number
  controls: API.UserControlBank

  getRange: GetRange
  getUserControl: (number) => false | API.Parameter
  getControlAtIndex: (number) => API.Parameter
}


export class UserControls extends UserControlsBase {
  constructor(rangeStart, rangeEnd) {
    super(rangeStart, rangeEnd)
    this.rangeStart = rangeStart
    this.rangeEnd = rangeEnd
    this.numControls = 1 + rangeEnd - rangeStart
    this.controls = host.createUserControls(this.numControls)
  }

  getRange: GetRange = () => [this.rangeStart, this.rangeEnd]

  getUserControlIndexFromControlKey = (controlKey: number) => {
    if (controlKey >= this.rangeStart && controlKey <= this.rangeEnd) {
      return controlKey - this.rangeStart
    }
    return null
  }

  getUserControl = (controlKey: number) => {
    const controlIndex = this.getUserControlIndexFromControlKey(controlKey)
    if (controlIndex !== null) {
      return this.controls.getControl(controlIndex)
    }
    return false
  }

  getControlAtIndex = (controlIndex: number) => {
    if (controlIndex > this.numControls - 1 || controlIndex < 0) {
      throw new Error('UserControls.getControlAtIndex: Not in range')
    }
    return this.controls.getControl(controlIndex)
  }
}


// Util

export const inRange = (val, range) => range[0] <= val && val <= range[1]
