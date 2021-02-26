const JobHistoryCapability = require("../../../core/capabilities/JobHistoryCapability");

const Job = require("../../../entities/job/Job");
const HistoryJobAttribute = require("../../../entities/job/attributes/HistoryJobAttribute");
const StatisticsJobAttribute = require("../../../entities/job/attributes/StatisticsJobAttribute");
const ErrorJobAttribute = require("../../../entities/job/attributes/ErrorJobAttribute");
const ValetudoMap = require("../../../entities/map/ValetudoMap");


class RoborockJobHistoryCapability extends JobHistoryCapability {
    /**
     * This function polls the job summary and stores the attributes in our robotState
     *
     * @abstract
     * @returns {Promise<Array<Job>>}
     */
    async getJobSummary() {
        const data = await this.robot.sendCommand("get_clean_summary", [], {});

        const jobSummary = [
            new Job({
                type: Job.TYPE.SUMMARY,
                state: null,
                action: Job.ACTION.VACUUM,
                count: data[2],
                attributes: [
                    new StatisticsJobAttribute({
                        type: StatisticsJobAttribute.TYPE.DURATION,
                        value: data[0] / 60
                    }),
                    new StatisticsJobAttribute({
                        type: StatisticsJobAttribute.TYPE.AREA,
                        value: data[1] / 100
                    }),
                ]
            })];

        data[3].forEach(e => {
            jobSummary.push(new Job({
                type: Job.TYPE.COMPLETED,
                state: null,
                action: Job.ACTION.VACUUM,
                id: e,
                attributes: null
            }));
        });

        return jobSummary;
    }

    /**
     * This function polls for an individual job record
     *
     * @abstract
     * @param {number} recordId
     * @returns {Promise<Job>}
     */
    async getJobRecord(recordId) {

        const data = await this.robot.sendCommand("get_clean_record", [recordId], {});

        const jobRecord = new Job ({
            type: Job.TYPE.COMPLETED,
            state: (data[0][5] === 1 ? Job.STATE.SUCCESSFUL: (data[0][4] === 0 ? Job.STATE.CANCELLED : Job.STATE.FAILED)),
            action: Job.ACTION.VACUUM,
            id: recordId,
            attributes: [
                new HistoryJobAttribute({
                    start: new Date(data[0][0] * 1000),
                    end: new Date(data[0][1] * 1000)
                }),
                new StatisticsJobAttribute({
                    type: StatisticsJobAttribute.TYPE.DURATION,
                    value: data[0][2]
                }),
                new StatisticsJobAttribute({
                    type: StatisticsJobAttribute.TYPE.AREA,
                    value: data[0][3] / 100
                }),
                new ErrorJobAttribute({
                    code: data[0][4],
                    description: this.robot.getErrorCodeDescription(data[0][4])
                })
            ]
        });

        return jobRecord;
    }

    /**
     * This function polls for an individual job record map
     *
     * @abstract
     * @param {number} recordId
     * @returns {Promise<string>}
     */
    async getJobRecordMap(recordId) {
        let i=0;
        let mapFound = false;
        let response = null;

        //Initialise a blank snapshot
        this.robot.initSnapshot();

        do {
            response = await this.robot.sendCommand("get_clean_record_map", [recordId], {});

            if (response[0].startsWith("map_slot_")) {
                mapFound = true;
                this.robot.snapshot.map.metaData.name = response;
            } else {
                await new Promise(res => setTimeout(res, 1000));
            }

            i++;
        } while (!mapFound && i < 5);

        return response;
    }

    /**
     * This function returns the map data from a snapshot provided the metadata name matches
     *
     * @abstract
     * @param {string} mapName
     * @returns {Promise<ValetudoMap>}
     */
    async getJobRecordMapData(mapName) {
        const snapshotName = this.robot.snapshot.map.metaData.name || "";
        let mapData = null;

        //Ensure the snapshot map is current for the JobRecordMap
        if (mapName[0] === snapshotName[0]) {
            mapData = this.robot.snapshot.map;
        } else {
            //Return a blank map
            mapData = require("../../../res/default_map");
        }

        return mapData;
    }
}

module.exports = RoborockJobHistoryCapability;