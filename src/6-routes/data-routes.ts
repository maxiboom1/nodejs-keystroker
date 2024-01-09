import express, { Request, Response, NextFunction } from "express";
import sendKeys from "../5-services/keystrokes-service";

const router = express.Router();

router.get("/refresh", async (request: Request, response: Response, next: NextFunction) => {
    try {
        //sendKeys("Google Chrome",{key:"f5",modifiers:[]});
        response.sendStatus(200);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;
