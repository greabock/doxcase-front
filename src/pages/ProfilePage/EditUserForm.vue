<template>
    <div id="modal-add-field-not-required">
        <div class="modal-window__header">
            <h3>Редактирование пользователя</h3>
        </div>
        <div class="form-wrap">
            <form @submit="submitHandle">
                <div>
                  <span class="form-wrap__input-title">
                      Изображение профиля
                  </span>

                    <div class="uploader-image-wrapper">
                        <uploader-image
                            v-model="fileInput"
                            :preview="userPhoto"
                            @click.stop.prevent
                        ></uploader-image>
                        <span
                            v-if='userPhoto && !fileInput'
                            class='text-danger'
                            @click="removeUserPhoto"
                        >
                           Удалить
                        </span>
                    </div>


                </div>

                <div class="form-wrap__input-wrap form-group">
                    <label
                    ><span class="form-wrap__input-title">Фамилия Имя Отчество</span
                    ><input
                        v-model="nameValue"
                        class="form-wrap__input form-control"
                        type="text"
                        placeholder="Введите ФИО"
                    />
                    </label>
                    <span class="validation-error">{{nameError}}</span>
                </div>
                <!-- +e.input-wrap-->
                <div class="form-wrap__input-wrap form-group">
                    <label><span class="form-wrap__input-title">Роль</span></label>
                    <v-select
                        class="mb-3"
                        v-model="roleValue"
                        :options="roleOptions"
                        bordered
                    >
                    </v-select>
                </div>
                <!-- +e.input-wrap-->
                <div class="form-wrap__input-wrap form-group">
                    <label
                    ><span class="form-wrap__input-title">Почта</span
                    ><input
                        @input="emailOccupied = null"
                        v-model="emailValue"
                        class="form-wrap__input form-control"
                        type="text"
                        placeholder="Введите e-mail"
                    />
                    </label>
                    <span class="validation-error">{{emailError}}{{emailOccupied}}</span>
                </div>
                <button
                    :disabled="!formMeta.valid  || emailOccupied"
                    class="btn btn-primary w-100"
                    type="submit"
                >
                    Сохранить
                </button>
            </form>
        </div>
    </div>
    <loader
        v-show="isLoading"
    ></loader>
</template>

<script>
import {ref} from 'vue';
import {useField, useForm} from 'vee-validate';
import VSelect from '@/ui/VSelect';
import * as yup from 'yup';
import UploaderImage from '@/components/UploaderImage';
import filesService from "@/services/files.service";
import Loader from '@/components/Loader';
import usersService from '@/services/users.service';

export default {
    props: {
        user: {
            type: Object
        }
    },
    emits: ['updateUser', 'closeModal'],
    components: {VSelect, Loader, UploaderImage},
    setup(props, {emit}) {

        const isLoading = ref(false);
        const isShowPass = ref(false);
        const userPhoto = ref(props.user.photo);
        const removeUserPhoto = () => {
            userPhoto.value = null;
        }

        const schema = yup.object({
            name: yup.string().required('Поле обязательно для заполнения'),
            role: yup.object().required('Поле обязательно для заполнения'),
            email: yup.string().email( 'Пожалуйста, введите корректный email-адрес')
                .required('Поле обязательно для заполнения'),
        });

        const {handleSubmit, meta: formMeta, setValues} = useForm({
            validationSchema: schema,
            initialValues: {
                role: {key: 'user', name: "Пользователь"}
            }
        });

        const {value: nameValue, errorMessage: nameError} = useField('name');
        const {value: roleValue} = useField('role');
        const {value: emailValue, errorMessage: emailError} = useField('email');
        const roleOptions = [
            {key: 'admin', name: "Администратор"},
            {key: 'moderator', name: "Модератор"},
            {key: 'user', name: "Пользователь"},
        ];

        const defineRoleOption = (role) => {
            return roleOptions.find(item => item.key === role);
        }

        setValues({
            name: props.user.name,
            role:  defineRoleOption(props.user.role),
            email: props.user.email,
        });

        const fileInput = ref(null);

        const emailOccupied = ref(null);
        const updateUser = async (user, newPhoto) => {
            const userData = {
                ...user,
                role: user.role.key,
                photo: newPhoto
            };
            return await usersService.updateUser(props.user.id, userData);
        };

        const submitHandle = handleSubmit(async (values) => {
            try {
                isLoading.value = true;
                if (fileInput.value) {
                    const formData = new FormData();
                    formData.append('files[]', fileInput.value)

                    const imageResp = await filesService.uploadFiles(formData);
                    userPhoto.value = imageResp[0].url;
                }

                const userResp = await updateUser(values, userPhoto.value);
                emit('updateUser', userResp.data);
                isLoading.value = false;
                emit('closeModal');
            } catch (e) {
                if(e.message === 'email occupied') {
                    emailOccupied.value = 'Пользователь c таким e-mail уже существует';
                } else {
                    console.log(e.message)
                    emit('closeModal');
                }
            } finally {
                isLoading.value = false;
            }
        });

        return {
            updateUser,
            formMeta,
            emailValue,
            nameValue,
            roleValue,
            submitHandle,
            roleOptions,
            isLoading,
            fileInput,
            nameError,
            emailError,
            isShowPass,
            emailOccupied,
            userPhoto,
            removeUserPhoto,
        };
    },
};
</script>

<style scoped>
.validation-error{
    color:#ff0000;
}
.password-input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
}
.pass-show-toggler{
    z-index: 10;
    position: absolute;
    right: 15px;
}
.pass-show-toggler IMG {
    display: block;
}
.validation-error {
    display: block;
    margin-top: 5px;
}
.uploader-image-wrapper {
    display: flex;
    align-items: center;
}
.uploader-image-wrapper > SPAN {
    display: block;
    margin-bottom: 1rem;
    cursor: pointer;
    margin-left: 24px;
}
</style>

