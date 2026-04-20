<script setup>
import {onMounted, ref} from "vue";
import {useEmployeesFilterStore} from "../stores/employees.js";
import {useQuasar} from "quasar";
import InfoEmployeeDialog from "./InfoEmployeeDialog.vue";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog.vue";

const columns = [
  {
    name: "fullName",
    label: "ФИО",
    field: (row) => row.fullName,
    align: "center",
    sortable: true,
  },
  {
    name: "department",
    label: "Отдел",
    field: (row) => row.department,
    align: "center",
  },
  {
    name: "position",
    label: "Должность",
    field: (row) => row.position,
    align: "center",
  },
  {
    name: "status",
    label: "Статус",
    field: (row) => row.status,
    align: "center",
  },
  {
    name: "actions",
    align: "center",
  },
];

const rows = ref([]);
const filter = useEmployeesFilterStore();

async function loadEmployeesData() {
  try {
    const params = {};
    if (filter.name) {
      params.name = filter.name;
    }
    if (filter.department) {
      params.department = filter.department;
    }
    if (filter.position) {
      params.position = filter.position;
    }
    const response = await fetch(`${import.meta.env.VITE_API_URL}/employees/detail?${new URLSearchParams(params).toString()}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    rows.value = data.map((employee) => {
      return {
        id: employee.id,
        fullName: `${employee.last_name} ${employee.first_name} ${employee.patronymic}`,
        department: employee.department_name || "—",
        position: employee?.position_name || "—",
        status: employee.deleted_at ? "Уволен" : "Работает",
      };
    });
  } catch (err) {
    console.error(err);
  }
}

const $q = useQuasar();

function openInfoDialog(employeeId) {
  $q.dialog({
    component: InfoEmployeeDialog,

    componentProps: {
      id: employeeId,
      persistent: true,
    },
  });
}

function openDeleteDialog(employeeId) {
  $q.dialog({
    component: DeleteEmployeeDialog,

    componentProps: {
      id: employeeId,
      persistent: true,
    },
  }).onOk(() => {
    loadEmployeesData();
  });
}

filter.$subscribe((mutation, state) => {
  loadEmployeesData();
});

onMounted(() => {
  loadEmployeesData();
});
</script>

<template>
  <div class="q-pa-md">
    <q-table
        class="my-sticky-dynamic"
        flat
        bordered
        :rows="rows"
        :columns="columns"
        :hide-bottom="true"
        row-key="index"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="more_vert">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="openInfoDialog(props.row.id)">
                  <q-item-section>Подробнее</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Редактировать</q-item-section>
                </q-item>
                <q-item v-if="props.row.status !== 'Уволен'" clickable v-close-popup @click="openDeleteDialog(props.row.id)">
                  <q-item-section>Уволить</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style lang="sass">
.my-sticky-dynamic
  height: 100%

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: $primary
    color: white
    font-size: 18px

  thead tr th
    position: sticky
    z-index: 1

  thead tr:last-child th
    top: 48px

  thead tr:first-child th
    top: 0

  tbody
    scroll-margin-top: 48px

  tbody tr td
    font-size: 15px
</style>