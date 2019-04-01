// Native Instruments Komplete Kontrol S 25

loadAPI(1);

load ("KompleteKontrol.js");

host.defineController("Native Instruments", "Komplete Kontrol S 25", "1.0", "8df967c0-69bf-11e4-9803-0800200c9a66");
host.defineMidiPorts(3, 3);
host.addDeviceNameBasedDiscoveryPair(["KOMPLETE KONTROL S25 Port 1", "KOMPLETE KONTROL S25 Port 2", "Komplete Kontrol DAW - 1"], ["KOMPLETE KONTROL S25 Port 1", "KOMPLETE KONTROL S25 Port 2", "Komplete Kontrol DAW - 1"]);
