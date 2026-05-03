import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useChangelogsFilterStore = defineStore('changelogsFilter', () => {
    const from = ref('');
    const to = ref('');
    const object = ref('');
    const field = ref('');

    function $reset() {
        from.value = '';
        to.value = '';
        object.value = '';
        field.value = '';
    }

    return {from, to, object, field, $reset};
})