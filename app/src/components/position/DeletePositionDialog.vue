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

const operationDate = ref(null);
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

async function deleteUser(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/positions/${id}?date=${operationDate.value}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error("Ошибка удаления должности");
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
        <q-form @submit="deleteUser(props.id)">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1">Все сотрудники будут уволены с данной должности по указанной дате.</div>
            <div class="text-subtitle1">Удалить должность?</div>
            <q-input
                outlined
                v-model="operationDate"
                mask="####-##-##"
                label="Дата удаления"
                :rules="[(val) => !!val || 'Поле обязательно']"
                class="q-mt-md"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                  >
                    <q-date v-model="operationDate" mask="YYYY-MM-DD" v-close-popup>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
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