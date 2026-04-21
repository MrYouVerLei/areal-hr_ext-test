<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 1000px; max-width: 80vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Добавление сотрудника</h5>
        </q-card-section>
        <q-form @submit="createEmployee">
          <q-stepper v-model="step" ref="stepper" color="primary" animated>
            <q-step :name="1" title="Основные сведения" icon="person">
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <q-input
                      outlined
                      v-model="formEmployeeData.last_name"
                      label="Фамилия"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-4">
                  <q-input
                      outlined
                      v-model="formEmployeeData.first_name"
                      label="Имя"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-4">
                  <q-input outlined v-model="formEmployeeData.patronymic" label="Отчество"/>
                </div>

                <div class="col-4">
                  <q-input
                      outlined
                      v-model="formEmployeeData.birth_date"
                      label="Дата рождения"
                      mask="####-##-##"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                          <q-date v-model="formEmployeeData.birth_date" mask="YYYY-MM-DD" v-close-popup>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-step>

            <q-step :name="2" title="Адрес регистрации" icon="home">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                      outlined
                      v-model="formAddressData.region"
                      label="Регион"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-6">
                  <q-input
                      outlined
                      v-model="formAddressData.locality"
                      label="Населённый пункт"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-6">
                  <q-input outlined v-model="formAddressData.street" label="Улица"/>
                </div>
                <div class="col-2">
                  <q-input
                      outlined
                      v-model="formAddressData.house"
                      label="Дом"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-2">
                  <q-input outlined v-model="formAddressData.corps" label="Корпус"/>
                </div>
                <div class="col-2">
                  <q-input outlined v-model="formAddressData.apartment" label="Квартира"/>
                </div>
              </div>
            </q-step>

            <q-step :name="3" title="Паспортные данные" icon="assignment_ind">
              <div class="row q-col-gutter-md">
                <div class="col-2">
                  <q-input
                      outlined
                      v-model="formPassportData.series"
                      label="Серия"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-3">
                  <q-input
                      outlined
                      v-model="formPassportData.number"
                      label="Номер"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-3">
                  <q-input
                      outlined
                      v-model="formPassportData.subdivision_code"
                      label="Код подразделения"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
                <div class="col-4">
                  <q-input
                      outlined
                      v-model="formPassportData.issue_date"
                      label="Дата выдачи"
                      mask="####-##-##"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                          <q-date v-model="formPassportData.issue_date" mask="YYYY-MM-DD" v-close-popup>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                      outlined
                      v-model="formPassportData.issuing_authority"
                      label="Кем выдан"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  />
                </div>
              </div>
              <div>
                <div class="text-subtitle1 q-pb-sm">
                  Загрузите сканы/фото страниц 2-3, 5-12 (при заполненности):
                </div>
                <q-file
                    v-model="files"
                    label="Прикрепите файлы"
                    filled
                    multiple
                    style="max-width: 300px"
                    hint="Допустимые форматы: JPG, PNG, PDF"
                    accept=".jpg .jpeg .png .pdf"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file"/>
                  </template>
                </q-file>
              </div>
            </q-step>

            <q-step :name="4" title="Принятие на работу" icon="assignment">
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <q-select filled v-model="department" :options="departmentsOptions" option-value="id"
                            option-label="name"
                            label="Отдел"/>
                </div>
                <div class="col-4">
                  <q-select filled v-model="position" :options="positionsOptions" option-value="id" option-label="name"
                            label="Должность"/>
                </div>
                <div class="col-4">
                  <q-input
                      outlined
                      v-model.number="formHrOperationData.salary"
                      label="Зарплата"
                      type="number"
                      :rules="[(val) => !!val || 'Поле обязательно',
                      (val) => val > 0 || 'Зарплата должна быть положительной']"
                  />
                </div>
                <div class="col-4">
                  <q-input
                      outlined
                      v-model="formHrOperationData.operation_date"
                      label="Дата приёма"
                      mask="####-##-##"
                      :rules="[(val) => !!val || 'Поле обязательно']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                        >
                          <q-date v-model="formHrOperationData.operation_date" mask="YYYY-MM-DD" v-close-popup>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation class="row justify-end">
                <q-btn
                    flat
                    color="primary"
                    @click="onDialogCancel"
                    label="Отмена"
                    class="q-mr-auto"
                />
                <q-btn
                    v-if="step > 1"
                    flat
                    color="primary"
                    @click="$refs.stepper.previous()"
                    label="Назад"
                    class="q-mr-sm"
                />
                <q-btn
                    @click="step === 4 ? null : $refs.stepper.next()"
                    color="primary"
                    :type="step === 4 ? 'submit' : 'button'"
                    :label="step === 4 ? 'Завершить' : 'Далее'"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

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

const formAddressData = ref({
  region: '',
  locality: '',
  street: '',
  house: '',
  corps: '',
  apartment: ''
});

const formPassportData = ref({
  series: '',
  number: '',
  issue_date: null,
  subdivision_code: '',
  issuing_authority: ''
});

const formEmployeeData = ref({
  last_name: '',
  first_name: '',
  patronymic: '',
  birth_date: null
});

const formHrOperationData = ref({
  salary: 0,
  operation_type: 'Принятие на работу',
  operation_date: null
});

const files = ref([]);
const department = ref(null);
const position = ref(null);
const departmentsOptions = ref([]);
const positionsOptions = ref([]);
const step = ref(1);
const stepper = ref(null);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function loadDepartmentsData() {
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
  } catch (err) {
    console.error(err);
  }
}

async function loadPositionsData() {
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
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadDepartmentsData();
  loadPositionsData();
});

async function createEmployee() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        ...formEmployeeData.value,
        address: formAddressData.value,
        passport: formPassportData.value
      })
    });

    if (response.ok) {
      const data = await response.json();
      await createFiles(data.id);
      await createHrOperation(data.id);
      onDialogOK();
    }
  } catch (err) {
    console.error(err);
  }
}

async function createFiles(employeeId) {
  const formData = new FormData();
  formData.append("employee_id", employeeId);

  files.value.forEach((item) => {
    formData.append("files", item);
  });

  const response = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    throw Error("Ошибка загрузки файлов");
  }
}

// переделать: закинуть в создание сотрудника
async function createHrOperation(employeeId) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/hr-operations`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({
      ...formHrOperationData.value,
      employee_id: employeeId,
      department_id: department.value.id,
      position_id: position.value.id
    })
  });

  if (!response.ok) {
    throw Error("Ошибка создания кадровой операции");
  }
}
</script>
