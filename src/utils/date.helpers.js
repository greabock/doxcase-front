export const formatDate = (dateString) => {

    const date = new Date( Date.parse(dateString));

    const day = date.getDate();
    const month = date.getMonth() - (-1);
    const year = date.getFullYear();

    const myDay = (day > 9) ? day : '0' + day;
    const myMonth = (month > 9) ? month : '0' + month;

    return `${myDay}.${myMonth}.${year}`;
}