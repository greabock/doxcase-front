export const defineAccessType = (access) => {
    let currentAccessOption;
    switch (access) {
        case 'all':
            currentAccessOption = {key: "all", name: "Всем"};
            break;
        case 'only':
            currentAccessOption = {key: "only", name: "Только определенным пользователям и группам"};
            break;
        case 'except':
            currentAccessOption = {key: "except", name: "Кроме определенных пользователей и групп"};
            break;
        default:
            currentAccessOption = {key: "all", name: "Всем"};
    }
    return currentAccessOption;
}

export const defineOptions = (arr) => {
    return arr.map(item => ({ name: item.name, key: item.id}))
        .sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
}