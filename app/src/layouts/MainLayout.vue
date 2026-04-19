<script setup>
import {router} from "../router/routes.js";

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
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"/>
          </q-avatar>
          HR
          <q-btn
              flat
              round
              dense
              icon="logout"
              @click="logout">
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" bordered>
      <q-item clickable v-ripple to="/organizations">
        <q-item-section> Организации</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/departments">
        <q-item-section> Отделы</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/employees">
        <q-item-section> Сотрудники</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/users">
        <q-item-section> Пользователи</q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <RouterView/>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="sass">

</style>