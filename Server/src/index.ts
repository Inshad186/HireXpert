
import dotenv from "dotenv"               
dotenv.config()

import express from "express"
import cors from "cors"
import userRouter from "./routes/UserRouter";
import adminRouter from "./routes/AdminRouter"
import morgan from "morgan";
import { connectDB } from "./config/mongo.config";
import { verifyTokenMiddleware } from "./middlewares/verifyToken.middleware";
import { corsMiddleware } from "./middlewares/cors.middleware";


const app = express()
const PORT = process.env.PORT

app.use(
  cors({
    origin:process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"))
connectDB()

app.use(corsMiddleware)
app.use("/api/auth", userRouter)
app.use("/api/auth/admin", adminRouter)
app.use((req, res, next) =>{
  verifyTokenMiddleware(req, res, next)
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})