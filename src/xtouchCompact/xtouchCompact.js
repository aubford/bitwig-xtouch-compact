loadAPI(8)
load('./controller')
// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true)

host.defineController(
  'aubrey',
  'xtouchCompact',
  '0.1',
  'dd95a53b-7d47-4cc3-aaaa-1d5aaa896f54',
  'aubrey'
)
host.defineMidiPorts(1, 1)
host.addDeviceNameBasedDiscoveryPair(['X-TOUCH COMPACT'], ['X-TOUCH COMPACT'])

function init() {
  new XTouchCompact(host.getMidiInPort(0), host.getMidiOutPort(0))
}

function flush() {
  // TODO: Flush any output to your controller here.
}

function exit() {}
