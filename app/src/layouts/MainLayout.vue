<script setup>
import {router} from "../router/routes.js";
import {useAuthStore} from "../stores/auth.js";

const auth = useAuthStore();

async function logout() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      router.push("/");
    }
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <q-layout view="lHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"/>
          </q-avatar>
          HR
        </q-toolbar-title>
        <q-btn

            flat
            round
            dense
            icon="logout"
            @click="logout">
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" bordered>
      <q-item clickable v-ripple to="/account">
        <q-item-section avatar>
          <q-icon name="person"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> Аккаунт</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/organizations">
        <q-item-section avatar>
          <q-icon name="business"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> Организации</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/departments">
        <q-item-section avatar>
          <q-icon name="schema"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> Отделы</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/positions">
        <q-item-section avatar>
          <q-icon name="badge"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> Должности</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/employees">
        <q-item-section avatar>
          <q-icon name="people"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> Сотрудники</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/changelogs" v-if="$can('read', 'Changelog') || auth.role === 'Администратор'">
        <q-item-section avatar>
          <q-icon name="history"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> История изменений</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/users" v-if="auth.role === 'Администратор'">
        <q-item-section avatar>
          <q-icon name="manage_accounts"/>
        </q-item-section>
        <q-item-section class="text-h6 q-py-sm"> Пользователи</q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <RouterView/>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="sass">

</style>