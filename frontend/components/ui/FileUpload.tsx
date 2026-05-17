import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, X, FileText, Image, Loader2 } from 'lucide-react'
import { api } from '@/lib/axios'
import { formatBytes } from '@/lib/utils'

interface Props {
  attachableType: string   // 'workflowrequest' | 'asset'
  attachableId:   string
  onUploaded?: () => void
}

interface UploadedFile {
  id: string
  original_name: string
  human_size: string
  mime_type: string
  url: string
}

export default function FileUpload({ attachableType, attachableId, onUploaded }: Props) {
  const qc = useQueryClient()
  const [files, setFiles] = useState<File[]>([])
  const [uploaded, setUploaded] = useState<UploadedFile[]>([])

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post(
        `/attachments/${attachableType}/${attachableId}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data as UploadedFile
    },
    onSuccess: (data) => {
      setUploaded(prev => [...prev, data])
      qc.invalidateQueries({ queryKey: [attachableType, attachableId] })
      onUploaded?.()
    },
  })

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => [...prev, ...accepted])
    accepted.forEach(f => uploadMutation.mutate(f))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg','.jpeg','.png','.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,  // 10 MB
  })

  const FileIcon = ({ mime }: { mime: string }) =>
    mime.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      }`}>
        <input {...getInputProps()} />
        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'วางไฟล์ที่นี่...' : 'ลากไฟล์มาวางหรือ '}
          {!isDragActive && <span className="text-blue-600 font-medium">คลิกเพื่อเลือก</span>}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF, DOCX สูงสุด 10MB</p>
      </div>

      {/* Upload Progress */}
      {uploadMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 size={14} className="animate-spin" />
          กำลังอัปโหลด...
        </div>
      )}

      {/* Uploaded Files */}
      {uploaded.length > 0 && (
        <div className="space-y-2">
          {uploaded.map(file => (
            <div key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
              <div className="text-blue-500"><FileIcon mime={file.mime_type} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{file.original_name}</p>
                <p className="text-xs text-gray-400">{file.human_size}</p>
              </div>
              <a href={file.url} target="_blank" rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex-shrink-0">
                ดาวน์โหลด
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}