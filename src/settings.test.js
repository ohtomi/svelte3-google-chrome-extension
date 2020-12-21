import { get } from 'svelte/store'
import { createSettings } from './settings'

test('初期状態', () => {
  const settings = createSettings()

  expect(get(settings)).toHaveLength(1)
  expect(get(settings)[0]).toHaveProperty('name', 'マークダウン記法')
  expect(get(settings)[0]).toHaveProperty('value', '[$title]($url)$lf$selection')
})

test('なに保存していない状態で設定を読み込もうとする', () => {
  const want = [{
    name: '__name__',
    value: '__value__'
  }]

  const storageSetMock = jest.fn()
  const storageGetMock = jest.fn((key, callback) => {
    callback({ [key]: null })
  })

  global.chrome = {
    storage: {
      local: {
        set: storageSetMock,
        get: storageGetMock
      }
    }
  }

  const settings = createSettings()
  settings.load();

  expect(get(settings)).toHaveLength(1)
  expect(get(settings)[0]).toHaveProperty('name', 'マークダウン記法')
  expect(get(settings)[0]).toHaveProperty('value', '[$title]($url)$lf$selection')
})

test('保存した設定を読み込む', () => {
  const want = {
    name: '__name__',
    value: '__value__'
  }

  const storageSetMock = jest.fn()
  const storageGetMock = jest.fn((key, callback) => {
    callback({ [key]: [want] })
  })

  global.chrome = {
    storage: {
      local: {
        set: storageSetMock,
        get: storageGetMock
      }
    }
  }

  const settings = createSettings()
  settings.load();

  expect(get(settings)[0]).toEqual(want)
})

test('フォーマットを登録する', () => {
  const want = {
    name: '__name__',
    value: '__value__'
  }

  const storageSetMock = jest.fn()
  const storageGetMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageSetMock,
        get: storageGetMock
      }
    }
  }

  const settings = createSettings()
  settings.add(want.name, want.value)

  expect(get(settings)).toHaveLength(2)
  expect(get(settings)[1]).toEqual(want)

  expect(storageSetMock).toHaveBeenCalledTimes(1)
  expect(storageSetMock.mock.calls[0][0].formatters[1]).toEqual(want)
})

test('フォーマットを更新する', () => {
  const want = {
    name: '__name__',
    value: '__value__'
  }

  const storageSetMock = jest.fn()
  const storageGetMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageSetMock,
        get: storageGetMock
      }
    }
  }

  const settings = createSettings()
  settings.add(want.name, '')
  settings.update(want.name, want.value)

  expect(get(settings)).toHaveLength(2)
  expect(get(settings)[1]).toEqual(want)

  expect(storageSetMock).toHaveBeenCalledTimes(2)
  expect(storageSetMock.mock.calls[1][0].formatters[1]).toEqual(want)
})

test('フォーマットを削除する', () => {
  const want = {
    name: '__name__',
    value: '__value__'
  }

  const storageSetMock = jest.fn()
  const storageGetMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageSetMock,
        get: storageGetMock
      }
    }
  }

  const settings = createSettings()
  settings.add(want.name, want.value)
  settings.remove(want.name)

  expect(get(settings)).toHaveLength(1)
  expect(get(settings)[0]).toHaveProperty('name', 'マークダウン記法')
  expect(get(settings)[0]).toHaveProperty('value', '[$title]($url)$lf$selection')

  expect(storageSetMock).toHaveBeenCalledTimes(2)
  expect(storageSetMock.mock.calls[1][0].formatters[0]).toHaveProperty('name', 'マークダウン記法')
  expect(storageSetMock.mock.calls[1][0].formatters[0]).toHaveProperty('value', '[$title]($url)$lf$selection')
})
