# InterceptTimeouts Tool — Context Summary

## Purpose

The **InterceptTimeoutsTool** wraps browser-level `setTimeout`, `clearTimeout`, `setInterval`, and `clearInterval` functions to intercept and track all timers created/removed. It maintains arrays of timeout/interval records with pointer, func, delay, args, time metadata. Provides `lt.clearLastTimeout` utility function.

## Dependencies

None explicitly listed — wraps global functions directly in init().

## Preferences

None — this is an infrastructure tool without preferences.

## How It Works

### Timer Tracking Arrays
- **timeouts**: array of objects {pointer, func, delay, args, time} (Date.now() at creation)
- **intervals**: array of objects {pointer, func, delay, args, time}

### WrapFunction on global.setTimeout
After hook: pushes new timeout record into timeouts array with pointer/func/delay/args/Date.now(). Removes expired entries via `lt.arrayRemoveAll` where `t.time + t.delay < Date.now()`.

### WrapFunction on global.clearTimeout
Before hook: removes timeout records from timeouts array where `t.pointer === pointer`.

### WrapFunction on global.setInterval
After hook: pushes new interval record into intervals array with pointer/func/delay/args/Date.now().

### WrapFunction on global.clearInterval
Before hook: removes interval records from intervals array where `t.pointer === pointer`.

### clearLastTimeout (`clearLastTimeout`)
Utility function assigned to `lt.clearLastTimeout`: clears the last timeout in timeouts array (`this.timeouts.at(-1)`). If exists → `lt.global.clearTimeout(timeout.pointer)`.

### Initialization (`init()`)
Wraps global setTimeout/clearTimeout/setInterval/clearInterval via lt.wrapFunction with id='interceptTimeouts'. Assigns clearLastTimeout to lt. No preferences, no start method — purely infrastructure setup.