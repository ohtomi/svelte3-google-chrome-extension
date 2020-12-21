import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/svelte'
import { tick } from 'svelte'
import App from './App.svelte'

test('マークダウン記法ボタンが表示されている', () => {
  const storageMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageMock,
        get: storageMock
      }
    }
  }

  const { getByText } = render(App)

  expect(getByText('マークダウン記法')).toBeInTheDocument()
})

test('マークダウン記法ボタンをクリックしたらスクリプトが送り込まれる', () => {
  const executeScriptMock = jest.fn((tabId, inject, callback) => {
    if (!!callback) {
      callback()
    }
  })
  const storageMock = jest.fn()

  global.chrome = {
    tabs: {
      executeScript: executeScriptMock
    },
    storage: {
      local: {
        set: storageMock,
        get: storageMock
      }
    }
  }

  const { getByText } = render(App)
  const button = getByText('マークダウン記法')

  fireEvent.click(button)

  expect(getByText('クリップボードにコピーしました。')).toBeInTheDocument()

  expect(executeScriptMock).toHaveBeenCalledTimes(2)
  expect(executeScriptMock).toHaveBeenNthCalledWith(1,
    null, { code: expect.any(String) }, expect.anything()
  )
  expect(executeScriptMock).toHaveBeenNthCalledWith(2,
    null, { file: 'content_script.js' }
  )
})

test('登録ボタンが表示されている', () => {
  const storageMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageMock,
        get: storageMock
      }
    }
  }

  const { getByText } = render(App)

  expect(getByText('登録')).toBeInTheDocument()
})

test('登録ボタンをクリックしたらフォーマットが登録される', async () => {
  const storageMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageMock,
        get: storageMock
      }
    }
  }

  const { getByText, getByDisplayValue, getByTestId } = render(App)
  const nameInput = getByTestId('new-name')
  const valueInput = getByTestId('new-value')
  const addButton = getByText('登録')

  fireEvent.input(nameInput, { target: { value: '__name__' } })
  fireEvent.input(valueInput, { target: { value: '__value__' } })
  fireEvent.click(addButton)
  await tick()

  expect(getByText('__name__')).toBeInTheDocument()
  expect(getByDisplayValue('__value__')).toBeInTheDocument()
})

test('更新ボタンをクリックしたらフォーマットが更新される', async () => {
  const storageMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageMock,
        get: storageMock
      }
    }
  }

  const { getByText, getAllByText, getByDisplayValue, getByTestId } = render(App)
  const nameInput = getByTestId('new-name')
  const valueInput = getByTestId('new-value')
  const addButton = getByText('登録')

  fireEvent.input(nameInput, { target: { value: '__name__' } })
  fireEvent.input(valueInput, { target: { value: '__value__' } })
  fireEvent.click(addButton)
  await tick()

  const addedValueInput = getByDisplayValue('__value__')
  const updateButton = getAllByText('更新')[1]

  fireEvent.input(addedValueInput, { target: { value: '__updated__' } })
  fireEvent.click(updateButton)
  await tick()

  expect(getByText('__name__')).toBeInTheDocument()
  expect(getByDisplayValue('__updated__')).toBeInTheDocument()
})

test('削除ボタンをクリックしたらフォーマットが削除される', async () => {
  const storageMock = jest.fn()

  global.chrome = {
    storage: {
      local: {
        set: storageMock,
        get: storageMock
      }
    }
  }

  const { getByText, getAllByText, getByTestId, queryByText, queryByDisplayValue } = render(App)
  const nameInput = getByTestId('new-name')
  const valueInput = getByTestId('new-value')
  const addButton = getByText('登録')

  fireEvent.input(nameInput, { target: { value: '__name__' } })
  fireEvent.input(valueInput, { target: { value: '__value__' } })
  fireEvent.click(addButton)
  await tick()

  const removeButton = getAllByText('削除')[1]

  fireEvent.click(removeButton)
  await tick()

  expect(queryByText('__name__')).not.toBeInTheDocument()
  expect(queryByDisplayValue('__value__')).not.toBeInTheDocument()
})
