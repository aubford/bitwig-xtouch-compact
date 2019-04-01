
loadAPI(1);

host.defineController("ROLI", "Seaboard GRAND", "1.0", "0E424D64-637D-4961-8BB3-7E4CB2FA12CE");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Seaboard GRAND"], ["Seaboard GRAND"]);

function init()
{
   host.getMidiInPort(0).setMidiCallback(onMidi);
   noteInput = host.getMidiInPort(0).createNoteInput("", "??????");

   noteInput.setUseExpressiveMidi(true, 0, 48);

   // Set POLY ON mode with 15 MPE voices
   sendChannelController(0, 127, 15);

   // Set up pitch bend sensitivity to 48 semitones (00/00)
   sendChannelController(0, 100, 0); // Registered Parameter Number (RPN) - LSB*
   sendChannelController(0, 101, 0); // Registered Parameter Number (RPN) - MSB*
   sendChannelController(0, 38, 0);
   sendChannelController(0, 6, 48);
}

function onMidi(status, data1, data2)
{
}

function exit()
{
}
