import React, { useState, useRef } from 'react'
import axios from 'axios'
import UploadList from './UploadList'
import Dragger from './Dragger'
import Button from '../button'

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadProps {
    action: string
    defaultFileList?: UploadFile[]

    beforeUpload?: (file: File) => boolean | Promise<File>
    onChange?: (file: File) => void
    onProgress?: (percentage: number, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (err: any, file: File) => void
    onRemove?: (file: UploadFile) => void
    headers?: { [key: string]: any }
    name?: string
    data?: { [key: string]: any }
    withCredentials?: boolean
    accept?: string
    multiple?: boolean
    drag?: boolean
}

export interface UploadFile {
    uid: string
    size: number
    name: string
    status?: UploadFileStatus
    percent?: number
    raw?: File
    response?: any
    error?: any

}
const Upload: React.FC<UploadProps> = (props) => {
    const {
        action,
        defaultFileList,
        beforeUpload,
        onChange,
        onProgress,
        onSuccess,
        onError,
        onRemove,
        name,
        data,
        headers,
        withCredentials,
        accept,
        multiple,
        drag,
        children
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])

    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList(prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid) {
                    return { ...file, ...updateObj }
                } else {
                    return file
                }
            })
        })
    }

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            if (!beforeUpload) {
                post(file)
            } else {
                const result = beforeUpload(file)
                if (result && result instanceof Promise) {
                    result.then(processedFile => {
                        post(processedFile)
                    })
                } else if (result !== false) {
                    post(file)
                }
            }
        })
    }

    const post = (file: File) => {
        let _file: UploadFile = {
            uid: Date.now() + 'upload_file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        }
        setFileList(prevList => {
            return [_file, ...prevList]
        })
        const formData = new FormData()
        formData.append(name!, file)
        if (data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
        }
        axios.post(action, formData, {
            headers: {
                ...headers,
                'Content-Type': "multipart/form-data"
            },
            withCredentials,
            onUploadProgress: (e) => {
                let percentage = Math.round((e.loaded * 100) / e.total) || 0
                if (percentage < 100) {
                    updateFileList(_file, { percent: percentage, status: 'uploading' })
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }

            }
        }).then(res => {
            updateFileList(_file, { status: 'success', response: res.data })
            if (onSuccess) {
                onSuccess(res.data, file)
            }
            if (onChange) {
                onChange(file)
            }
        }).catch(err => {
            updateFileList(_file, { status: 'error', error: err })
            if (onError) {
                onError(err, file)
            }
            if (onChange) {
                onChange(file)
            }
        })
    }

    const handleRemove = (file: UploadFile) => {
        setFileList(prevList => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if (onRemove) {
            onRemove(file)
        }
    }

    return (
        <div className="web-upload">
            <Button type="primary" onClick={handleClick}>upload file</Button>
            {drag ?
                <Dragger
                    onFile={(files) => { uploadFiles(files) }}
                >
                    {children}
                </Dragger>
                : children
            }
            <input
                className="web-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept={accept}
                multiple={multiple}
            >
            </input>
            <UploadList
                fileList={fileList}
                onRemove={handleRemove}
            />
        </div>
    )
}

Upload.defaultProps = {
    name: 'file'
}

export default Upload;