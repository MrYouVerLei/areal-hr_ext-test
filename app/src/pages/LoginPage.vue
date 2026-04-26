<script setup>
import {onMounted, ref} from "vue";
import {router} from "../router/routes.js";
import {useQuasar} from "quasar";
import {ability} from "../ability.ts";

const formData = ref({
  login: '',
  password: ''
});

const isPwd = ref(true);
const $q = useQuasar()

async function login() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify(formData.value)
    });

    if (response.ok) {
      const data = await response.json();
      ability.update(data.permissions);
      await router.push("/employees");
    } else {
      $q.notify({
        type: 'negative',
        position: 'top',
        message: 'Неверный логин или пароль',
        timeout: 1000
      });
    }
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      position: 'top',
      message: 'Неверный логин или пароль',
      timeout: 1000
    });
  }
}
</script>

<template>
  <q-page class="flex flex-center items-center">
    <q-card bordered style="width: 400px; max-width: 50vw">
      <q-card-section class="text-center q-pb-none">
        <h4 class="q-ma-none">Вход</h4>
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <q-form @submit="login">
          <q-input
              outlined
              v-model="formData.login"
              label="Логин"
              autocomplete="username"
              :rules="[(val) => !!val || 'Введите логин']"
          />
          <q-input
              v-model="formData.password"
              outlined
              label="Пароль"
              autocomplete="current-password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'Введите пароль']"
          >
            <template v-slot:append>
              <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
              type="submit"
              color="primary"
              label="Войти"
              class="full-width q-mt-md"
              size="18px"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped lang="sass">

</style>