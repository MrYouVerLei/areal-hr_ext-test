import {createRouter, createWebHistory} from 'vue-router'
import EmployeesPage from '../pages/EmployeesPage.vue'
import OrganizationsPage from "../pages/OrganizationsPage.vue";
import UsersPage from "../pages/UsersPage.vue";
import DepartmentsPage from "../pages/DepartmentsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import MainLayout from "../layouts/MainLayout.vue";
import LoginLayout from "../layouts/LoginLayout.vue";
import PositionsPage from "../pages/PositionsPage.vue";
import AccountPage from "../pages/AccountPage.vue";
import {useAuthStore} from "../stores/auth.js";
import ChangelogPage from "../pages/ChangelogPage.vue";

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
            {path: 'users', component: UsersPage, meta: {requiresAuth: true, roles: ['Администратор']}},
            {path: 'account', component: AccountPage, meta: {requiresAuth: true}},
            {path: 'changelogs', component: ChangelogPage, meta: {requiresAuth: true}},
        ]
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    let result = false;
    let role = '';
    const auth = useAuthStore();
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {credentials: 'include'});

        if (response.ok) {
            const data = await response.json();
            result = data.result;
            if (result) {
                role = data.user.role_name;
                auth.setRole(role);
            }
        }
    } catch (e) {
        console.error(e);
        next('/login');
    }

    const routeRoles = to.meta.roles;

    if (to.meta.requiresAuth) {
        if (result) {
            if (routeRoles && !routeRoles.includes(role)) {
                return next('/employees');
            }
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