"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        // this.initializeMiddlewares()
        // this.initializeDB()
        // this.initializeRoutes()
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, morgan_1.default)('combined'));
    }
    // private initializeRoutes(): void {
    //     this.app.use('/', userRouter)
    //     this.app.use('/admin', adminRouter)
    // }
    // private initializeDB(): void {
    //     connectDB()
    //     initializeRedisClient()
    // }
    listen() {
        this.app.listen(3000, () => {
            console.log(`Server running on http://localhost:${3000}`);
        });
    }
}
const app = new App();
app.listen();
//# sourceMappingURL=index.js.map