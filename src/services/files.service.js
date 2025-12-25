import RestService from './rest.service.js'

// Simple service for single file upload
class FilesService {
  /**
   * Upload a single file
   * @param {string} endpoint - API endpoint (e.g. '/curriculums/upload')
   * @param {File|Blob} file
   * @param {Object} options
   * @param {string} [options.fieldName='file']
   * @param {Object} [options.meta]
   * @param {Function} [options.onProgress]
   */
  async upload(endpoint, file, options = {}) {
    const { fieldName = 'file', meta = {}, onProgress } = options

    try {
      const formData = new FormData()
      formData.append(fieldName, file)

      Object.entries(meta).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const response = await RestService.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
          ? (e) => {
              const percent = Math.round((e.loaded * 100) / e.total)
              onProgress(percent, e)
            }
          : undefined,
      })

      return response.data || response
    } catch (error) {
      console.error(`File upload failed to ${endpoint}:`, error)
      throw error
    }
  }
}

export default new FilesService()
