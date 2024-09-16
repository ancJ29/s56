import { IS_DEV, LOG_LEVEL } from "./env";

type Level = "OFF" |
  "ERROR" |
  "WARN" |
  "INFO" |
  "DEBUG" |
  "TRACE";

const map = {
  OFF: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5,
};

const threshold = 1 + (map[LOG_LEVEL as Level] || 0);

export default {
  error: _log.bind(null, "ERROR"),
  warn: _log.bind(null, "WARN"),
  info: _log.bind(null, "INFO"),
  debug: _log.bind(null, "DEBUG"),
  trace: _log.bind(null, "TRACE"),
};

const IS_DEBUG = localStorage.__DEBUG__ === "JDHdHg23KfF4";

function _log(level: Level, ...args: unknown[]) {
  if (IS_DEV) {
    const lvl = (map[level] || 0)
    if (lvl < threshold) {
      console.log(level, ...args); // eslint-disable-line no-console
    }
  } else if (IS_DEBUG) {
    console.log(level, ...args); // eslint-disable-line no-console
  }
}
