# Welcome to Auth Service

## Project setup
- Clone the project on your local.
- Execute `npm insall` on the same path as of your root directory of the clonned / downloaded project.
- Create a `.env` file in the root diretory and add the following environment variables.
    - `PORT = 3000`

- Inside the `src/config` folder create a new file `config.json` and then add the following piece of json
- Environmen Variables
    - `PORT = <PORT>`
    - `DB_SYNC = true` use true when you want to sync your db else just comment it or remove it form `.env` file.
    - `FLIGHT_SERVICE_PATH='<FLIGHT SERVICE PATH/LINK>'` for example `'http://localhost:3000'`
