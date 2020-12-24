import React, { FC, useState, useEffect, useRef, ChangeEvent, KeyboardEvent, ReactElement } from 'react'
import classNames from 'classnames'
import Input, { InputProps } from '../input/Input'
import Icon from '../icon/Icon'
import useDebounce from '../_utils/hooks/useDebounce'
import useClickOutside from '../_utils/hooks/useClickOutside'

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
    const [highlightIndex, setHighlightIndex] = useState(-1)
    const triggerSearch = useRef(false)
    const componentRef = useRef<HTMLDivElement>(null)
    const debounceValue = useDebounce(inputValue, 500)

    useClickOutside(componentRef, () => { setSuggestions([]) })
    useEffect(() => {
        setSuggestions([])
        if (debounceValue && triggerSearch.current) {
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
        setHighlightIndex(-1)
    }, [debounceValue])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
        triggerSearch.current = true
    }

    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setSuggestions([])
        if (onSelect) {
            onSelect(item)
        }
        triggerSearch.current = false
    }

    const highlight = (index: number) => {
        if (index < 0) index = 0
        if (index >= suggestions.length) index = suggestions.length - 1
        setHighlightIndex(index)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            case 13:
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex])
                }
                break;
            case 38:
                highlight(highlightIndex - 1)
                break;
            case 40:
                highlight(highlightIndex + 1)
                break;
            case 27:
                setSuggestions([])
                break;
            default:
                break;

        }
    }

    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }

    const generateDropdown = () => (
      <ul className="web-suggestion-list">
            {loading && <div className="web-suggestion-loading-icon"><Icon icon="spinner" spin /></div>}
            {suggestions.map((item, index) => {
                const cnames = classNames('web-suggestion-item', {
                    'is-active': index === highlightIndex
                })
                return (
                    <li key={index} className={cnames} onClick={() => handleSelect(item)}>{renderTemplate(item)}</li>
                )
            })}
        </ul>
    )

    return (
        <div className="web-auto-complete" ref={componentRef}>
            <Input value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} {...rest} />
            {suggestions.length > 0 ? generateDropdown() : null}
        </div>
    )
}

export default AutoComplete;