module.exports = [
  {
    name: 'language',
    type: 'list',
    message: 'Choose whether your develop language is a JS or TS(default: JS)',
    choices: [
      {
        name: 'JS',
        value: 'js'
      },
      {
        name: 'TS',
        value: 'ts'
      }
    ],
    default: 'js'
  },
  {
    name: 'application',
    type: 'list',
    message: 'Choose whether your app is a PC or a mobile(default:mobile)',
    choices: [
      {
        name: 'PC',
        value: 'pc'
      },
      {
        name: 'mobile',
        value: 'mobile'
      }
    ]
  }
]