export const sizeFormat = (size) => {
    const kb = size / 1024;
    const mb = kb / 1024;
    return mb > 0 ? `${kb.toFixed(2)} kb` : `${mb.toFixed(2)} mb`;
};