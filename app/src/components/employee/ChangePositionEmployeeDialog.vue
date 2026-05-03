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

const position = ref(null);
const positionsOptions = ref([]);
const employeeData = ref(null);
const operationDate = ref(null);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function changePositionHrOperation(employeeId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/hr-operations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        salary: Number(employeeData.value.salary),
        operation_type: 'Изменение должности',
        operation_date: operationDate.value,
        employee_id: employeeId,
        department_id: employeeData.value.department_id,
        position_id: position.value
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

async function loadPositionsData(employeeId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/positions`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    positionsOptions.value = data.map((position) => {
      return {
        id: position.id,
        name: position.name,
      };
    });

    const responseEmployee = await fetch(`${import.meta.env.VITE_API_URL}/employees/detail/${employeeId}`, {credentials: 'include'});

    if (!responseEmployee.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    employeeData.value = await responseEmployee.json();

    if (employeeData.value.position_id) {
      position.value = employeeData.value.position_id;
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadPositionsData(props.id);
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 400px; max-width: 40vw">
      <div class="q-pa-md">
        <q-form @submit="changePositionHrOperation(props.id)">
          <q-card-section class="text-center">
            <h5 class="q-ma-none">Изменение должности</h5>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <q-select outlined v-model="position" :options="positionsOptions" option-value="id"
                      option-label="name"
                      label="Должность"
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