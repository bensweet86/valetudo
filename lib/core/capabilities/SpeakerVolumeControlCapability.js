const Capability = require("./Capability");
const NotImplementedError = require("../NotImplementedError");

class SpeakerVolumeControlCapability extends Capability {
    /**
     * Returns the current voice volume as percentage
     *
     * @abstract
     * @returns {Promise<number>}
     */
    async getVolume() {
        throw new NotImplementedError();
    }

    /**
     * Sets the speaker volume
     *
     * @abstract
     * @param {number} value
     * @returns {Promise<void>}
     */
    async setVolume(value) {
        throw new NotImplementedError();
    }

    /**
     * Tests the robot's voice volume by playing a sound
     *
     * @abstract
     * @returns {Promise<void>}
     */
    async testSpeaker() {
        throw new NotImplementedError();
    }

    getType() {
        return SpeakerVolumeControlCapability.TYPE;
    }
}

SpeakerVolumeControlCapability.TYPE = "SpeakerVolumeControlCapability";

module.exports = SpeakerVolumeControlCapability;
