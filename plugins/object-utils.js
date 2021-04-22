export default (context, inject) => {
  inject('objectMap', (obj, fn) =>
    Object.fromEntries(
      Object.entries(obj).map(
        ([k, v], i) => [k, fn(v, k, i)]
      )
    )
  )

  inject('pluck', (...keys) => obj => {
    const ret = {}
    for (const key in obj) {
      if (keys.includes(key)) {
        ret[key] = obj[key]
      }
    }

    return ret
  })
}
