const { map, EventManager } = require('./index')

describe('map function', () => {
  let arr;

  beforeEach(() => {
    arr = [1, 2, 3]
  })

  test('Should be defined', () => {
    expect(map).toBeDefined();
  });

  test('Callback function should be called each iteration', () => {
    const cb = jest.fn(item => item);

    map(arr, cb)

    expect(cb).toBeCalledTimes(arr.length);
  });



  test('Iterated item should be passed to the callback function', () => {
    const cb = jest.fn(item => item);
    const arr = ['1', '2', '3'];

    map(arr, cb)

    const mockResults = cb.mock.results;

    expect(mockResults[0].value).toBe('1')
    expect(mockResults[1].value).toBe('2')
    expect(mockResults[2].value).toBe('3')
  })

  test('Should return new array', () => {
    const result = map(arr, item => item);

    expect(result).toBeInstanceOf(Array);
    expect(result).not.toBe(arr);
  });

  test('Should return new array with structure which returned by callback function', () => {
    const result = [
      `${ 1 } - ${ 1 }`,
      `${ 2 } - ${ 2 }`,
      `${ 3 } - ${ 3 }`
    ];

    expect(
        map(arr, item => `${ item } - ${ item }`)
    ).toEqual(result)
  })

  test('Should not mutate original array', () => {
    const result = [1, 2, 3];
    map(arr, item => `${ item } - ${ item }`);

    expect(arr).toEqual(result)
  })
})

describe('event manager utility', () => {
  let eventManager;
  const callbackFunction = data => data;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  test('Callback function should not be called', () => {
    const cb = jest.fn(callbackFunction)
    eventManager.on('EVENT_NAME', cb);

    expect(cb).not.toBeCalled();
  });

  test('Callback function should be called once', () => {
    const cb = jest.fn(callbackFunction);

    eventManager.on('EVENT_NAME', cb);
    eventManager.fire('EVENT_NAME', 'data1');

    expect(cb).toBeCalledTimes(1);
  });

  test('Each callback functions should be called to the appropriate event', () => {
    const cb1 = jest.fn(callbackFunction);
    const cb2 = jest.fn(callbackFunction);

    eventManager.on('EVENT_NAME', cb1);
    eventManager.on('EVENT_NAME', cb2);
    eventManager.fire('EVENT_NAME', 'data1')

    expect(cb1).toBeCalledTimes(1);
    expect(cb2).toBeCalledTimes(1);
  });

  test('Data should be passed to the callback function', () => {
    const cb = jest.fn(callbackFunction);

    eventManager.on('EVENT_NAME', cb);
    eventManager.fire('EVENT_NAME', 'data1');

    const mockResult = cb.mock.calls;

    expect(mockResult[0][0]).toBe('data1')
  })

  test('Callback function can not be called if it is not registered', () => {
    const cb = jest.fn(callbackFunction);

    eventManager.on('EVENT_NAME');
    eventManager.fire('ANOTHER_EVENT_NAME');

    expect(cb).not.toBeCalled();
  });

  test('Callback function should be called twice', () => {
    const cb = jest.fn(callbackFunction);

    eventManager.on('EVENT_NAME', cb);
    eventManager.fire('EVENT_NAME', 'data1');
    eventManager.fire('EVENT_NAME', 'data2');

    const mockResult = cb.mock.calls;

    expect(cb).toBeCalledTimes(2);
    expect(mockResult[0][0]).toBe('data1')
    expect(mockResult[1][0]).toBe('data2')
  })

  test('Callback function can not be called after removing it', () => {
    const cb = jest.fn(callbackFunction);

    eventManager.on('EVENT_NAME', cb);
    eventManager.off('EVENT_NAME');
    eventManager.fire('EVENT_NAME');

    expect(cb).not.toBeCalled();
  });
});
