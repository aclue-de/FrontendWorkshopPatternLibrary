# Actions

This directory contains actions which are being used by the worklows here.

## Usage

The actions can be used just like any other locally defined action **after checkout**:

```yaml
- uses: actions/checkout@v2
- uses: ./actions/${NAME OF THE ACTION}
```

Do make sure you use a relative path (i.e. starting with `./`). Only then you can omit the version identifier 
for the action (e.g. the `@v2` in the checkout action).

## Development

### Updating an action

- `yarn build:watch` in this directory to start webpack in watchmode
- make a new commit. Check that webpack updated the `main.js` file in the updated action's `dist` directory
- push to any branch.

### Adding an action

- define a new entry in the webpack config
- create a directory containing an `action.yml` file
    - a good IDE will now offer content assist
    - make sure your main entrypoint for the action is "dist/main.js" because webpack
- from here on, see the 'Update an action' steps