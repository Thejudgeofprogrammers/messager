import { ClientOptions, Transport } from '@nestjs/microservices';

export const kafkaMicroservice: ClientOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: 'my-consumer-group',
        },
    },
};
