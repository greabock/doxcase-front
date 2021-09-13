<template>
  <div id="modal-add-field-not-required">
    <div class="form-wrap">
      <form @submit="submitHandle">
        <div>
          <span class="form-wrap__input-title">Аватар</span
          >
          <uploader-image
              v-model="fileInput"
              @click.stop.prevent
          ></uploader-image>
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
              v-model="emailValue"
              class="form-wrap__input form-control"
              type="text"
              placeholder="Введите e-mail"
          />
          </label>
          <span class="validation-error">{{emailError}}</span>
        </div>

        <div class="form-wrap__input-wrap form-group">
          <label
          ><span class="form-wrap__input-title">Логин</span
          ><input
              v-model="loginValue"
              class="form-wrap__input form-control"
              type="text"
              name="newUserLogin"
              placeholder="Введите"
              autocomplete="off"
              maxLength="30"
          />
          </label>
          <span class="validation-error">{{loginError}}</span>
        </div>
        <div class="form-wrap__input-wrap form-group">
          <label>
            <span
                class="form-wrap__input-title"
            >Пароль
            </span>
            <span
                class="pass-show-toggler"
                @click="isShowPass = !isShowPass"
            ><img
                width="20"
                height="20"
                :src="isShowPass ? '/img/svg/invisible.svg' : '/img/svg/visibility.svg'"
            >
            </span>
            <input
              v-show="!isShowPass"
              v-model="passwordValue"
              class="form-wrap__input form-control"
              type="password"
              name="newUserPassword"
              placeholder="Введите"
              autocomplete="off"
              maxLength="30"
          />
            <input
                v-show="isShowPass"
                v-model="passwordValue"
                class="form-wrap__input form-control"
                type="text"
                name="newUserPassword"
                placeholder="Введите"
                autocomplete="off"
                maxLength="30"
            />
          </label>
            <span class="validation-error">{{passwordError}}</span>
        </div>
        <button
            :disabled="!formMeta.valid"
            class="btn btn-primary w-100"
            type="submit"
        >
         Добавить
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
  emits: ['addNewUser', 'closeModal'],
  components: {VSelect, Loader, UploaderImage},
  setup(props, {emit}) {

    const isLoading = ref(false);
    const isShowPass = ref(false);

    const schema = yup.object({
      name: yup.string().required('Поле обязательно для заполнения'),
      role: yup.object().required('Поле обязательно для заполнения'),
      email: yup.string().email( 'Пожалуйста, введите корректный email-адрес')
          .required('Поле обязательно для заполнения'),
      login: yup.string().required('Поле обязательно лдоя заполнения'),
      password: yup.string()
          .min(6, "Длина пароля не менее 6 символов")
          .required('Поле обязательно для заполнения')
    });

    const {handleSubmit, meta: formMeta} = useForm({
      validationSchema: schema,
      initialValues: {
        role: {key: 'user', name: "Пользователь"}
      }
    });

    const {value: nameValue, errorMessage: nameError} = useField('name');
    const {value: roleValue} = useField('role');
    const {value: emailValue, errorMessage: emailError} = useField('email');
    const {value: loginValue, errorMessage: loginError} = useField('login');
    const {value: passwordValue, errorMessage: passwordError} = useField('password');
    const roleOptions = [
      {key: 'admin', name: "Администратор"},
      {key: 'moderator', name: "Модератор"},
      {key: 'user', name: "Пользователь"},
    ];

    const fileInput = ref(null);
    const photoUrl = ref(null);

    const addNewUser = async (user, photo) => {
      const userData = {
        ...user,
        role: user.role.key,
        photo
      };
        return await usersService.addUser(userData);
    };

    const submitHandle = handleSubmit(async (values) => {
      try {
        isLoading.value = true;
        if (fileInput.value) {
          const formData = new FormData();
          formData.append('files[]', fileInput.value)

          const imageResp = await filesService.uploadFiles(formData);
          photoUrl.value = imageResp[0].url;
        }

        const userResp = await addNewUser(values, photoUrl.value);
        console.log('NewUser: ', userResp.data);
        emit('addNewUser', userResp.data);
      } catch (e) {
        console.log(e);
      } finally {
        isLoading.value = false;
        emit('closeModal');
      }
    });

    return {
      addNewUser,
      formMeta,
      loginValue,
      emailValue,
      nameValue,
      passwordValue,
      roleValue,
      submitHandle,
      roleOptions,
      isLoading,
      fileInput,
      nameError,
      emailError,
      passwordError,
      loginError,
      isShowPass,
    };
  },
};
</script>

<style scoped>
.validation-error{
  color:#ff0000;
}
.pass-show-toggler{
  z-index: 10;
  position: absolute;
  top: 39px;
  right: 10px;
}
.validation-error {
  display: block;
  margin-top: 5px;
}
</style>

