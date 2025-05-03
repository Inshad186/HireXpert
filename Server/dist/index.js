"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserRouter_1 = __importDefault(require("./routes/UserRouter"));
const morgan_1 = __importDefault(require("morgan"));
const mongo_config_1 = require("./config/mongo.config");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("combined"));
(0, mongo_config_1.connectDB)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use("/api/auth", UserRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map