if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


export const PORT = 5002

// MARK  HOST
export const STATION_AUTO_API = process.env.HOST_STATION_AUTO
