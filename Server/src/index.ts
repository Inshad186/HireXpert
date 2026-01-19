import "reflect-metadata"
import dotenv from "dotenv"               
dotenv.config()

import express from "express"
import cors from "cors"
import morgan from "morgan";
import http from "http";

import userRouter from "./routes/UserRouter";
import clientRouter from "./routes/ClientRouter";
import freelancerRouter from "./routes/FreelancerRouter"
import adminRouter from "./routes/AdminRouter"
import notificationRouter from "./routes/NotificationRouter"
import webhookRouter from "./routes/WebhookRouter"

import { connectDB } from "./config/mongo.config";
import { verifyTokenMiddleware } from "./middlewares/verifyToken.middleware";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { gigMapper } from "./mappings/gig.mapper";

import { initSocket } from "./socket/socket"

const app = express()
const PORT = process.env.PORT

const server = http.createServer(app)
initSocket(server)

app.use(
  cors({
    origin:process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

app.use("/api/auth/webhook", webhookRouter)

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"))
connectDB()
gigMapper()

app.use(corsMiddleware)
app.use("/api/auth", userRouter)
app.use("/api/auth/client", clientRouter)
app.use("/api/auth/freelancer", freelancerRouter)
app.use("/api/auth/admin", adminRouter)
app.use("/api/auth/notification", notificationRouter)

app.use((req, res, next) =>{
  verifyTokenMiddleware(req, res, next)
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})