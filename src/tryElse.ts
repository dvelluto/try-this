export type Result<TReturn, TError = undefined> =
  | {
    ok: true;
    value: TReturn;
  }
  | {
    ok: false;
    error: TError extends undefined ? unknown : TError
    value?: TReturn
  }

const isTryElseResult = <TReturn, TError> (obj: unknown): obj is Result<TReturn, TError> => {
  return typeof obj === 'object' && obj !== null && typeof (obj as Record<string, unknown>)['ok'] === 'boolean'
}

export const tryElse =
  <TReturn, TError = undefined> (
    tryFn: () => TReturn | Result<TReturn, TError>,
    fallbackValue?: TReturn
  ): Result<TReturn, TError> => {

    try {
      const result = tryFn()

      if (isTryElseResult<TReturn, TError>(result)) {
        if (result.ok === false && fallbackValue !== undefined) {
          return {
            ok: false,
            error: result.error,
            value: fallbackValue
          }
        }

        return result
      }

      return {
        ok: true,
        value: result
      }
    } catch (e) {
      return {
        ok: false,
        error: e,
        value: fallbackValue,
      }
    }
  }
