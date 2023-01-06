const express = require("express")
const connectDB = require("./config/connect.js")

const app = express();

app.use( express.json({ extended : false }))
connectDB();

app.get('/',(req,res)=>{
    res.send("Api is running")
})

app.use("/api/auth", require("./config/routes/api/auth.js"));
app.use("/api/user", require("./config/routes/api/user.js"));
app.use("/api/post", require("./config/routes/api/post.js"));
app.use("/api/profile", require("./config/routes/api/profile.js"));

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log("Server started")
})