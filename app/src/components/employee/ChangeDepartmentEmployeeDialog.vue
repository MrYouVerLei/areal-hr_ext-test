<script setup>
import {useDialogPluginComponent} from "quasar";
import {onMounted, ref} from "vue";

const props = defineProps({
  id: Number,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const department = ref(null);
const departmentsOptions = ref([]);
const employeeData = ref(null);
const operationDate = ref(null);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function changeDepartmentHrOperation(employeeId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/hr-operations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        salary: Number(employeeData.value.salary),
        operation_type: 'Изменение отдела',
        operation_date: operationDate.value,
        employee_id: employeeId,
        department_id: department.value,
        position_id: employeeData.value.position_id
      })
    });

    if (!response.ok) {
      throw Error("Ошибка создания кадровой операции");
    }

    onDialogOK();
  } catch (err) {
    console.error(err);
  }
}

async function loadDepartmentsData(employeeId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/departments`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    departmentsOptions.value = data.map((department) => {
      return {
        id: department.id,
        name: department.name,
      };
    });

    const responseEmployee = await fetch(`${import.meta.env.VITE_API_URL}/employees/detail/${employeeId}`, {credentials: 'include'});

    if (!responseEmployee.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    employeeData.value = await responseEmployee.json();

    if (employeeData.value.department_id) {
      department.value = employeeData.value.department_id;
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadDepartmentsData(props.id);
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 400px; max-width: 40vw">
      <div class="q-pa-md">
        <q-form @submit="changeDepartmentHrOperation(props.id)">
          <q-card-section class="text-center">
            <h5 class="q-ma-none">Изменение отдела</h5>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <q-select outlined v-model="department" :options="departmentsOptions" option-value="id"
                      option-label="name"
                      label="Отдел"
                      emit-value
                      map-options
                      :rules="[(val) => !!val || 'Поле обязательно']"/>
            <q-input
                outlined
                v-model="operationDate"
                mask="####-##-##"
                label="Дата изменения"
                :rules="[(val) => !!val || 'Поле обязательно']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                  >
                    <q-date v-model="operationDate" mask="YYYY-MM-DD" v-close-popup>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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