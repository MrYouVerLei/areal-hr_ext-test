<template>
  <div class="q-pa-md q-gutter-md">
    <ChangelogsFilters />
    <div class="q-mx-md q-px-md">
      <ChangelogsTable :key="componentKey"/>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import ChangelogsFilters from "../components/changelog/ChangelogsFilters.vue";
import ChangelogsTable from "../components/changelog/ChangelogsTable.vue";

const componentKey = ref(0);

</script>

<style lang="sass">

</style>
