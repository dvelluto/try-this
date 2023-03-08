import { assertEquals } from "https://Deno.land/std/testing/asserts.ts";
import { tryThis } from "../src/tryThis.ts";

Deno.test('should return value if function does not throw', () => {
  const testFn = () => 'test'

  const result = tryThis(testFn)

  assertEquals(result, { ok: true, value: 'test' })
})

Deno.test('should return fallback value if function throws', () => {
  const error = new Error('error test')
  const fallback = 'fallback'
  const testThrowing = (): string => {
    throw error
  }

  const result = tryThis(testThrowing, { fallback })

  assertEquals(result, { ok: false, value: 'fallback', error })
})

Deno.test('should return no value for fallback empty', () => {
  const error = new Error('error test')
  const testThrowing = (): string => {
    throw error
  }

  const result = tryThis(testThrowing)

  assertEquals(result, { ok: false, error, value: undefined })
})

Deno.test('should try with the else function in case of throw', () => {
  const error = new Error('error test')
  const testThrowing = (): string => {
    throw error
  }
  const elseFunction = () => 'else!'

  const result = tryThis(testThrowing, { else: elseFunction })

  assertEquals(result, { ok: true, value: 'else!' })
})


Deno.test('should return no value for fallback empty', () => {
  const error = new Error('error test')
  const testThrowing = (): string => {
    throw error
  }

  const result = tryThis(testThrowing)

  assertEquals(result, { error, ok: false, value: undefined })
})


Deno.test('should handle recoursive call when correct return', () => {
  const testFn = () => 'test'

  const result = tryThis(() => tryThis(testFn))

  assertEquals(result, { ok: true, value: 'test' })
})

Deno.test('should handle recoursive call when throwing return and custom fallback', () => {
  const error = new Error('error test')
  const fallback = 'fallback'
  const internalFallback = 'notThis!'
  const testThrowing = (): string => {
    throw error
  }

  const result = tryThis(() => tryThis(testThrowing, { fallback: internalFallback }), { fallback })

  assertEquals(result, { ok: false, value: 'fallback', error })
})

Deno.test('should handle throwing in else function', () => {
  const error = new Error('error test')
  const fallback = 'fallback'
  const internalFallback = 'notThis!'
  const testThrowing = (): string => {
    throw error
  }

  const result = tryThis(() => tryThis(testThrowing, { fallback: internalFallback }), { fallback, else: testThrowing })

  assertEquals(result, { ok: false, value: 'fallback', error })
})

Deno.test('should handle recoursive call in else function', () => {
  const error = new Error('error test')
  const fallback = 'fallback'
  const internalFallback = 'notThis!'
  const testThrowing = (): string => {
    throw error
  }

  const result = tryThis(() => tryThis(testThrowing, { fallback: internalFallback }), { fallback, else: () => tryThis(testThrowing, { fallback: internalFallback }) })

  assertEquals(result, { ok: false, value: 'fallback', error })
})