import axios from "axios";
import { axiosErrorHandler } from "../utils";
import type {
  IRencanaProduksi,
  IRencanaProduksiDetail,
  ISelectItems,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL.concat("rencana-produksi");

export async function getPlanProduction(planId: string) {
  try {
    if (!planId) throw new Error("Plan ID is undefined");
    const { data } = await axios.get(API_URL.concat("/plan/", planId));
    return data as IRencanaProduksi;
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}

export async function findPlanProduction(keyword: string) {
  try {
    if (!keyword) return [];
    const { data } = await axios.get(API_URL.concat("/", keyword));
    return data as ISelectItems[];
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}

export async function getPlanProductionDetail(planId: string) {
  try {
    if (!planId) return [];
    const { data } = await axios.get(API_URL.concat("/detail/", planId));
    return data as IRencanaProduksiDetail[];
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}
