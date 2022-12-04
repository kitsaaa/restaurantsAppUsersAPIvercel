// const express = require("express");

// const app = express();

// app.get("/", (req, res) => {
//   res.send("Express on Vercel");
// });

// app.listen(5000, () => {
//   console.log("Running on port 5000.");
// });

// // Export the Express API
// module.exports = app;


const mongoDBConnectionString = "mongodb+srv://nk:admin@cluster0.nc6ci.mongodb.net/RestaurantsAppUsersDB?retryWrites=true&w=majority";
const HTTP_PORT = process.env.PORT || 3000;

const express = require("express");
const bodyParser = require('body-parser');

const cors = require("cors");
const dataService = require("./modules/data-service.js");

const data = dataService(mongoDBConnectionString);
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res)=> {
    res.json({
        working:'true'
    });
})

app.post("/api/posts", (req,res)=>{
    data.addNewPost(req.body).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});

// IMPORTANT NOTE: ?tag=#funny wll not function, but ?tag=funny will
app.get("/api/posts", (req,res) => {
    data.getAllPosts(req.query.page, req.query.perPage, req.query.category, req.query.tag).then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    })
});

app.get("/api/posts/:id",(req,res)=>{
    data.getPostById(req.params.id).then(data=>{
        res.json(data);
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});

app.put("/api/posts/:id", (req,res)=>{
    data.updatePostById(req.body,req.params.id).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});

app.delete("/api/posts/:id", (req,res)=>{
    data.deletePostById(req.params.id).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});

// Connect to the DB and start the server

data.connect({useUnifiedTopology: true}).then(()=>{
    app.listen(HTTP_PORT, ()=>{console.log("API listening on: " + HTTP_PORT)});
})
.catch((err)=>{
    console.log("unable to start the server: " + err);
    process.exit();
});

module.exports = app;