
loadAPI(1);

host.defineController("ACME", "product 2000", "1.0", "INSERT UUID HERE");
host.defineMidiPorts(1, 1);

function init()

{
   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.getMidiInPort(0).setSysexCallback(onSysex);
}

function exit()
{
}

function onMidi(status, data1, data2)
{
}

function onSysex(data)
{
}
