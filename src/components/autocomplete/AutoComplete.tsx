import React, { FC, useState, ChangeEvent, ReactElement } from 'react'
import Input, { InputProps } from '../input/Input'

interface DataSourceObject {
    value:string
}

export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[]
    onSelect?: (item: DataSourceType) => void
    renderOption?: (item: DataSourceType) => ReactElement
}


const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { fetchSuggestions, onSelect, renderOption, value, ...rest } = props
    const [inputValue, setInputValue] = useState(value)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])

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

    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setSuggestions([])
        if (onSelect) {
            onSelect(item)
        }
    }

    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
      }

    const generateDropdown = () => (
        <ul>
            {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item)}>{renderTemplate(item)}</li>
            ))}
        </ul>
    )

    return (
        <div className="auto-complete">
            <Input value={inputValue} onChange={handleChange} {...rest} />
            {suggestions.length > 0 ? generateDropdown() : null}
        </div>
    )
}

export default AutoComplete;