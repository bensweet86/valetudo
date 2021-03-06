const Logger = require("../../Logger");

const CapabilityRouter = require("./CapabilityRouter");

class JobHistoryCapabilityRouter extends CapabilityRouter {

    initRoutes() {
        this.router.put("/", async (req, res) => {
            if (req.body && req.body.type) {
                try {
                    switch (req.body.type) {
                        case "summary":
                            res.json(await this.capability.getJobSummary());
                            break;
                        case "detail":
                            res.json(await this.capability.getJobRecord(req.body.id));
                            break;
                        case "map":
                            res.json(await this.capability.getJobRecordMap(req.body.id));
                            break;
                        case "mapdata":
                            res.json(await this.capability.getJobRecordMapData(req.body.name));
                            break;
                        default:
                            // noinspection ExceptionCaughtLocallyJS
                            throw new Error("Invalid action");
                    }

                } catch (e) {
                    Logger.warn("Error while executing action \"" + req.body.type + "\" for JobHistoryCapability", e);
                    res.status(500).json(e.message);
                }
            } else {
                res.status(400).send("Missing type in request body");
            }
        });
    }
}

module.exports = JobHistoryCapabilityRouter;