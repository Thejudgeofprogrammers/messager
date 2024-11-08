import {
    makeCounterProvider,
    makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

export const prometheusProvidersUser = [
    makeCounterProvider({
        name: 'PROM_METRIC_USER_FIND_BY_ID_TOTAL',
        help: 'Total number of find user by ID requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_USER_FIND_BY_ID_DURATION',
        help: 'Duration of find user by ID requests',
    }),
    makeCounterProvider({
        name: 'PROM_METRIC_USER_FIND_BY_TAG_TOTAL',
        help: 'Total number of find user by tag requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_USER_FIND_BY_TAG_DURATION',
        help: 'Duration of find user by tag requests',
    }),
    makeCounterProvider({
        name: 'PROM_METRIC_USER_FIND_BY_PHONE_TOTAL',
        help: 'Total number of find user by phone requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_USER_FIND_BY_PHONE_DURATION',
        help: 'Duration of find user by phone requests',
    }),
    makeCounterProvider({
        name: 'PROM_METRIC_USER_FIND_BY_EMAIL_TOTAL',
        help: 'Total number of find user by email requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_USER_FIND_BY_EMAIL_DURATION',
        help: 'Duration of find user by email requests',
    }),
    makeCounterProvider({
        name: 'PROM_METRIC_USER_FIND_BY_USERNAME_TOTAL',
        help: 'Total number of find user by username requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_USER_FIND_BY_USERNAME_DURATION',
        help: 'Duration of find user by username requests',
    }),
];
