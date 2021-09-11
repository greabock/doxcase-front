export function adminGuard(to, from, next) {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
        next('/forbidden');
    } else {
        next();
    }
}

export function authGuard(to, from, next) {
    const token = localStorage.getItem('token');
    if (!token) {
        next('/auth');
        // next('/auth');
    } else {
        next();
    }
}