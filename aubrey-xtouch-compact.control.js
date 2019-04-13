loadAPI(8);
// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);
host.defineController('Behringer', 'aubrey-xtouch-compact', '0.1', '07e1d9d2-246b-46a9-b5b5-07cfbf519fa7', 'Aubrey Ford');
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(['X-TOUCH COMPACT'], ['X-TOUCH COMPACT']);
var MidiType;
(function (MidiType) {
    MidiType[MidiType["NOTE"] = 144] = "NOTE";
    MidiType[MidiType["NOTE_OFF"] = 128] = "NOTE_OFF";
    MidiType[MidiType["CC"] = 176] = "CC";
})(MidiType || (MidiType = {}));
var TRACK_ENCODERS = 'TRACK_ENCODERS';
var TRACK_ENCODERS_PUSH = 'TRACK_ENCODERS_PUSH';
var SIDE_ENCODERS = 'SIDE_ENCODERS';
var SIDE_ENCODERS_PUSH = 'SIDE_ENCODERS_PUSH';
var FADER = 'FADER';
var FADER_TOUCH = 'FADER_TOUCH';
var BUTTONS_FADER = 'BUTTONS_FADER';
var BUTTONS1 = 'BUTTONSA';
var BUTTONS2 = 'BUTTONSB';
var BUTTONS3 = 'BUTTONSC';
var BUTTONS_TRANSPORT = 'BUTTONS_TRANSPORT';
var FOOT_SW_LED = 'FOOT_SW_LED';
var FOOT_EXP_LED = 'FOOT_EXP_LED';
var inRange = function (val, range) { return range[0] <= val <= range[1]; };
var encoderActionInRange = function (val) { return inRange(val, [0, 12]); };
var UserControls = /** @class */ (function () {
    function UserControls(rangeStart, rangeEnd) {
        var _this = this;
        this.getUserControlIndex = function (controlKey) {
            if (controlKey >= _this.rangeStart && controlKey <= _this.rangeEnd) {
                return _this.rangeEnd - controlKey;
            }
            return null;
        };
        this.getUserControl = function (controlKey) {
            var controlIndex = _this.getUserControlIndex(controlKey);
            if (controlIndex !== null) {
                return _this.controls.getControl(controlIndex);
            }
            return false;
        };
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
        this.controls = host.createUserControls(rangeEnd - rangeStart);
    }
    return UserControls;
}());
var XTouchCompact = /** @class */ (function () {
    function XTouchCompact(midiIn, midiOut) {
        var _this = this;
        this.actionValueRange = [0, 12];
        this.sendRx = function (type, controlKey, actionName, actionValue) {
            if (actionValue && !inRange(actionValue, _this.actionValueRange)) {
                throw new Error('bad actionValue for sendRx');
            }
            var _a = _this.rxInterface.find(function (rx) { return rx.type === type; }), midiType = _a.midiType, range = _a.range, actions = _a.actions;
            var outIndex = controlKey + range[0];
            if (!inRange(outIndex, range)) {
                throw new Error('bad controlIndex value for sendRx');
            }
            var action = actions[actionName];
            _this.midiOut.sendMidi(midiType, outIndex, actionValue ? action + actionValue : action);
        };
        this.getInterfaceElement = function (midiStatus, controlKey) {
            return _this.mainInterface.find(function (_a) {
                var controlsA = _a.controlsA, controlsB = _a.controlsB, midiType = _a.midiType;
                return midiStatus === midiType &&
                    (inRange(controlKey, controlsA) || inRange(controlKey, controlsB));
            });
        };
        this.getUserControl = function (midiStatus, controlKey) {
            var _a = _this.getInterfaceElement(midiStatus, controlKey), controlsA = _a.controlsA, controlsB = _a.controlsB;
            return controlsA.getUserControl(controlKey) || controlsB.getUserControl(controlKey);
        };
        this.setParameter = function (parameter, value) {
            if (!parameter) {
                throw new Error('badd parameter');
            }
            parameter.setImmediately(value / 128);
        };
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        var buttonActions = { off: 0, on: 1, blink: 2 };
        var encoderActions = {
            off: 0,
            onOffset: 1,
            blinkOffset: 14,
            allOn: 27,
            allBlinking: 28
        };
        var offOn = { off: 0, on: 127 };
        var encoderLEDModeActions = {
            single: 0,
            pan: 1,
            fan: 2,
            spread: 3,
            trim: 4
        };
        var NOTE = MidiType.NOTE, CC = MidiType.CC;
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
        ];
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
        ];
        this.midiIn.setMidiCallback(this.onMidi);
    }
    XTouchCompact.prototype.onMidi = function (midiStatus, controlKey, controlValue) {
        this.setParameter(this.getUserControl(midiStatus, controlKey), controlValue);
    };
    return XTouchCompact;
}());
var hardware;
var transport;
function init() {
    hardware = new XTouchCompact(host.getMidiInPort(0), host.getMidiOutPort(0));
    transport = host.createTransport();
}
function flush() {
    // TODO: Flush any output to your controller here.
}
function exit() { }
