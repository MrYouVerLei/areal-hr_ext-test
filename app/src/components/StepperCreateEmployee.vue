<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 1000px; max-width: 80vw">
      <div class="q-pa-md">
        <q-card-section class="text-center">
          <h5 class="q-ma-none">Добавление сотрудника</h5>
        </q-card-section>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" title="Основные сведения" icon="person">
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <q-input
                  outlined
                  label="Фамилия"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-4">
                <q-input
                  outlined
                  label="Имя"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-4">
                <q-input outlined label="Отчество" />
              </div>

              <div class="col-4">
                <q-input
                  outlined
                  v-model="date"
                  label="Дата рождения"
                  mask="date"
                  :rules="[(val) => !!val || 'Поле обязательно', 'date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-step>

          <q-step :name="2" title="Адрес регистрации" icon="home">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  outlined
                  label="Регион"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  label="Населённый пункт"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-6">
                <q-input outlined label="Улица" />
              </div>
              <div class="col-2">
                <q-input
                  outlined
                  label="Дом"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-2">
                <q-input outlined label="Корпус" />
              </div>
              <div class="col-2">
                <q-input outlined label="Квартира" />
              </div>
            </div>
          </q-step>

          <q-step :name="3" title="Паспортные данные" icon="assignment_ind">
            <div class="row q-col-gutter-md">
              <div class="col-2">
                <q-input
                  outlined
                  label="Серия"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-3">
                <q-input
                  outlined
                  label="Номер"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-3">
                <q-input
                  outlined
                  label="Код подразделения"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-4">
                <q-input
                  outlined
                  v-model="date"
                  label="Дата выдачи"
                  mask="date"
                  :rules="[(val) => !!val || 'Поле обязательно', 'date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  outlined
                  label="Кем выдан"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
            </div>
            <div>
              <div class="text-subtitle1 q-pb-sm">
                Загрузите сканы/фото страниц 2-3, 5-12 (при заполненности):
              </div>
              <q-file
                v-model="files"
                label="Прикрепите файлы"
                filled
                multiple
                style="max-width: 300px"
                hint="Допустимые форматы: JPG, PNG, PDF"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </q-step>

          <q-step :name="4" title="Принятие на работу" icon="assignment">
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <q-select filled v-model="model" :options="options" label="Отдел" />
              </div>
              <div class="col-4">
                <q-select filled v-model="model" :options="options" label="Должность" />
              </div>
              <div class="col-4">
                <q-input
                  outlined
                  label="Зарплата"
                  :rules="[(val) => !!val || 'Поле обязательно']"
                />
              </div>
              <div class="col-4">
                <q-input
                  outlined
                  v-model="date"
                  label="Дата приёма"
                  mask="date"
                  :rules="[(val) => !!val || 'Поле обязательно', 'date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation class="row justify-end">
              <q-btn
                flat
                color="primary"
                @click="onDialogCancel"
                label="Отмена"
                class="q-mr-auto"
              />
              <q-btn
                v-if="step > 1"
                flat
                color="primary"
                @click="$refs.stepper.previous()"
                label="Назад"
                class="q-mr-sm"
              />
              <q-btn
                @click="next"
                color="primary"
                :label="step === 4 ? 'Завершить' : 'Далее'"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";

const props = defineProps({
  // ...your custom props
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const step = ref(1);
const stepper = ref(null);
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

function next() {
  if (step.value == 4) {
    onDialogOK();
  } else {
    stepper.value.next();
  }
}
</script>
