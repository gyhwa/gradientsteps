const express = require("express");
const bodyParser = require("body-parser");

//route const
const home = require("./routes/home")

const app = express();



app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


//routes
app.use("/", home);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully.")
});
