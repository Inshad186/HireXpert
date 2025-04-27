import nodemailer from "nodemailer"
import { env } from "./env.config"

export const transport = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : env.SENDER_MAIL,
        pass : env.SENDER_PASSWORD
    }
})