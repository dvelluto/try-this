import { assertEquals } from "https://Deno.land/std/testing/asserts.ts";
import { tryElse } from '../src/tryElse.ts'

Deno.test('should return value if function does not throw', () => {
  const testFn = () => 'test'

  const result = tryElse(testFn)

  assertEquals(result, { ok: true, value: 'test' })
})

Deno.test('should return fallback value if function throws', () => {
  const error = new Error('error test')
  const fallback = 'fallback'
  const testThrowing = (): string => {
    throw error
  }

  const result = tryElse(testThrowing, fallback)

  assertEquals(result, { ok: false, value: 'fallback', error })
})

Deno.test('should return no value for fallback empty', () => {
  const error = new Error('error test')
  const testThrowing = (): string => {
    throw error
  }

  const result = tryElse(testThrowing)

  assertEquals(result, { ok: false, error, value: undefined })
})

Deno.test('should handle recoursive call when correct return', () => {
  const testFn = () => 'test'

  const result = tryElse(() => tryElse(testFn))

  assertEquals(result, { ok: true, value: 'test' })
})

Deno.test('should handle recoursive call when throwing return and custom fallback', () => {
  const error = new Error('error test')
  const fallback = 'fallback'
  const internalFallback = 'notThis!'
  const testThrowing = (): string => {
    throw error
  }

  const result = tryElse(() => tryElse(testThrowing, internalFallback), fallback)

  assertEquals(result, { ok: false, value: 'fallback', error })
})
