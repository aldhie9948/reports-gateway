import { writable } from "svelte/store";
import type { ISelectItems, KepatuhanSearchType } from "./types";

export const searchKeyword = writable<string>("");
export const contentLoading = writable<boolean>(false);
export const showHeader = writable<boolean>(false);
export const selectedValue = writable<ISelectItems | undefined>();
export const currentKepatuhanSearchType = writable<KepatuhanSearchType>("date");
