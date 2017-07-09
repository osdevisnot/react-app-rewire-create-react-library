const path = require('path');

const rewireCreateReactLibrary = (config, env) => {
  if (process.env.npm_lifecycle_script.includes('library')) {
    /**
     * Determine Library Name based on package name
     * basename will omit scope name from npm scoped packages
     */
    const libraryName = path.basename(process.env.npm_package_name);
    /**
     * Read the entry and output filename from package.json's module and main properties
     * Why? Read here: https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage
     */
    const entryFile = process.env.npm_package_module;
    const outFile = path.basename(process.env.npm_package_main);
    const outDir = process.env.npm_package_main.replace(outFile, '');
    /**
     * add library configurations to webpack config
     */
    config.output.library = libraryName;
    config.output.libraryTarget = 'commonjs';
    /**
     * Change the webpack entry and output path
     */
    config.entry = { [libraryName]: path.resolve(entryFile) };
    config.output.filename = outFile;
    config.output.path = path.resolve(outDir);
    /**
     * Add all package dependencies as externals as commonjs externals
     */
    let externals = {};
    Object.keys(process.env).forEach(key => {
      if (key.includes('npm_package_dependencies_')) {
        let pkgName = key.replace('npm_package_dependencies_', '');
        pkgName = pkgName.replace(/_/g, '-');
        // below if condition addresses scoped packages : eg: @storybook/react
        if (pkgName.startsWith('-')) {
          const scopeName = pkgName.substr(1, pkgName.indexOf('-', 1) - 1);
          const remainingPackageName = pkgName.substr(pkgName.indexOf('-', 1) + 1, pkgName.length);
          pkgName = `@${scopeName}/${remainingPackageName}`;
        }
        externals[pkgName] = `commonjs ${pkgName}`;
      }
    });
    config.externals = externals;
    /**
     * Clear all plugins from CRA webpack config
     */
    config.plugins = [];
  }
  return config;
};

module.exports = rewireCreateReactLibrary;
