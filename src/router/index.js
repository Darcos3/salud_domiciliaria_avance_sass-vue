import { createRouter, createWebHistory } from '@ionic/vue-router';


const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import ('../views/front/LoginPage.vue')
  },
  {
    path: '/registro',
    component: () => import ('../views/front/RegistroPage.vue')
  },
  {
    path: '/update-password',
    component: () => import ('../views/front/UpdatePasswordPage.vue')
  },
  {
    path: '/historias',
    component: () => import ('../views/usuario/historias/IndexPage.vue')
  },
  {
    path: '/historias-update/:id',
    component: () => import ('../views/usuario/historias/UpdatePage.vue')
  },
  {
    path: '/historias-create',
    component: () => import ('../views/usuario/historias/CreatePage.vue')
  },
  {
    path: '/historias-detalles/:id',
    component: () => import ('../views/usuario/historias/ViewPage.vue')
  },
  {
    path: '/configuracion',
    component: () => import ('../views/usuario/configuracion/UpdatePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
