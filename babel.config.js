module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { ie: 11 }, useBuiltIns: "usage" }],
    "@babel/preset-typescript"
  ]
}
