// HTTP client using Axios with automatic token injection and error handling

import axios from 'axios';

class RestService {
  constructor(baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.timeout = 30000;

    this.axiosInstance = axios.create({
      baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Auto-inject auth token
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Handle 401 errors
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
      }
    );
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQyYTk2MzE2Yjg4Yjg3MDM2MGZjYTkiLCJpYXQiOjE3NjU5NzY1MTgsImV4cCI6MTc2NjA2MjkxOH0.fPjDq90R_iP4Huf9dVIkSpobKuAwo-jjEZvvJwc7swg';
  }

  // Store token in localStorage
  setToken(token) {
    localStorage.setItem('access_token', token);
  }

  // Clear stored token
  clearToken() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
  }

  // GET request
  async get(endpoint, config = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST request
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await this.axiosInstance.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT request (full replacement)
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await this.axiosInstance.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PATCH request (partial update)
  async patch(endpoint, data = {}, config = {}) {
    try {
      const response = await this.axiosInstance.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE request
  async delete(endpoint, config = {}) {
    try {
      const response = await this.axiosInstance.delete(endpoint, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload single file
  async uploadFile(endpoint, file, additionalData = {}, config = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      Object.keys(additionalData).forEach(key => {
        if (Array.isArray(additionalData[key])) {
          additionalData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, additionalData[key]);
        }
      });

      const response = await this.axiosInstance.post(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload multiple files
  async uploadFiles(endpoint, files, additionalData = {}, config = {}) {
    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      Object.keys(additionalData).forEach(key => {
        if (Array.isArray(additionalData[key])) {
          additionalData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, additionalData[key]);
        }
      });

      const response = await this.axiosInstance.post(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Download file
  async downloadFile(endpoint, filename, config = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, {
        ...config,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Stream request
  async streamRequest(endpoint, config = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, {
        ...config,
        responseType: 'stream',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request with upload/download progress tracking
  async requestWithProgress(endpoint, method = 'GET', data = null, onProgress = null, config = {}) {
    try {
      const response = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        ...config,
        onUploadProgress: onProgress ? event => onProgress('upload', event) : undefined,
        onDownloadProgress: onProgress ? event => onProgress('download', event) : undefined,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Execute multiple requests concurrently
  async all(requests) {
    try {
      const responses = await axios.all(requests);
      return responses.map(r => r.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Normalize error responses
  handleError(error) {
    const customError = new Error(
      error.response?.data?.message ||
      error.message ||
      'An error occurred'
    );
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.originalError = error;
    return customError;
  }

  // Set API base URL
  setBaseURL(url) {
    this.baseURL = url;
    this.axiosInstance.defaults.baseURL = url;
  }

  // Get API base URL
  getBaseURL() {
    return this.baseURL;
  }

  // Set request timeout
  setTimeout(ms) {
    this.timeout = ms;
    this.axiosInstance.defaults.timeout = ms;
  }

  // Set default headers
  setDefaultHeaders(headers) {
    Object.assign(this.axiosInstance.defaults.headers.common, headers);
  }

  // Add request interceptor
  addRequestInterceptor(onFulfilled, onRejected) {
    return this.axiosInstance.interceptors.request.use(onFulfilled, onRejected);
  }

  // Add response interceptor
  addResponseInterceptor(onFulfilled, onRejected) {
    return this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  }

  // Remove interceptor by type and id
  removeInterceptor(type, id) {
    if (type === 'request') {
      this.axiosInstance.interceptors.request.eject(id);
    } else if (type === 'response') {
      this.axiosInstance.interceptors.response.eject(id);
    }
  }

  // Get raw Axios instance
  getAxiosInstance() {
    return this.axiosInstance;
  }
}

export default new RestService();
