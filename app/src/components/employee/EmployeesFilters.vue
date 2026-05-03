<template>
  <div class="column q-gutter-y-md">
    <div class="row justify-center">
      <div class="col-5">
        <q-input
            class="font"
            filled
            debounce="300"
            v-model="search"
            placeholder="Поиск по ФИО"
        >
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-5">
        <div class="row q-col-gutter-x-md">
          <div class="col-6">
            <q-select filled v-model="department" :options="departmentsOptions" option-value="id" option-label="name"
                      label="Отдел"/>
          </div>
          <div class="col-6">
            <q-select filled v-model="position" :options="positionsOptions" option-value="id" option-label="name"
                      label="Должность"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-5">
        <div class="row q-col-gutter-x-md">
          <div class="col-6">
            <q-btn
                class="full-width"
                color="indigo-1"
                text-color="black"
                label="Очистить"
                @click="reset"
            />
          </div>
          <div class="col-6">
            <q-btn class="full-width" color="primary" label="Найти" @click="applyFilter"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useEmployeesFilterStore} from "../../stores/employees.js";

const filter = useEmployeesFilterStore();
const search = ref("");
const department = ref(null);
const position = ref(null);
const departmentsOptions = ref([]);
const positionsOptions = ref([]);

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

function reset() {
  search.value = "";
  department.value = null;
  position.value = null;
  filter.$reset();
}

function applyFilter() {
  filter.$patch({
    name: search.value,
    department: department.value?.id,
    position: position.value?.id
  });
}

onMounted(() => {
  loadDepartmentsData();
  loadPositionsData();
});

onUnmounted(() => {
  filter.$reset();
});
</script>

<style scope>
.font {
  font-size: 16px;
}
</style>
