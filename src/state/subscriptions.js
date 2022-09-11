import { api } from './api';

export const chargeSubscription = (callback) => api.subscribe({
    app: 'docket',
    path: '/charges',
    event: (data) => callback(data)
});