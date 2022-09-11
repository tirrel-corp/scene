import { api } from './state/api';

export const chargeSubscription = (callback) => api.subscribe({
    app: 'docket',
    path: '/charges',
    event: (data) => callback(data)
});
}