var con = require('../config/config')

const getHomePage = (req,res)=>{
    let sql= "select * from products"
    con.query(sql,(err,row) =>
    {
        console.log(row)
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(req.session.user)
            {
                let user = req.session.user;
                console.log(user,"---------");
                res.render('index',{user,row});
            }
            else{
                res.render('index',{row});
            }
        }
    })     
}
const getLoginPage = (req,res) => {
    res.render('users/login');
}
const getRegisterPage = (req,res) => {
    res.render('users/register');
}

const doRegister = (req,res) => {
    console.log(req.body);
    let qry = "insert into user set ?"
    con.query(qry,req.body,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            console.log('data inserted');
            res.redirect('/login');
        }
    })
}

const doLogin = (req,res) =>
{
    let {username} = req.body;
    let {password} = req.body;
    let quer = "select * from user where username = ? and password = ?";
    con.query(quer,[username,password],(err,result) =>{
        if(err)
        {
            console.log(err)
        }
        else{
            console.log(result)
            if(result.length>0)
            {
                console.log('login successfully');
                req.session.user = result[0];
                console.log(req.session.user,'from session data');
                res.redirect('/');
            }
            else
            {
                console.log("login error");
                res.redirect('/login');
            }
        }
    })
}

const getMyOrder = (req,res) =>
{
    let user = req.session.user;
    res.render('users/myOrder',{user});
}


const getlogout = (req,res) =>
{
    req.session.destroy();
    res.redirect('/');
}
module.exports = {
    getHomePage,
    getLoginPage,
    getRegisterPage,
    doRegister,
    doLogin,
    getMyOrder, 
    getlogout
}