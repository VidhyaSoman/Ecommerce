var con = require('../config/config')

const getadminLogin = (req,res) =>
{
    res.render('Admin/adminLogin');
}

const login = (req,res) =>
{
    let username = 'admin';
    let password = '1234';
    if(req.body.username==username && req.body.password==password)
    {
        console.log('login succesfully');
        res.redirect('/admin/home');
    }
    else{
        console.log('login error');
        res.redirect('/admin');
    }
}

const getadminHome =(req,res) =>
{
    res.render('Admin/adminHome');
}

const addproductPage = (req,res) =>
{
    res.render('Admin/addProduct');
}

const addProduct = (req,res) =>
{
    // console.log(req.body);
    // console.log(req.files);
    let file = req.files.image;
    const {name} = req.files.image;
    req.body.image = name;
    console.log(req.body);
    var data = req.body;
    file.mv('public/images/Products/'+name,(err)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            let sql="insert into products set ?";
            con.query(sql,data,(err,row) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.redirect('/admin/addproduct');
                }
            })
        }
    })
}
module.exports = {
    getadminLogin,
    login,
    getadminHome,
    addproductPage,
    addProduct
}