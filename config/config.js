
var mysql = require('mysql');
var con = mysql.createConnection(
{
    host:'localhost',
    user:'root',
    database:'Ecommerce'
})
con.connect((err)=>
{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log('Connected..')
    }
}
);

module.exports = con;