<script setup>
import {onMounted, ref} from "vue";
import {useQuasar} from "quasar";
import DeleteUserDialog from "./DeleteUserDialog.vue";
import EditUserDialog from "./EditUserDialog.vue";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";

const columns = [
  {
    name: "login",
    label: "Логин",
    field: (row) => row.login,
    align: "center",
    sortable: true,
  },
  {
    name: "fullName",
    label: "ФИО",
    field: (row) => row.fullName,
    align: "center",
    sortable: true,
  },
  {
    name: "role_name",
    label: "Роль",
    field: (row) => row.role_name,
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    align: "center",
  },
];

const rows = ref([]);
const $q = useQuasar();

async function loadUsersData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    rows.value = data.map((user) => {
      return {
        id: user.id,
        login: user.login,
        fullName: `${user.last_name} ${user.first_name} ${user.patronymic}`,
        role_name: user.role_name,
      };
    });
  } catch (err) {
    console.error(err);
  }
}

function openDeleteDialog(userId) {
  $q.dialog({
    component: DeleteUserDialog,

    componentProps: {
      id: userId,
      persistent: true,
    },
  }).onOk(() => {
    loadUsersData();
  });
}

function openEditDialog(userId) {
  $q.dialog({
    component: EditUserDialog,

    componentProps: {
      id: userId,
      persistent: true,
    },
  }).onOk(() => {
    loadUsersData();
  });
}

function openChangePasswordDialog(userId) {
  $q.dialog({
    component: ChangePasswordDialog,

    componentProps: {
      id: userId,
      persistent: true,
    },
  });
}

onMounted(() => {
  loadUsersData();
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
                <q-item clickable v-close-popup @click="openEditDialog(props.row.id)">
                  <q-item-section>Редактировать</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openChangePasswordDialog(props.row.id)">
                  <q-item-section>Поменять пароль</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openDeleteDialog(props.row.id)">
                  <q-item-section>Удалить</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style scoped lang="sass">
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