const map = (array = [], cb) => {
  if (!array.length) {
    return []
  } else {
    const [first, ...rest] = array;

    return [
        cb(first),
      ...map(rest, cb)
    ];
  }
};

function EventManager() {
  const events = {};

  const on = (eventName, cb) => {
    events[eventName] = [...events[eventName] || [], cb];
  };

  const fire = (eventName, data) => {
    if (!events[eventName]) return;

    events[eventName].forEach(cb => cb(data));
  };

  const off = (eventName) => {
    events[eventName] = undefined;
  };

  return {
    on, off, fire
  }
}

module.exports = { map, EventManager }
