import { AxiosError } from "axios";
import moment from "moment";

export function axiosErrorHandler(error: unknown) {
  let message = "";
  if (error instanceof AxiosError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return message;
}

export function utcToDate(
  dateString: string | undefined | null,
  format?: string
) {
  if (!format) format = "DD/MM/YYYY";
  if (!dateString) return "-";
  return moment.utc(dateString).locale("id").format(format);
}

export function dateParsed(date?: string) {
  if (!date) return "....................";
  return moment.utc(date).locale("id").format("DD/MM/YYYY");
}

export function numberFormat(nominal: string) {
  if (!nominal) return "";
  return new Intl.NumberFormat("id").format(parseInt(nominal));
}

export function reduce(data: any[], field: string): number {
  return data.reduce((a, b) => a + Number(b[field]), 0);
}

export function getURLSearchParams() {
  const currentURL = window.location.search;
  const urlSearchParams = new URLSearchParams(currentURL);
  return urlSearchParams;
}

export function getPlanIdFromURL() {
  const params = getURLSearchParams();
  const planId = params.get("plan") as string;
  return planId;
}
