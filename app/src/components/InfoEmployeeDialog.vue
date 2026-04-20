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

const fullName = ref('');
const birthDate = ref('');
const series = ref('');
const number = ref('');
const issue_date = ref('');
const subdivision_code = ref('');
const issuing_authority = ref('');
const region = ref('');
const locality = ref('');
const street = ref('');
const house = ref('');
const corps = ref('');
const apartment = ref('');
const organization = ref('');
const department = ref('');
const position = ref('');
const salary = ref('');
const operation_date = ref('');
const operation_type = ref('');
const files = ref([]);
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function loadEmployeeData(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/employees/detail/${id}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    fullName.value = `${data.last_name} ${data.first_name} ${data.patronymic}`;
    birthDate.value = date.formatDate(data.birth_date, 'DD.MM.YYYY');
    series.value = data.series;
    number.value = data.number;
    issue_date.value = date.formatDate(data.issue_date, 'DD.MM.YYYY');
    subdivision_code.value = data.subdivision_code;
    issuing_authority.value = data.issuing_authority;
    region.value = data.region;
    locality.value = data.locality;
    street.value = data.street;
    house.value = data.house;
    corps.value = data.corps;
    apartment.value = data.apartment;
    organization.value = data.organization_name;
    department.value = data.department_name;
    position.value = data.position_name;
    salary.value = data.salary;
    operation_date.value = date.formatDate(data.operation_date, 'DD.MM.YYYY');
    operation_type.value = data.operation_type;
  } catch (err) {
    console.error(err);
  }
}

async function loadFilesData(id) {
  try {
    const params = {
      employee: id
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/files?${new URLSearchParams(params).toString()}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    files.value = await response.json();
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadEmployeeData(props.id);
  loadFilesData(props.id);
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 60vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Информация о сотруднике</h5>
        </q-card-section>
        <q-card-section>
          <div class="column q-col-gutter-sm">
            <div>
              <span class="text-weight-bold text-subtitle1">ФИО: </span>
              <span class="text-body1">{{ fullName }}</span>
            </div>
            <div class="q-pb-sm">
              <span class="text-weight-bold text-subtitle1">Дата рождения: </span>
              <span class="text-body1">{{ birthDate }}</span>
            </div>
            <q-separator class="q-pa-none"/>
            <div class="row" style="height: 34px">
              <div class="col-6">
                <span class="text-weight-bold text-subtitle1">Серия: </span>
                <span class="text-body1">{{ series }}</span>
              </div>
              <div class="col-6">
                <span class="text-weight-bold text-subtitle1">Номер: </span>
                <span class="text-body1">{{ number }}</span>
              </div>
            </div>
            <div class="row" style="height: 36px">
              <div class="col-6">
                <span class="text-weight-bold text-subtitle1">Дата выдачи: </span>
                <span class="text-body1">{{ issue_date }}</span>
              </div>
              <div class="col-6">
                <span class="text-weight-bold text-subtitle1">Код подразделения: </span>
                <span class="text-body1">{{ subdivision_code }}</span>
              </div>
            </div>
            <div class="q-pb-sm">
              <span class="text-weight-bold text-subtitle1">Кем выдан: </span>
              <span class="text-body1">{{ issuing_authority }}</span>
            </div>
            <q-separator class="q-pa-none"/>
            <div>
              <span class="text-weight-bold text-subtitle1">Регион: </span>
              <span class="text-body1">{{ region }}</span>
            </div>
            <div>
              <span class="text-weight-bold text-subtitle1">Населённый пункт: </span>
              <span class="text-body1">{{ locality }}</span>
            </div>
            <div v-if="street">
              <span class="text-weight-bold text-subtitle1">Улица: </span>
              <span class="text-body1">{{ street }}</span>
            </div>
            <div class="row q-pb-sm" style="height: 44px">
              <div class="col-4">
                <span class="text-weight-bold text-subtitle1">Дом: </span>
                <span class="text-body1">{{ house }}</span>
              </div>
              <div class="col-4" v-if="corps">
                <span class="text-weight-bold text-subtitle1">Корпус: </span>
                <span class="text-body1">{{ corps }}</span>
              </div>
              <div class="col-4" v-if="apartment">
                <span class="text-weight-bold text-subtitle1">Квартира: </span>
                <span class="text-body1">{{ apartment }}</span>
              </div>
            </div>
            <q-separator class="q-pa-none"/>
            <div>
              <span class="text-weight-bold text-subtitle1">Организация: </span>
              <span class="text-body1">{{ organization }}</span>
            </div>
            <div>
              <span class="text-weight-bold text-subtitle1">Отдел: </span>
              <span class="text-body1">{{ department }}</span>
            </div>
            <div>
              <span class="text-weight-bold text-subtitle1">Должность: </span>
              <span class="text-body1">{{ position }}</span>
            </div>
            <div>
              <span class="text-weight-bold text-subtitle1">Зарплата: </span>
              <span class="text-body1">{{ salary }}₽</span>
            </div>
            <div>
              <span class="text-weight-bold text-subtitle1">Дата последнего изменения: </span>
              <span class="text-body1">{{ operation_date }}</span>
            </div>
            <div class="q-pb-sm">
              <span class="text-weight-bold text-subtitle1">Последнее изменение: </span>
              <span class="text-body1">{{ operation_type }}</span>
            </div>
            <q-separator class="q-pa-none"/>
            <div>
              <span class="text-weight-bold text-subtitle1">Файлы:</span>
              <q-list dense bordered padding class="rounded-borders">
                <q-item v-for="file in files" :href="file.URL" clickable v-ripple>
                  <q-item-section>{{ file.name }}</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <div class="row justify-end q-mt-md">
          <q-btn
              color="primary"
              @click="onDialogOK"
              label="Закрыть"
              class="q-ml-auto"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>