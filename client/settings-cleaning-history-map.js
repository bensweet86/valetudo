/*global ons */
import {VacuumMap} from "./zone/js-modules/vacuum-map.js";
import {ApiService} from "./services/api.service.js";

async function updateSettingsCleaningHistoryMapPage() {
    const loadingBar = document.getElementById("loading-bar-settings-cleaning-history-map");
    let map = null;
    
    loadingBar.setAttribute("indeterminate", "indeterminate");
    try {
        let topPage = fn.getTopPage();
        let mapName = await ApiService.getJobRecordMap(parseInt(topPage.data.recordId));
        let mapData = await ApiService.getJobRecordMapData(mapName);
        map = new VacuumMap(document.getElementById("settings-cleaning-history-map"));
        map.initCanvas(mapData, {metaData: "forbidden", noGotoPoints: true});
    } catch (err) {
        ons.notification.toast(err.message,
            {buttonLabel: "Dismiss", timeout: window.fn.toastErrorTimeout});
        throw err;
    } finally {
        loadingBar.removeAttribute("indeterminate");
    }
}

window.updateSettingsCleaningHistoryMapPage = updateSettingsCleaningHistoryMapPage;