#!/bin/bash

# Инициализируем переменную для подсчета строк
total_lines=0

# Находим и подсчитываем строки в указанных файлах, исключая node_modules и dist
while IFS= read -r file; do
    echo "Обрабатываем файл: $file"  # Временный вывод
    lines=$(wc -l < "$file")  # Подсчитываем строки в текущем файле
    total_lines=$((total_lines + lines))  # Добавляем к общему количеству
done < <(find . -type f \( -name "*.ts" -o -name "*.proto" -o -name "*.prisma" -o -name "*.env" -o -name "*.yml" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/protos/*" ! -path "*/data/*")

# Выводим общее количество строк
echo "Общее количество строк кода: $total_lines"