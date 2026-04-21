<script setup>
import {onMounted, ref} from "vue";

const columns = [
  {
    name: "name",
    label: "Название",
    field: (row) => row.name,
    align: "center",
    sortable: true,
  }
];

const rows = ref([]);

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
    />
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