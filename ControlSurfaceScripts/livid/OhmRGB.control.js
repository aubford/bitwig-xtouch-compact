


const DEFAULT_MIDI_ASSIGNMENTS = {'mode':'chromatic', 'offset':36, 'vertoffset':12, 'scale':'Chromatic', 'drumoffset':0, 'split':false}

//const QUERYSURFACE = 'F0 7E 7F 06 01 F7';

isShift = false;

loadAPI(1);

host.defineController("Livid Instruments", "OhmRGB", "1.0", "f3b428f0-6689-11e3-949a-0800200c9a66");
var PRODUCT = "07"; //BRAIN="01", OHM64="02", BLOCK="03", CODE="04", MCD="05", MCP="06", OHMRGB="07", CNTRLR="08", BRAIN2="09", ENLIGHTEN="0A", ALIAS8="0B", BASE="0C", BRAINJR="0D"
var LIVIDRESPONSE = "F0 7E ?? 06 02 00 01 61 01 00 "+PRODUCT+" 00 ?? ?? ?? ?? F7";
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["OhmRGB"], ["OhmRGB"]);
host.addDeviceNameBasedDiscoveryPair(["OhmRGB Controls"], ["OhmRGB Controls"]);

for ( var m = 1; m < 9; m++)
{
	host.addDeviceNameBasedDiscoveryPair(["Controls" + m + " (OhmRGB)"], ["Controls" + m + " (OhmRGB)"]);
}
const PADS = new Array(64);
const KNOBS = [17, 16, 9, 8, 19, 18, 11, 10, 21, 20, 13, 12, 3, 1, 0, 2];
const BUTTONS = [65, 73, 66, 74, 67, 75, 68, 76] ;
const FADERS = [23, 22, 15, 14, 5, 7, 6, 4];
const FUNCTION = [69, 70, 71, 77, 78, 79];
const CROSSFADER = 24;
const SHIFT_L = 64;
const SHIFT_R = 72;
const GARY = 87;

var color =
{
	OFF : 0,
	WHITE : 1,
	CYAN : 5,
	MAGENTA : 9,
	RED : 17,
	BLUE : 33,
	YELLOW : 65,
	GREEN : 127
};

var LOCAL_OFF = function()
{
	sendChannelController(15, 122, 64);
}

var script = this;
var session;

var DEBUG = false;	//post() doesn't work without this
var VERSION = '1.0';
var VERBOSE = false;

load("Prototypes.js");

function init()
{
	////////////////////////////////////////////////////////////////////////////////
	application = host.createApplication();
	cursorDevice = host.createCursorDeviceSection(8);
	cursorTrack = host.createCursorTrack(4, 8);
	masterTrack = host.createMasterTrack(8);
	//transport = host.createTransport();
	trackBank = host.createMainTrackBank(7, 8, 8);
	returnBank = host.createEffectTrackBank(4, 8);
	////////////////////////////////////////////////////////////////////////////////
	post('OhmRGB script loading ------------------------------------------------');
	host.getMidiInPort(0).setMidiCallback(onMidi);
	host.getMidiInPort(0).setSysexCallback(onSysex);
	initialize_noteInput();
	initialize_prototypes();
	initialize_surface();
	setup_controls();
	resetAll();
	setup_session();
	setup_mixer();
	setup_device();
	setup_transport();
	setup_instrument_control();
	setup_tasks();
	setup_modes();
	setup_notifications();
	setup_listeners();
	setupTests();
	//LOCAL_OFF();
	MainModes.change_mode(0, true);
	post('OhmRGB script loaded! ------------------------------------------------');
	notifier.show_message('OhmRGB Script version ' + VERSION +' loaded.');
}

function initialize_noteInput()
{
	noteInput = host.getMidiInPort(0).createNoteInput("OhmRGBInstrument", "80????", "90????", "D0????", "E0????");
	noteInput.setShouldConsumeEvents(false);
}

function initialize_surface()
{
	//sendSysex(LINKFUNCBUTTONS);
	//sendSysex(DISABLECAPFADERNOTES);
}

function setup_controls()
{
	script['faders'] = [];
	script['faderbank'] = new Grid(8, 0, 'Faders');
	for (var i = 0;i < 8; i++)
	{
		faders[i] = new Slider(FADERS[i], 'Fader_'+i);
		faderbank.add_control(i, 0, faders[i]);
	}
	script['pads'] = [];
	for (var i = 0;i < 8; i++)
	{
		for (var j = 0; j < 8; j++)
		{
			var number = i+(j*8);
			var id = j+(i*8);
			pads[number] = new Button(id,  'Pad_'+(number));
		}
	}
	script['grid'] = new Grid(8, 8, 'Grid');
	for ( var i = 0; i< 8; i++)
	{
		for (var j = 0; j< 8; j++)
		{
			var number = i + (j*8);
			grid.add_control(i, j, pads[number]);
		}
	}
	script['buttons'] = [];
	for ( var i = 0; i< 8; i++)
	{
		buttons[i] = new Button(BUTTONS[i], 'Button_'+i);
	}
	script['functions'] = [];
	for ( var i = 0; i< 6; i++)
	{
		functions[i] = new Button(FUNCTION[i], 'Function_'+i);
	}
	script['knobs'] = [];
	for (var i = 0; i < 16; i++)
	{
		knobs[i] = new Slider(KNOBS[i], 'Knob_'+i);
	}
	script['shift_l'] = new Button(SHIFT_L, 'Shift_L');
	script['shift_r'] = new Button(SHIFT_R, 'Shift_R');
	script['crossfader'] = new Encoder(CROSSFADER, 'Crossfader');
	script['livid'] = new Button(GARY, 'Gary');

	post('setup_controls successful');
}

function setup_session()
{
	session = new SessionComponent('Session', 7, 8, trackBank);
	//session2 = new SessionComponent('Session2', 8, 5, trackBank);
	session.set_verbose(VERBOSE);
}

function setup_mixer()
{
	mixer = new MixerComponent('Mixer', 7, 4, trackBank);
	mixer.set_verbose(VERBOSE);
}

function setup_device()
{
	device = new DeviceComponent('Device', 8, cursorDevice);
	device._mode._value = 1;
	device.set_verbose(VERBOSE);

}

function setup_transport()
{
	transport = new TransportComponent('Transport', host.createTransport());
	transport.set_verbose(VERBOSE);
}

function setup_instrument_control()
{
	var KEYOFFSETS = [1, 4, 5, 12];
	var DRUMOFFSETS = [1, 4, 8, 16];

	instrument = new AdaptiveInstrumentComponent('Instrument', {'drum':[4, 4, 0, 0], 'keys':[8, 2, 0, 2], 'drumseq':[4, 4, 4, 0], 'keysseq':[8, 2, 0, 0]});

	//we're not using this, but it could easily be added back into the script.  you'd need to remove assignments for the intervalSelector.
	instrument._scaleSelector_callback = function(){instrument._keys._scaleOffset.set_value(instrument._scaleSelector._value);}
	instrument._scaleSelector = new RadioComponent(instrument._keys._name + '_scaleSelector', 0, 5, 0, instrument._scaleSelector_callback, colors.BLUE, colors.OFF);
	instrument._update_scaleSelector = function(){instrument._scaleSelector._value = instrument._keys._scaleSelector._value;}
	//instrument._keys._scaleOffset.add_listener(instrument._update_scaleSelector);

	instrument._intervalSelector_callback = function()
	{
		instrument._keys._noteOffset._increment = KEYOFFSETS[instrument._intervalSelector._value];
		instrument._drums._noteOffset._increment = DRUMOFFSETS[instrument._intervalSelector._value];
	}
	instrument._intervalSelector = new RadioComponent(instrument._name + '_intervalSelector', 0, 4, 0, instrument._intervalSelector_callback, colors.MAGENTA, colors.OFF);
	instrument.set_verbose(VERBOSE);
}

function setup_notifications()
{
	notifier = new NotificationDisplayComponent();
	notifier.add_subject(MainModes, 'Mode', ['Clip Page', 'Sequencer Page'], 9);
	notifier.add_subject(mixer._selectedstrip._track_name, 'Selected Track', undefined, 8, 'Main');
	notifier.add_subject(device._device_name, 'Device', undefined, 6, 'Device');
	notifier.add_subject(device._bank_name, 'Bank', undefined, 6, 'Device');
	for(var i=0;i<8;i++)
	{
		notifier.add_subject(device._parameter[i].displayed_name, 'Parameter', undefined, 5, 'Param_'+i);
		notifier.add_subject(device._parameter[i].displayed_value, 'Value', undefined, 5, 'Param_'+i);
		notifier.add_subject(device._macro[i], 'Macro : ' + i +  '  Value', undefined, 5);
	}

	notifier.add_subject(instrument._stepsequencer._flip, 'Flip Mode', undefined, 4);
	notifier.add_subject(instrument._drums._noteOffset, 'Root Note', NOTENAMES, 4, 'Drums');
	notifier.add_subject(instrument._keys._noteOffset, 'Root Note', NOTENAMES, 4, 'Keys');
	notifier.add_subject(instrument._keys._scaleOffset, 'Scale', SCALENAMES, 4, 'Keys');
	notifier.add_subject(instrument._keys._vertOffset, 'Vertical Offset', undefined, 4, 'Keys');


}

function setup_tasks()
{
	tasks = new TaskServer(script, 100);
}

function setup_usermodes()
{
	/*user1Input = host.getMidiInPort(0).createNoteInput("OhmRGBUser1", "80????", "90????", "D0????", "E0????");
	userbank1 = new UserBankComponent('UserBank1', 48, user1Input);
	user1Input.setShouldConsumeEvents(false);

	user2Input = host.getMidiInPort(0).createNoteInput("OhmRGBUser2", "80????", "90????", "D0????", "E0????");
	userbank2 = new UserBankComponent('UserBank2', 48, user2Input);
	user2Input.setShouldConsumeEvents(false);

	user3Input = host.getMidiInPort(0).createNoteInput("OhmRGBUser3", "80????", "90????", "D0????", "E0????");
	userbank3 = new UserBankComponent('UserBank3', 48, user3Input);
	user3Input.setShouldConsumeEvents(false);

	user4Input = host.getMidiInPort(0).createNoteInput("OhmRGBUser4", "80????", "90????", "D0????", "E0????");
	userbank4 = new UserBankComponent('UserBank4', 48, user4Input);
	user4Input.setShouldConsumeEvents(false);*/
}

function setup_modes()
{
	//script['main_session_grid'] = new Grid(7, 8, 'MainSessionGrid');
	script['session_grid'] = new Grid(7, 5, 'SessionGrid');
	script['seq_zoom'] = new Grid(8, 2, 'KeysGrid');
	script['seq_grid'] = new Grid(8, 4, 'SequenceGrid');

	altClipLaunchSub = new Page('AltClipLaunchSub');
	altClipLaunchSub._last_pressed;
	altClipLaunchSub._alt = function(obj)
	{
		if(obj._value)
		{
			tasks.addTask(altClipLaunchSub.Alt, [obj], 3, false, 'AltClipLaunchSub');
		}
		else if(obj == altClipLaunchSub._last_pressed)
		{
			altClipLaunchSub._last_pressed = undefined;
			clipLaunch.exit_mode();
			MainModes.current_page().enter_mode();
		}
	}
	altClipLaunchSub.Alt = function(obj)
	{
		if(obj._value)
		{
			altClipLaunchSub._last_pressed = obj;
			MainModes.current_page().exit_mode();
			clipLaunch.enter_mode();
		}
	}
	altClipLaunchSub.enter_mode = function()
	{
		for(var i=0;i<8;i++)
		{
			buttons[i].add_listener(altClipLaunchSub._alt)
		}
	}
	altClipLaunchSub.exit_mode = function()
	{
		if(!altClipLaunchSub._last_pressed)
		{
			for(var i=0;i<8;i++)
			{
				buttons[i].remove_listener(altClipLaunchSub._alt)
			}
		}
	}

	clipLaunch = new Page('ClipLaunch');
	clipLaunch.enter_mode = function()
	{
		post('cliplaunch enter mode');
		grid.reset();
		session_grid.sub_grid(grid, 0, 7, 0, 5);
		session.assign_grid(session_grid);
		session.set_nav_buttons(functions[2], functions[5], functions[4], functions[3]);
		session._scene_launch.set_controls([pads[7], pads[15], pads[23], pads[31], pads[39]]);
		for(var i=0;i<7;i++)
		{
			mixer.channelstrip(i)._mute.set_control(pads[i+40]);
			mixer.channelstrip(i)._solo.set_control(pads[i+48]);
			mixer.channelstrip(i)._arm.set_control(pads[i+56]);
		}
		mixer._masterstrip._mute.set_control(pads[47]);
		mixer._masterstrip._solo.set_control(pads[55]);
		mixer._masterstrip._arm.set_control(pads[63]);
	}
	clipLaunch.exit_mode = function()
	{
		session.assign_grid();
		session_grid.clear_buttons();
		session._scene_launch.set_controls();
		session.set_nav_buttons();
		for(var i=0;i<7;i++)
		{
			mixer.channelstrip(i)._mute.set_control();
			mixer.channelstrip(i)._solo.set_control();
			mixer.channelstrip(i)._arm.set_control();
		}
		mixer._masterstrip._mute.set_control();
		mixer._masterstrip._solo.set_control();
		mixer._masterstrip._arm.set_control();
	}


	//Page 0:  Send Control and Instrument throughput
	clipPage = new Page('ClipPage');
	clipPage.enter_mode = function()
	{
		post('clipPage entered');
		grid.reset();
		//main_session_grid.sub_grid(grid, 0, 7, 0, 8);
		session.assign_grid(grid);
		session.set_nav_buttons(functions[2], functions[5], functions[4], functions[3]);
		altClipLaunchSub.enter_mode();
		for(var i=0;i<7;i++)
		{
			mixer.channelstrip(i)._volume.set_control(faders[i]);
			mixer.channelstrip(i)._select.set_control(buttons[i]);

		}
		device.set_shared_controls(knobs.slice(0, 8));
		for(var i=0;i<4;i++)
		{
			mixer.selectedstrip()._send[i].set_control(knobs[i+8]);
			mixer.returnstrip(i)._volume.set_control(knobs[i+12]);
		}
		transport._play.set_control(functions[0]);
		transport._stop.set_control(functions[1]);
		transport._overdub.set_control(livid);
		mixer._masterstrip._volume.set_control(faders[7]);
		mixer._masterstrip._select.set_control(buttons[7]);
		clipPage.set_shift_button(shift_l);
		clipPage.active = true;
	}
	clipPage.exit_mode = function()
	{
		altClipLaunchSub.exit_mode();
		//main_session_grid.clear_buttons();
		session.assign_grid();
		session.set_nav_buttons();
		for(var i=0;i<7;i++)
		{
			mixer.channelstrip(i)._volume.set_control();
			mixer.channelstrip(i)._select.set_control();
			mixer.channelstrip(i)._solo.set_control();
			mixer.channelstrip(i)._arm.set_control();
			mixer.channelstrip(i)._mute.set_control();
		}
		for(var i=0;i<8;i++)
		device.set_shared_controls();
		device.set_nav_buttons();
		transport._play.set_control();
		transport._stop.set_control();
		transport._overdub.set_control();
		transport._autowrite.set_control();
		clipPage.set_shift_button();
		clipPage.active = false;
		post('clipPage exited');
	}
	clipPage.update_mode = function()
	{
		post('clipPage updated');
		grid.reset();
		if(clipPage._shifted)
		{
			//session.assign_grid();
			//session._zoom.assign_grid(grid);
			device._mode.set_value(0);
			device.set_nav_buttons(functions[5], functions[2], functions[4], functions[3]);
			transport._play.set_control();
			transport._stop.set_control();
			transport._overdub.set_control();
			transport._autowrite.set_control(livid);
			device._enabled.set_control(functions[0]);
		}
		else
		{
			device._mode.set_value(1);
			device.set_nav_buttons();
			transport._autowrite.set_control();
			//session._zoom.assign_grid();
			transport._record.set_control();
			transport._stop.set_control();
			device._enabled.set_control();
			clipPage.enter_mode();
		}
	}


	//Page 1:  Sequencer
	sequencerPage = new Page('Sequencer');
	sequencerPage.enter_mode = function()
	{
		post('sequencerPage entered');
		grid.reset();
		altClipLaunchSub.enter_mode();
		seq_grid.sub_grid(grid, 0, 8, 0, 4);
		seq_zoom.sub_grid(grid, 0, 8, 4, 6);
		//instrument.set_scale_offset_buttons(pads[49], pads[48]);
		//instrument.set_octave_offset_buttons(pads[53], pads[52]);
		instrument._stepsequencer._flip.set_control(pads[55]);
		instrument._stepsequencer._follow.set_control(pads[63]);
		instrument.set_note_offset_buttons(pads[49], pads[48]);
		instrument._intervalSelector.set_controls([pads[50], pads[51], pads[52], pads[53]]);
		instrument._quantization.set_controls([pads[56], pads[57], pads[58], pads[59], pads[60]]);
		instrument._stepsequencer._triplet.set_control(pads[61]);
		instrument.assign_grid(seq_grid);
		instrument._stepsequencer.assign_zoom_grid(seq_zoom);
		//session.set_nav_buttons(functions[2], functions[5], functions[4], functions[3]);
		session._slot_select.set_inc_dec_buttons(functions[5], functions[2]);
		session._track_up.set_control(functions[4]);
		session._track_down.set_control(functions[3]);
		functions[4].send(colors.YELLOW);
		functions[3].send(colors.YELLOW);
		session._record_clip.set_control(pads[54]);
		session._create_clip.set_control(pads[62]);
		for(var i=0;i<7;i++)
		{
			mixer.channelstrip(i)._volume.set_control(faders[i]);
			mixer.channelstrip(i)._select.set_control(buttons[i]);
		}
		device.set_shared_controls(knobs.slice(0, 8));
		for(var i=0;i<4;i++)
		{
			mixer.selectedstrip()._send[i].set_control(knobs[i+8]);
			mixer.returnstrip(i)._volume.set_control(knobs[i+12]);
		}
		mixer._masterstrip._volume.set_control(faders[7]);
		mixer._masterstrip._select.set_control(buttons[7]);
		transport._play.set_control(functions[0]);
		transport._stop.set_control(functions[1]);
		transport._overdub.set_control(livid)
		sequencerPage.set_shift_button(shift_r);
		sequencerPage.active = true;
	}
	sequencerPage.exit_mode = function()
	{
		altClipLaunchSub.exit_mode();
		for(var i=0;i<4;i++)
		{
			mixer.channelstrip(i)._volume.set_control();
			mixer.channelstrip(i)._select.set_control();
		}
		device.set_shared_controls();
		for(var i=0;i<4;i++)
		{
			mixer.selectedstrip()._send[i].set_control();
			mixer.returnstrip(i)._volume.set_control();
		}
		//seq_grid.clear_buttons();
		//seq_zoom.clear_buttons();
		instrument._stepsequencer._flip.set_control();
		instrument._stepsequencer._follow.set_control();
		instrument.set_scale_offset_buttons();
		instrument.set_note_offset_buttons();
		instrument.set_octave_offset_buttons();
		instrument._quantization.set_controls();
		instrument._intervalSelector.set_controls();
		instrument._stepsequencer._triplet.set_control();
		instrument.assign_grid();
		instrument._stepsequencer.assign_zoom_grid();
		mixer._masterstrip._volume.set_control();
		mixer._masterstrip._select.set_control();
		transport._play.set_control();
		transport._stop.set_control();
		transport._autowrite.set_control();
		session.set_nav_buttons();
		session._slot_select.set_inc_dec_buttons();
		session._record_clip.set_control();
		session._create_clip.set_control();
		sequencerPage.set_shift_button();
		sequencerPage.active = false;
		post('sequencerPage exited');
	}
	sequencerPage.update_mode = function()
	{
		post('sequencerPage updated');
		if(sequencerPage._shifted)
		{
			instrument._drums._select._value = 0;
			instrument._keys._select._value = 0;
			instrument._shift._value = 1;
			instrument.set_scale_offset_buttons();
			instrument.set_note_offset_buttons();
			instrument.set_octave_offset_buttons();
			instrument._intervalSelector.set_controls();
			session._slot_select.set_inc_dec_buttons();
			session._track_up.set_control();
			session._track_down.set_control();
			instrument._scaleSelector.set_controls([pads[48], pads[49], pads[50], pads[51], pads[52], pads[53]]);
			device.set_nav_buttons(functions[5], functions[2], functions[4], functions[3]);
			transport._overdub.set_control();
			transport._autowrite.set_control(livid);
			//transport._record.set_control(functions[0]);
			//transport._stop.set_control(functions[1]);
			device._enabled.set_control(functions[0]);
			device._mode.set_control(functions[1]);
		}
		else
		{
			instrument._drums._select._value = 1;
			instrument._keys._select._value = 1;
			instrument._shift._value =	0;
			instrument._scaleSelector.set_controls();
			device.set_nav_buttons();
			device._enabled.set_control();
			device._mode.set_control();
			transport._autowrite.set_control();
			transport._record.set_control();
			transport._stop.set_control();
			sequencerPage.enter_mode();
		}
	}

	script["MainModes"] = new PageStack(2, "Main Modes");
	MainModes.add_mode(0, clipPage);
	MainModes.add_mode(1, sequencerPage);
	MainModes.set_mode_buttons([shift_l, shift_r]);

}

function setup_listeners()
{
	track_type_name = new Parameter('track_type_name_listener');
	cursorTrack.addTrackTypeObserver(20, 'None', track_type_name.receive);
	track_type_name.add_listener(on_track_type_name_changed);

	track_type = new Parameter('track_type_listener', {javaObj:cursorTrack.getCanHoldNoteData(), monitor:'addValueObserver'});

	selected_track_selected_clipslot = new Parameter('selected_track_selected_clipslot_listener', {javaObj:cursorTrack.getClipLauncher(), monitor:'addIsPlayingObserver'});
	selected_track_selected_clipslot.add_listener(on_selected_track_selected_clipslot_changed);

}

function on_selected_track_selected_clipslot_changed(obj)
{
	//post('on_selected_track_selected_clipslot_changed:', obj._value);
	//cursorTrack.getClipLauncher().select(obj._value);
}

//this reports "Instrument" or "Audio" depending on the type of track selected
function on_track_type_name_changed(type_name)
{
	var page = MainModes.current_page();
	if(page == sequencerPage)
	{
		page.refresh_mode();
	}
}

function exit()
{
	//resetAll();
}

function onMidi(status, data1, data2)
{
	 //printMidi(status, data1, data2);
	if (isChannelController(status)&& MIDIChannel(status) == 0)
	{
		//post('CC: ' + status + ' ' + data1 + ' ' + data2);
		CC_OBJECTS[data1].receive(data2);
	}
	else if (isNoteOn(status) && MIDIChannel(status) == 0)
	{
		//post('NOTE: ' + status + ' ' + data1 + ' ' + data2);
		NOTE_OBJECTS[data1].receive(data2);
	}
}

function onSysex(data)
{
	//printSysex(data);
}

function display_mode(){}

function setupTests()
{

}



