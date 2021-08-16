<template>
    <div class="form-wrap__modal-win" id="modal-filter">
        <p class="fw-500">Фильтры для раздела</p>
        <div class="form-wrap__text small text-dark">
            Выберите допустимые для фильтрации поля&nbsp;из&nbsp;добавленных
        </div>
        <div ref="root" class="form-wrap__input-wrap form-group">
            <div class="form-wrap__input form-select toggle-dropdown" @click="isActive = !isActive">Выберите поле</div>
            <div :class="['form-wrap__dropdown', {active: isActive}]">
                <div v-for="(val, i) of options" :key="i" class="form-wrap__dropdown-item">
                    <label class="dropdown-custom-input">
                        <input v-model="modelOptions[i].isUsed" type="checkbox" name="" />
                        <span class="dropdown-custom-input__title"> {{ val }}</span>
                        <span class="dropdown-custom-input__circle"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="lines">
            <div v-for="(model, i) of usedOptions" :key="i" class="lines__item">
                <div class="lines__title">{{ model.name }}</div>
                <div class="lines__btns">
                    <div class="btn-edit-sm btn-white" @click="swap(model, 'up')">
                        <svg class="icon icon-chevron-up">
                            <use xlink:href="/img/svg/sprite.svg#chevron-up"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-white" @click="swap(model, 'down')">
                        <svg class="icon icon-chevron-down">
                            <use xlink:href="/img/svg/sprite.svg#chevron-down"></use>
                        </svg>
                    </div>
                    <div class="btn-edit-sm btn-edit-sm--minus btn-danger" @click="deleteEl(model)"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from '@vue/reactivity';
import {computed, onMounted, onUnmounted, watch} from '@vue/runtime-core';

function outsideSub(fn) {
    global.addEventListener('focusin', fn);
    global.addEventListener('click', fn);
}

function outsideUnsub(fn) {
    global.removeEventListener('focusin', fn);
    global.removeEventListener('click', fn);
}

export default {
    emits:['update'],
    setup(props, {emit}) {
        const options = ref(['Контрагент', 'Локация', 'Обучение', 'Файлы от менеджера']);
        const modelOptions = ref(
            options.value.map((x, i) => ({
                isUsed: false,
                name: x,
                order: i,
            }))
        );

        const usedOptions = computed(() =>
            modelOptions.value.filter((x) => x.isUsed).sort((a, b) => a.order - b.order)
        );

        const deleteEl = (model) => {
            model.isUsed = false;
        };

        const swap = (model, direction) => {
            const index = usedOptions.value.indexOf(model);
            const isSwap = direction === 'up' ? index !== 0 : index !== usedOptions.value.length - 1;

            if (isSwap) {
                const swapEl = direction === 'up' ? usedOptions.value[index - 1] : usedOptions.value[index + 1];
                [swapEl.order, model.order] = [model.order, swapEl.order];
            }
        };

        const isActive = ref(false);
        const root = ref(null);

        const hide = (event) => {
            if (!root.value.contains(event.target)) {
                isActive.value = false;
            }
        };

        watch(modelOptions, () => {
            emit('update', modelOptions);
        });

        onMounted(() => {
            outsideSub(hide);
        });

        onUnmounted(() => {
            outsideUnsub(hide);
        });

        return {options, isActive, root, usedOptions, modelOptions, deleteEl, swap};
    },
};
</script>
