// Controller Script for the CME Xkey.
// All CCs mappable
// Poly Aftertouch to Timbre
// Autodetection

loadAPI(1);

host.defineController("CME", "Xkey", "1.0", "846f8c60-2a0a-11e4-8c21-0800200c9a66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Xkey"], ["Xkey"]);
host.addDeviceNameBasedDiscoveryPair(["Xkey MIDI 1"], ["Xkey MIDI 1"]);
host.addDeviceNameBasedDiscoveryPair(["Xkey25"], ["Xkey25"]);
host.addDeviceNameBasedDiscoveryPair(["Xkey37"], ["Xkey37"]);

function init()
{
   var CME = host.getMidiInPort(0).createNoteInput("CME Xkey", "??????");
   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.getMidiInPort(0).setSysexCallback(onSysex);
   //CME.setShouldConsumeEvents(false);
}

function onMidi(status, data1, data2)
{
   //printMidi(status, data1, data2);
}

function onSysex(data)
{
}

function exit()
{
}
