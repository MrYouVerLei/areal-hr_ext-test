<script setup>
import {useQuasar} from "quasar";
import {onMounted, ref} from "vue";
import ChangePasswordDialog from "../components/ChangePasswordDialog.vue";

const fullName = ref('');
const login = ref('');
const userData = ref(null);
const $q = useQuasar();

function open() {
  $q.dialog({
    component: ChangePasswordDialog,

    componentProps: {
      userData: userData.value,
      persistent: true,
    },
  });
}

async function loadUserData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {credentials: 'include'});

    if (response.ok) {
      const data = await response.json();
      if (data.result) {
        userData.value = data.user;
        fullName.value = `${userData.value.last_name} ${userData.value.first_name} ${userData.value.patronymic}`;
        login.value = userData.value.login;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadUserData();
});
</script>

<template>
  <div class="q-mx-md q-pa-md q-gutter-md">
      <div class="column q-col-gutter-sm">
        <div>
          <span class="text-weight-bold text-subtitle1">ФИО: </span>
          <span class="text-body1">{{ fullName }}</span>
        </div>
        <div>
          <span class="text-weight-bold text-subtitle1">Логин: </span>
          <span class="text-body1">{{ login }}</span>
        </div>
        <div>
          <q-btn style="width: 300px" color="primary" label="Поменять пароль" @click="open"/>
        </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

</style>