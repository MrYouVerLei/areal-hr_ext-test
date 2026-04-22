<script setup>
import {date, useDialogPluginComponent} from "quasar";
import {onMounted, ref} from "vue";

const props = defineProps({
  id: Number,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const formData = ref({
  last_name: '',
  first_name: '',
  patronymic: ''
});

const role = ref(null);
const rolesOptions = ref([]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function loadUserData(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    formData.value.last_name = data.last_name;
    formData.value.first_name = data.first_name;
    formData.value.patronymic = data.patronymic;

    if (rolesOptions.value.length > 0) {
      role.value = rolesOptions.value.find(item => item.id === data.role_id);
    }
  } catch (err) {
    console.error(err);
  }
}

async function saveUser(userId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
      method: 'PATCH',
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
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadRolesData();
  loadUserData(props.id);
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 50vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Редактирование пользователя</h5>
        </q-card-section>
        <q-form @submit="saveUser(props.id)">
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
                label="Сохранить"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>