<template>
  <div class="q-pa-md q-gutter-md">
    <div class="q-mx-xl q-px-xl">
      <PositionsTable :key="componentKey"/>
    </div>
    <div class="fixed-bottom-right q-pa-lg" v-if="$can('create', 'Position') || auth.role === 'Администратор'">
      <q-btn round color="primary" icon="add" size="lg" @click="open"/>
    </div>
  </div>

</template>

<script setup>
import {useQuasar} from "quasar";
import {ref} from "vue";
import PositionsTable from "../components/PositionsTable.vue";
import CreatePositionDialog from "../components/CreatePositionDialog.vue";
import {useAuthStore} from "../stores/auth.js";

// переменная для колхозного обновления дочернего компонета (таблицы)
const componentKey = ref(0);
const auth = useAuthStore();
const $q = useQuasar();

function open() {
  $q.dialog({
    component: CreatePositionDialog,

    componentProps: {
      persistent: true,
    },
  }).onOk(() => {
    componentKey.value++;
  });
}
</script>

<style lang="sass">

</style>
