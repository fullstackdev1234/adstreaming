Updated by Nat 03/08/21 7:17PM EST

# To build the project

First you have to clone or update the repo from Github....

Then rename the `.env.sample` file to `.env`, and update the contents based on your preferences. If you set the `SET_ONLY` to `true`, then the server will use the production data only, while `false` will show the development environment.

Then there are two ways to build the static files:

1. **Manual method:** This method might require some OS specific libraries to be installed separately, especially ones that are related to image manipulation. But after cloning run:
```sh
npm install
```
If it ran without errors, then run:
```sh
npm run build
npm run export
```

2. **Docker method:** This will install all the dependencies inside Docker, so no need to do any other manual setup:
```sh
docker-compose up --build
```
After the image is built and running, in another command-line tab run the following command:
```sh
docker exec -it \
$(docker ps -f name=omniscms_nuxt_frontend --format "{{.ID}}") \
ash -c "node ../node_modules/.bin/nuxt build && NUXT_PORT=3001 node ../node_modules/.bin/nuxt export"
```
