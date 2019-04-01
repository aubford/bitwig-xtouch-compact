// Native Instruments Komplete Kontrol S 61

loadAPI(1);

load ("KompleteKontrol.js");

host.defineController("Native Instruments", "Komplete Kontrol S 61", "1.0", "ea3c2e00-69bf-11e4-9803-0800200c9a66");
host.defineMidiPorts(3, 3);
host.addDeviceNameBasedDiscoveryPair(["KOMPLETE KONTROL S61 Port 1", "KOMPLETE KONTROL S61 Port 2", "Komplete Kontrol DAW - 1"], ["KOMPLETE KONTROL S61 Port 1", "KOMPLETE KONTROL S61 Port 2", "Komplete Kontrol DAW - 1"]);
