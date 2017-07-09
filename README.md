# react-app-rewire-create-react-library
Use create-react-app to build react libraries.

This gives you ability to reuse most of CRA setup for building your libraries.

## Installation
```
yarn add --dev react-app-rewire-create-react-library

# or use npm if you don't have yarn yet

npm install --save-dev react-app-rewire-create-react-library
```

## Usage
In the `config-overrides.js` you created for [react-app-rewired](https://github.com/timarney/react-app-rewired) add this code:

```
const rewireCreateReactLibrary = require('react-app-rewire-create-react-library');

module.exports = function override(config, env) {
  config = rewireCreateReactLibrary(config, env);
  return config;
};
```

In `package.json`, add a separate npm script to build library

```
{
  "scripts": {
    ...
    "build-library": "react-app-rewired build --library",
    ...
  }
}
```

And you can now use CRA to build your library 💪

## Conventions

The library name will be read from `name` property in your `package.json`. For scoped NPM packages, the scope name will be omited from library name.

The webpack entry file is read from `module` property in `package.json` and output file & path are read from `main` property in `package.json`. Why? [read here](https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage)

All the dependencies in your `package.json` will ba added to as commonjs externals to webpack config.

This package will be activated only when a `--library` flag is detected in npm script. This eliminated the need to maintain separate `config-overrides.js` for app and library builds.

## Caveats

Setting `main` file to be outside of `build` folder would cause CRA to throw error when reporting file sizes. To avoid this, always set `"main"` to be inside `build` folder. For example:
```
# GOOD: uses build directory for output
"main": "build/my-library.js",

# BAD: uses dist directory for output
"main": "dist/my-library.js",
```

`public` folder always gets copied over to build even for library builds. This is currently handled and defaulted inside CRA, there is no way to override this at the moment. However, you can use `.npmignore` to avoid publishing these files to NPM:
```
# .npmignore

**
!build/*.js
!build/*.map
```

## License
Licensed under the MIT License, Copyright @ 2017 osdevisnot. See LICENSE.md for more information.
