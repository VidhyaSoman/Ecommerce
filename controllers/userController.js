var con = require('../config/config')
let Razorpay = require('../Payments/Razorpay')

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
                let id = user.id;
                console.log(user,"---------");
                let qryCart = "select count (*) as cartNumber from cart where userid = ?"
                con.query(qryCart,[id],(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        console.log(result[0].cartNumber,"cart....")
                        let cart = result[0].cartNumber;
                        res.render('index',{user,row,cart});
                    }
                })
                // res.render('index',{user,row});
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

const addtocart = (req,res) =>
{
    let productid = req.params.pid;
    let userid = req.session.user.id;
    let qry1 = "select * from cart where productid = ? and userid = ?"
    con.query(qry1,[productid,userid],(err,result) =>{
        if(err)
        {
            console.log(err)
        }
        else{
            if(result.length>0)
            {
                var qty = result[0].qty;
                let cartId = result[0].id;
                qty = parseInt(qty)+1;
                let qry2 = "update cart set qty = ? where id = ?"
                con.query(qry2,[qty,cartId],(err,row)=>
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        res.redirect('/')
                    }
                })
            }
            else{
                let qry3 = "insert into cart set ?"
                let data ={
                    productid,
                    userid
                }
                con.query(qry3,data,(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        res.redirect('/')
                    }
                })
            }
        }
    })
}

const buyNow = (req,res) =>{
    let pid = req.params.id;
    let qry = "select * from products where id = ?";
    con.query(qry,[pid],(err,result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else{
            let product =result[0];
            let user =req.session.user;
            res.render('users/singleView',{product,user});
        }
    })
}

const checkOut = (req,res) =>{
        let pid= req.params.id;
        let price = req.params.price;
        console.log(pid,price);
        var options = {
            amount: price,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          Razorpay.orders.create(options, function(err, order) {
            if(err)
            {
                console.log(err)
            }
            else{
            console.log(order);
            res.render('users/checkout',{order});
            }
    });
}

const payVerify = async(req,res) =>
{
    console.log(req.body);
    let data = req.body;
    var crypto = require('crypto');
    var order_id = data['response[razorpay_order_id]']
    var payment_id = data[ 'response[razorpay_payment_id]']
    const razorpay_signature = data[ 'response[razorpay_signature]']
    const key_secret = "53g2ihDVft0sBzrpnz3x0YAi";
    let hmac = crypto.createHmac('sha256', key_secret); 
    await hmac.update(order_id + "|" + payment_id);
    const generated_signature = hmac.digest('hex');
    if(razorpay_signature===generated_signature){
        console.log('verified')
    }
    else{
        console.log('failed')
    } 

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
    getlogout,
    addtocart,
    checkOut,
    payVerify,
    buyNow
}