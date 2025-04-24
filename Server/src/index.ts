
//     public listen(): void {
//         this.app.listen(3000, ()=>{
//             console.log(`
//                 \x1b[35m        _         __  __                _   
//                   /\\  /(_)_ __ ___\\ \\/ /_ __   ___ _ __| |_ 
//                  / /_/ / | '__/ _ \\\\  /| '_ \\ / _ \\ '__| __|
//                 / __  /| | | |  __//  \\| |_) |  __/ |  | |_ 
//                 \\/ /_/ |_|_|  \\___/_/\\_\\ .__/ \\___|_|   \\__|
//                                        |_|                  
//                 \x1b[36m🚀 Server running on \x1b[34mhttp://localhost:3000\x1b[0m
//                 `); 
//         })
//     }
// }
// const app = new App()
// app.listen()

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/UserRouter";
import morgan from "morgan";
import { connectDB } from "./config/mongo.config";

dotenv.config()

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(morgan("combined"))

connectDB()

app.use(
  cors({
    origin:process.env.CLIENT_URL,
    credentials:true
  })
)

app.use("/api/auth",userRouter)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})