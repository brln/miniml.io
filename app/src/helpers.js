export function isIpadWebview () {
  return window.webkit && window.webkit.messageHandlers
}

export function toCamelCase(s) {
  return s
    .replace(/_/g, " ")
    .replace(/\s(.)/g, function ($1) {
      return $1.toUpperCase()
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase()
    })
}

export function valueFromInputEvent (e) {
  let newVal = e.target.value
  if (e.target.type === "checkbox") {
    newVal = e.target.checked
  }
  return newVal
}
