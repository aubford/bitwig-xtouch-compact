"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../src/aubrey-xtouch-compact.control.ts");
require("./mocks.ts");
var xtouch = new XTouchCompact(host.getMidiInPort(), host.getMidiOutPort());
var userControl;
describe('XTouchCompact', function () {
    beforeAll(function () {
        xtouch = new XTouchCompact(host.getMidiInPort(), host.getMidiOutPort());
    });
    test('getInterfaceElement', function () {
        var sideEncoder = xtouch.getUserControl(MidiType.CC, 18);
        expect(sideEncoder.type).toBe(SIDE_ENCODERS);
    });
    test('getUserControls', function () {
        userControl = xtouch.getUserControl(MidiType.CC, 18);
    });
});
