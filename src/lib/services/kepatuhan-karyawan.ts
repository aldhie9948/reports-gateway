import axios from "axios";
import { axiosErrorHandler } from "../utils";
import type { IKepatuhanPress, ISelectItems } from "../types";
import moment from "moment";
const API_URL = import.meta.env.VITE_API_URL.concat("kepatuhan-karyawan");

export async function getSelectItems(text: string) {
  try {
    if (!text) return [];
    const { data } = (await axios.get(
      API_URL.concat("/press/select/", text)
    )) as { data: ISelectItems[] };
    const formatted = data.map((d) => {
      const date = moment(d.value).utc(true).format("DD-MM-YYYY");
      const group = moment(d.value).utc(true).format("MMMM");
      return { value: d.value, label: date, group };
    });
    return formatted as ISelectItems[];
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}

export async function getKepatuhanPress(date: string) {
  try {
    if (!date) return [];
    const { data } = (await axios.get(API_URL.concat("/press/", date))) as {
      data: IKepatuhanPress[];
    };
    return data;
  } catch (error) {
    return Promise.reject(axiosErrorHandler(error));
  }
}
