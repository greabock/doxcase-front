export function adminGuard(to, from, next) {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
        next('/profile');
    } else {
        next();
    }
}
