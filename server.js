var express = require('express'),
    app = express();

app.use(express.static('./src'));

// app.get('*', function (req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.listen(3000);