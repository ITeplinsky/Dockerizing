#здесь видим многоступенчатую сборку (multi-stage builds) т.к. имеем 2 FROM
#устанавливаем базовый образ (что-то копируется необходимое для основной работы приложения)
FROM statping/statping:base AS base
#какая-то важная непереопределяемая переменная
ARG BUILDPLATFORM
# Statping main Docker image that contains all required libraries
#(тут насколько понял копируется для детальной настройки приложения)
FROM alpine:latest

#apk - Alpine Package Keeper -
#инструмент, предназначенный для эффективной работы в системах с ограниченными ресурсами.
#устанавливаем необходимые утилиты, при этом не кэшируем для уменьшения размера контейнера 
RUN apk --no-cache add libgcc libstdc++ ca-certificates curl jq && update-ca-certificates

#копируем из отдельно взятого образа (в данном случае base)
#нужные артефакты (всё, что появляется в процессе сборки).
#в данном случае копируем в 
COPY --from=base /go/bin/statping /usr/local/bin/
COPY --from=base /root/sassc/bin/sassc /usr/local/bin/
COPY --from=base /usr/local/share/ca-certificates /usr/local/share/

#устанавливаем рабочую директорию
WORKDIR /app

#том хранения данных - место где будут храниться
#данные, которые будут необходимы после перезапуска
#контейнера
VOLUME /app

#задаём энвы
ENV IS_DOCKER=true
ENV SASS=/usr/local/bin/sassc
ENV STATPING_DIR=/app
#указываем порт в контейнере
ENV PORT=8080

#указываем порт для контейнера из энвы
EXPOSE $PORT

#проверяем работоспособность контейнера на заданном порте.
#выводим ответ НЕ в формате json, а сразу направляем в поток вывода,
#и заодно проверяем код статуса ошибки (это не точно, но вроде б так)
HEALTHCHECK --interval=60s --timeout=10s --retries=3 CMD curl -s "http://localhost:$PORT/health" | jq -r -e ".online==true"

#запускаем приложение на определенном порту
CMD statping --port $PORT
