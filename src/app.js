import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.js";

import __dirname from "./utils.js";

import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js"
import chatRouter from "./routes/messages.js";
import sessionRouter from "./routes/sessions.js";

const app = express();
const PORT = 8080;
const urlMongo = "mongodb+srv://santurosa999:Jana2022San@clustercursobackend.c9erwbe.mongodb.net/ecommerce";

const connection = mongoose.connect(urlMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use('/static', express.static(`${__dirname}/public`))

initializePassport();
app.use(session({
    store: MongoStore.create({
        mongoUrl: urlMongo,
        ttl: 3600
    }),
    secret: "rehr34edfyh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/", chatRouter);
app.use("/api/sessions", sessionRouter);

const server = app.listen(PORT, () => {
    console.log("Server on PORT " + PORT);
})

const io = new Server(server)

let messages = [];

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    })

    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data);
    })
})