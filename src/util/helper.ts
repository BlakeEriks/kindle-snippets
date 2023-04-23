export const stringify = (obj: any) =>
  JSON.stringify(obj, function (k, v) {
    return v === undefined ? null : v
  })
