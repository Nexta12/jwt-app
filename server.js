
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const PORT = 3000

app.use(express.json())

// database users
const users = [
    {
        id: "1",
        username: 'john',
        password: 'John0908',
        isAdmin: true,
    },
    {
        id: "2",
        username: 'jane',
        password: 'Jane0908',
        isAdmin: false,
    },
]

// Login Route

app.post('/api/login', (req, res)=>{
    // take username and password from user (as in login in format)
    const {username, password} = req.body  //(Because the user is making the req. from the body of the form)
//    lets find user inside our users array above

  const user = users.find(u=>{
      return u.username === username && u.password === password
  })
   if(user){
    //  generate access token if there's a user
    const accessToken = jwt.sign(
        {  id:user.id,
           isAdmin:user.isAdmin
         }, "my_terrible_secret_key",
          {expiresIn: "15m"},
         )
         res.json(
             {
                 username: user.username,
                 isAdmin: user.isAdmin,
                 accessToken,
             }
             )


   }else{
       res.status(400).json("Username or Password Incorrect")
   }

    
})

const verify = (req, res, next)=>{
 const authHeader = req.headers.authorization;
 if(authHeader){
     const token = authHeader.split("")[1];
     
    jwt.verify(token, "my_terrible_secret_key", (err, user)=>{
        if(err){
            return res.status(403).json('Token is invalid')
        }

        req.user = user
        next()
    })

 }else{
     res.status(401).json("You're not authenticated")
 }
}


app.get('/', (req, res)=>{
    res.send('THIS IS JSON WEB TOKEN APPLICATION')
})

app.post("api/refresh", (req, res)=>{
    // take 
})

app.delete('/api/users/:userId', verify, (req, res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User Deleted Successfully")
    }else{
        res.status(403).json("You are not allowed to Delete this user")
    }
})



app.listen(PORT, ()=>console.log(`Server is running on http://localhost:${PORT}`))
