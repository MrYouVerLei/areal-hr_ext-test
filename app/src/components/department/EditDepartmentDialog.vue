<script setup>
import {useDialogPluginComponent} from "quasar";
import {onMounted, ref, watch} from "vue";

const props = defineProps({
  id: Number,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const formData = ref({
  name: '',
  comment: null,
  organization_id: null,
  parent_id: 0
});

const organizationsOptions = ref([]);
const departmentsOptions = ref([]);
const flag = ref(false);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function loadDepartmentData(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/departments/${id}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    formData.value.name = data.name;
    formData.value.comment = data.comment;
    formData.value.organization_id = data.organization_id;
    formData.value.parent_id = data.parent_id || 0;
  } catch (err) {
    console.error(err);
  }
}

async function saveDepartment(id) {
  try {
    const form = {
      ...formData.value,
      organization_id: Number(formData.value.organization_id),
      parent_id: formData.value.parent_id !== 0 ? Number(formData.value.parent_id) : null,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/departments/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify(form)
    });

    if (response.ok) {
      onDialogOK();
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadOrganizationsData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    organizationsOptions.value = data.map((organization) => {
      return {
        id: organization.id,
        name: organization.name,
      };
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadDepartmentsData(organizationId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/departments/tree/${organizationId}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    const options = data.map((department) => {
      return {
        id: department.id,
        name: department.name,
      };
    });

    departmentsOptions.value = [
      {
        id: 0,
        name: "Отсутствует"
      },
      ...options,
    ];
  } catch (err) {
    console.error(err);
  }
}

watch(() => formData.value.organization_id, (val) => {
  if (val) {
    if (flag.value) {
      formData.value.parent_id = 0;

    }
    loadDepartmentsData(formData.value.organization_id);
    if (!flag.value) {
      flag.value = true;
    }
  }
});

onMounted(() => {
  loadOrganizationsData();
  loadDepartmentData(props.id);
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 50vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Редактирование отдела</h5>
        </q-card-section>
        <q-form @submit="saveDepartment(props.id)">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                  outlined
                  v-model="formData.name"
                  label="Название"
                  :rules="[(val) => !!val || 'Поле обязательно']"
              />
            </div>
            <div class="col-12">
              <q-input outlined v-model="formData.comment" label="Комментарий"/>
            </div>
            <div class="col-12">
              <q-select outlined v-model="formData.organization_id" :options="organizationsOptions" option-value="id"
                        option-label="name"
                        label="Организация"
                        emit-value
                        map-options
                        :rules="[(val) => !!val || 'Поле обязательно']"/>
            </div>
            <div class="col-12">
              <q-select outlined v-model="formData.parent_id" :options="departmentsOptions" option-value="id"
                        option-label="name"
                        emit-value
                        map-options
                        label="Родительский отдел"/>
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