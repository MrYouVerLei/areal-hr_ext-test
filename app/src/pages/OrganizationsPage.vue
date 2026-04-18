<template>
  <div class="q-pa-md q-gutter-md">
    <div class="q-mx-xl q-px-xl">
      <OrganizationsTable :key="componentKey"/>
    </div>
    <div class="fixed-bottom-right q-pa-lg">
      <q-btn round color="primary" icon="add" size="lg" @click="open"/>
    </div>
  </div>

</template>

<script setup>
import OrganizationsTable from "../components/OrganizationsTable.vue";
import {useQuasar} from "quasar";
import CreateOrganizationDialog from "../components/CreateOrganizationDialog.vue";
import {ref} from "vue";

// переменная для колхозного обновления дочернего компонета (таблицы)
const componentKey = ref(0);
const $q = useQuasar();

function open() {
  $q.dialog({
    component: CreateOrganizationDialog,

    componentProps: {
      text: "something",
      persistent: true,
    },
  }).onOk(() => {
    componentKey.value++;
  });
}
</script>

<style lang="sass">

</style>
