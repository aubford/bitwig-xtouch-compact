loadAPI(1);

host.defineController("Joue", "Joue", "1.2" , "9be46f60-231e-48a3-9279-a4faccfdbb30", "Joué");
host.defineMidiPorts(2, 2);

host.addDeviceNameBasedDiscoveryPair(["Joue Play", "Joue Edit"], ["Joue Play", "Joue Edit"]);
host.addDeviceNameBasedDiscoveryPair(["Joue", "MIDIIN2 (Joue)"], ["Joue", "MIDIOUT2 (Joue)"]);
host.addDeviceNameBasedDiscoveryPair(["Joue MIDI 1", "Joue MIDI 2"], ["Joue MIDI 1", "Joue MIDI 2"]);


function init()
{
	noteInputOmni   = host.getMidiInPort(0).createNoteInput("Omni", "??????");
	noteInputMpe   = host.getMidiInPort(0).createNoteInput("Mpe", "??????");
	noteInput1  = host.getMidiInPort(0).createNoteInput("Ch 1", "?0????");
	noteInput2  = host.getMidiInPort(0).createNoteInput("Ch 2", "?1????");
	noteInput3  = host.getMidiInPort(0).createNoteInput("Ch 3", "?2????");
	noteInput4  = host.getMidiInPort(0).createNoteInput("Ch 4", "?3????");
	noteInput5  = host.getMidiInPort(0).createNoteInput("Ch 5", "?4????");
	noteInput6  = host.getMidiInPort(0).createNoteInput("Ch 6", "?5????");
	noteInput7  = host.getMidiInPort(0).createNoteInput("Ch 7", "?6????");
	noteInput8  = host.getMidiInPort(0).createNoteInput("Ch 8", "?7????");
	noteInput9  = host.getMidiInPort(0).createNoteInput("Ch 9", "?8????");
	noteInput10 = host.getMidiInPort(0).createNoteInput("Ch 10", "?9????");
	noteInput11 = host.getMidiInPort(0).createNoteInput("Ch 11", "?A????");
	noteInput12 = host.getMidiInPort(0).createNoteInput("Ch 12", "?B????");
	noteInput13 = host.getMidiInPort(0).createNoteInput("Ch 13", "?C????");
	noteInput14 = host.getMidiInPort(0).createNoteInput("Ch 14", "?D????");
	noteInput15 = host.getMidiInPort(0).createNoteInput("Ch 15", "?E????");
	noteInput16 = host.getMidiInPort(0).createNoteInput("Ch 16", "?F????");

	noteInputOmni.setShouldConsumeEvents(false);
	noteInputMpe.setShouldConsumeEvents(false);
	noteInput1.setShouldConsumeEvents(false);
	noteInput2.setShouldConsumeEvents(false);
	noteInput3.setShouldConsumeEvents(false);
	noteInput4.setShouldConsumeEvents(false);
	noteInput5.setShouldConsumeEvents(false);
	noteInput6.setShouldConsumeEvents(false);
	noteInput7.setShouldConsumeEvents(false);
	noteInput8.setShouldConsumeEvents(false);
	noteInput9.setShouldConsumeEvents(false);
	noteInput10.setShouldConsumeEvents(false);
	noteInput11.setShouldConsumeEvents(false);
	noteInput12.setShouldConsumeEvents(false);
	noteInput13.setShouldConsumeEvents(false);
	noteInput14.setShouldConsumeEvents(false);
	noteInput15.setShouldConsumeEvents(false);
	noteInput16.setShouldConsumeEvents(false);
		
	noteInputMpe.setUseExpressiveMidi(true, 0, 48);
	
	host.getMidiInPort(0).setMidiCallback(onMidi);
	host.getMidiInPort(0).setSysexCallback(onSysex);
	
}

function onMidi(status, data1, data2)
{

	

}

function onSysex(data)
{

}

function exit()
{

}
