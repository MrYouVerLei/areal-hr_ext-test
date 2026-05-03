<script setup>
import {useDialogPluginComponent} from "quasar";
import {ref} from "vue";

const props = defineProps({
  id: Number,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const password = ref('');
const isPwd = ref(true);
const isConfirmPwd = ref(true);
const confirmPassword = ref('');

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function changePassword() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${props.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        password: password.value
      })
    });

    if (!response.ok) {
      throw Error("Ошибка изменения пароля");
    }

    onDialogOK();
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 400px; max-width: 40vw">
      <div class="q-pa-md">
        <q-form @submit="changePassword()">
          <q-card-section class="text-center">
            <h5 class="q-ma-none">Изменение пароля</h5>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <q-input
                v-model="password"
                outlined
                label="Пароль"
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => !!val || 'Поле обязательно']"
            >
              <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-input
                v-model="confirmPassword"
                outlined
                label="Подтвердите пароль"
                :type="isConfirmPwd ? 'password' : 'text'"
                :rules="[(val) => !!val || 'Поле обязательно',
                  (val) => val === password || 'Пароли не совпадают']"
            >
              <template v-slot:append>
                <q-icon
                    :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isConfirmPwd = !isConfirmPwd"
                />
              </template>
            </q-input>
          </q-card-section>
          <div class="row justify-end q-mt-md">
            <q-btn
                flat
                color="primary"
                @click="onDialogCancel"
                label="Отмена"
                class="q-mr-auto"
            />
            <q-btn
                color="primary"
                label="Подтвердить"
                type="submit"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="sass">

</style>