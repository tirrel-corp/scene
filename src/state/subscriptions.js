import { api } from './api';

export const chargeSubscription = (callback) => api.subscribe({
    app: 'docket',
    path: '/charges',
    event: (data) => callback(data)
});

export const allySubscription = (callback) => api.subscribe({
    app: "treaty",
    path: "/allies",
    event: (data) => callback(data)
})

export const treatySubscription = (callback) => api.subscribe({
    app: "treaty",
    path: "/treaties",
    event: (data) => callback(data)
})

export const harkSubscription = (callback) => api.subscribe({
    app: 'hark-store',
    path: '/updates',
    event: (data) => callback(data),
});
