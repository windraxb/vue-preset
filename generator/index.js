module.exports = (api, options) => {
  const utils = require('./utils')(api);

  //  开发语言选择
  //  JS
  if (options.language === 'js') {
    api.extendPackage({
      scripts: {
        'serve': 'vue-cli-serve serve',
        'build': 'node build/index.js',
        'inspect': 'vue inspect > output.js --verbose'
      }
    })

    api.extendPackage({
      dependencies: {
        '@windraxb/cloud-utils': '*',
        '@windraxb/common-less': '*',
        'axios': '0.19.2',
        'normalize.css': '8.0.1',
        'vue': '^2.6.11',
        'vue-router': '3.2.0',
        'vuex': '^3.4.0'
      },
      devDependencies: {
        '@vue/eslint-config-prettier': '^6.0.0'
      }
    })
  }
}