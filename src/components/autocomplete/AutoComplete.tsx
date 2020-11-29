import React, { FC, useState, useEffect, ChangeEvent, ReactElement } from 'react'
import Input, { InputProps } from '../input/Input'
import Icon from '../icon/Icon'
import useDebounce from '../_utils/hooks/useDebounce'

interface DataSourceObject {
    value: string
}

export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>
    onSelect?: (item: DataSourceType) => void
    renderOption?: (item: DataSourceType) => ReactElement
}


const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { fetchSuggestions, onSelect, renderOption, value, ...rest } = props
    const [inputValue, setInputValue] = useState<string>(value as string)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
    const [loading, setLoading] = useState(false)
    const debounceValue = useDebounce(inputValue, 500)

    useEffect(() => {
        if (debounceValue) {
            const results = fetchSuggestions(debounceValue)
            if (results instanceof Promise) {
                setLoading(true)
                results.then(data => {
                    setLoading(false)
                    setSuggestions(data)
                })
            } else {
                setSuggestions(results)
            }
        } else {
            setSuggestions([])
        }
    }, [debounceValue])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
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
            {loading && <ul><Icon icon="spinner" spin /></ul>}
            {suggestions.length > 0 ? generateDropdown() : null}
        </div>
    )
}

export default AutoComplete;