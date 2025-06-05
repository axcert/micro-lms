// resources/js/Utils/routes.ts

/**
 * Simple route helper for frontend navigation
 * This provides a centralized place to manage all routes
 */

export const routes = {
    // Guest routes
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: (token: string) => `/reset-password/${token}`,
    
    // Authenticated routes
    dashboard: '/dashboard',
    profile: {
        edit: '/profile',
        update: '/profile',
        destroy: '/profile'
    },
    
    // Admin routes
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        reports: '/admin/reports'
    },
    
    // Teacher routes
    teacher: {
        dashboard: '/teacher/dashboard',
        batches: '/teacher/batches',
        classes: '/teacher/classes',
        quizzes: '/teacher/quizzes',
        quizCreate: '/teacher/quiz/create'
    },
    
    // Student routes
    student: {
        dashboard: '/student/dashboard',
        classes: '/student/classes',
        quizTake: (quizId: string | number) => `/student/quiz/${quizId}`,
        results: '/student/results'
    },
    
    // API routes
    api: {
        login: '/login',
        passwordEmail: '/forgot-password',
        passwordReset: '/reset-password',
        logout: '/logout'
    }
};

/**
 * Route helper function
 * Usage: route('login') or route('student.quizTake', 123)
 */
export const route = (routeName: string, params?: any): string => {
    const keys = routeName.split('.');
    let routeValue: any = routes;
    
    // Navigate through nested object
    for (const key of keys) {
        if (routeValue[key] !== undefined) {
            routeValue = routeValue[key];
        } else {
            console.warn(`Route '${routeName}' not found`);
            return '/';
        }
    }
    
    // If it's a function (for parameterized routes), call it with params
    if (typeof routeValue === 'function') {
        return routeValue(params);
    }
    
    return routeValue;
};

export default routes;