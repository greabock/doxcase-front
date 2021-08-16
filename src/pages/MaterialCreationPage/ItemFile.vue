<template>
    <div class="sAddDocs__item">
        <div class="container-fluid">
            <div class="sAddDocs__inner">
                <div class="sAddDocs__left">
                    <div class="sAddDocs__title-wrap">
                        <svg class="icon icon-doc">
                            <use xlink:href="/img/svg/sprite.svg#doc"></use>
                        </svg>
                        <div class="sAddDocs__title">
                            {{ data.name }} .{{ data.type }}
                            <span class="sAddDocs__size">
                                {{ data.size }}
                            </span>
                        </div>
                    </div>
                    <div class="sAddDocs__btns">
                        <div class="btn-edit-sm btn-secondary" @click="$emit('edit', data)">
                            <svg class="icon icon-edit">
                                <use xlink:href="/img/svg/sprite.svg#edit"></use>
                            </svg>
                        </div>
                        <div class="btn-edit-sm btn-danger" @click="$emit('delete')">
                            <svg class="icon icon-basket">
                                <use xlink:href="/img/svg/sprite.svg#basket"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        file: File,
        data: Object,
    },
}
</script>