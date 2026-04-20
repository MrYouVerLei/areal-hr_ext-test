<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 1000px; max-width: 80vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Редактирование сотрудника</h5>
        </q-card-section>
        <q-card-section>
          <q-form @submit="saveEmployee">
            <div class="row q-col-gutter-md q-pb-md">
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
            <q-separator class="q-pa-none"/>
            <div class="row q-col-gutter-md q-py-md">
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
            <q-separator class="q-pa-none"/>
            <div class="row q-col-gutter-md q-py-md">
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
            <q-separator class="q-pa-none"/>
            <div class="column q-py-md q-gutter-md">
              <span class="text-subtitle1">Файлы:</span>
              <q-list v-if="files.length > 0" dense bordered padding class="rounded-borders">
                <q-item v-for="(file, index) in files" :href="file.URL" :key="file.id" clickable v-ripple>
                  <q-item-section>{{ file.name }}</q-item-section>
                  <q-item-section side>
                    <q-btn flat round icon="delete" color="negative" size="md"
                           @click.stop.prevent="deleteFiles(index, file.id)"/>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-file
                  v-model="newFiles"
                  label="Добавьте новые файлы"
                  filled
                  multiple
                  style="max-width: 300px"
                  hint="Допустимые форматы: JPG, PNG, PDF"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file"/>
                </template>
              </q-file>
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
                  color="primary"
                  label="Сохранить"
                  type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

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

const files = ref([]);
const newFiles = ref([]);
const removeFiles = ref([]);
const departmentsOptions = ref([]);
const positionsOptions = ref([]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

function deleteFiles(index, fileId) {
  files.value.splice(index, 1);
  removeFiles.value.push(fileId);
}

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

async function saveEmployee() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/employees/${props.id}`, {
      method: 'PUT',
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
      await saveFiles(data.id);
      onDialogOK();
    }
  } catch (err) {
    console.error(err);
  }
}

async function saveFiles(employeeId) {
  try {
    if (removeFiles.value.length > 0) {
      const responseDelete = await fetch(`${import.meta.env.VITE_API_URL}/files/array`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          ids: removeFiles.value
        })
      });

      if (!responseDelete.ok) {
        throw Error("Ошибка удаления файлов");
      }
    }

    if (newFiles.value.length > 0) {
      const formData = new FormData();
      formData.append("employee_id", employeeId);

      newFiles.value.forEach((item) => {
        formData.append("files", item);
      });

      const responseCreate = await fetch(`${import.meta.env.VITE_API_URL}/files`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!responseCreate.ok) {
        throw Error("Ошибка добавления файлов");
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadEmployeeData(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/employees/detail/${id}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    formEmployeeData.value.last_name = data.last_name;
    formEmployeeData.value.first_name = data.first_name;
    formEmployeeData.value.patronymic = data.patronymic;
    formEmployeeData.value.birth_date = date.formatDate(data.birth_date, 'YYYY-MM-DD');
    formPassportData.value.series = data.series;
    formPassportData.value.number = data.number;
    formPassportData.value.issue_date = date.formatDate(data.issue_date, 'YYYY-MM-DD');
    formPassportData.value.subdivision_code = data.subdivision_code;
    formPassportData.value.issuing_authority = data.issuing_authority;
    formAddressData.value.region = data.region;
    formAddressData.value.locality = data.locality;
    formAddressData.value.street = data.street;
    formAddressData.value.house = data.house;
    formAddressData.value.corps = data.corps;
    formAddressData.value.apartment = data.apartment;
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
  loadDepartmentsData();
  loadPositionsData();
  loadEmployeeData(props.id);
  loadFilesData(props.id);
});
</script>
