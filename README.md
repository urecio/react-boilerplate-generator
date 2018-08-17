# REACT BOILERPLATE generator

The purpose of this generator is to generate! :D :D :D:
Jokes aside, it can generate routes, containers, components, etc... but also flows!

** IMPORTANT NOTE ** this can be adapted, but for now the generator works best with this scaffolding: [Counselling video chat app](https://github.com/mindsforlife/counselling-video-chat)

## Use:

* ```yarn generate container```: Will generate a container and optionally actions, sagas, constants, requests...

* ```yarn generate route``` For the moment just private routes (inside dashboard).

* Optionally you may want to add some scripts to your package.json, like:
```
    "generate-container": "cd ./node_modules/@rootcapital/react-boilerplate-generator && npm run generate container",
    "generate-component": "cd ./node_modules/@rootcapital/react-boilerplate-generator && npm run generate component",
    "generate-route": "cd ./node_modules/@rootcapital/react-boilerplate-generator && npm run generate route",
    "generate-async-flow": "cd ./node_modules/@rootcapital/react-boilerplate-generator && npm run generate async-flow",
```

## TODO:

* check if reducers, etc are already imported on the route for a container to prevent duplicates
* check if a resource name exists in a reducer before adding a duplicate
