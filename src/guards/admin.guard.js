export function adminGuard(to, from, next) {
    const role = localStorage.getItem('role');
    console.log(to);
    if (role !== 'admin') {
        next('/profile');
    } else {
        next();
    }
}
