/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { ie: 11 }, useBuiltIns: "usage", corejs: 3 }
    ],
    "@babel/preset-typescript"
  ]
}
