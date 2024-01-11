import express, { Request, Response, NextFunction } from "express";
import configService from "../5-services/config-service";

const router = express.Router();

router.get("/refresh", async (request: Request, response: Response, next: NextFunction) => {
    try {
        console.log("GOT BLYA");
        response.sendStatus(200);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/set-config", async (request: Request, response: Response, next: NextFunction) => {
    try {
        await configService.setConfig(request.body);
        response.json({status:"success"});
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/set-comport", async (request: Request, response: Response, next: NextFunction) => {
    try {
        await configService.setComPort(request.body.port); // As front send {port: "COM{X}"}
        response.json({status:"success"});
    }
    catch(err: any) {
        next(err);
    }
});

export default router;
