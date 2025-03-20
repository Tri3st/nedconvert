# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


## Layout

### Main Screen with layout and images (top and bottom)

LAYOUT:

    - Inlay with 
      - Two menu tabs
      - Login information - login will be done with supabase (free database)
      - center view
        - TOP
          - INPUT SECTION
              - two input on the left 
                - type of currency (select)
                - ammount
              - two inputs on the right 
                - type of currency (select)
                - ammount (read only)
              - symbol in the middle to convert
          - RESULTS SECTION
            - result of currency exchange for the left
            - result of currency exchange for the right
        - BOTTOM
          - graph showing the last days of that currency
          - choose between days/weeks/years

## Needed APIs :

  - currency exchange
    RapiApi is a free api provider that has some good free currency exchange api's
    Currency Conversion and Exchange has a free plan for 1000 requests free per month. This should do for now, but must be reviewed when using in production.
    (https://currency-conversion-and-exchange-rates.p.rapidapi.com)[Currency Conversion and Exchange]
- supabase for user management
    SUPABASE :
        - Nedconvert - users
                     - converts
    This can later be converted to a local postGres container for django, flask or fastAPI

    At this moment the users password is sent to the db unencrypted. This is NOT what we want! md5 or SHA256 hash it and then send it.

## STYLING

Try to use the colors from the example

## Tech

### Tech Stack

* Vue3  [Documentation](https://vuejs.org/)
* Vite [Documentation](https://vite.dev/)
* Ant-Design-Vue [Documentation](https://www.antdv.com/)

### Project Structure

```markdown
├── index.html
├── package.json
├── package-lock.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   └── vue.svg
│   ├── components
│   ├── MenuBar.vue
│   ├── MessageModal.vue
│       └── UserInfo.vue
│   ├── main.ts
│   ├── router.ts
│   ├── stores
│   │   ├── auth.ts
│   │   ├── convertHistory.ts
│   │   ├── currency.ts
│   │   └── message.ts
│   ├── style.css
│   ├── views
│   │   ├── ConvertView.vue
│   │   ├── CreateView.vue
│   │   ├── GraphView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   └── LogoutView.vue
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

### Packages

- **Ant-design for Vue** [Documentation](https://www.antdv.com/)
  - **Ant-design Icons for Vue** [Documentation](https://https://antdv.com/components/icon)
- **Supabase Javascript Library** [Documentation](https://https://github.com/supabase/supabase-js)
- **Axios** [Documentation](https://https://github.com/imcvampire/vue-axios#readme)
- **Vue Chartjs** [Documentation](https://https://vue-chartjs.org/)
  - **Chart.js** [Documentation](https://https://vue-chartjs.org/)
- **Moment** [Documentation](https://https://momentjs.com/) Alternative is dayjs. Both good
- **Pinia**  [Documentation](https://https://pinia.vuejs.org/)

##  TODO

- whenever we get the rates to calculate a conversion, we could send the data to our database. This way we get a better
    idea of what rates we used, when we calculated these and who calculated these.
- We can choose to do the user and currency API in our own backend. In django or other backend
- We need a better way of storing the user passwords. At the moment there is NO hashing-encryption, which is not really safe.
  - We could also choose a different way of managing user identities. (all-auth with django, 0auth, keycloak)
- The types are now all scattered in the various stores, we can gather them all in a separate folder. this is much cleaner.
- 