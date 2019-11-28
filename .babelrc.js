module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "plugins": [
    [
      "inline-dotenv", {
        "path": process.env.NODE_ENV === 'test' ? './.env.test': './.env'
      }
    ]
  ]
}
