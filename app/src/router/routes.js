import {createRouter, createWebHistory} from 'vue-router'
import EmployeesPage from '../pages/EmployeesPage.vue'
import OrganizationsPage from "../pages/OrganizationsPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import DepartmentsPage from "../pages/DepartmentsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import MainLayout from "../layouts/MainLayout.vue";
import LoginLayout from "../layouts/LoginLayout.vue";
import PositionsPage from "../pages/PositionsPage.vue";

const routes = [
    {
        path: '/', redirect: '/login'
    },
    {
        path: '/', component: LoginLayout, children: [
            {path: 'login', component: LoginPage}
        ]
    },
    {
        path: '/', component: MainLayout, children: [
            {path: 'employees', component: EmployeesPage, meta: {requiresAuth: true}},
            {path: 'organizations', component: OrganizationsPage, meta: {requiresAuth: true}},
            {path: 'departments', component: DepartmentsPage, meta: {requiresAuth: true}},
            {path: 'positions', component: PositionsPage, meta: {requiresAuth: true}},
            {path: 'users', component: UsersPage, meta: {requiresAuth: true}}
        ]
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    let result = false;
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {credentials: 'include'});

        if (response.ok) {
            const data = await response.json();
            result = data.result;
        }
    } catch (e) {
        console.error(e);
        next('/login');
    }

    if (to.meta.requiresAuth) {
        if (result) {
            next();
        } else {
            next('/login');
        }
    } else {
        if (result && to.path === '/login') {
            next('/employees');
        } else {
            next();
        }
    }
})