/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name:  Rushabh Rajendrakumar Shah  Student ID:  145207205   Date:  16/09/2022
*  Cyclic Link: https://handsome-teal-starfish.cyclic.app/
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");


const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


const dotenv = require("dotenv");
dotenv.config({path:"./config/info.env"});

// Middlewares 
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


// Ensuring that the environment is set correctly and our Web API starts with simple listening message at home path.
app.get("/", function(req,res) {
    res.json({message:"API Listening"});
});

app.post("/api/movies", (req, res) => {
    res.status(201).json(db.addNewMovie(req.body))
});

app.get("/api/movies", (req, res) => {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let title = req.query.title;

    db.getAllMovies(page, perPage, title).then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json({});
        });
});

app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong, please try again ${err}'
            });
        });
});

app.put("/api/movies/:id", (req, res) => {
    db
        .updateMovieById(req.body, req.params.id)
        .then((data) => {
            res.status(204).json({message: data});
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong, please try again ${err}' });
        });
});

app.delete("/api/movies/:id", (req, res) => {
    db
        .deleteMovieById(req.params.id)
        .then((data) => {
            res.status(201).json( {message: data });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong, please try again ${err}'
            });
        });
});


const HTTP_PORT = process.env.PORT || 8080;


//Initializing the Module before the server starts

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


