export default {
  error: _log.bind(null, "ERROR"),
  warn: _log.bind(null, "WARN"),
  info: _log.bind(null, "INFO"),
  debug: _log.bind(null, "DEBUG"),
  trace: _log.bind(null, "TRACE"),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _log(level: string, ...args: any[]) {
  console.log(level, ...args); // eslint-disable-line no-console
}
