"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
let ent = ["src/entity/*.ts"];
if (path_1.default.extname(__filename) === '.js') {
    ent = ['build/entity/*.js'];
}
exports.myDataSource = new typeorm_1.DataSource({
    type: "mysql",
    url: "mysql://ukweitfuwqjvmqzx:YVYZ1lsJoRZZTzon2TPw@bcoxz0g2dmaihdiyaozb-mysql.services.clever-cloud.com:3306/bcoxz0g2dmaihdiyaozb",
    entities: ent,
    synchronize: false
}
/* {
    type: "mysql",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "c1l2e3m1196",
    database: process.env.DATABASE_NAME || "nutrigenetics_db",
    entities: ent,
    logging: true,
    synchronize: true
}*/
);
