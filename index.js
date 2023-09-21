const express = require("express");
const mysql2 = require("mysql2/promise");
const app = express();

const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mysql_todo_list",
  connectionLimit: 20,
});

//login
// Method : past, Path: /login
//data: username,pasw

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // fild tabile users with username and password
    const result = await db.query(
      "select * from users where username = ? and password =?",
      [username, password]
    );
    if (result[0].length === 0) {
      return res.status(400).json({ msg: "invalid username or password" });
    }
    res.status(200).json({
      msg: "success login",
    });
  } catch (error) {
    res.status(500).json({ msg: "internal sever error" });
  }
});
// Body, query, paramiter
//register
// Method: post, path: /register
// Data: username, password (request BODY)

app.use(express.json());
app.post("/register", async (req, res, next) => {
  try {
    //read body
    // const body = req.body
    // console.log(body)

    const { username, password } = req.body;
    //find exists username

    // res.json({"msg": "S"})

    const result = await db.query("select * from users where username = ?", [
      username,
    ]);
    console.log(result);
    if (result[0].length > 0) {
      return res
        .status(400)
        .json({ msg: "username is already exists please try other" });
    }
    await db.query("insert into users (username, password) values (?,?)", [
      username,
      password,
    ]);
    res.status(201).json({ msg: "success registration" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "songthing wrong" });
  }
});

// change password
// method : put, path /change-password
//data : username , new password

app.put('/change-password', async (req, res, next) => {
  try {
    //read body
    const { username, newPassword } = req.body;
    //validate
    const result = await db.query("select * users where username = ?", [
      username,
    ]);
    if (result[0].length === 0) {
      return res.status(400).json({ msg: "username not found" });
    }
    await db.query("update users set password = ? where username = ?", [newPassword,username]);
    res.status(200).json({
      msg: "success updated",
    });
    await db.query('insert into todos (title, completed, user_id )values (?,?,?)', [title, completed, userId])
    res.status(200).json({ msg: "create todo successfully"})
  } catch (error) {
    res.status(500).json({ msg: "songthing wrong" });
  }
});


app.post('/create-todo', async (req,res,next)=>{
    try {
        const { title, userId, completed} = req.body
        const result = await db.query('select * from users where id =?', [userId])
        if(result[0].length === 0 ){
            return res.status(400).json({ msg: 'user with this id not found'})
        }
        await db.query('insert into todos (title, completed, user_id) values (?,?,?)', [title,completed,userId])
        res.status(200).json({msg : "create todo successfully"})
    } catch (error) {
        res.status(500).json({ msg: "songthing wrong" });
    }
})


app.get('/get-todo', async (req, res, next) =>{
try {
    const { searchTitle, userId } = req.query;
    if(searchTitle !== undefined && userId !== undefined){

        const result = await db.query('select * from todos where title = ? and user_id =?' , [searchTitle, userId])
        return res.status(200).json({ resultTodo: result[0]})
    }
    if (searchTitle !== undefined){
        const result = await db.query('select * from todos where title = ?', [searchTitle])
        return res.status(200).json({ resultTodo: result[0]})
    }
    if (userId !== undefined){
         const result = await db.query('select * from todos where user_id =?', [userId])
         return res.status(200).json({ resultTodo: result[0]})
    }
    const result = await db.query('select * from todos')
    return res.status(200).json({ resultTodo: result[0]})
} catch (error) {
    res.status(500).json({ msg: "songthing wrong" });
}

})

app.delete('/delete-todo/:idToDelete', async (req, res, next) =>{
    try {
        const { idToDelete } = req.params;
        const result = await db.query('select * from todos where id =?', [idToDelete]);
        if(result[0].length === 0){
            return res.status(400).json({ msg: "todo with this id not found"})
        }
        await db.query('delete from todos where id = ?', [idToDelete])
        res.status(200).json({ msg: "delete successfully"})
    } catch (error) {
        res.status(500).json({ msg: "songthing wrong" });
    }
})
app.listen(8000, () => console.log("server is runing on port 8000"));
