loadAPI(1);

host.defineController("Source Audio", "Hot Hand", "1.0", "ADEDCC70-3FDA-11E3-AA6E-0800200C9A66");
host.defineMidiPorts(1, 0);
host.addDeviceNameBasedDiscoveryPair(["Source Audio Hot Hand USB"], []);

var AXIS_X = 7;
var AXIS_Y = 8;
var AXIS_Z = 9;
var NUM_DIMENSIONS = 3;

function init()
{
	host.getMidiInPort(0).setMidiCallback(onMidi);

	// cursorDevice = host.createCursorDeviceSection(8);
	cursorTrack = host.createCursorTrackSection(0, 0);
	primaryInstrument = cursorTrack.getPrimaryInstrument();

	for (var i = 0; i < NUM_DIMENSIONS; i++)
	{
		primaryInstrument.getMacro(i).getAmount().setIndication(true);
	}
}

function exit()
{
}

function onMidi(status, data1, data2)
{
	if (isChannelController(status))
	{
		if (data1 == AXIS_X)
		{
			primaryInstrument.getMacro(0).getAmount().set(data2, 128);
		}
		else if (data1 == AXIS_Y)
		{
			primaryInstrument.getMacro(1).getAmount().set(data2, 128);
		}
		else if (data1 == AXIS_Z)
		{
			primaryInstrument.getMacro(2).getAmount().set(data2, 128);
		}
	}
}
