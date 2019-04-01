
var TopButton =
{
   CURSOR_UP:104,
   CURSOR_DOWN:105,
   CURSOR_LEFT:106,
   CURSOR_RIGHT:107,
   SESSION:108,
   USER1:109,
   USER2:110,
   MIXER:111
};

var MixerButton =
{
   VOLUME:0,
   PAN:1,
   SEND_A:2,
   SEND_B:3,
   STOP:4,
   TRK_ON:5,
   SOLO:6,
   ARM:7
};

function mixColour(red, green, blink)
{
   return (blink ? 8 : 12) | red | (green * 16);
}

var Colour = // Novation are from the UK
{
   OFF:12,
   RED_LOW:13,
   RED_FULL:15,
   AMBER_LOW:29,
   AMBER_FULL:63,
   YELLOW_FULL:62,
   YELLOW_LOW: 0x2D,
   ORANGE:39,
   LIME:0x3D,
   HEADER:mixColour(0,1,false),
   GREEN_LOW:28,
   GREEN_FULL:60,
   RED_FLASHING:11,
   AMBER_FLASHING:59,
   YELLOW_FLASHING:58,
   GREEN_FLASHING:56
};

var LED =
{
   GRID:0,
   SCENE:64,
   TOP:72,

   CURSOR_UP:0,
   CURSOR_DOWN:1,
   CURSOR_LEFT:2,
   CURSOR_RIGHT:3,
   SESSION:4,
   USER1:5,
   USER2:6,
   MIXER:7,

   VOLUME:0,
   PAN:1,
   SEND_A:2,
   SEND_B:3,
   STOP:4,
   TRK_ON:5,
   SOLO:6,
   ARM:7
};

var NUM_TRACKS = 8;
var NUM_SENDS = 2;
var NUM_SCENES = 8;
