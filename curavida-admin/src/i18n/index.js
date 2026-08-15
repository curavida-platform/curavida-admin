import { reactive } from 'vue'

import messages from './locales.js'

const DETECTED = navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'

const saved = (() => {
  try {
    return localStorage.getItem('curavida-locale')
  } catch {
    return null
  }
})()

export const locale = reactive({
  value: saved === 'pt' || saved === 'en' ? saved : DETECTED,
})

export function setLocale(value) {
  locale.value = value

  try {
    localStorage.setItem('curavida-locale', value)
  } catch {
    /* ignore */
  }
}

export function toggleLocale() {
  setLocale(locale.value === 'pt' ? 'en' : 'pt')
}

export function t(key, params) {
  const dict = messages[locale.value] || messages.en

  const value = key
    .split('.')
    .reduce((obj, part) => (obj == null ? obj : obj[part]), dict)

  if (value == null) return key

  if (!params) return value

  return value.replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(params, name)
      ? params[name]
      : match
  })
}