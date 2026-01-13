// Lessons database service extending BaseDbService

import BaseDbService from './base.db.service.js'

class LessonsService extends BaseDbService {
  constructor() {
    super('/lessons')
  }


  // Get lessons with sections populated
  async getLessonsWithSections(params = {}) {
    try {
      const response = await this.rest.get(`${this.endpoint}?populate=sections`, {
        params,
      })

      console.log(response)
      return Array.isArray(response) ? response : response.data || response
    } catch (error) {
      console.log('Failed to fetch lessons with sections:', error)
      throw error
    }
  }

  // Get lesson by ID with full details
  async getLessonDetails(id) {
    try {
      const response = await this.rest.get(`${this.endpoint}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to fetch lesson ${id}:`, error)
      throw error
    }
  }

  // Create lesson with sections
  async createLessonWithSections(lessonData) {
    try {
      const response = await this.rest.post(`${this.endpoint}`, lessonData)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error('Failed to create lesson:', error)
      throw error
    }
  }

  // Update lesson with sections
  async updateLessonWithSections(id, lessonData) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, lessonData)
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to update lesson ${id}:`, error)
      throw error
    }
  }

  // Get lessons by subject
  async getLessonsBySubject(subjectId, params = {}) {
    try {
      return await this.find({ subjectId }, params)
    } catch (error) {
      console.error(`Failed to fetch lessons for subject ${subjectId}:`, error)
      throw error
    }
  }

  // Get lessons by topic
  async getLessonsByTopic(topicId, params = {}) {
    try {
      return await this.find({ topicId }, params)
    } catch (error) {
      console.error(`Failed to fetch lessons for topic ${topicId}:`, error)
      throw error
    }
  }

  // Get lessons by curriculum
  async getLessonsByCurriculum(curriculumId, params = {}) {
    try {
      return await this.find({ curriculumId }, params)
    } catch (error) {
      console.error(`Failed to fetch lessons for curriculum ${curriculumId}:`, error)
      throw error
    }
  }

  // Get lessons by author

    async getStudentPersonalizedLessons() {
    const response = await this.rest.get(`${this.endpoint}/students/me`)
    console.log(response.data)
    return response.data || response
  }
  async getLessonsByAuthor(authorId) {
    const response = await this.rest.get(`${this.endpoint}/author/${authorId}`)
    console.log(response.data)
    return response.data || response
  }

  // Add section to lesson
  async addSection(lessonId, section) {
    try {
      const response = await this.rest.post(`${this.endpoint}/${lessonId}/sections`, section)
      this.invalidateCache(`getById_${lessonId}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to add section to lesson ${lessonId}:`, error)
      throw error
    }
  }

  // Remove section from lesson
  async removeSection(lessonId, sectionIndex) {
    try {
      const response = await this.rest.delete(
        `${this.endpoint}/${lessonId}/sections/${sectionIndex}`,
      )
      this.invalidateCache(`getById_${lessonId}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to remove section from lesson ${lessonId}:`, error)
      throw error
    }
  }

  // Update section in lesson
  async updateSection(lessonId, sectionIndex, section) {
    try {
      const response = await this.rest.patch(
        `${this.endpoint}/${lessonId}/sections/${sectionIndex}`,
        section,
      )
      this.invalidateCache(`getById_${lessonId}`)
      return response.data || response
    } catch (error) {
      console.error(`Failed to update section in lesson ${lessonId}:`, error)
      throw error
    }
  }

  // Publish lesson
  async publishLesson(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { published: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to publish lesson ${id}:`, error)
      throw error
    }
  }

  // Archive lesson
  async archiveLesson(id) {
    try {
      const response = await this.rest.patch(`${this.endpoint}/${id}`, { archived: true })
      this.invalidateCache(`getById_${id}`)
      this.invalidateCache('getAll')
      return response.data || response
    } catch (error) {
      console.error(`Failed to archive lesson ${id}:`, error)
      throw error
    }
  }
}

export default new LessonsService()
