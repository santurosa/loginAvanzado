import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }),async (req, res) => {
    try {
        if(!req.user) return res.status(400).send({ status: "error", error: "Credenciales incorrectas" });
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol
        }
        res.send({ status: "success", payload: req.session.user });
    } catch (error) {
        res.status(401).send({ status: "error", error: "Credenciales incorrectas" });
    }
})

router.get("/faillogin", (req, res) => {
    res.send({ status: "error", message: "Failed login" });
})

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
    res.send({ status: "success", message: "User registered" });
})

router.get("/failregister", (req, res) => {
    res.send({ status: "error", message: "Failed register" });
})

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send({ status: "Logout ERROR", body: error });
        res.redirect("/login");
    })
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    const user = req.user;
    delete user.password;
    req.session.user = user;
    res.redirect("/products");
});

export default router;