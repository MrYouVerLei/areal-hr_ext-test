import {createRouter, createWebHistory} from 'vue-router'
import EmployeesPage from '../pages/EmployeesPage.vue'
import OrganizationsPage from "../pages/OrganizationsPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import DepartmentsPage from "../pages/DepartmentsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import MainLayout from "../layouts/MainLayout.vue";
import LoginLayout from "../layouts/LoginLayout.vue";

const routes = [
    {
        path: '/', component: LoginLayout, children: [
            {path: '', component: LoginPage}
        ]
    },
    {
        path: '/', component: MainLayout, children: [
            {path: 'employees', component: EmployeesPage},
            {path: 'organizations', component: OrganizationsPage},
            {path: 'departments', component: DepartmentsPage},
            {path: 'users', component: UsersPage}
        ]
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})