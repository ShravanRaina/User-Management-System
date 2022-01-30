const mysql = require('mysql');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

exports.register = (req, res)=>{
    res.render('register');
}

exports.reguser = (req, res)=>{
    const {username, password} = req.body;
    if(username == '' || password == ''){
        res.render('register', {alert: "Username/Password not entered"});
    }
    else{
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM admin WHERE username = ?', [username], (err, rows)=>{
            if (rows.length>0) {
                return res.render('register', {alert: "User with this username already exists"});
            }
            else{
                connection.query('INSERT INTO admin SET username = ?, password = ? ', [username, password], (err, rows)=>{
                    // When done with the connection, release it
                    connection.release();
        
                    if(!err){
                        res.render('register', {alert: "Registered Successfully!"});
                    }
                    else{
                        console.log(err);
                    }
                    console.log('Admin Registered');
                });
            }
        })

        

    });
}
}

exports.login = (req, res)=>{
    res.render('login');
}

exports.loguser = (req, res)=>{
    const {username, password} = req.body;
    if(username == '' || password == ''){
        res.render('login', {alert: "Username/Password not entered"});
    }
    else{
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM admin WHERE username = ?', [username], (err, rows)=>{
            
            if (rows[0].password === password) {
                if(!err){
                    res.redirect('/main');
                }
                else{
                    console.log(err);
                }
            }
            else{
                res.render('login', {alert: "Incorrect Password"})
            }

            // When done with the connection, release it
            connection.release();

        });

    });
}
}


// View Users
exports.view = (req, res)=>{ 
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM user where status = "active"', (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.render('home', {rows});
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}

// Find user by search
exports.find = (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        connection.query('SELECT * FROM user where status = "active" AND (id LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)', ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.render('home', {rows});
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}


// Add new user
exports.form = (req, res)=>{
    res.render('add-user');
}

exports.create = (req, res)=>{
    const {first_name, last_name, email, phone, address} = req.body;
    
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;

        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?', [first_name, last_name, email, phone, address], (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.render('add-user', {alert: 'User added successfully!'});
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}

// Edit user

exports.edit = (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        connection.query('SELECT * FROM user where id = ?', [req.params.id] , (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.render('edit-user', {rows});
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}

// Update User
exports.update = (req, res)=>{
    const {first_name, last_name, email, phone, address} = req.body;

    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ? WHERE id = ?', [first_name, last_name, email, phone, address, req.params.id] , (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                pool.getConnection((err, connection)=>{
                    if (err) throw err; // not connected
                    console.log('Connected as ID' + connection.threadId);
                    connection.query('SELECT * FROM user where id = ?', [req.params.id] , (err, rows)=>{
                        // When done with the connection, release it
                        connection.release();
            
                        if(!err){
                            res.render('edit-user', {rows, alert: `${first_name} has been updated`});
                        }
                        else{
                            console.log(err);
                        }
                        // console.log('The data from user table: \n', rows);
                    });
            
                });
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}

// Delete user

exports.delete = (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        connection.query('DELETE FROM user WHERE id = ?', [req.params.id] , (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.redirect('/main');
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}

// Delete All

exports.deleteall = (req, res)=>{

    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        connection.query('DELETE FROM user', (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.redirect('/main');
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}




// Mark as Removed

exports.remove = (req, res)=>{
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);
        let searchTerm = req.body.search;
        connection.query('UPDATE user SET status = "removed" where id = ?', [req.params.id] , (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.redirect('/main');
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}



// View Users
exports.viewall = (req, res)=>{ 
    pool.getConnection((err, connection)=>{
        if (err) throw err; // not connected
        console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM user where id = ?', [req.params.id], (err, rows)=>{
            // When done with the connection, release it
            connection.release();

            if(!err){
                res.render('view-user', {rows});
            }
            else{
                console.log(err);
            }
            // console.log('The data from user table: \n', rows);
        });

    });
}



exports.logout = (req, res)=>{
    res.redirect('/');
}