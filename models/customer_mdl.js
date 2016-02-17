var sql = require("mssql");
var md5 = require("md5");

module.exports = {   

    signup : function (input, callback){ //sign function: input is input value set, callback is callback function when user signup.
        
        //input.con is database connection
        if (input.con === null) {
            callback("Database Connection is failed.");
        }
        var request = new sql.Request(input.con);
        var dd = new Date();
        
        //make database query
        var addQuery = "insert into customer (email,fname,lname,phone,password,last_time_connected) values ('" + input.email + "','" + input.fname + "','" + input.lname + "','" + input.phone + "','" +md5(input.password) + "','" + dd.toLocaleDateString('en-US') + " " + dd.toLocaleTimeString('en-US')+"')";
        console.log(addQuery);
        request.query(addQuery).then(function () {
            callback(null); //if success, return null
        }).catch(function (err) {
            callback(err); // if error, return error
        });
    },
    update : function (input, callback){
        if (input.con === null) {
            callback("DB Connection Failed.");
        }
        var isSet = 0;
        var request = new sql.Request(input.con);
        var updateQuery = "update customer set ";
        var whereClause = " where id = " + input.id;
        if (input.id == null) {
            callback("Update Query: id field is required.");
            return;
        }
        if (input.fname != null) {
            updateQuery += "fname='" + input.fname + "',";
            isSet++;
        }
        if (input.lname != null) {
            updateQuery += "lname='" + input.lname + "',";
            isSet++;
        }
        if (input.password != null) {
            updateQuery += "password='" + md5(input.password) + "',";
            isSet++;
        }
        if (input.gender != null) {
            updateQuery += "gender='" + md5(input.gender) + "',";
            isSet++;
        }
        if (input.dob != null) {
            updateQuery += "dob='" + input.dob + "',";
            isSet++;
        }
        if (isSet <= 0) {
            console.log("cannot update query.");
            callback(null);
        }else{
            updateQuery = updateQuery.substr(0, updateQuery.length - 1);
            updateQuery += whereClause;
            console.log(updateQuery);
            request.query(updateQuery).then(function () {
                callback(null);               
            }).catch(function (err) {
                callback(err);                
            });
        }        
    },
    login : function (input, callback){ //login function: input is input value set, callback is callback function when user login
        
        //input.con is database connection
        if (input.con === null) {
            callback({
                err : {
                    "param" : "db",
                    "msg": "Database Connection is failed."
                }
            });
        }
        
        //make login query with email/phone and password
        var loginQuery = "select * from customer where password='" + md5(input.password);
        
        //check if phone is not valid or email is not valid
        if (input.phone == null && input.email != null) {
            loginQuery += "' and email='" + input.email+"'";
        } else{
            loginQuery += "' and phone='" + input.phone + "'";
        }

        var request = new sql.Request(input.con);
        request.query(loginQuery).then(function (recordset) {
            callback({ user : recordset}); //if success, return user data.
        }).catch(function (err) {
            callback({  //if error, return errors,
                err : {
                    "param" : "unknown",
                    "msg" : err.message
                }
            });
        });
    }
};