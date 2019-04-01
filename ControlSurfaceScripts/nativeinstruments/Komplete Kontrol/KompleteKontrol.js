// Native Instruments Komplete Kontrol S

var LOWEST_CC = 1;
var HIGHEST_CC = 119;

var KK = {
   play : 94,
   stop : 93,
   rec : 95,
   loop : 86,
   rwd : 91,
   ffw : 92,
   pressed : false,
   isPlaying : false,
   isRecording : false,
   isLoop : false,
   stopTime : false,
   modeName : ["Mix", "Track", "Device", "User"],
   mode : 0,
   userMode : 0,
   transport : null,
   cTrack : null,
   cDevice : null,
   tracks : null
};

//KK.trackHasChanged = false;
//KK.deviceHasChanged = false;

function init()
{
   KK.note = host.getMidiInPort(0).createNoteInput("Keys", "??????");
   KK.note.setShouldConsumeEvents(false);
   KK.note.assignPolyphonicAftertouchToExpression(0, NoteExpression.TIMBRE_UP, 2)

   host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);
   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.getMidiInPort(0).setSysexCallback(onSysex);
   host.getMidiInPort(1).setMidiCallback(onMidi1);
   host.getMidiInPort(1).setSysexCallback(onSysex1);
   host.getMidiInPort(2).setMidiCallback(onMidi2);
   host.getMidiInPort(2).setSysexCallback(onSysex2);

   notif = host.getNotificationSettings();

   notif.setShouldShowChannelSelectionNotifications(true);
   notif.setShouldShowDeviceLayerSelectionNotifications(true);
   notif.setShouldShowDeviceSelectionNotifications(true);
   notif.setShouldShowMappingNotifications(true);
   notif.setShouldShowPresetNotifications(true);
   notif.setShouldShowSelectionNotifications(true);
   notif.setShouldShowTrackSelectionNotifications(true);
   notif.setShouldShowValueNotifications(true);


   // Make CCs freely mappable
   userControls = host.createUserControlsSection(HIGHEST_CC - LOWEST_CC + 1);

   for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
   {
      userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
   }

   KK.transport = host.createTransport();
   KK.cTrack = host.createCursorTrack(6, 0);
   KK.cDevice = KK.cTrack.getPrimaryDevice();
   KK.tracks = host.createTrackBank(8, 0, 0);
   KK.user = host.createUserControls(16);

   for (var i = 0; i < 16; i++) {
      KK.user.getControl(i).setLabel("User " + i);
   }

   setIndications();

   // Observer:
   KK.transport.addIsPlayingObserver(function(on) {
      KK.isPlaying = on;
      host.getMidiOutPort(2).sendMidi(144, KK.play, on ? 127 : 0);
      host.getMidiOutPort(2).sendMidi(144, KK.stop, on ? 0 : 127);
   });
   KK.transport.addIsRecordingObserver(function(on) {
      KK.isRecording = on;
      host.getMidiOutPort(2).sendMidi(144, KK.rec, on ? 127 : 0);
   });
   KK.transport.addIsLoopActiveObserver(function(on) {
      KK.isLoop = on;
      host.getMidiOutPort(2).sendMidi(144, KK.loop, on ? 127 : 0);
   });
}


function onMidi(status, data1, data2)
{
   //println("Midi 0")
   //printMidi(status, data1, data2);

   if (isChannelController(status))
   {
      var inc = 0;
      if (data2 < 64) {
         inc = data2;
      }
      else {
         inc = -(128 - data2);
      }
      if (data1 >= 14 && data1 < 22) {
         switch (KK.mode) {
            case 0:
               KK.tracks.getTrack(data1 - 14).getVolume().inc(inc, 255);
               break;
            case 1:
               if (data1 === 14) {
                  KK.cTrack.getVolume().inc(inc, 255);
               }
               else if (data1 === 15) {
                  KK.cTrack.getPan().inc(inc, 255);
               }
               else {
                  KK.cTrack.getSend(data1 - 16).inc(inc, 255);
               }
               break;
            case 2:
               KK.cDevice.getMacro(data1 - 14).getAmount().inc(inc, 255);
               break;
            case 3:
               if(KK.userMode === 0) {
                  KK.user.getControl(data1 - 14).inc(inc, 128);
               }
               else if(KK.userMode === 1) {
                  KK.user.getControl(data1 - 14 + 8).inc(inc, 128);
               }
               break;

         }
      }
   }
}

function onMidi1(status, data1, data2)
{
   //println("Midi 1")
   //printMidi(status, data1, data2);
}

function onMidi2(status, data1, data2) {
   //println("Midi 2")
   //printMidi(status, data1, data2);

   if (isNoteOn(status)) {
      if (data2 > 64) {
         //code
         switch(data1) {
            case KK.play:
               KK.transport.play();
               break;
            case KK.stop:
               KK.stopTime = true;
               KK.pressed = true;
               host.scheduleTask(setStopTimer, null, 400);
               break;
            case KK.rec:
               KK.transport.record()
               break;
            case KK.loop:
               if (KK.pressed) {
                  KK.mode = (KK.mode + 1) % 4;
                  host.showPopupNotification(KK.modeName[KK.mode] + " Mode");
                  setIndications();
               }
               else {
                  KK.transport.toggleLoop();
               }
               break;
            case KK.ffw:
               if (KK.pressed) {
                  switch (KK.mode) {
                     case 0:
                        KK.tracks.scrollTracksDown();
                        break;
                     case 1:
                        KK.trackHasChanged = true;
                        KK.cTrack.selectNext();
                        break;
                     case 2:
                        KK.deviceHasChanged = true;
                        KK.cDevice.switchToDevice(DeviceType.ANY,ChainLocation.NEXT);
                        break;
                     case 3:
                        KK.userMode = 1;
                        host.showPopupNotification("User Bank 2");
                        break;
                  }
               }
               else {
                  KK.transport.fastForward();
               }
               break;
            case KK.rwd:
               if (KK.pressed) {
                  switch (KK.mode) {
                     case 0:
                        KK.tracks.scrollTracksUp();
                        break;
                     case 1:
                        KK.trackHasChanged = true;
                        KK.cTrack.selectPrevious();
                        break;
                     case 2:
                        KK.deviceHasChanged = true;
                        KK.cDevice.switchToDevice(DeviceType.ANY,ChainLocation.PREVIOUS);
                        break;
                     case 3:
                        KK.userMode = 0;
                        host.showPopupNotification("User Bank 1");
                        break;
                  }
               }
               else {
                  KK.transport.rewind();
               }
               break;
         }
      }
      else {
         switch(data1) {
            case KK.play:
               break;
            case KK.stop:
               if (KK.stopTime) {
                  KK.transport.stop();
               }
               KK.pressed = false;
               break;
            case KK.rec:
               break;
            case KK.loop:
               break;
            case KK.ffw:
               break;
            case KK.rwd:
               break;
         }
      }
   }
}

function setStopTimer () {
   KK.stopTime = false;
   host.showPopupNotification(KK.modeName[KK.mode] + " Mode");
}

function setIndications () {
   var mix = false;
   var track = false;
   var device = false;
   var user = false;
   switch (KK.mode) {
      case 0:
         mix = true;
         break;
      case 1:
         track = true;
         break;
      case 2:
         device = true;
         break;
      case 3:
         user = true;
         break;
   }
   for (var i = 0; i < 8; i++) {
      KK.tracks.getTrack(i).getVolume().setIndication(mix);
      KK.cDevice.getMacro(i).getAmount().setIndication(device);
      KK.user.getControl(i).setIndication(user);
   }
   KK.cTrack.getVolume().setIndication(track);
   KK.cTrack.getPan().setIndication(track);
   for (var j = 0; j < 6; j++) {
      KK.cTrack.getSend(j).setIndication(track);
   }

}

function onSysex(data) {
   //println("Sysex0")
   //printSysex(data);
}
function onSysex1(data) {
   //println("Sysex1")
   //printSysex(data);
}
function onSysex2(data) {
   //println("Sysex2")
   //printSysex(data);
}
function exit()
{
}
