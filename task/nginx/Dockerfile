#выбираем базовый образ
FROM nginx:1.25.2

#удалим дефолтный пользовательский конфиг
RUN rm /etc/nginx/conf.d/default.conf
#также удалим главный конфиг 
RUN rm /etc/nginx/nginx.conf

#заменим удаленный главный конфиг собственным со своей машины
COPY ./nginx.conf /etc/nginx/nginx.conf
#копируем пользовательский конфиг, заменяя дефолтный, но под тем же именем
COPY ./for_docker.conf /etc/nginx/conf.d/default.conf

#создадим директорию ssl
RUN cd /etc/nginx && mkdir ssl
#и соответствующие директории тоже, в которые будут 
#копироваться/сохраняться файлы
RUN cd /etc/nginx/ssl/ && mkdir private && mkdir dhparam && mkdir certs && mkdir ca

#копируем еще одну штуку для шифрования
COPY ./dhparam.pem          /etc/nginx/ssl/dhparam/dhparam.pem
#этот сертификат создадим позже
#COPY ./ca.crt               /etc/nginx/ssl/ca/ca.crt

#если мы создадим самоподписанный сертификат на своем компе
#и тупо скопируем в образ, то получим ошибку при сборке,
#ибо будет ругаться на невозможность прочесть и всё в этом духе.
#поэтому самоподписанный сертификат создадим прям в образе далее.
#а вот эти строки закомментим, и запомним что так просто копировать серт нельзя!
#COPY ./nginx-selfsigned.crt  /etc/nginx/ssl/certs/nginx-selfsigned.crt
#COPY ./nginx-selfsigned.key  /etc/nginx/ssl/private/nginx-selfsigned.key

#коируем 
#snippets: self-signed.conf  ssl-params.conf
COPY ./s*.conf              /etc/nginx/snippets/


#установим openSSL
RUN apt install openssl 

#установка sudo
RUN apt-get update && \
      apt-get -y install sudo

#создадим самоподписанный сертификат 
#и заполним поля во избежания появления интерактивного режима
RUN sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
 -keyout /etc/nginx/ssl/private/nginx-selfsigned.key \
 -out /etc/nginx/ssl/certs/nginx-selfsigned.crt \
 -subj "/C=RU/ST=Rostov Obl/L=Taganrog/O=WebBee/OU=DevOps Department/CN=teplinsky@sfedu.ru"

#скопируем серт еще в одну директорию
RUN cp /etc/nginx/ssl/certs/nginx-selfsigned.crt /etc/nginx/ssl/ca/ca.crt

#установим порт 
EXPOSE 80

#запустимся из-под суперюзера и перезапустим nginx, чекнем версию и проверим синтаксис
RUN sudo su
RUN sudo nginx -V
RUN sudo nginx -t
RUN sudo service nginx restart
