# Cinema Booking System

Система онлайн-бронирования билетов в кинотеатр на Vue 3 с TypeScript.

## Технологии

- **Vue 3**
- **TypeScript**
- **Pinia**
- **Vue Router**
- **Vite**
- **Axios**

## Архитектура (Feature-Sliced Design)

```
src/
├── app/                    # Глобальные настройки приложения
├── pages/                  # Страницы приложения
├── features/               # Бизнес-фичи
│   ├── Ticket/             # Бронирование билетов
│   └── Schedule/           # Расписание сеансов
│
├── entities/               # Бизнес-сущности
│   ├── Booking/            # Бронирования
│   ├── Cinema/             # Кинотеатры
│   ├── Movie/              # Фильмы
│   └── MovieSession        # Киносеансы
│
├── shared/                 # Переиспользуемый код
│   ├── types/              # Типы
│   ├── ui/                 # UI-компоненты
│   └── utils/              # Утилиты
│
└── widgets/                # Самостоятельные виджеты
```

## Разработка

```bash
# Установка зависимостей
yarn install

# Запуск разработки
yarn dev

# Сборка проекта
yarn build

# Линтинг
yarn lint

# Запуск prettier
yarn lint
```
