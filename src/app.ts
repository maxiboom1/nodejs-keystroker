import express from "express";
import dataRoutes from "./6-routes/data-routes";
import routeNotFound from "./3-middleware/route-not-found";
import catchAll from "./3-middleware/catch-all";
import appConfig from "./4-utils/app-config";
import listenSerial from "./5-services/serial-service";
import path from "path";

const server = express();

server.use(express.json());
server.use("/api", dataRoutes);

// Static server for configuration page
server.use(express.static(path.join(__dirname, '1-config')));

server.use(routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));

listenSerial();