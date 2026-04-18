import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HelloWorld.vue'
import EmployeesPage from '../pages/EmployeesPage.vue'
import OrganizationsPage from "../pages/OrganizationsPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import DepartmentsPage from "../pages/DepartmentsPage.vue";

const routes = [
  { path: '/', component: HomeView },
  { path: '/employees', component: EmployeesPage },
  { path: '/organizations', component: OrganizationsPage },
  { path: '/departments', component: DepartmentsPage },
  { path: '/users', component: UsersPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})