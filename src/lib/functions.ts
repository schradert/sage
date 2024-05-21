export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export const flatten = (obj: Object, roots: string[] = [], separator: string = "."): Object => (
    Object
    .keys(obj)
    .reduce((memo, key) => Object.assign(
      {},
      memo,
      // recurse if key's value is an object
      // otherwise, return prefixed key (with roots) and value in memo
      Object.prototype.toString.call(obj[key]) === '[object Object]'
        ? flatten(obj[key], roots.concat([key]), separator)
        : {[roots.concat([key]).join(separator)]: obj[key]}
    ), {})
)
