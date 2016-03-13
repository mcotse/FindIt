var credentials = requrie('config.JSON');

var ddb = require('ddb.js').ddb({ accessKeyId:credentials.key, secretAccessKey: credentials.secretKey});

ddb.createTable('test',
  { hash: ['Item', ddb.schemaTypes().string],
  range: ['ItemPlural', ddb.schemaTypes().string],
  range: ['Location', ddb.schemaTypes().string],
  range: ['NumberInStock', ddb.schemaTypes().number]
  },
  {read: 10, write: 10}, function(err, details) {});
