var credentials = requrie('config.JSON');

var ddb = require('ddb.js').ddb({ accessKeyId:credentials.key, secretAccessKey: credentials.secretKey});

var itemAsile;
// ddb.query('items', '', {}, function(err, res, cap) {
//   console.log(res);
// });

// res: { count: 23,
//        lastEvaluatedKey: { hash: '3d2d6963' },
//        items: [...] };

ddb.query('items', 'Apple Juice', {}, function(err, res, cap) {
  if (err){
    console.log(err);
  }
  if (res){
    itemAsile = res.items[0].Location;
    console.log(itemAsile);
  }
});
/*
var params = {
    TableName : "items",
    KeyConditionExpression: "#nm = :Name",
    ExpressionAttributeNames:{
        "#nm": "Name"
    },
    ExpressionAttributeValues: {
        ":Name":"Beer"
    }
};

ddb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(item);
        });
    }
});
*/
