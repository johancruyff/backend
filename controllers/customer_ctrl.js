var customer = require('../models/customer_mdl.js');

module.exports = function (app, con) {
    
    //login function
    app.post('/login' , function (req, res) {
        console.log("login params : " + JSON.stringify(req.body));
        var errors = [];
        
        //checking validation for email or phone
        if (req.body.email == null && req.body.phone == null) {
            errors[0] = {
                "param" : "email/phone",
                "msg": "Email or Phone is required."
            };
        }
        
        //checking validation for password
        if (req.body.password == null) {
            errors[errors.length] = {
                "param" : "password",
                "msg":"Password is required."
            };
        }
        if (errors.length > 0) {
            res.send({ err : errors });
        }
        req.body.con = con;
        
        //getting user from customer model with email/phone and password
        customer.login(req.body, function (ret) {
            if (ret.err != null) {  //if error have, please return error value.
                res.send(ret.err);
            } else {
                if (ret.user.length > 0) { //if user exists, return data of user.
                    res.send(ret.user[0]);
                } else {
                    res.send({  // if user don't exist, return error.
                    err : [{
                            "param" : "auth",
                            "msg"  :  "Email or Password is incorrect."    
                           }]
                    });
                }
            }
        });
    });
    
    //signup function
    app.post('/signup' , function (req, res) {
        console.log("signup params : " + JSON.stringify(req.body));
        var errors = [];
        
        //validation of some inputs such as firstName, lastName, email , password, phone number
        if (req.body.fname == null) {
            errors[0] = {
                "param" : "fname",
                "msg" : "firstName is required."
            };
        }
        if (req.body.lname == null) {
            errors[errors.length] = {
                "param" : "lname",
                "msg" : "lastName is required."
            };
        }
        if (req.body.password == null) {
            errors[errors.length] = {
                "param" : "password",
                "msg" : "Password is required."
            }
        }
        if (req.body.email == null) {
            errors[errors.length] = {
                "param" : "email",
                "msg" : "Email is required."
            };
        }
        if (req.body.phone == null) {
            errors[errors.length] = {
                "param" : "phone",
                "msg" : "Phone is required."
            }
        }
        if (errors.length > 0) {
            res.send(errors);
        }
        req.body.con = con;
        
        //add user in customer model from the above form data(firstName, lastName, phone, phoneNumber, email)
        customer.signup(req.body, function (err) {
            if (err) {
                res.send({
                    err : [{
                            "param" : "unknown",
                            "msg" : err.message
                        }]
                   });
            } else { //if adding user is success, login again and return user data from email, password
                customer.login(req.body, function (ret) {
                    if (ret.err != null) {
                        res.send({ err : ret.err });
                    } else {
                        if (ret.user.length > 0) {
                            res.send(ret.user[0]);
                        } else {
                            res.send({
                                err : [{
                                        "param" : "auth",
                                        "msg"  : "Email or Password is incorrect."
                                    }]
                            });
                        }
                    }
                });
            }
        });
    });
};