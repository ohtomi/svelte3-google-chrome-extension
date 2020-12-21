import { writable } from 'svelte/store';

const STORAGE_KEY = 'formatters'
const DEFAULT_SETTINGS = [
  {
    name: 'マークダウン記法',
    value: '[$title]($url)$lf$selection'
  }
]

function loadSettings(set) {
  chrome.storage.local.get(STORAGE_KEY, items => {
    let formatters = items[STORAGE_KEY]
    if (!formatters) {
      formatters = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      saveSettings(formatters)
    }
    set(formatters)
  })
}

function saveSettings(formatters) {
  const items = { [STORAGE_KEY]: formatters }
  chrome.storage.local.set(items)
}

function addFormat(oldState, name, value) {
  const newState = JSON.parse(JSON.stringify(oldState))
  newState.push({ name, value })
  saveSettings(newState)
  return newState
}

function updateFormat(oldState, name, value) {
  const newState = JSON.parse(JSON.stringify(oldState))
  const existing = newState.find(item => item.name === name)
  existing.value = value
  saveSettings(newState)
  return newState
}

function removeFormat(oldState, name, value) {
  const newState = oldState.filter(item => item.name !== name)
  saveSettings(newState)
  return newState
}

export function createSettings() {
  const { subscribe, set, update } = writable(DEFAULT_SETTINGS)

  return {
    subscribe,
    load: () => loadSettings(set),
    add: (name, value) => update(state => addFormat(state, name, value)),
    update: (name, value) => update(state => updateFormat(state, name, value)),
    remove: (name) => update(state => removeFormat(state, name))
  }
}
