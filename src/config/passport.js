import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userModel } from "../models/users.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, rol } = req.body
        try {
            const user = await userModel.findOne({ email: username });
            if (user) return done(null, false);
            const newUser = { first_name, last_name, email: email.toLowerCase(), age, password: createHash(password), rol }
            const result = await userModel.create(newUser);
            done(null, result);
        } catch (error) {
            throw done("Error al obtener el usuario: " + error);
        }
    }
    ));

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                console.log("User doesn't exist");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            throw done(error);
        }
    }))
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.81081089c45b38d4",
        clientSecret: "07e1bf386ed8a0c2dc85046c3f8ce459d55a64d6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: 0,
                    password: "",
                    rol: "user"
                }
                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            throw done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializePassport;