//////////////////////////////////////////////////////
////        encoders can send nrpn, but it's broken. on fast movements, an encoder sends less data,
////        which means, much less and delayed change of parameter values in the app.
////        only works like expected when moving encoders very slowly
////        -> check nrpn behaviour on apc40
/////////////////////////////////////////////////////////////////////////////////////////////////////

loadAPI(1);

host.defineController("Akai", "MPK25", "1.0", "4AF735DD-5294-4122-BEFD-D64D820C89CA");
host.defineSysexIdentityReply("F0 7E ?? 06 02 47 72 00 19 00 ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? F7");
// "F0 7E 00 06 02 47 72 00 19 00 01 00 03 00 7F 7F 7F 7F 00 4B 01 00 09 00 09
// 00 02 03 09 00 08 09 07 02 F7";
host.defineMidiPorts(1, 1);

if (host.platformIsWindows())
	host.addDeviceNameBasedDiscoveryPair(["Akai MPK25"], ["Akai MPK25"]);
else if (host.platformIsMac())
	host.addDeviceNameBasedDiscoveryPair(["Akai MPK25 Port 1"], ["Akai MPK25 Port 1"]);
else if (host.platformIsLinux())
	host.addDeviceNameBasedDiscoveryPair(["Akai MPK25 MIDI 1"], ["Akai MPK25 MIDI 1"]);

var CC =
{
	REW : 115,
	FF : 116,
	STOP : 117,
	PLAY : 118,
	REC : 119,
	K1A : 12,
	K2A : 13,
	K3A : 14,
	K4A : 15,
	K1B : 16,
	K2B : 17,
	K3B : 18,
	K4B : 19,
	K5A : 20,
	K5B : 28,
	S1A : 50,
	S2A : 51,
	S3A : 52,
	S4A : 53,
	S1B : 54,
	S2B : 55,
	S3B : 56,
	S4B : 57,

	K12A : 27,

};

// var NRPN = // see nrpn commment  //////////
// {
// K1A : 1,
// K2A : 2,
// K3A : 3,
// K4A : 4,
// K1B : 13,
// K2B : 14,
// K3B : 15,
// K4B : 16,
// K5A : 5,
// K5B : 17,
// DATA_INC : 96,
// DATA_DEC : 97,
// NRPN_LSB : 98,
// NRPN_MSB : 99
// }
/////////////////////////////////////////////

var isShift = false;
var isPlay = false;
var encoderId = 0;

function init()
{
	host.getMidiInPort(0).setMidiCallback(onMidi);
	host.getMidiInPort(0).setSysexCallback(onSysex);
   host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);
	MPK25Keys = host.getMidiInPort(0).createNoteInput("Keys", "?0????");
	MPK25Pads = host.getMidiInPort(0).createNoteInput("Pads", "?1????");

	MPK25Keys.setShouldConsumeEvents(false);
	MPK25Pads.setShouldConsumeEvents(false);

   // Notifications:
   host.getNotificationSettings().setShouldShowSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowChannelSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowTrackSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowDeviceSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowDeviceLayerSelectionNotifications(true);
   host.getNotificationSettings().setShouldShowPresetNotifications(true);
   host.getNotificationSettings().setShouldShowMappingNotifications(true);
   host.getNotificationSettings().setShouldShowValueNotifications(true);

	// /////////////////////////////////////////////////// sections
	transport = host.createTransport();
	application = host.createApplication();
	//trackBank = host.createTrackBank(8, 2, 0);
	cursorTrack = host.createCursorTrack(2, 0);
	cursorDevice = cursorTrack.getPrimaryDevice();

	transport.addIsPlayingObserver(function(on)
	{
		isPlay = on;
	});

	for ( var p = 0; p < 8; p++)
	{
		cursorDevice.getMacro(p).getAmount().setIndication(true);
		cursorDevice.getParameter(p).setIndication(true);
      cursorDevice.getParameter(p).setLabel("P" + (p + 1));
	}
}


function onMidi(status, data1, data2)
{
	var pressed = data2 > 64; // ignore button release

	 //printMidi(status, data1, data2);

	// /////////////////////////// NRPN behavior is crap. on fast movements an encoder sends less data, which means, much less and delayed change of parameter values in the app. only works like expected when moving encoders very slowly.

	// var relativeRange = isShift ? 200 : 96;

	// if (data1 == NRPN.NRPN_LSB && data2 != 127 && data2 != encoderId)
	// {
	// encoderId = data2;
	// }
	//
	// if (data1 == NRPN.DATA_INC)
	// {
	// var delta = 1;
	//
	// if (encoderId >= NRPN.K5A && encoderId < NRPN.K5A + 8)
	// {
	// cursorDevice.getMacro(encoderId - NRPN.K5A).getAmount().inc(delta, relativeRange);
	// }
	// if (encoderId >= NRPN.K5B && encoderId < NRPN.K5B + 8)
	// {
	// cursorDevice.getParameter(encoderId - NRPN.K5B).inc(delta, relativeRange);
	// }
	// switch (encoderId)
	// {
	// case NRPN.K1A:
	// cursorTrack.getVolume().inc(delta, relativeRange);
	// break;
	// case NRPN.K2A:
	// cursorTrack.getPan().inc(delta, relativeRange);
	// break;
	// case NRPN.K3A:
	// cursorTrack.getSend(0).inc(delta, relativeRange);
	// break;
	// case NRPN.K4A:
	// cursorTrack.getSend(1).inc(delta, relativeRange);
	// break;
	// case NRPN.K1B:
	// cursorTrack.getVolume().inc(delta, relativeRange);
	// break;
	// case NRPN.K2B:
	// cursorTrack.getPan().inc(delta, relativeRange);
	// break;
	// case NRPN.K3B:
	// cursorTrack.getSend(0).inc(delta, relativeRange);
	// break;
	// case NRPN.K4B:
	// cursorTrack.getSend(1).inc(delta, relativeRange);
	// break;
	//
	// }
	//
	// }
	//
	// if (data1 == NRPN.DATA_DEC)
	// {
	// var delta = -1;
	// if (encoderId >= NRPN.K5A && encoderId < NRPN.K5A + 8)
	// {
	// cursorDevice.getMacro(encoderId - NRPN.K5A).getAmount().inc(delta, relativeRange);
	// }
	// if (encoderId >= NRPN.K5B && encoderId < NRPN.K5B + 8)
	// {
	// cursorDevice.getParameter(encoderId - NRPN.K5B).inc(delta, relativeRange);
	// }
	// switch (encoderId)
	// {
	// case NRPN.K1A:
	// cursorTrack.getVolume().inc(delta, relativeRange);
	// break;
	// case NRPN.K2A:
	// cursorTrack.getPan().inc(delta, relativeRange);
	// break;
	// case NRPN.K3A:
	// cursorTrack.getSend(0).inc(delta, relativeRange);
	// break;
	// case NRPN.K4A:
	// cursorTrack.getSend(1).inc(delta, relativeRange);
	// break;
	// case NRPN.K1B:
	// cursorTrack.getVolume().inc(delta, relativeRange);
	// break;
	// case NRPN.K2B:
	// cursorTrack.getPan().inc(delta, relativeRange);
	// break;
	// case NRPN.K3B:
	// cursorTrack.getSend(0).inc(delta, relativeRange);
	// break;
	// case NRPN.K4B:
	// cursorTrack.getSend(1).inc(delta, relativeRange);
	// break;
	// }
	//
	// }/////////////////////////////////// end of nrpn crap ////////////////////////////////////////////////////

   if (isChannelController(status)) {

      if (data1 >= CC.K5A && data1 < CC.K5A + 8)
      {
         cursorDevice.getMacro(data1 - CC.K5A).getAmount().set(data2, 128);
      }
      if (data1 >= CC.K5B && data1 < CC.K5B + 8)
      {
         cursorDevice.getParameter(data1 - CC.K5B).set(data2, 128);
      }
      switch (data1)
      {
         case CC.K1A:
            cursorTrack.getVolume().set(data2, 128);
            break;
         case CC.K2A:
            cursorTrack.getPan().set(data2, 127);
            break;
         case CC.K3A:
            cursorTrack.getSend(0).set(data2, 128);
            break;
         case CC.K4A:
            cursorTrack.getSend(1).set(data2, 128);
            break;
         case CC.K1B:
            cursorTrack.getVolume().set(data2, 128);
            break;
         case CC.K2B:
            cursorTrack.getPan().set(data2, 128);
            break;
         case CC.K3B:
            cursorTrack.getSend(0).set(data2, 128);
            break;
         case CC.K4B:
            cursorTrack.getSend(1).set(data2, 128);
            break;
         case CC.S1A:
            isShift = data2 > 64;
            break;
         case CC.S1B:
            isShift = data2 > 64;
            break;
      }

      if (pressed)
      {
         switch (data1)
         {
            case CC.PLAY:
               isShift ? transport.returnToArrangement() : transport.play();
               break;
            case CC.STOP:
               isShift ? transport.resetAutomationOverrides() : transport.stop();
               break;
            case CC.REC:
               isShift ? cursorTrack.getArm().toggle() : transport.record();
               break;
            case CC.REW:
               isShift ? cursorTrack.selectPrevious() : transport.rewind();
               break;
            case CC.FF:
               isShift ? cursorTrack.selectNext() : transport.fastForward();
               break;
            case CC.S2A:
               isShift ? cursorDevice.switchToPreviousPreset() : cursorDevice.switchToNextPreset();
               break;
            case CC.S3A:
               isShift ? cursorDevice.switchToPreviousPresetCategory() : cursorDevice.switchToNextPresetCategory();
               break;
            case CC.S4A:
               isShift ? cursorDevice.switchToPreviousPresetCreator() : cursorDevice.switchToNextPresetCreator();
               break;
            case CC.S2B:
               isShift ? cursorDevice.previousParameterPage() : cursorDevice.nextParameterPage();
               break;
            case CC.S3B:
               isShift ? cursorDevice.selectPrevious() : cursorDevice.selectNext();
               break;
            case CC.S4B:
               isShift ? cursorTrack.getMute().toggle() : cursorTrack.getSolo().toggle();
               break;
         }
      }
   }
}

function onSysex(data)
{
	// printSysex(data);
}

function exit()
{

}
