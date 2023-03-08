export type Result<TReturn, TError = undefined> =
  | {
    ok: true;
    value: TReturn;
  }
  | {
    ok: false;
    error: TError extends undefined ? unknown : TError
    value: TReturn | undefined
  }


export interface TryThisBuilder<TReturn, TError = undefined> {
  else: (cb: () => TReturn | Result<TReturn, TError>) => TryThisBuilder<TReturn, TError>
  fallback: (value: TReturn) => TryThisBuilder<TReturn, TError>
  result: () => Result<TReturn, TError>
}

const isTryElseResult = <TReturn, TError> (obj: unknown): obj is Result<TReturn, TError> => {
  return typeof obj === 'object' && obj !== null && typeof (obj as Record<string, unknown>)['ok'] === 'boolean'
}

class TryThis<TReturn, TError = undefined> implements TryThisBuilder<TReturn, TError> {
  private tryResult: Result<TReturn, TError>

  result () {
    return this.tryResult
  }

  constructor (tryFn: () => TReturn | Result<TReturn, TError>) {
    try {
      const result = tryFn()

      if (isTryElseResult<TReturn, TError>(result)) {
        this.tryResult = result
      } else {
        this.tryResult = {
          ok: true,
          value: result
        }
      }
    } catch (e) {
      this.tryResult = {
        ok: false,
        error: e,
        value: undefined
      }
    }
  }

  else (cb?: () => TReturn | Result<TReturn, TError>) {
    if (this.tryResult.ok === false && cb) {
      this.tryResult = new TryThis(cb).result()
    }

    return this
  }

  fallback (value?: TReturn) {
    if (this.tryResult.ok === false && value) {
      this.tryResult.value = value
    }

    return this
  }
}

export const tryThis = <TReturn, TError> (
  tryFn: () => TReturn | Result<TReturn, TError>,
  options: {
    chain?: boolean
    fallback?: TReturn
    else?: () => TReturn | Result<TReturn, TError>
  } = {}
): Result<TReturn | TError> => {
  return new TryThis(tryFn).else(options.else).fallback(options.fallback).result()
}
