<script setup>
import {useDialogPluginComponent} from "quasar";
import {onMounted, ref} from "vue";

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const role = ref(null);
const rolesOptions = ref([]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function loadRolesData(employeeId) {
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
    <q-card style="width: 400px; max-width: 40vw">
      <div class="q-pa-md">
        <q-form @submit="onDialogOK(role)">
          <q-card-section class="text-center">
            <h5 class="q-ma-none">Сохранение разрешений</h5>
          </q-card-section>
          <q-card-section class="q-py-none">
            <span class="text-subtitle1">Сохранить разрешения для:</span>
            <q-select outlined v-model="role" :options="rolesOptions" option-value="id"
                      option-label="name"
                      label="Роль"
                      emit-value
                      map-options
                      class="q-pt-sm"
                      :rules="[(val) => !!val || 'Поле обязательно']"/>
          </q-card-section>
          <div class="row justify-end q-mt-md">
            <q-btn
                flat
                color="primary"
                @click="onDialogCancel"
                label="Отмена"
                class="q-mr-auto"
            />
            <q-btn
                color="primary"
                label="Подтвердить"
                type="submit"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>