"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
//datasource and entities
const dataSource_1 = require("./dataSource");
//routes
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config();
//Connect database with express server
dataSource_1.myDataSource
    .initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Data source has been initialized!");
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 3000;
    //middlewares
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    //paths
    app.use(routes_1.default);
    //inicio del servidor
    app.listen(PORT, () => {
        console.log("The server is listening on the port" + " " + PORT);
    });
}))
    .catch((err) => {
    console.log("Error during data source initialization or server error: ", err);
});
