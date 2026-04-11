import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HelloWorld.vue'
import EmployeesPage from '../pages/EmployeesPage.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/employees', component: EmployeesPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})