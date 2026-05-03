<script setup>
import {useQuasar} from "quasar";
import {onMounted, ref} from "vue";
import ChangePasswordDialog from "../components/user/ChangePasswordDialog.vue";

const fullName = ref('');
const login = ref('');
const userId = ref(null);
const $q = useQuasar();

function open() {
  $q.dialog({
    component: ChangePasswordDialog,

    componentProps: {
      id: userId.value,
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
        userId.value = data.user.id;
        fullName.value = `${data.user.last_name} ${data.user.first_name} ${data.user.patronymic}`;
        login.value = data.user.login;
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