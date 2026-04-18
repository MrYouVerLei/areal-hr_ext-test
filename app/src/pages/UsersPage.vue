<script setup>
import UsersTable from "../components/UsersTable.vue";
import {useQuasar} from "quasar";
import {ref} from "vue";
import CreateUserDialog from "../components/CreateUserDialog.vue";

// переменная для колхозного обновления дочернего компонета (таблицы)
const componentKey = ref(0);
const $q = useQuasar();

function open() {
  $q.dialog({
    component: CreateUserDialog,

    componentProps: {
      text: "something",
      persistent: true,
    },
  }).onOk(() => {
    componentKey.value++;
  });
}
</script>

<template>
  <div class="q-pa-md q-gutter-md">
    <div class="q-mx-xl q-px-xl">
      <UsersTable :key="componentKey"/>
    </div>
    <div class="fixed-bottom-right q-pa-lg">
      <q-btn round color="primary" icon="add" size="lg" @click="open" />
    </div>
  </div>
</template>

<style scoped lang="sass">

</style>