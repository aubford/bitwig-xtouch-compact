/******/ ;(function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {} // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }) // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ) // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true // Return the exports of the module
    /******/
    /******/ /******/ return module.exports
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value)
    /******/ if (mode & 8) return value
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value
    /******/ var ns = Object.create(null)
    /******/ __webpack_require__.r(ns)
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key)
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default']
          }
        : /******/ function getModuleExports() {
            return module
          }
    /******/ __webpack_require__.d(getter, 'a', getter)
    /******/ return getter
    /******/
  } // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 0))
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict'

      Object.defineProperty(exports, '__esModule', { value: true })
      var framework_1 = __webpack_require__(1)
      exports.TRACK_ENCODERS = 'TRACK_ENCODERS'
      exports.TRACK_ENCODERS_PUSH = 'TRACK_ENCODERS_PUSH'
      exports.SIDE_ENCODERS = 'SIDE_ENCODERS'
      exports.SIDE_ENCODERS_PUSH = 'SIDE_ENCODERS_PUSH'
      exports.FADER = 'FADER'
      exports.FADER_TOUCH = 'FADER_TOUCH'
      exports.BUTTONS_FADER = 'BUTTONS_FADER'
      exports.BUTTONS1 = 'BUTTONSA'
      exports.BUTTONS2 = 'BUTTONSB'
      exports.BUTTONS3 = 'BUTTONSC'
      exports.BUTTONS_TRANSPORT = 'BUTTONS_TRANSPORT'
      exports.FOOT_SW_LED = 'FOOT_SW_LED'
      exports.FOOT_EXP_LED = 'FOOT_EXP_LED'
      var Controller = /** @class */ (function() {
        function Controller(midiIn, midiOut) {
          var _this = this
          this.getUserControl = function(midiStatus, controlKey) {
            var _a = _this.getInterfaceElement(midiStatus, controlKey),
              controlsA = _a.controlsA,
              controlsB = _a.controlsB
            return (
              controlsA.getUserControl(controlKey) ||
              controlsB.getUserControl(controlKey)
            )
          }
          this.setParameter = function(parameter, value) {
            if (!parameter || value < 0 || value > 128) {
              throw new Error('badd parameter')
            }
            parameter.set(value, 128)
          }
          this.getInterfaceElement = function(midiStatus, controlKey) {
            return _this.mainInterface.find(function(_a) {
              var controlsA = _a.controlsA,
                controlsB = _a.controlsB,
                midiType = _a.midiType
              return (
                midiStatus === midiType &&
                (framework_1.inRange(controlKey, controlsA.getRange()) ||
                  framework_1.inRange(controlKey, controlsB.getRange()))
              )
            })
          }
          this.onMidi = function(midiStatus, controlKey, controlValue) {
            _this.setParameter(
              _this.getUserControl(midiStatus, controlKey),
              controlValue
            )
          }
          this.actionValueRange = [0, 12]
          this.sendRx = function(type, controlKey, actionName, actionValue) {
            if (
              actionValue &&
              !framework_1.inRange(actionValue, _this.actionValueRange)
            ) {
              throw new Error('bad actionValue for sendRx')
            }
            var _a = _this.rxInterface.find(function(rx) {
                return rx.type === type
              }),
              midiType = _a.midiType,
              range = _a.range,
              actions = _a.actions
            var outIndex = controlKey + range[0]
            if (!framework_1.inRange(outIndex, range)) {
              throw new Error('bad controlIndex value for sendRx')
            }
            var action = actions[actionName]
            _this.midiOut.sendMidi(
              midiType,
              outIndex,
              actionValue ? action + actionValue : action
            )
          }
          this.midiIn = midiIn
          this.midiOut = midiOut
          var buttonActions = { off: 0, on: 1, blink: 2 }
          var encoderActions = {
            off: 0,
            onOffset: 1,
            blinkOffset: 14,
            allOn: 27,
            allBlinking: 28
          }
          var offOn = { off: 0, on: 127 }
          var encoderLEDModeActions = {
            single: 0,
            pan: 1,
            fan: 2,
            spread: 3,
            trim: 4
          }
          var NOTE = framework_1.MidiType.NOTE,
            CC = framework_1.MidiType.CC
          this.rxInterface = [
            { range: [1, 9], type: exports.FADER, midiType: CC },
            {
              range: [10, 17],
              type: exports.TRACK_ENCODERS_PUSH,
              midiType: CC,
              actions: encoderLEDModeActions
            },
            {
              range: [18, 25],
              type: exports.SIDE_ENCODERS_PUSH,
              midiType: CC,
              actions: encoderLEDModeActions
            },
            {
              range: [26, 33],
              type: exports.TRACK_ENCODERS,
              midiType: CC,
              actions: encoderActions
            },
            {
              range: [34, 41],
              type: exports.SIDE_ENCODERS,
              midiType: CC,
              actions: encoderActions
            },
            {
              range: [42, 42],
              type: exports.FOOT_SW_LED,
              midiType: CC,
              actions: offOn
            },
            {
              range: [43, 43],
              type: exports.FOOT_EXP_LED,
              midiType: CC,
              actions: offOn
            },
            {
              range: [0, 7],
              type: exports.BUTTONS1,
              midiType: NOTE,
              actions: buttonActions
            },
            {
              range: [8, 15],
              type: exports.BUTTONS2,
              midiType: NOTE,
              actions: buttonActions
            },
            {
              range: [16, 23],
              type: exports.BUTTONS3,
              midiType: NOTE,
              actions: buttonActions
            },
            {
              range: [24, 32],
              type: exports.BUTTONS_FADER,
              midiType: NOTE,
              actions: buttonActions
            },
            {
              range: [33, 38],
              type: exports.BUTTONS_TRANSPORT,
              midiType: NOTE,
              actions: buttonActions
            }
          ]
          this.mainInterface = [
            {
              type: exports.FADER,
              controlsA: new framework_1.UserControls(1, 9),
              controlsB: new framework_1.UserControls(28, 36),
              midiType: CC
            },
            {
              type: exports.TRACK_ENCODERS,
              controlsA: new framework_1.UserControls(10, 17),
              controlsB: new framework_1.UserControls(37, 44),
              midiType: CC
            },
            {
              type: exports.SIDE_ENCODERS,
              controlsA: new framework_1.UserControls(18, 25),
              controlsB: new framework_1.UserControls(45, 52),
              midiType: CC
            },
            {
              type: exports.FADER_TOUCH,
              controlsA: new framework_1.UserControls(101, 109),
              controlsB: new framework_1.UserControls(111, 119),
              midiType: CC
            },
            {
              type: exports.TRACK_ENCODERS_PUSH,
              controlsA: new framework_1.UserControls(0, 7),
              controlsB: new framework_1.UserControls(55, 62),
              midiType: NOTE
            },
            {
              type: exports.SIDE_ENCODERS_PUSH,
              controlsA: new framework_1.UserControls(8, 15),
              controlsB: new framework_1.UserControls(63, 70),
              midiType: NOTE
            },
            {
              type: exports.BUTTONS1,
              controlsA: new framework_1.UserControls(16, 23),
              controlsB: new framework_1.UserControls(71, 78),
              midiType: NOTE
            },
            {
              type: exports.BUTTONS2,
              controlsA: new framework_1.UserControls(24, 31),
              controlsB: new framework_1.UserControls(79, 86),
              midiType: NOTE
            },
            {
              type: exports.BUTTONS3,
              controlsA: new framework_1.UserControls(32, 39),
              controlsB: new framework_1.UserControls(87, 94),
              midiType: NOTE
            },
            {
              type: exports.BUTTONS_FADER,
              controlsA: new framework_1.UserControls(40, 48),
              controlsB: new framework_1.UserControls(95, 103),
              midiType: NOTE
            },
            {
              type: exports.BUTTONS_TRANSPORT,
              controlsA: new framework_1.UserControls(49, 54),
              controlsB: new framework_1.UserControls(104, 109),
              midiType: NOTE
            }
          ]
          this.midiIn.setMidiCallback(this.onMidi)
        }
        return Controller
      })()
      exports.Controller = Controller

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict'

      var __extends =
        (this && this.__extends) ||
        (function() {
          var extendStatics = function(d, b) {
            extendStatics =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function(d, b) {
                  d.__proto__ = b
                }) ||
              function(d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
              }
            return extendStatics(d, b)
          }
          return function(d, b) {
            extendStatics(d, b)
            function __() {
              this.constructor = d
            }
            d.prototype =
              b === null
                ? Object.create(b)
                : ((__.prototype = b.prototype), new __())
          }
        })()
      Object.defineProperty(exports, '__esModule', { value: true })
      var MidiType
      ;(function(MidiType) {
        MidiType[(MidiType['NOTE'] = 144)] = 'NOTE'
        MidiType[(MidiType['NOTE_OFF'] = 128)] = 'NOTE_OFF'
        MidiType[(MidiType['CC'] = 176)] = 'CC'
      })((MidiType = exports.MidiType || (exports.MidiType = {})))
      var UserControlsBase = /** @class */ (function() {
        function UserControlsBase(rangeStart, rangeEnd) {}
        return UserControlsBase
      })()
      var UserControls = /** @class */ (function(_super) {
        __extends(UserControls, _super)
        function UserControls(rangeStart, rangeEnd) {
          var _this = _super.call(this, rangeStart, rangeEnd) || this
          _this.getRange = function() {
            return [_this.rangeStart, _this.rangeEnd]
          }
          _this.getUserControlIndexFromControlKey = function(controlKey) {
            if (
              controlKey >= _this.rangeStart &&
              controlKey <= _this.rangeEnd
            ) {
              return controlKey - _this.rangeStart
            }
            return null
          }
          _this.getUserControl = function(controlKey) {
            var controlIndex = _this.getUserControlIndexFromControlKey(
              controlKey
            )
            if (controlIndex !== null) {
              return _this.controls.getControl(controlIndex)
            }
            return false
          }
          _this.getControlAtIndex = function(controlIndex) {
            if (controlIndex > _this.numControls - 1 || controlIndex < 0) {
              throw new Error('UserControls.getControlAtIndex: Not in range')
            }
            return _this.controls.getControl(controlIndex)
          }
          _this.rangeStart = rangeStart
          _this.rangeEnd = rangeEnd
          _this.numControls = 1 + rangeEnd - rangeStart
          _this.controls = host.createUserControls(_this.numControls)
          return _this
        }
        return UserControls
      })(UserControlsBase)
      exports.UserControls = UserControls
      // Util
      exports.inRange = function(val, range) {
        return range[0] <= val && val <= range[1]
      }

      /***/
    }
    /******/
  ]
)
