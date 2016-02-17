var sql = require("mssql");
var dbConfig = require('./dbconfig.js');
var con = new sql.Connection(dbConfig);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// express configuration
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended:true
}));
app.use(bodyParser.json({
    limit:'50mb'
}));


//CORS setting configugration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(80, function () {
    console.log("Server(localhost) is running...");
});

//mssql connect
con.connect().then(function () {
    console.log("SQL Server Connection is ok.");
    require('./controllers/customer_ctrl.js')(app, con);  

}).catch(function (err) {
    console.log(err);
    process.exit(0);
});