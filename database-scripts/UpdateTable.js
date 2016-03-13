var config = requrie('config.JSON');
var ddb = require('ddb.js').ddb({ accessKeyId:config.key, secretAccessKey: config.secretKey});


// put all the items inot the database
for (var i = 0, len = itemsJSON.length; i < len; ++i) {
  var item = config.itemsJSON[i];
  ddb.putItem('inventory', item, {}, function(err, res, cap) {});
}
