# uballet

![Badge for react native unit tests](https://github.com/MarkoVrljicak/uballet/actions/workflows/unit-test.yml/badge.svg)

ERC-4337 compliant mobile wallet for Ethereum-based blockchains

## Development and setup

### First steps 

Install NodeJS: [NodeJS Download](https://nodejs.org/en/download/package-manager)

Install Expo

From the root directory, run `npm install expo`

Update dependencies `npx expo install --fix`

To start the project, run `npx expo start`

### Virtual environment

#### Android 

Have Android Studio installed
From Android Studio > Tool > Device manager > Create virtual device > Choose an emulator with an API 34 (Android 14) image

To run from the terminal

> The emulator command should be installed and added to the terminal environment when configuring Android Studio

`emulator -list-avds` to see the list of installed emulators

`emulator -avd $NAME` to run the emulator from the terminal 

#### iOS

Have XCode installed. When XCode asks for the types of projects to develop, select the `iOS` option. After that, the simulator will be downloaded.

#### Storybook

To run storybook, you must run one of the two scripts `npm run storybook:ios` or `npm run storybook:android`.

Also, you need to include an entry `EXPO_PUBLIC_STORYBOOK=${STORYBOOK}` in the `.env` file. This means that the environment variable `STORYBOOK` which is set in the previously mentioned scripts, is made available to the application through the variable `EXPO_PUBLIC_STORYBOOK`.

## Builds

Tu run a build command  you have to push your local changes to the remote repoitory and from the desired commit run

> eas build -p PLATFLORM --profile PROFILE

where PLATFLORM options are `ios` or `android` and PROFILE options are `development`, `preview` o `production`
