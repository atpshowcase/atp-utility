export const pdfService = {
  async mergePDFs(files: File[]): Promise<Blob> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const res = await fetch('http://localhost:8080/api/pdf/merge', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to merge PDFs')
    }

    return res.blob()
  }
}
