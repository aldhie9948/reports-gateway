import axios from "axios";
import type { IPortalLaporan } from "../types";
import { axiosErrorHandler } from "../utils";

const API_URL = import.meta.env.VITE_API_URL.concat("portal-laporan");

export async function findReports(keyword: string, limit: number = 10) {
  try {
    if (!keyword) return [];
    const params = new URLSearchParams({ limit: limit.toString() });
    const { data } = await axios.post(API_URL.concat("?", params.toString()), {
      keyword,
    });
    return data as IPortalLaporan[];
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}
