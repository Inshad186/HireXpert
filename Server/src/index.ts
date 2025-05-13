
import dotenv from "dotenv"               
dotenv.config()

import express from "express"
import cors from "cors"
import userRouter from "./routes/UserRouter";
import adminRouter from "./routes/AdminRouter"
import morgan from "morgan";
import { connectDB } from "./config/mongo.config";


const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(morgan("dev"))
connectDB()

app.use(
  cors({
    origin:process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials:true,
    // allowedHeaders: ["Content-Type", "Authorization"]
  })
)

app.use("/api/auth", userRouter)
app.use("/api/auth/admin", adminRouter)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})