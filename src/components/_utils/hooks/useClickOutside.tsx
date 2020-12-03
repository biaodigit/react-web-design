import React, { useState, useEffect } from 'react'

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: Function) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as HTMLElement)) return

            handler(event)
        }
        document.addEventListener('click', listener)

        return () => {
            document.removeEventListener('click', listener)
        }
    }, [ref, handler])
}

export default useClickOutside