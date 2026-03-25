# volga_residence_fe (Volga)

Пустой шаблон проекта на Nuxt 3 с Options API.

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

## Docker (production)

Сборка образа:

```bash
docker build -t volga-residence-fe .
```

Запуск контейнера:

```bash
docker run --rm -p 3000:3000 \
  -e NITRO_HOST=0.0.0.0 \
  -e NITRO_PORT=3000 \
  volga-residence-fe
```

Либо через compose:

```bash
docker compose up --build
```

### Переменные окружения

Публичные переменные Nuxt можно передавать через `NUXT_PUBLIC_*` (см. `nuxt.config.js` → `runtimeConfig.public`), например:

```bash
NUXT_PUBLIC_HOME_RESERVE_API_URL=
NUXT_PUBLIC_HOME_RESERVE_API_KEY=
NUXT_PUBLIC_YANDEX_MAPS_API_KEY=
NUXT_PUBLIC_APARTMENT_IDS=323833,333838
```

## Скрипты

- `npm run dev` — режим разработки
- `npm run build` — сборка для production
- `npm run preview` — просмотр production-сборки
- `npm run generate` — статическая генерация (SSG)

## Структура

- `app/app.vue` — корневой компонент приложения
- `app/pages/` — страницы (file-based routing)

Компоненты написаны в стиле Options API (`defineComponent` + `data`, `methods`, `computed` и т.д.).
