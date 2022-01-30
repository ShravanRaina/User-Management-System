const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

pool.getConnection((err, connection)=>{
    if (err) throw err; // not connected
    console.log('Connected as ID' + connection.threadId);
});


const routes = require('./server/routes/user');
app.use('/', routes);


app.listen(port, function(){
    console.log(`Listening on port ${port}`);
});
