<script setup>
import {onMounted, ref} from "vue";
import EditOrganizationDialog from "./EditOrganizationDialog.vue";
import DeleteOrganizationDialog from "./DeleteOrganizationDialog.vue";
import {useQuasar} from "quasar";
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
    name: "comment",
    label: "Комментарий",
    field: (row) => row.comment,
    align: "left",
  },
  {
    name: "actions",
    align: "center",
  },
];

const rows = ref([]);
const $q = useQuasar();
const auth = useAuthStore();

async function loadOrganizationsData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/organizations`, {credentials: 'include'});

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    rows.value = data.map((organization) => {
      return {
        id: organization.id,
        name: organization.name,
        comment: organization.comment || "—",
      };
    });
  } catch (err) {
    console.error(err);
  }
}

function openEditDialog(organizationId) {
  $q.dialog({
    component: EditOrganizationDialog,

    componentProps: {
      id: organizationId,
      persistent: true,
    },
  }).onOk(() => {
    loadOrganizationsData();
  });
}

function openDeleteDialog(organizationId) {
  $q.dialog({
    component: DeleteOrganizationDialog,

    componentProps: {
      id: organizationId,
      persistent: true,
    },
  }).onOk(() => {
    loadOrganizationsData();
  });
}

onMounted(() => {
  loadOrganizationsData();
});
</script>

<template>
  <div class="q-pa-md q-mx-auto" style="width: 900px; max-width: 90vw">
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
                 v-if="$can('update', 'Organization') || $can('delete', 'Organization') || auth.role === 'Администратор'">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="openEditDialog(props.row.id)"
                        v-if="$can('update', 'Organization') || auth.role === 'Администратор'">
                  <q-item-section>Редактировать</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openDeleteDialog(props.row.id)"
                        v-if="$can('delete', 'Organization') || auth.role === 'Администратор'">
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