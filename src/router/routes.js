const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'register', component: () => import('pages/auth/RegisterPage.vue') },
      {
        path: 'register-extra',
        component: () => import('pages/ExtraInformationRegisterationPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/LoginPage.vue') }],
  },
  {
    path: '/home',
    component: () => import('layouts/LessonLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  {
    path: '/students',
    component: () => import('layouts/ChannelLayout.vue'),
    children: [
      { path: 'channels', component: () => import('pages/teachers/ChannelsPage.vue') },
      { path: 'channels/:id', component: () => import('pages/teachers/LessonPage.vue') },
      { path: 'lessons', component: () => import('pages/LessonsPage.vue') },
      { path: 'lessons/:id', component: () => import('pages/teachers/LessonPage.vue') },
      { path: 'subjects', component: () => import('pages/teachers/SubjectsPage.vue') },
      { path: 'curriculums', component: () => import('pages/teachers/CurriculumsPage.vue') },
      { path: 'levels', component: () => import('pages/teachers/LevelsPage.vue') },
      { path: 'topics', component: () => import('pages/teachers/TopicsPage.vue') },
      { path: 'users', component: () => import('pages/teachers/UsersPage.vue') },
      { path: 'users/:id/:authId', component: () => import('pages/UserPage.vue') },
    ],
  },
  {
    path: '/quizzes',
    component: () => import('layouts/QuizLayout.vue'),
    children: [
      { path: '', component: () => import('pages/QuizzesPage.vue') },
      { path: ':id', component: () => import('pages/QuizPage.vue') },
    ],
  },
  {
    path: '/teacher',
    component: () => import('layouts/LessonLayout.vue'),
    children: [
      { path: 'lessons', component: () => import('pages/teacher/LessonsPage.vue') },
      { path: ':id', component: () => import('pages/LessonPage.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
   children: [
      { path: 'channels', component: () => import('pages/admin/ChannelsPage.vue') },
      { path: 'channels/:id', component: () => import('pages/admin/LessonPage.vue') },
      { path: 'lessons', component: () => import('pages/admin/LessonsPage.vue') },
      { path: 'lessons/:id', component: () => import('pages/admin/LessonPage.vue') },
      { path: 'subjects', component: () => import('pages/admin/SubjectsPage.vue') },
      { path: 'curriculums', component: () => import('pages/admin/CurriculumsPage.vue') },
      { path: 'levels', component: () => import('pages/admin/LevelsPage.vue') },
      { path: 'topics', component: () => import('pages/admin/TopicsPage.vue') },
      { path: 'users', component: () => import('pages/admin/UsersPage.vue') },
      { path: 'users/:id/:authId', component: () => import('pages/admin/UserPage.vue') },
    ],
  }
  ,
  {
    path: '/teachers',
    component: () => import('layouts/TeacherLayout.vue'),
   children: [
      { path: 'channels', component: () => import('pages/teachers/ChannelsPage.vue') },
      { path: 'channels/:id', component: () => import('pages/teachers/LessonPage.vue') },
      { path: 'lessons', component: () => import('pages/teachers/LessonsPage.vue') },
      { path: 'lessons/:id', component: () => import('pages/teachers/LessonPage.vue') },
      { path: 'subjects', component: () => import('pages/teachers/SubjectsPage.vue') },
      { path: 'curriculums', component: () => import('pages/teachers/CurriculumsPage.vue') },
      { path: 'levels', component: () => import('pages/teachers/LevelsPage.vue') },
      { path: 'topics', component: () => import('pages/teachers/TopicsPage.vue') },
      { path: 'users', component: () => import('pages/teachers/UsersPage.vue') },
      { path: 'users/:id/:authId', component: () => import('pages/teachers/UserPage.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
