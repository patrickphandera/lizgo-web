const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
      {
        path: 'register-extra',
        component: () => import('pages/ExtraInformationRegisterationPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/home',
    component: () => import('layouts/LessonLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  {
    path: '/lessons',
    component: () => import('layouts/LessonLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LessonsPage.vue') },
      { path: ':id', component: () => import('pages/LessonPage.vue') },
    ],
  },
  {
    path: '/discussions',
    component: () => import('layouts/DiscussionLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DiscussionsPage.vue') },
      // { path: ':id', component: () => import('pages/DiscussionPage.vue') },
    ],
  },
  {
    path: '/quizzes',
    component: () => import('layouts/QuizLayout.vue'),
    children: [
      { path: '', component: () => import('pages/QuizzesPage.vue') },
      // { path: ':id', component: () => import('pages/QuizPage.vue') },
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
