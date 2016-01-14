export const getItem = function (key) {
  if (typeof (Storage) === 'undefined')
    return
  const store = localStorage.getItem(key)
  return JSON.parse(store)
}

export const setItem = function (key, value) {
  if (typeof (Storage) === 'undefined')
    return
  localStorage.setItem(key, JSON.stringify(value))
}

export const removeItem = function (key) {
  localStorage.removeItem(key)
}
