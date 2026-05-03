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

const operationDate = ref(null);
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function deleteHrOperation(employeeId) {
  try {
    const responseEmployee = await fetch(`${import.meta.env.VITE_API_URL}/employees/detail/${employeeId}`, {credentials: 'include'});

    if (!responseEmployee.ok) {
      throw new Error("Ошибка получения данных");
    }

    const employeeData = await responseEmployee.json();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/hr-operations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        salary: Number(employeeData.salary),
        operation_type: 'Увольнение',
        operation_date: operationDate.value,
        employee_id: employeeId,
        department_id: employeeData.department_id,
        position_id: employeeData.position_id
      })
    });

    if (!response.ok) {
      throw Error("Ошибка создания кадровой операции");
    }

    await deleteEmployee(employeeId);
    onDialogOK();
  } catch (err) {
    console.error(err);
  }
}

async function deleteEmployee(employeeId) {
  try {
    const responseEmployee = await fetch(`${import.meta.env.VITE_API_URL}/employees/${employeeId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!responseEmployee.ok) {
      throw new Error("Ошибка удаления сотрудника");
    }
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 400px; max-width: 40vw">
      <div class="q-pa-md">
        <q-form @submit="deleteHrOperation(props.id)">
          <q-card-section class="text-center">
            <h5 class="q-ma-none">Увольнение сотрудника</h5>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <q-input
                outlined
                v-model="operationDate"
                mask="####-##-##"
                label="Дата увольнения"
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