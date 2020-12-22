import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import message from '../Message'

describe('test Message component', () => {
  afterEach(() => {
    message.destroy()
  })
  it('should render default message', () => {
    const hide1 = message.info('message', 0)
    const hide2 = message.info('message', 0)
    expect(document.querySelectorAll('.web-message-notice').length).toEqual(2)
    hide1()
    expect(document.querySelectorAll('.web-message-notice').length).toEqual(1)
    hide2()
    expect(document.querySelectorAll('.web-message-notice').length).toEqual(0)
  })
})
