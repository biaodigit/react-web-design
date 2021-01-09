import React, { useRef, FC, FormHTMLAttributes, ChangeEvent } from 'react'
import axios from 'axios'
import Button from '../button'

export interface UploadProps {
    action: string
    onProgress?: (percentage: number, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (err: any, file: File) => void
}

const Upload: FC<UploadProps> = (props) => {
    const { action, onProgress, onSuccess, onError } = props
    const fileInput = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        uploadFiles(files)
        if (fileInput.current) {
            fileInput.current.value = ''
        }
    }

    const uploadFiles = (files: FileList) => {
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            const formData = new FormData()
            formData.append(file.name, file)
            axios.post(action, formData, {
                headers: {
                    'Content-Type': "multipart/form-data"
                },
                onUploadProgress: (e) => {
                    let percentage = Math.round((e.loaded * 100) / e.total) || 0
                    if (percentage < 100 && onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }).then(res => {
                if (onSuccess) {
                    onSuccess(res.data, file)
                }
            }).catch(err => {
                if (onError) {
                    onError(err, file)
                }
            })
        })
    }
    return (
        <div className="web-upload">
            <Button type="primary" onClick={handleClick}>upload file</Button>
            <input
                className="web-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            >
            </input>
        </div>
    )
}

export default Upload;