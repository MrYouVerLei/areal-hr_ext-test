<script setup>
import {onMounted, ref} from "vue";
import {useQuasar} from "quasar";
import EditPositionDialog from "./EditPositionDialog.vue";
import DeletePositionDialog from "./DeletePositionDialog.vue";
import {useAuthStore} from "../../stores/auth.js";

const columns = [
  {
    name: "name",
    label: "Название",
    field: (row) => row.name,
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
const auth = useAuthStore();

async function loadPositionsData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/positions`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    rows.value = data.map((position) => {
      return {
        id: position.id,
        name: position.name
      };
    });
  } catch (err) {
    console.error(err);
  }
}

function openEditDialog(positionId) {
  $q.dialog({
    component: EditPositionDialog,

    componentProps: {
      id: positionId,
      persistent: true,
    },
  }).onOk(() => {
    loadPositionsData();
  });
}

function openDeleteDialog(positionId) {
  $q.dialog({
    component: DeletePositionDialog,

    componentProps: {
      id: positionId,
      persistent: true,
    },
  }).onOk(() => {
    loadPositionsData();
  });
}

onMounted(() => {
  loadPositionsData();
});
</script>

<template>
  <div class="q-pa-md q-mx-auto" style="width: 500px; max-width: 50vw">
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
          <q-btn flat round icon="more_vert"
                 v-if="$can('update', 'Position') || $can('delete', 'Position') || auth.role === 'Администратор'">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="openEditDialog(props.row.id)"
                        v-if="$can('update', 'Position') || auth.role === 'Администратор'">
                  <q-item-section>Редактировать</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openDeleteDialog(props.row.id)"
                        v-if="$can('delete', 'Position') || auth.role === 'Администратор'">
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