import React, { FC, useState, ChangeEvent } from 'react'
import Input, { InputProps } from '../input/Input'

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => string[]
    onSelect?: (item: string) => void
}

const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { fetchSuggestions, onSelect, value, ...rest } = props
    const [inputValue, setInputValue] = useState(value)
    const [suggestions, setSuggestions] = useState<string[]>([])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
        if (value) {
            const result = fetchSuggestions(value)
            setSuggestions(result)
        } else {
            setSuggestions([])
        }
    }

    const handleSelect = (item: string) => {
        setInputValue(item)
        setSuggestions([])
        if (onSelect) {
            onSelect(item)
        }
    }

    const generateDropdown = () => (
        <ul>
            {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item)}>{item}</li>
            ))}
        </ul>
    )

    console.log(suggestions)
    return (
        <div className="auto-complete">
            <Input value={inputValue} onChange={handleChange} {...rest} />
            {suggestions.length > 0 ? generateDropdown() : null}
        </div>
    )
}

export default AutoComplete;