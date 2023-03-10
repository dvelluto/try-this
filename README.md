# try this
Function for avoiding `try catch` boilerplate.

## Why?
Often we want to just try some function that could throw and do not trigger any error warning, but just provide a fallback value to use instead or reacting in the same closure.
In JS there's lot of pain into doing this as we would need to create two closures, a let variable, re-write it for each use case. For example this is very common:

```
let value

try {
  value = trySomeThrowingFunction()
} catch () {
  value = fallback
}

return value
```

With this package we got one liner function:

```
const { ok, value, error } = tryThis(throwingFunction)
```

### Options
We can provide an options object which will get a fallback value (of the same type as the expected value) and / or an 'else' function which can return the same kind of type as the original function or be void and the original error (or fallback) will be passed back.

```
const { ok, value, error } = tryThis(throwingFunction, {
  fallback: 'some fallback value',
  else: () => 'some alternative to the original function'
})
```
The else function will be evaluated the same way as the original function.
The fallback value is the last resort value.

### Async?
Yes, there is also `tryThisAsync` made for handling async functions or promises

```
const { ok, value, error } = await tryThisAsync(promise, {
  fallback: 'some fallback value',
  else: () => 'some alternative to the original promise'
})
```
The else function will be evaluated in place of the original promise.
The fallback value is the last resort value.

#### Ok promises, but async functions?
At the moment it's handling only promises, if you have an async function, you'll have to call it in it

```
const { ok, value, error } = await tryThisAsync(fnAsync(), {
  fallback: 'some fallback value',
  else: () => 'some alternative to the original async function'
})
```
