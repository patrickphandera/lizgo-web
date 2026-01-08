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
      { path: 'channels', component: () => import('pages/ChannelsPage.vue') },
      { path: 'channels/:id', component: () => import('pages/LessonPage.vue') },
      { path: 'lessons', component: () => import('pages/LessonsPage.vue') },
      { path: 'lessons/:id', component: () => import('pages/LessonPage.vue') },
      { path: 'subjects', component: () => import('pages/SubjectsPage.vue') },
      { path: 'curriculums', component: () => import('pages/CurriculumsPage.vue') },
      { path: 'levels', component: () => import('pages/LevelsPage.vue') },
      { path: 'topics', component: () => import('pages/TopicsPage.vue') },
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
      { path: '', component: () => import('pages/admin/HomePage.vue') },
      { path: 'lessons', component: () => import('pages/admin/LessonsPage.vue') },
      { path: 'quizzes', component: () => import('pages/admin/QuizzesPage.vue') },
      { path: 'discussions', component: () => import('pages/admin/DiscussionsPage.vue') },
      { path: 'curriculums', component: () => import('pages/admin/CurriculumPage.vue') },
      { path: 'levels', component: () => import('pages/admin/LevelsPage.vue') },
      { path: 'topics', component: () => import('pages/admin/TopicsPage.vue') },
      { path: 'subjects', component: () => import('pages/admin/SubjectsPage.vue') },
      { path: 'students', component: () => import('pages/admin/StudentsPage.vue') },
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
