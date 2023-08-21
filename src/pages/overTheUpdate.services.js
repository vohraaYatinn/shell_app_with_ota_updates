import { HttpAxiosService } from "../services/HttpService";
import { HRMS_BASE_URL  } from "../config/environment.config";
import { Urls } from "../constant/Urls";

const capacitorOtaService = new HttpAxiosService(HRMS_BASE_URL);

export const getLatestBuildVersion = (payload_data) => {
 return capacitorOtaService.get(Urls.LATEST_VERSION_FETCH, payload_data) 
}