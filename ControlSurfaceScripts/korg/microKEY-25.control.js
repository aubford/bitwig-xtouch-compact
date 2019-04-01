loadAPI(1);

host.defineController("Korg", "microKEY-25", "1.0", "62731D4D-368A-4710-A729-BC7462DF2800");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["microKEY-25"], ["microKEY-25"]);
host.addDeviceNameBasedDiscoveryPair(["microKEY-25 KEYBOARD"], ["microKEY-25 CTRL"]);

function init()
{
   host.getMidiInPort(0).createNoteInput("", "8?????", "9?????", "B?40??", "D?????", "E?????");
   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);

   cursorTrack = host.createCursorTrackSection(0, 0);
   primaryDevice = cursorTrack.getPrimaryDevice();

   primaryDevice.getMacro(0).getAmount().setIndication(true);
   primaryDevice.getMacro(1).getAmount().setIndication(true);
}

function exit()
{
}

function onMidi(status, data1, data2)
{
   //printMidi(status, data1, data2);

   /*if (isPitchBend(status))
   {
      var val = pitchBendValue(data1, data2);
   }
   else*/
   if (isChannelController(status))
   {
      if (data1 == 1)
      {
         // XY UP
         primaryDevice.getMacro(0).getAmount().set(data2, 128);
      }
      else if (data1 == 2)
      {
         // XY DOWN
         primaryDevice.getMacro(1).getAmount().set(data2, 128);
      }

      if (data1 == 67)  // XY press
      {
         if (data2 == 127)
         {
            // this is reached if the XY pad is pressed.. can be used to switch to a different mode
         }
      }
   }
}
