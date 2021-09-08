<template>
    <div
        v-if="filteredFields?.length"
    >
      <div class="fw-500 pb-3" >Дата</div>
      <div
          v-for="item in dataOptions"
          :key="item.id"
      >
      <span class="custom-input__text form-check-label">{{item.title}}</span>
        <div class="data-values-cont">
          <v-date-picker
            class="mar-right-5"
            placeholder="От"
          >
          </v-date-picker>
          <v-date-picker
              placeholder="До"
          >
          </v-date-picker>
        </div>
      </div>
    </div>
</template>

<script>
import {computed, ref} from 'vue';
import VDatePicker from "@/ui/VDatePicker";

export default {
  components: {VDatePicker},
  props: {
    fieldsArray: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const filteredFields = computed(() => {
      return props.fieldsArray.filter((field) => field.type.name === 'Date');
    });

    const dataOptions = ref(props.modelValue);

    // const changeHandler = (cbValue) => {
    //   let updCheckboxes;
    //   if (props.modelValue.includes(cbValue)) {
    //     updCheckboxes = props.modelValue.filter(value => value !== cbValue);
    //   } else {
    //     updCheckboxes = props.modelValue.concat(cbValue);
    //   }
    //   emit('update:modelValue', updCheckboxes);
    // };

    return {
      filteredFields,
      dataOptions
      // changeHandler,
    }
  }
}
</script>

<style scoped>
.data-values-cont {
  display: flex;
}
.mar-right-5 {
  margin-right: 5px;
}
</style>