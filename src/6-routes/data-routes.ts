import express, { Request, Response, NextFunction } from "express";
import configService from "../5-services/config-service";
import sendKeys from '../5-services/keystrokes-service';
import appConfig from "../4-utils/app-config";

const router = express.Router();

router.get("/gpi/:gpi", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const gpi = 'gpi' + request.params.gpi;
        console.log(gpi)
        sendKeys(appConfig[gpi], gpi, "HTTP");
        response.sendStatus(200);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/get-config", async (request: Request, response: Response, next: NextFunction) => {
    try {
        response.json(appConfig);
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


export default router;
