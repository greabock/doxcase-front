export function adminGuard(to, from, next) {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
        next('/profile');
    } else {
        next();
    }
}

export function authGuard(to, from, next) {
    const token = localStorage.getItem('token');
    if (!token) {
        next('/auth');
    } else {
        next();
    }
}