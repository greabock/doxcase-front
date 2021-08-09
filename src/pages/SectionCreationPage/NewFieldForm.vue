<template>
    <div v-if="isFieldModalVisible" class="mock-modal__wrapper">
        <div class="mock-modal__cont">
            <b class="mock-modal__closer" @click="setFieldModalVisible(false)">x</b>
            <div class="modal-win" id="modal-add-field">
                <div class="form-wrap">
                    <form>
                        <div class="h3 mb-4">Новое поле</div>
                        <div class="form-wrap__input-wrap form-group">
                            <label
                                ><span class="form-wrap__input-title">Выберите тип поля</span>
                                <select class="form-wrap__input form-select" name="select">
                                    <option value="Текстовое поле">Текстовое поле</option>
                                    <option value=" placeholder 1">placeholder 1</option>
                                    <option value=" placeholder 2">placeholder 2</option>
                                    <option value=" placeholder 3">placeholder 3</option>
                                    <option value=" placeholder 4">placeholder 4</option>
                                </select>
                            </label>
                        </div>
                        <!-- +e.input-wrap-->
                        <div class="form-wrap__input-wrap form-group">
                            <label
                                ><span class="form-wrap__input-title">Заголовок</span
                                ><input
                                    class="form-wrap__input form-control is-valid"
                                    name="text"
                                    type="text"
                                    placeholder="Заполните поле"
                                />
                            </label>
                        </div>
                        <!-- +e.input-wrap-->
                        <div class="form-wrap__input-wrap form-group">
                            <label
                                ><span class="form-wrap__input-title">Краткое описание поля</span
                                ><input
                                    class="form-wrap__input form-control is-invalid"
                                    name="text"
                                    type="text"
                                    placeholder="Заполните поле"
                                />
                            </label>
                        </div>
                        <!-- +e.input-wrap-->
                        <div class="col-6">
                            <div class="form-wrap__input-wrap form-group">
                                <label
                                    ><span class="form-wrap__input-title">Максимум символов для поля</span
                                    ><input
                                        class="form-wrap__input form-control is-invalid"
                                        name="text"
                                        type="text"
                                        placeholder="Заполните поле"
                                    />
                                </label>
                            </div>
                            <!-- +e.input-wrap-->
                        </div>
                        <label class="custom-input form-check"
                            ><input class="custom-input__input form-check-input" name="checkbox" type="checkbox" /><span
                                class="custom-input__text form-check-label"
                                >Обязательное поле</span
                            >
                        </label>
                        <label class="custom-input form-check"
                            ><input class="custom-input__input form-check-input" name="checkbox" type="checkbox" /><span
                                class="custom-input__text form-check-label"
                                >Отображать на карточке материала</span
                            >
                        </label>
                        <div class="text-center text-danger mb-3">Заполните все поля чтобы создать поле</div>
                        <button class="btn btn-primary w-100" type="submit" disabled="disabled">Добавить</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isFieldModalVisible: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, {emit}) {
        const setFieldModalVisible = (bool) => {
            emit('updateFieldModalVisible', bool);
        };
        return {
            setFieldModalVisible,
        };
    },
};
</script>

<style scoped>
INPUT::placeholder {
    color: #d6d6d6;
}
.mock-modal__wrapper {
    display: flex;
    z-index: 10;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
}
.mock-modal__cont {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 600px;
    background-color: #fff;
    padding: 32px;
    border-radius: 5px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.06);
}
.mock-modal__closer {
    display: block;
    position: absolute;
    font-size: 26px;
    line-height: 26px;
    top: 15px;
    right: 20px;
    cursor: pointer;
}

.mock-modal__buttons button:first-child {
    margin-right: 5px;
}
</style>
