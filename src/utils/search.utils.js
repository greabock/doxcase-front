//Поисковая строка____________________________________
export const serialize = (obj, prefix) => {
    const str = [];

    for (const p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p)) {
            const k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                k + "=" + v);
        }
    }
    return str.join("&");
}
