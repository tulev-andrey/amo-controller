# amo-controller

TypeScript-клиент для [AmoCRM API v4](https://www.amocrm.ru/developers/content/crm_platform/api-reference): сделки, контакты, компании, задачи, заметки, воронки, пользователи, теги, события и др. Запросы идут через **axios**, ограничение частоты — **Bottleneck** (по умолчанию до 6 запросов в секунду).

## Установка

```bash
npm install
```

## Сборка

Компиляция в каталог `amo/` (см. `tsconfig.json`):

```bash
npm run build
```

Точка входа после сборки: `amo/index.js` (поле `main` в `package.json`).

## Использование

```ts
import Amo from 'amo-controller'

const amo = new Amo('https://example.amocrm.ru', 'access_token', {
  rps: 6,
  logs: {
    throwErrors: false,
    // customLogger: myWinstonLogger,
  },
})

const leads = await amo.leads.get({ limit: 50 })
```

- **`rps`** — целевое число запросов в секунду (лимитер на исходящие вызовы).
- **`logs.throwErrors`** — если `true`, ошибки HTTP после логирования пробрасываются дальше; иначе методы вроде `get` / `create` / `update` часто возвращают `null`.
- **`logs.customLogger`** — экземпляр winston вместо встроенного логгера.

## Скрипты

| Команда        | Назначение                    |
| -------------- | ----------------------------- |
| `npm run build` | Сборка TypeScript → `amo/`   |
| `npm run lint`  | Проверка ESLint               |
| `npm run lint:fix` | ESLint с автоисправлением  |
| `npm run format` | Prettier                      |
| `npm test`      | Запуск `index.test.ts` (нужен `.env`) |

## Локальная проверка API (`npm test`)

В корне создайте файл `.env`:

```env
API_URL=https://ваш-поддомен.amocrm.ru
API_TOKEN=долгосрочный_токен
```

Скрипт `index.test.ts` обращается к реальному API; используйте только на тестовом аккаунте.

## Разработка

- Исходники: `classes/`, `types/`, `utils/`.
- Статический анализ: **ESLint** (`eslint.config.mjs`) + **TypeScript** в режиме `strict`.

## Лицензия

ISC
