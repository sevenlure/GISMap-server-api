import axios from "axios";

import { STATION_AUTO_API } from "~root/configSys";

export const fetch = axios.create({
  baseURL: STATION_AUTO_API
});

export function getGroupByStationType(params) {
  return fetch.post("/station-auto/group-by/station-type", params);
}

export default {
  getGroupByStationType
};