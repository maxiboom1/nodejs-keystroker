import express, { Request, Response, NextFunction } from "express";
import keystrokes from "../5-services/keystrokes-service";

const router = express.Router();

router.get("/refresh", async (request: Request, response: Response, next: NextFunction) => {
    try {
        keystrokes("Anveks","f5");
        response.sendStatus(200);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;
