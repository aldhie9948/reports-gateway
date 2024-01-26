<script lang="ts">
  import { onMount } from "svelte";
  import { getPlanDetail } from "../services/laporan-produksi";
  import { contentLoading, searchKeyword, showHeader } from "../store";
  import type { ILaporanProduksi } from "../types";
  import { getPlanIdFromURL, getURLSearchParams, utcToDate } from "../utils";
  import { disableIsDown, onMouseDown, onMouseMove } from "../drag-scoll";

  let reports: ILaporanProduksi[] = [];
  let reportSample: ILaporanProduksi;
  let planId: string;

  async function fetchPlan(planId: string) {
    try {
      $contentLoading = true;
      reports = (await getPlanDetail(planId)) as ILaporanProduksi[];
      $contentLoading = false;
    } catch (error) {
      $contentLoading = false;
    }
  }

  $: planId = getPlanIdFromURL();
  $: fetchPlan($searchKeyword || planId);
  $: if (Array.isArray(reports) && reports.length > 0) {
    reportSample = reports[0];
  } else {
    // @ts-ignore
    reportSample = undefined;
  }
</script>

<div class="w-full print:pb-20">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="overflow-auto mb-2 px-1 pb-1"
    id="parent-table"
    on:mousedown={onMouseDown}
    on:mouseleave={disableIsDown}
    on:mouseup={disableIsDown}
    on:mousemove={onMouseMove}
  >
    <table class="report" id="table-laporan-produksi">
      <tr>
        <td colspan="18" class="border-none">
          <p class="font-bold text-3xl">LAPORAN PRODUKSI HARIAN</p>
        </td>
      </tr>
      <tr>
        <td colspan="18" class="border-none">
          <p class="font-bold text-3xl">(KEPALA SEKSI)</p>
        </td>
      </tr>
      <tr><td colspan="18" class="border-none"><p class="py-1"></p></td></tr>
      <tr class="font-bold">
        <td colspan="2" class="border-none">
          <p class="text-left">
            <span class="inline-block w-20">Shift</span> : {reportSample?.shift ||
              "-"}
          </p>
        </td>
        <td colspan="3" class="border-none">
          <p class="text-left">
            <span class="inline-block w-20">Bagian</span> : {reportSample?.nama_area ||
              "-"}
          </p>
        </td>
      </tr>
      <tr class="font-bold">
        <td colspan="2" class="border-none">
          <p class="text-left">
            <span class="inline-block w-20">No. Plan</span> : {reportSample?.lot ||
              "-"}
          </p>
        </td>
        <td colspan="3" class="border-none">
          <p class="text-left">
            <span class="inline-block w-20">Tanggal</span> : {utcToDate(
              reportSample?.start
            ) || "-"} <span class="inline-block w-10 text-center">s/d</span>
            {utcToDate(reportSample?.finish) || "-"}
          </p>
        </td>
      </tr>

      <tr class="thead">
        <th>No</th>
        <th>Nama Part</th>
        <th>Operator</th>
        <th>No. Mesin</th>
        <th>Start</th>
        <th>Finish</th>
        <th>I</th>
        <th>II</th>
        <th>III</th>
        <th>IV</th>
        <th>V</th>
        <th>VI</th>
        <th>VII</th>
        <th>OK</th>
        <th>NG</th>
        <th>TOTAL</th>
        <th>Keterangan</th>
        <th>LOT</th>
      </tr>
      <tbody>
        {#if reports.length === 0}
          <tr>
            <td colspan="18" class="italic"
              >Laporan tidak ditemukan atau tidak ada</td
            >
          </tr>
        {:else}
          {#each reports as report, i (i)}
            <tr>
              <td>{i + 1}</td>
              <td class="!text-left"><p class="part">{report.barang}</p></td>
              <td class="!text-left operator"
                ><p class="operator">
                  {report.nama_operator === " " ? "-" : report.nama_operator}
                </p></td
              >
              <td>{!report.kode_mesin ? "-" : report.kode_mesin}</td>
              <td>{utcToDate(report.start, "HH:mm")}</td>
              <td>{utcToDate(report.finish, "HH:mm")}</td>
              <td>{report["01"] < 1 ? "-" : report["01"]}</td>
              <td>{report["02"] < 1 ? "-" : report["02"]}</td>
              <td>{report["03"] < 1 ? "-" : report["03"]}</td>
              <td>{report["04"] < 1 ? "-" : report["04"]}</td>
              <td>{report["05"] < 1 ? "-" : report["05"]}</td>
              <td>{report["06"] < 1 ? "-" : report["06"]}</td>
              <td>{report["07"] < 1 ? "-" : report["07"]}</td>
              <td>{report.OK < 1 ? "-" : report.OK}</td>
              <td>{report.NG < 1 ? "-" : report.NG}</td>
              <td>
                {report.OK - report.NG < 1 ? "-" : report.OK - report.NG}</td
              >
              <td class="!text-left print:whitespace-normal print:w-40 w-20"
                ><p>
                  {report.keterangan}
                </p></td
              >
              <td>{report.lot}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="flex justify-end px-1">
    <table class="text-center lg:w-fit w-full footer">
      <tr class="font-bold">
        <td><p class="lg:w-36">Disetujui</p></td>
        <td><p class="lg:w-36">Diperiksa</p></td>
        <td><p class="lg:w-36">Dibuat</p></td>
      </tr>
      <tr>
        <td><div class="py-12" /></td>
        <td><div class="py-12" /></td>
        <td><div class="py-12" /></td>
      </tr>
      <tr class="font-bold">
        <td>Planner</td>
        <td>Kasie. Produksi</td>
        <td>Karu. Produksi</td>
      </tr>
    </table>
  </div>
</div>

<style lang="scss">
  .report {
    @apply w-full whitespace-nowrap my-1 break-inside-auto;

    tr {
      @apply break-inside-avoid break-after-auto;
    }

    th,
    td {
      @apply border border-slate-800 py-1;
    }

    .thead {
      @apply bg-slate-800/50;
    }

    th {
      @apply px-4;
    }

    td {
      @apply text-center px-2;
    }
  }

  .footer {
    td {
      @apply border border-slate-800;
    }
  }
</style>
