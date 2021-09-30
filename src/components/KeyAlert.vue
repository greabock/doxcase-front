<template>
    <div
        class='key-alert-wrapper'
        :class="{
        'alert-visible': alertType !== 'not_expired',
        'license-expired': alertType === 'expired'
        }"
    >
        <div class='container-fluid'>
            <div
                v-if="alertType === 'pre_expired'"
                class='row'
            >
                <div class='col'>
                    <img class="alert-icon" src="/img/svg/alert.svg" />
                    <span>
                        Истекает срок действия лицензии {{formatDate(licenseEnd)}} г. Для продления свяжитесь по почте sample@sample.com
                    </span>
                </div>
                <div
                    class='col-auto key-modal-toggle'
                    @click="isKeyModal = true"
                >
                    <img class="key-icon" src="/img/svg/key.svg" />
                    Введите ключ
                </div>
            </div>
            <div
                v-if="alertType !== 'expired'"
                class='row'
            >
                <div class='col expired-license'>
                    <img class="alert-icon" src="/img/svg/alert_white.svg" />
                    <span>
                        Срок действия лицензии истек. Для продления свяжитесь по почте sample@sample.com
                    </span>
                </div>
                <div
                    class='col-auto key-modal-toggle'
                    @click="isKeyModal = true"
                >
                    <img class="key-icon" src="/img/svg/key_white.svg" />
                    Введите ключ
                </div>
            </div>
        </div>
    </div>
    <!-- Удаление группы -->
    <modal-window
        v-model="isKeyModal"
        maxWidth="480px"
    >
        <div class="modal-window__header">
            <h3>Активация продукта</h3>
        </div>
        <p class='alert-form-text'>Для продления свяжитесь по почте sample@sample.com или по номеру телефона +7 985 998 99 88</p>
        <form @submit="submitHandle">
            <div class="form-wrap__input-wrap form-group">
                <label
                >
                    <input
                        v-model="prodKeyValue"
                        class="form-wrap__input form-control"
                        type="text"
                        placeholder="Введите ключ"
                    />
                </label>
                <span class="validation-error">{{prodKeyError}}</span>
            </div>
            <div class="modal-window__buttons">
                <v-button
                    class="w-100"
                    :class="{'disabled': !formMeta.valid}"
                    type='submit'
                >Активировать</v-button>
            </div>
        </form>
    </modal-window>
</template>

<script>
import {ref, computed} from 'vue';
import ModalWindow from '@/components/ModalWindow';
import VButton from '@/ui/VButton';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';
import {formatDate} from '@/utils/date.helpers'

export default {
    props: {
        licenseInfo: {
            type: Object || null
        }
    },
    components: {
        ModalWindow,
        VButton
    },
    setup(props) {
        const licenseEnd = computed(() => {
            if (props.licenseInfo && props.licenseInfo.expires_at) {
                const dateArr =  props.licenseInfo.expires_at.split('-');
                dateArr[1] = dateArr[1] - 1;
                return new Date(...dateArr);
            }
            return null;
        });

        const currentTime = computed(() => {
            if (props.licenseInfo && props.licenseInfo.current_date) {
                const dateArr = props.licenseInfo.current_date.split('-');
                dateArr[1] = dateArr[1] - 1;
                return new Date(...dateArr);
            }
            return null;
        });

        const alertType = computed(() => {
            if (!props.licenseInfo) {
                return 'not_expired';
            }
            if ((licenseEnd.value - currentTime.value <= 0)) {
                return 'expired';
            } else if ((licenseEnd.value - currentTime.value <= 432000000)) {
                return 'pre_expired';
            } else {
                return 'not_expired';
            }
        });
        const isKeyModal = ref(false);

        const schema = yup.object({
            prodKey: yup.string().required('Добавьте ключ'),
        });

        const {handleSubmit, meta: formMeta} = useForm({
            validationSchema: schema,
        });

        const {value: prodKeyValue, errorMessage: prodKeyError} = useField('prodKey');

        const submitHandle = handleSubmit(async (values) => {
            try {
                await console.log('sending request', values);
            } catch (e) {
                    console.log(e.message)
            }
        });

        return {
            isKeyModal,
            ModalWindow,
            prodKeyValue,
            prodKeyError,
            formMeta,
            submitHandle,
            alertType,
            licenseEnd,
            formatDate
        }
    }
};
</script>
<style scoped>
.key-alert-wrapper {
    display: none;
    position: relative;
    z-index: 1000;
    align-items: center;
    height: 40px;
    font-size: 13px;
    color: #000;
    background-color: #FFDA59;
}
.alert-visible {
    display:flex;
}
.alert-icon {
    display: inline-flex;
    position: relative;
    top:-1px;
    margin-right: 10px;
}
.key-icon {
    margin-right: 10px;
}
.key-modal-toggle {
    cursor: pointer;
}
.alert-form-text {
    font-size: 13px;
}
.modal-window__buttons {
    padding-top: 0;
}

.license-expired.key-alert-wrapper {
    background-color: #FF6459;
    color:#fff;
}
</style>