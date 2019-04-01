// Controller Script for the AKAI EWI USB Windcontroller
// Initial Version

loadAPI(1);

host.defineController("Akai", "EWI USB", "1.0", "fa0b9d70-222f-11e4-8c21-0800200c9a66");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["EWI-USB"], ["EWI-USB"]);
host.addDeviceNameBasedDiscoveryPair(["EWI-USB MIDI 1"], ["EWI-USB MIDI 1"]);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;

function init()
{
   EWI = host.getMidiInPort(0).createNoteInput("Akai EWI USB", "?0????");
   EWI.setShouldConsumeEvents(false);
   EWI.assignPolyphonicAftertouchToExpression(0, NoteExpression.TIMBRE_UP, 2)

   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);

   // Make CCs freely mappable
   userControls = host.createUserControlsSection(HIGHEST_CC - LOWEST_CC + 1);

   for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
   {
      userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
   }
}

function exit()
{
}

function onMidi(status, data1, data2)
{
   if (isChannelController(status))
   {
      if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC)
      {
         var index = data1 - LOWEST_CC;
         userControls.getControl(index).set(data2, 128);
      }
   }
}
