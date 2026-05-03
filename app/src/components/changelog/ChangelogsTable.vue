<script setup>
import {onMounted, ref} from "vue";
import {useChangelogsFilterStore} from "../../stores/changelogs.js";

const columns = [
  {
    name: "dateTime",
    label: "Время операции",
    field: (row) => row.date_time,
    align: "center",
    sortable: true,
  },
  {
    name: "user",
    label: "Кем изменено",
    field: (row) => row.user,
    align: "center",
    sortable: true,
  },
  {
    name: "objectType",
    label: "Объект",
    field: (row) => row.object_type,
    align: "center",
  },
  {
    name: "fieldName",
    label: "Поле",
    field: (row) => row.field_name,
    align: "center",
  },
  {
    name: "oldValue",
    label: "Старое значение",
    field: (row) => row.old_value,
    align: "center",
  },
  {
    name: "newValue",
    label: "Новое значение",
    field: (row) => row.new_value,
    align: "center",
  }
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});
const loading = ref(false)
const rows = ref([]);
const filter = useChangelogsFilterStore();

async function loadChangelogsData(props = null) {
  try {
    const {page, rowsPerPage} = props?.pagination || pagination.value;
    const params = {
      page: page,
      rowsPerPage: rowsPerPage,
    };
    loading.value = true

    if (filter.from) {
      params.from = filter.from;
    }
    if (filter.to) {
      params.to = filter.to;
    }
    if (filter.object) {
      params.object = filter.object;
    }
    if (filter.field) {
      params.field = filter.field;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/changelogs?${new URLSearchParams(params).toString()}`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const json = await response.json();

    rows.value = json.data.map((log) => {
      return {
        id: log.id,
        date_time: new Date(log.date_time).toLocaleString(),
        user: `${log.last_name} ${log.first_name} ${log.patronymic}`,
        user_login: log.login,
        object_type: log.object_type,
        field_name: log.field_name,
        old_value: log.old_value || 'null',
        new_value: log.new_value || 'null',
      };
    });

    pagination.value.rowsNumber = json.count;
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage

    loading.value = false
  } catch (err) {
    console.error(err);
  }
}

filter.$subscribe((mutation, state) => {
  pagination.value.page = 1;
  loadChangelogsData();
});

onMounted(() => {
  loadChangelogsData();
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
        row-key="index"
        :rows-per-page-options="[10, 20, 30, 50]"
        v-model:pagination="pagination"
        :loading="loading"
        @request="loadChangelogsData"
    >
      <template v-slot:body-cell-user="props">
        <q-td :props="props">
          <div class="my-table-details">
            {{ props.row.user }}
            <q-tooltip transition-show="scale" transition-hide="scale" class="bg-primary text-body2">
              Логин: {{ props.row.user_login }}
            </q-tooltip>
          </div>
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