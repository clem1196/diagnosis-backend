import path from "path";
import { DataSource } from "typeorm"
let ent =["src/entity/*.ts"]
if (path.extname(__filename) === '.js') {
    ent = ['build/entity/*.js'];
  }
export const myDataSource = new DataSource(
    {
        type:"mysql",       
        url: "mysql://ukweitfuwqjvmqzx:YVYZ1lsJoRZZTzon2TPw@bcoxz0g2dmaihdiyaozb-mysql.services.clever-cloud.com:3306/bcoxz0g2dmaihdiyaozb",
        entities: ent,
        synchronize:false
       
       
        
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
)
