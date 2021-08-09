<template>
    <h1>Edit Section id: {{ $route.params.id }}</h1>
    <new-field-form></new-field-form>
</template>

<script>
import NewFieldForm from '../SectionCreationPage/NewFieldForm';
export default {
    components: {
        NewFieldForm,
    },
};
</script>

<style scoped></style>
