module.exports = {
  defaultSeverity: 'error',
  extends: ['@blueking/stylelint-config-bk'],
  "rules" : {
    "declaration-property-value-blacklist": {
      "/^border/": []
    }
  }
}
