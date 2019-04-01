loadAPI(2);
host.setShouldFailOnDeprecatedUse(true);

host.defineController("Generic", "Keyboard + 8 Device Knobs (CC 20-27)", "2.3.3", "BADEC0B0-806E-46CB-AB8C-06209F78F6F9");
host.defineMidiPorts(1, 0);
host.setShouldFailOnDeprecatedUse(true);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;

var DEVICE_START_CC = 20;
var DEVICE_END_CC = 27;

function init()
{
  midiIn = host.getMidiInPort(0);
  midiIn.setMidiCallback(onMidi);
  midiIn.setSysexCallback(onSysex);
  allChannels = midiIn.createNoteInput("All Channels", "??????");
  allChannels.setShouldConsumeEvents(false);

  for (var i = 0; i < 16; i++)
  {
      midiIn.createNoteInput("Channel " + (i + 1), "?" + i.toString(16) + "????");
  }

  transport = host.createTransport();

	// Map CC 20 - 27 to device parameters

	cursorTrack = host.createCursorTrack(3, 0);
	cursorDevice = cursorTrack.createCursorDevice();
	remoteControls = cursorDevice.createCursorRemoteControlsPage(8);

	for ( var i = 0; i < 8; i++)
	{
		var p = remoteControls.getParameter(i).getAmount();
		p.setIndication(true);
		p.setLabel("P" + (i + 1));
	}

	// Make the rest freely mappable
	userControls = host.createUserControls(HIGHEST_CC - LOWEST_CC + 1 - 8);

	for ( var i = LOWEST_CC; i < HIGHEST_CC; i++)
	{
		if (!isInDeviceParametersRange(i))
		{
			var index = userIndexFromCC(i);
			userControls.getControl(index).setLabel("CC" + i);
		}
	}
}

function isInDeviceParametersRange(cc)
{
	return cc >= DEVICE_START_CC && cc <= DEVICE_END_CC;
}

function userIndexFromCC(cc)
{
	if (cc > DEVICE_END_CC)
	{
		return cc - LOWEST_CC - 8;
	}

	return cc - LOWEST_CC;
}

function onMidi(status, data1, data2)
{
	if (isChannelController(status))
	{
		if (isInDeviceParametersRange(data1))
		{
			var index = data1 - DEVICE_START_CC;
			remoteControls.getParameter(index).getAmount().value().set(data2, 128);
		}
		else if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC)
		{
			var index = userIndexFromCC(data1);
			userControls.getControl(index).value().set(data2, 128);
		}
	}
}

function onSysex(data) {
   // MMC Transport Controls:
   switch (data) {
      case "f07f7f0605f7":
         transport.rewind();
         break;
      case "f07f7f0604f7":
         transport.fastForward();
         break;
      case "f07f7f0601f7":
         transport.stop();
         break;
      case "f07f7f0602f7":
         transport.play();
         break;
      case "f07f7f0606f7":
         transport.record();
         break;
   }
}

function exit()
{
}
