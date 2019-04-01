// Native Instruments Komplete Kontrol S

loadAPI(1);

load ("KompleteKontrol.js");

host.defineController("Native Instruments", "Komplete Kontrol S", "1.0", "c196a280-50a8-11e4-916c-0800200c9a66");
host.defineMidiPorts(3, 3);
host.addDeviceNameBasedDiscoveryPair(["Komplete Kontrol - 1", "Komplete Kontrol EXT - 1", "Komplete Kontrol DAW - 1"], ["Komplete Kontrol - 1", "Komplete Kontrol EXT - 1", "Komplete Kontrol DAW - 1"]);
