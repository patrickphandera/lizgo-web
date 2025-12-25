// Generic CRUD service for database operations - extend for specific entities

import RestService from './rest.service.js'

class BaseDbService {
  constructor(endpoint) {
    this.rest = RestService
    this.endpoint = endpoint
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Get all records with filtering, sorting, and pagination
  async getAll(params = {}) {
    const { useCache = true, ...queryParams } = params
    const cacheKey = `getAll_${JSON.stringify(queryParams)}`

    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const queryString = this.buildQueryString(queryParams)
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint
      const response = await this.rest.get(url)

      const data = Array.isArray(response) ? response : response.data || response

      if (useCache) {
        this.cache.set(cacheKey, data)
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)
      }

      return data
    } catch (error) {
      console.error(`Failed to fetch records from ${this.endpoint}:`, error)
      throw error
    }
  }

  // Get single record by ID
  async getById(id, useCache = true) {
    const cacheKey = `getById_${id}`

    if (useCache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      const data = response.data || response

      if (useCache) {
        this.cache.set(cacheKey, data)
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)
      }

      return data
    } catch (error) {
      console.error(`Failed to fetch record ${id} from ${this.endpoint}:`, error)
      throw error
    }
  }

  // Find records by filter
  async find(filter, options = {}) {
    try {
      const params = { filter, ...options }
      return await this.getAll(params)
    } catch (error) {
      console.error(`Failed to find records in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Search records (full-text search)
  async search(query, fields = '', options = {}) {
    try {
      const params = {
        search: query,
        searchFields: fields,
        ...options,
      }
      return await this.getAll(params)
    } catch (error) {
      console.error(`Failed to search records in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Create new record
  async create(data) {
    try {
      const response = await this.rest.post(this.endpoint, data)
      const created = response.data || response

      this.invalidateCache('getAll')

      return created
    } catch (error) {
      console.error(`Failed to create record in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Create multiple records
  async createBatch(dataArray) {
    try {
      const response = await this.rest.post(`${this.endpoint}/batch`, {
        items: dataArray,
      })
      const created = response.data || response

      this.invalidateCache('getAll')

      return Array.isArray(created) ? created : created.items || []
    } catch (error) {
      console.error(`Failed to create batch records in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Update record by ID (full update)
  async update(id, data) {
    try {
      const response = await this.rest.put(`${this.endpoint}/${id}`, data)
      const updated = response.data || response

      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')

      return updated
    } catch (error) {
      console.error(`Failed to update record ${id} in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Partial update record by ID
  async patch(id, data) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, data)
      const updated = response.data || response

      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')

      return updated
    } catch (error) {
      console.error(`Failed to patch record ${id} in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Update multiple records
  async updateBatch(updates) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/batch`, {
        items: updates,
      })
      const updated = response.data || response

      this.invalidateCache('getAll')
      updates.forEach((u) => this.invalidateCache(`getById_${u.id}`))

      return Array.isArray(updated) ? updated : updated.items || []
    } catch (error) {
      console.error(`Failed to update batch records in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Delete record by ID
  async delete(id) {
    try {
      const response = await this.rest.delete(`${this.endpoint}/${id}`)

      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')

      return response
    } catch (error) {
      console.error(`Failed to delete record ${id} from ${this.endpoint}:`, error)
      throw error
    }
  }

  // Delete multiple records
  async deleteBatch(ids) {
    try {
      const response = await this.rest.delete(`${this.endpoint}/batch`, {
        ids,
      })

      this.invalidateCache('getAll')
      ids.forEach((id) => this.invalidateCache(`getById_${id}`))

      return response
    } catch (error) {
      console.error(`Failed to delete batch records from ${this.endpoint}:`, error)
      throw error
    }
  }

  // Delete records by filter
  async deleteByFilter(filter) {
    try {
      const response = await this.rest.post(`${this.endpoint}/delete-by-filter`, filter)

      this.invalidateCache('getAll')

      return response
    } catch (error) {
      console.error(`Failed to delete records by filter from ${this.endpoint}:`, error)
      throw error
    }
  }

  // Count records
  async count(filter = {}) {
    try {
      const response = await this.rest.post(`${this.endpoint}/count`, filter)
      return response.count || response
    } catch (error) {
      console.error(`Failed to count records in ${this.endpoint}:`, error)
      throw error
    }
  }

  // Check if record exists
  async exists(id) {
    try {
      await this.getById(id, false)
      return true
    } catch (error) {
      if (error.status === 404) {
        return false
      }
      throw error
    }
  }

  // Export records to file
  async export(params = {}) {
    try {
      const queryString = this.buildQueryString(params)
      const url = `${this.endpoint}/export?${queryString}`
      return await this.rest.downloadFile(url, `export.${params.format || 'csv'}`)
    } catch (error) {
      console.error(`Failed to export records from ${this.endpoint}:`, error)
      throw error
    }
  }

  // Import records from file
  async import(file, options = {}) {
    try {
      const response = await this.rest.uploadFile(`${this.endpoint}/import`, file, options)

      this.invalidateCache('getAll')

      return response
    } catch (error) {
      console.error(`Failed to import records to ${this.endpoint}:`, error)
      throw error
    }
  }

  // Bulk operation
  async bulkAction(action, ids, data = {}) {
    try {
      const response = await this.rest.post(`${this.endpoint}/bulk`, {
        action,
        ids,
        data,
      })

      this.invalidateCache('getAll')
      ids.forEach((id) => this.invalidateCache(`getById_${id}`))

      return response
    } catch (error) {
      console.error(`Failed to perform bulk action "${action}" on ${this.endpoint}:`, error)
      throw error
    }
  }

  // Build query string from parameters
  buildQueryString(params) {
    const parts = []

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return

      if (key === 'filter' && typeof value === 'object') {
        Object.entries(value).forEach(([filterKey, filterValue]) => {
          parts.push(
            `${encodeURIComponent(`filter.${filterKey}`)}=${encodeURIComponent(filterValue)}`,
          )
        })
      } else if (Array.isArray(value)) {
        value.forEach((v) => {
          parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`)
        })
      } else if (typeof value === 'object') {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`)
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    })

    return parts.join('&')
  }

  // Invalidate cache by pattern
  invalidateCache(pattern) {
    if (pattern === 'getAll') {
      for (const key of this.cache.keys()) {
        if (key.startsWith('getAll_')) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.delete(pattern)
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear()
  }

  // Set cache timeout
  setCacheTimeout(ms) {
    this.cacheTimeout = ms
  }

  // Get endpoint URL
  getEndpoint() {
    return this.endpoint
  }

  // Set endpoint URL
  setEndpoint(endpoint) {
    this.endpoint = endpoint
    this.clearCache()
  }
  async uploadFile(file, options = {}) {
    try {
      const response = await this.rest.uploadFile(`${this.endpoint}/upload`, file, options)

      this.invalidateCache('getAll')

      return response.data || response
    } catch (error) {
      console.error(`Failed to upload file to ${this.endpoint}:`, error)
      throw error
    }
  }
}

export default BaseDbService
