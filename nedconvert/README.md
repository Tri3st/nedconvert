# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


## Layout

### Main Screen with layout and images (top and bottom)

    - Inlay with 
      - Two menu tabs
      - Login information - login will be done with supabase (free database)
      - center view
        - TOP
          - INPUT SECTION
              - two input on the eft 
                - type of currency
                - ammount
              - two inputs on the right 
                - type of currency
                - ammount
              - symbol in the middle
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

## STYLING 

### Colors 

darkblue background : #00263A

##  TODO