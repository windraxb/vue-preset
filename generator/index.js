module.exports = (api, options) => {
  const utils = require('./utils')(api);

  //  开发语言选择
  //  JS
  api.extendPackage({
    scripts: {
      "serve": "vue-cli-service serve --open",
      "build": "vue-cli-service build",
      "lint": "vue-cli-service lint",
      "bootstrap": "yarn --registry https://registry.npm.taobao.org || npm install --registry https://registry.npm.taobao.org || cnpm install",
      "inspect": "vue inspect > output.js --verbose",
      "reinstall": "rimraf node_modules && rimraf yarn.lock && rimraf package.lock.json && npm run bootstrap",
      "report": "vue-cli-service build --report",
      "svg": "vsvg -s ./src/icons/svg -t ./src/icons/components --ext js --es6"
    }
  })

  if (options.language === 'ts') {
    api.extendPackage({
      scripts: {
        'zip': 'node build/zip.ts'
      },
      dependencies: {
        'vue-class-component': '^7.2.2',
        'vue-property-decorator': '^8.3.0'
      },
      devDependencies: {
        "typescript": "~3.9.3"
      }
    })
  } else {
    api.extendPackage({
      scripts: {
        'zip': 'node build/zip.js'
      }
    });
  }

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
      "@vue/cli-plugin-babel": "^4.5.0",
      "@vue/cli-plugin-eslint": "^4.5.0",
      "@vue/cli-plugin-router": "^4.5.0",
      "@vue/cli-plugin-vuex": "^4.5.0",
      "@vue/cli-service": "^4.5.0",
      "@vue/eslint-config-standard": "^5.1.2",
      "archiver": "^5.1.0",
      "compression-webpack-plugin": "^6.1.1",
      "eslint": "^6.7.2",
      "eslint-plugin-import": "^2.20.2",
      "eslint-plugin-node": "^11.1.0",
      "eslint-plugin-promise": "^4.2.1",
      "eslint-plugin-standard": "^4.0.0",
      "eslint-plugin-vue": "^6.2.2",
      "less": "^3.0.4",
      "less-loader": "^5.0.0",
      "lint-staged": "^9.5.0",
      "script-ext-html-webpack-plugin": "^2.1.5",
      "vue-svgicon": "^3.2.9",
      "vue-template-compiler": "^2.6.11"
    }
  })

  if (options.language === 'ts') {
    api.extendPackage({
      devDependencies: {
        "@typescript-eslint/eslint-plugin": "^2.33.0",
        "@typescript-eslint/parser": "^2.33.0",
        "@vue/cli-plugin-typescript": "^4.5.0",
        "@vue/eslint-config-typescript": "^5.0.2",
      }
    })
  }

  // postcss
  api.extendPackage({
    postcss: {
      plugins: {
        autoprefixer: {}
      }
    }
  });

  if (options.language === 'ts') {
    api.render('ts-template')
  }
}