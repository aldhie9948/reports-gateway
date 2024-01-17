import axios from "axios";
import { axiosErrorHandler } from "../utils";
import type { ILaporanProduksi, ISelectItems } from "../types";
const API_URL = import.meta.env.VITE_API_URL.concat(
  "laporan-produksi"
) as string;

export async function getPlansList(keyword: string) {
  try {
    if (!keyword) return [];
    const { data } = await axios.get(API_URL.concat("/", keyword));
    return data as ISelectItems[];
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}

export async function getPlanDetail(planId: string) {
  try {
    if (!planId) return [];
    const params = new URLSearchParams({ plan: planId });
    const { data } = await axios.get(API_URL.concat("?", params.toString()));
    return data as ILaporanProduksi[];
  } catch (error) {
    return Promise.reject(axiosErrorHandler(error));
  }
}
