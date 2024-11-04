const fs = require('fs-extra');
const path = require('path');

const microservices = [
    '../session_microservice/src',
    '../user_microservice/src',
    '../auth_microservice/src',
    '../gateway_microservice/src'
];

const sourceDir = path.join(__dirname, '../protos');
const destinationDir = 'protos';

async function copyProtos() {
    for (const microservice of microservices) {
        const targetDir = path.join(__dirname, microservice, destinationDir);

        try {
            await fs.remove(targetDir);
            await fs.copy(sourceDir, targetDir);
            console.log(`Копирование в ${targetDir} выполнено.`);
        } catch (err) {
            console.error(`Ошибка при копировании в ${targetDir}:`, err);
        }
    }
}

copyProtos();