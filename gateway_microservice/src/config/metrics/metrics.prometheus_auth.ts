import {
    makeCounterProvider,
    makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

export const prometheusProvidersAuth = [
    makeCounterProvider({
        name: 'PROM_METRIC_AUTH_LOGIN_TOTAL',
        help: 'Total number of login requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_AUTH_LOGIN_DURATION',
        help: 'Duration of login requests',
    }),
    makeCounterProvider({
        name: 'PROM_METRIC_AUTH_REGISTER_TOTAL',
        help: 'Total number of register requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_AUTH_REGISTER_DURATION',
        help: 'Duration of register requests',
    }),
    makeCounterProvider({
        name: 'PROM_METRIC_AUTH_LOGOUT_TOTAL',
        help: 'Total number of logout requests',
    }),
    makeHistogramProvider({
        name: 'PROM_METRIC_AUTH_LOGOUT_DURATION',
        help: 'Duration of logout requests',
    }),
];
