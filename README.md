# uballet


(https://github.com/MarkoVrljicak/uballet/actions/workflows/unit-test.yml/badge.svg)
ERC-4337 compliant mobile wallet for Ethereum based blockchains


## First steps 

Instalar NodeJS: https://nodejs.org/en/download/package-manager

Instalar Expo

Desde el directorio raiz ejecutar `npm install expo`

Actualizar las dependencias `npx expo install --fix`

Para levantar el proyecto hay que correr `npx expo start`

## Entorno virtual

### Android 

Tener instalador Android Studio
Desde Android Studio > Tool > Device manager > Cretae virtual device > Elegir un emulador a gusto con una imagen API 34 (Android 14)

Para correr desde la terminal

> El comando emulator deberia instarse y ser agregado al entorno de la terminal cuando se hace la configuracion del Android Studio

`emulator -list-avds` para ver el listado de emuladores instalados

`emulator -avd $NOMBRE` para correr el emulador desde terminal 

### iOS

Tener instalado XCode. Cuando XCode solicite los tipos de proyectos a desarrollar tildar la opcion de `iOS`. Posterior a eso se va a descargar el simulador.

### Storybook

Para correr storybook se debe correr alguno de los dos scripts `npm run storybook:ios` o `npm run storybook:android`.

Además, se debe incluir en el archivo `.env` una entrada `EXPO_PUBLIC_STORYBOOK=${STORYBOOK}`. Esto significa que la variable de ambiente

`STORYBOOK` que es seteada en los scripts mencionados previamente se hace disponible para la aplicación a través de la variable `EXPO_PUBLIC_STORYBOOK`.