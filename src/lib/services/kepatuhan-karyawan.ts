import axios from "axios";
import { axiosErrorHandler } from "../utils";
import type {
  IKepatuhanPress,
  IKepatuhanWelding,
  ISelectItems,
  KepatuhanMachineType,
  KepatuhanSearchType,
} from "../types";
import moment from "moment";
const API_URL = import.meta.env.VITE_API_URL.concat("kepatuhan-karyawan");

export async function getSelectItemsByDate(
  text: string,
  machine: KepatuhanMachineType
) {
  try {
    if (!text) return [];
    const { data } = (await axios.get(
      API_URL.concat("/", machine, "/select/date/", text)
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
export async function getSelectItemsByWorker(
  text: string,
  machine: KepatuhanMachineType
) {
  try {
    if (!text) return [];
    const { data } = (await axios.get(
      API_URL.concat("/", machine, "/select/worker/", text)
    )) as { data: ISelectItems[] };
    const formatted = data.map((d) => ({ ...d, label: d.label.toUpperCase() }));
    return formatted as ISelectItems[];
  } catch (error) {
    const message = axiosErrorHandler(error);
    return Promise.reject(message);
  }
}

export async function getKepatuhanKaryawan(
  text: string,
  type: KepatuhanSearchType,
  machine: KepatuhanMachineType
) {
  try {
    if (!text) return [];
    const { data } = await axios.get(
      API_URL.concat("/", machine, "/", type, "/", text)
    );
    return data as IKepatuhanPress[] | IKepatuhanWelding[];
  } catch (error) {
    return Promise.reject(axiosErrorHandler(error));
  }
}
