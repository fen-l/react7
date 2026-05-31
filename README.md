# Лабораторная работа №7 Global State, API и CRUD

## Meta
Author: Анастасия Лавриеня  
Stack: React, TypeScript, Zod, Context API, useReducer

---

## Описание лабораторной работы

Данная лабораторная работа посвящена реализации глобального состояния приложения, работе с API и CRUD-операциями с использованием React, TypeScript, useReducer, Context API и Zod.

В рамках работы реализуется система авторизации с сохранением сессии через localStorage, а также каталог товаров с возможностью получения данных с внешнего API, создания, редактирования и удаления товаров.

Состояние приложения централизовано и разделено на два контекста: AuthContext для управления пользователем и ProductContext для управления товарами. Все изменения состояния выполняются через useReducer, что обеспечивает предсказуемость и единый поток данных.

Валидация данных выполняется через Zod, который используется как единый источник типов и правил проверки данных.

---

## Установка зависимостей

```bash
npm install
npm install zod classnames
```

## Контрольные вопросы

1. В чем концептуальное отличие **useReducer** от **useState**? В каких случаях предпочтительнее использовать первый? 
   useState используется для управления простым локальным состоянием, когда логика обновления состояния несложная. `useReducer` применяется в случаях, когда состояние имеет сложную структуру или когда логика его изменения включает множество различных сценариев (например CRUD, многошаговые формы, глобальное состояние). `useReducer` предпочтительнее, когда требуется централизованное управление состоянием через `actions` и `reducer`.

2. Какую роль выполняет функция **dispatch**? Почему мы передаем в нее объект с полем type? 
   dispatch используется для отправки action в reducer. Объект с полем type необходим для идентификации типа действия, чтобы reducer мог определить, какую именно логику обновления состояния необходимо выполнить через switch-case. Это основа паттерна Flux.

3. Почему запрос за списком товаров **(GET)** необходимо оборачивать в хук **useEffect**? Что произойдет, если вызвать **fetch** прямо в теле компонента? 
   `useEffect` используется для выполнения побочных эффектов после рендера компонента. Если вызвать `fetch` прямо в теле компонента, он будет выполняться при каждом рендере, что приведет к бесконечному циклу запросов и нестабильной работе приложения.

4. Объясните логику обновления **стейта** при удалении `(DELETE)` товара. Почему мы сначала ждем ответа от сервера, а затем вызываем `dispatch` с методом `.filter()`? 
   Сначала выполняется запрос к серверу для удаления товара, чтобы убедиться, что операция прошла успешно. После успешного ответа выполняется dispatch, который обновляет локальное состояние через filter, исключая удалённый элемент по id. Это обеспечивает иммутабельность состояния и согласованность UI с данными.

5. В чем разница между **POST и PUT** запросами в контексте добавления и изменения товара? 
   POST используется для создания нового ресурса, PUT используется для полного обновления существующего ресурса по id. В CRUD-логике POST соответствует Create, PUT соответствует Update.

6. Что возвращает метод `ProductSchema.safeParse(data)` в случае успеха и в случае провала валидации? 
   safeParse возвращает объект с полем success.

   При успехе:
     - success: true
     - data: валидированные данные

   При ошибке:
     - success: false
     - error: объект с информацией о причинах ошибки

   Метод `safeParse` не выбрасывает исключения, что делает его безопасным для UI.

7. Что делает конструкция `z.infer<typeof ProductSchema>` и какую проблему двойного написания кода она решает?

   `z.infer<typeof ProductSchema>` автоматически выводит `TypeScript` тип из `Zod` схемы. Это позволяет использовать одну схему как единственный источник истины для валидации и типизации, исключая дублирование интерфейсов и снижая риск рассинхронизации типов.

8. Как приложение «понимает», что пользователь авторизован, если он закрыл вкладку и открыл ее заново через час? Опишите механизм восстановления сессии.

   При запуске приложения `AuthProvider` проверяет наличие данных пользователя в `localStorage`. Если данные существуют, они загружаются и передаются в состояние через `LOGIN` action. Это позволяет восстановить состояние авторизации между сессиями без повторного входа пользователя.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
