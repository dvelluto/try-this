const tryElse = (tryFn, elseArg = null) => {
  try {
    return tryFn()
  } catch (e) {
    return elseArg
  }
}

module.export = tryElse