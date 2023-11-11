import { Router } from "express";
import Messages from "../dao/db/messages.js";

const router = Router();
const managerMessages = new Messages();

router.get("/api/messages", async (req, res) => {
    try {
        const messages = await managerMessages.getMessages();
        res.send(messages);
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.post("/api/messages", async (req, res) => {
    try {
        const {user, message} = req.body;

        const result = await managerMessages.addMessage(user, message);
        res.send({ status: "success", payload: result });   
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

export default router