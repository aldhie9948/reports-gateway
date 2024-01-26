<script lang="ts">
  import { onMount } from "svelte";
  import logo from "../../assets/logo.png";
  import {
    getPlanProduction,
    getPlanProductionDetail,
  } from "../services/rencana-produksi";
  import { contentLoading, searchKeyword } from "../store";
  import type { IRencanaProduksi, IRencanaProduksiDetail } from "../types";
  import {
    dateParsed,
    reduce,
    numberFormat,
    getURLSearchParams,
    getPlanIdFromURL,
  } from "../utils";
  import { disableIsDown, onMouseDown, onMouseMove } from "../drag-scoll";

  let planProductionInfo: IRencanaProduksi;
  let planProductionDetail: IRencanaProduksiDetail[] = [];
  let planId: string;

  async function fetchData(planId: string) {
    try {
      $contentLoading = true;
      planProductionInfo = await getPlanProduction(planId);
      planProductionDetail = await getPlanProductionDetail(planId);
      $contentLoading = false;
    } catch (error) {
      $contentLoading = false;
    }
  }

  $: planId = getPlanIdFromURL();
  $: fetchData($searchKeyword || planId);
</script>

<div class="w-full" id="print">
  <div class="relative border border-transparent">
    <img
      src={logo}
      alt="logo"
      width="128px"
      class="absolute -top-3 left-0"
      id="logo"
    />
    <p class="flex-grow underline text-2xl text-center my-10 font-bold">
      RENCANA PRODUKSI HARIAN
    </p>
  </div>
  <div class="flex justify-between items-center my-2">
    <p>Shift : {planProductionInfo?.shift || "-"}</p>
    <p>Bagian : {planProductionInfo?.bagian.toUpperCase() || "-"}</p>
    <div class="flex items-center gap-2">
      <p>Tgl. Plan :</p>
      <p>
        {dateParsed(planProductionInfo?.start)}
      </p>
      <p>-s/d-</p>
      <p>
        {dateParsed(planProductionInfo?.end)}
      </p>
    </div>
    <p>No. Plan : <strong>{planProductionInfo?.plan_no || "-"}</strong></p>
    <p>FPSM-7-1-02/R5</p>
  </div>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="w-full overflow-auto py-2 my-2"
    id="parent-table"
    on:mousedown={onMouseDown}
    on:mouseleave={disableIsDown}
    on:mouseup={disableIsDown}
    on:mousemove={onMouseMove}
  >
    <table class="w-full print:break-inside-auto" id="table-rencana-produksi">
      <thead>
        <th>No.</th>
        <th>Nama Part (No. Part)</th>
        <th>No. Mesin</th>
        <th>Qty. Plan</th>
        <th>Durasi</th>
        <th><p class="print:w-[5rem] print:mx-auto">Act. Mesin</p></th>
        <th>Cek1</th>
        <th>Cek2</th>
        <th>Cek3</th>
        <th>Keterangan</th>
      </thead>
      <tbody>
        {#if planProductionDetail.length === 0}
          <tr>
            <td colspan="10"
              ><p class="italic text-center">Data tidak ditemukan</p></td
            >
          </tr>
        {:else}
          {#each planProductionDetail as item, i (i)}
            <tr class="text-center print:break-inside-avoid">
              <td>
                <p>{i + 1}</p>
              </td>
              <td class="text-left">
                <div class="print:max-w-[30rem] flex print:block">
                  <p>{item.nama_barang}</p>
                  <p>({item.id_barang})</p>
                </div>
              </td>
              <td>
                <p class="print:max-w-[5rem] print:mx-auto">
                  {item.mesin.trim() || "-"}
                </p>
              </td>
              <td><p>{numberFormat(item.plan_qty)}</p></td>
              <td><p>{Number(item.plan_time).toFixed(1)}</p></td>
              <td><p /></td>
              <td><p class="w-[5rem]" /></td>
              <td><p class="w-[5rem]" /></td>
              <td><p class="w-[5rem]" /></td>
              <td><p class="w-[10rem]" /></td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="flex justify-end mb-5">
    <table class="w-fit" id="footer-table">
      <tbody>
        <tr class="text-center">
          <td class="!border-none" />
          <td>Dibuat</td>
          <td>Diterima</td>
        </tr>
        <tr>
          <td class="!border-none">
            {#if reduce(planProductionDetail, "plan_qty") === 0}
              <p class="text-center font-bold px-2">
                Total Qty : ...................... Pcs
              </p>
            {:else}
              <p class="text-center font-bold px-2">
                Total Qty : {numberFormat(
                  reduce(planProductionDetail, "plan_qty").toString()
                )} Pcs
              </p>
            {/if}
          </td> <td><p class="h-20 w-32" /></td>
          <td><p class="h-20 w-32" /></td>
        </tr>
        <tr>
          <td class="!border-none" />
          <td><p class="h-5" /></td>
          <td><p class="h-5" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  #table-rencana-produksi {
    td,
    th,
    tr {
      @apply border border-slate-800;
    }

    td,
    th {
      @apply whitespace-nowrap px-1;
    }
    th {
      @apply py-2;
    }
  }
  #footer-table {
    td {
      @apply border border-slate-800;
    }
  }
  @media print {
    #table-rencana-produksi {
      td,
      th {
        white-space: normal !important;
      }
    }
  }
</style>
