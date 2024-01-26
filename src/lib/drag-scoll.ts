let isDown: boolean = false;
let startX: number;
let walk: number;
let scrollLeft: number;

export function onMouseDown(e: MouseEvent) {
  const parentTable = document.querySelector("#parent-table") as HTMLElement;
  if (!parentTable) return;
  parentTable.style.cursor = "grabbing";
  isDown = true;
  startX = e.pageX - parentTable.offsetLeft;
  scrollLeft = parentTable.offsetLeft + parentTable.scrollLeft;
}

export function onMouseMove(e: MouseEvent) {
  const parentTable = document.querySelector("#parent-table") as HTMLElement;
  if (!parentTable) return;
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - parentTable.offsetLeft;
  walk = (x - startX) * 1.5;
  parentTable.scrollLeft = scrollLeft - walk;
}

export function disableIsDown(e: MouseEvent) {
  const parentTable = document.querySelector("#parent-table") as HTMLElement;
  if (!parentTable) return;
  parentTable.style.cursor = "grab";
  isDown = false;
}
