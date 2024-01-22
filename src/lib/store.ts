import { writable } from "svelte/store";
import type { ISelectItems, KepatuhanPressType } from "./types";

export const searchKeyword = writable<string>("");
export const contentLoading = writable<boolean>(false);
export const selectedValue = writable<ISelectItems | undefined>();
export const kepatuhanPressFetchType = writable<KepatuhanPressType>("date");
