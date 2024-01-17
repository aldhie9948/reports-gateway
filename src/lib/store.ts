import { writable } from "svelte/store";

export const searchKeyword = writable<string>("");
export const contentLoading = writable<boolean>(false);
