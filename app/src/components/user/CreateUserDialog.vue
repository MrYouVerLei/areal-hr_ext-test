<script setup>
import {useDialogPluginComponent} from "quasar";
import {onMounted, ref} from "vue";

const props = defineProps({
  // ...your custom props
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const formData = ref({
  login: '',
  password: '',
  last_name: '',
  first_name: '',
  patronymic: ''
});

const isPwd = ref(true);
const isConfirmPwd = ref(true);
const confirmPassword = ref('');
const role = ref(null);
const rolesOptions = ref([]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function createUser() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        ...formData.value,
        role_id: role.value.id
      })
    });

    if (response.ok) {
      onDialogOK();
    }
  } catch (err) {
    console.error(err);
  }
}

async function checkUniqueLogin(val) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/check-unique-login/${val}`);

    if (!response.ok) {
      throw new Error("Ошибка проверки уникальности логина");
    }

    const data = await response.json();

    if (data) {
      return true;
    } else {
      return "Логин уже занят"
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadRolesData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    rolesOptions.value = data.filter(role => role.name !== "Администратор").map((role) => {
      return {
        id: role.id,
        name: role.name,
      };
    });

    if (rolesOptions.value.length > 0) {
      role.value = rolesOptions.value[0];
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadRolesData();
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 50vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Добавление пользователя</h5>
        </q-card-section>
        <q-form @submit="createUser">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                  outlined
                  v-model="formData.last_name"
                  label="Фамилия"
                  :rules="[(val) => !!val || 'Поле обязательно']"
              />
            </div>
            <div class="col-12">
              <q-input
                  outlined
                  v-model="formData.first_name"
                  label="Имя"
                  :rules="[(val) => !!val || 'Поле обязательно']"
              />
            </div>
            <div class="col-12">
              <q-input
                  outlined
                  v-model="formData.patronymic"
                  label="Отчество"
              />
            </div>
            <div class="col-12">
              <q-select outlined v-model="role" :options="rolesOptions" option-value="id"
                        option-label="name"
                        label="Роль"
                        emit-value
                        map-options
                        class="q-pt-sm"
                        :rules="[(val) => !!val || 'Поле обязательно']"/>
            </div>
            <div class="col-12">
              <q-input
                  outlined
                  v-model="formData.login"
                  label="Логин"
                  :rules="[(val) => !!val || 'Поле обязательно',
                  (val) => checkUniqueLogin(val)]"
              />
            </div>
            <div class="col-12">
              <q-input
                  v-model="formData.password"
                  outlined
                  label="Пароль"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => !!val || 'Поле обязательно']"
              >
                <template v-slot:append>
                  <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                  v-model="confirmPassword"
                  outlined
                  label="Подтвердите пароль"
                  :type="isConfirmPwd ? 'password' : 'text'"
                  :rules="[(val) => !!val || 'Поле обязательно',
                  (val) => val === formData.password || 'Пароли не совпадают']"
              >
                <template v-slot:append>
                  <q-icon
                      :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isConfirmPwd = !isConfirmPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row justify-end q-mt-md">
            <q-btn
                flat
                color="primary"
                @click="onDialogCancel"
                label="Отмена"
                class="q-mr-auto"
            />
            <q-btn
                type="submit"
                color="primary"
                label="Добавить"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>