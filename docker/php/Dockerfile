FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev libzip-dev \
    libxml2-dev oniguruma-dev

RUN docker-php-ext-install \
    pdo_mysql zip gd opcache \
    bcmath mbstring xml

# Redis extension
RUN apk add --no-cache $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY backend /var/www

RUN composer install --no-dev --optimize-autoloader\
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache


RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000 
CMD ["php-fpm"]