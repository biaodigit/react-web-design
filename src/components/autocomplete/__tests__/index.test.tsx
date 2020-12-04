import React from 'react'
import { config } from 'react-transition-group'
import { render, RenderResult, fireEvent, wait, waitFor } from '@testing-library/react'
import AutoComplete, { AutoCompleteProps } from '../AutoComplete'

config.disabled = true

const testArray = [
    { value: 'ab', number: 11 },
    { value: 'abc', number: 1 },
    { value: 'b', number: 4 },
    { value: 'c', number: 15 },
]
const testProps: AutoCompleteProps = {
    fetchSuggestions: (query) => { return testArray.filter(item => item.value.includes(query)) },
    onSelect: jest.fn(),
    placeholder: 'auto-complete'
}

let wrapper: RenderResult, inputNode: HTMLInputElement

describe('test AutoComplete component', () => {
    beforeEach(() => {
        wrapper = render(<AutoComplete {...testProps} />)
        inputNode = wrapper.getByPlaceholderText('auto-complete') as HTMLInputElement
    })

    it('test basic auto complete ', async () => {
       fireEvent.change(inputNode,{target:{value:'a'}})
       await waitFor(() => {
           expect(wrapper.getByText('ab')).toBeInTheDocument()
       })
       expect(wrapper.container.querySelectorAll('.suggestion-item').length).toEqual(2)
       fireEvent.click(wrapper.getByText('ab'))
    })

    it('should provide keyboard support', () => {

    })

    it('click outside should hide dropdown', () => {

    })

    it('renderOption should generate the right template', () => {

    })
    it('async fetchSuggestions should works fine', () => {

    })
})