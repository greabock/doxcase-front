export const sortByIndexUp = (item, arr) => {
    const idx = arr.indexOf(item);
    if (idx > 0) {
        const oldSort_index = arr[idx].sort_index;
        const newSort_index = arr[idx - 1].sort_index;
        const newUpItem = {...arr[idx], sort_index: newSort_index};
        const newDownItem = {...arr[idx - 1], sort_index: oldSort_index};
        return [...arr.slice(0, idx - 1), newUpItem, newDownItem, ...arr.slice(idx + 1)];
    }
    return arr;
};

export const sortByIndexDown = (item, arr) => {
    const idx = arr.indexOf(item);
    if (idx < arr.length - 1) {
        const oldSort_index = arr[idx].sort_index;
        const newSort_index = arr[idx + 1].sort_index;
        const newUpItem = {...arr[idx], sort_index: newSort_index};
        const newDownItem = {...arr[idx + 1], sort_index: oldSort_index};
        return [...arr.slice(0, idx), newDownItem, newUpItem, ...arr.slice(idx + 2)];
    }
    return arr;
};

export const findMaxFilterIdx = (arr) => {
    return arr.reduce((max, {filter_sort_index}) => {
        if (filter_sort_index === null || filter_sort_index < max) {
            return max;
        } else {
            return filter_sort_index
        }
    }, 1);
};