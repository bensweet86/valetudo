const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

class JobHistoryCapability extends Capability {
    /**
     * This function polls the job summary
     *
     * @abstract
     * @returns {Promise<Array<import("../../entities/job/Job")>>}
     */
    async getJobSummary() {
        throw new NotImplementedError();
    }

    /**
     * This function polls for an individual job record
     *
     * @abstract
     * @param {number} recordId
     * @returns {Promise<import("../../entities/job/Job")>}
     */
    async getJobRecord(recordId) {
        throw new NotImplementedError();
    }

    /**
     * This function polls for an individual job record map
     *
     * @abstract
     * @param {number} recordId
     * @returns {Promise<string>}
     */
    async getJobRecordMap(recordId) {
        throw new NotImplementedError();
    }

    /**
     * This function returns the map data from a snapshot provided the metadata name matches
     *
     * @abstract
     * @param {string} mapName
     * @returns {Promise<import("../../entities/map/ValetudoMap")>}
     */
    async getJobRecordMapData(mapName) {
        throw new NotImplementedError();
    }

    getType() {
        return JobHistoryCapability.TYPE;
    }
}

JobHistoryCapability.TYPE = "JobHistoryCapability";

module.exports = JobHistoryCapability;