<script lang="ts">
  import { disableIsDown, onMouseDown, onMouseMove } from "../drag-scoll";
  import { getPlanDetail } from "../services/laporan-produksi";
  import { contentLoading, isTemplateActive, searchKeyword } from "../store";
  import type { ILaporanProduksi } from "../types";
  import { getPlanIdFromURL, utcToDate } from "../utils";

  let reports: ILaporanProduksi[] = [];
  let reportSample: ILaporanProduksi;
  let planId: string;

  async function fetchPlan(planId: string) {
    try {
      $contentLoading = true;
      const results = await getPlanDetail(planId);
      if ($isTemplateActive) {
        reports = results.map((r) => ({
          ...r,
          "01": 0,
          "02": 0,
          "03": 0,
          "04": 0,
          "05": 0,
          "06": 0,
          "07": 0,
          "08": 0,
          NG: 0,
          OK: 0,
        }));
      } else {
        reports = results;
      }
      $contentLoading = false;
    } catch (error) {
      $contentLoading = false;
    }
  }

  $: planId = getPlanIdFromURL();
  $: $isTemplateActive, fetchPlan($searchKeyword || planId);
  $: if (Array.isArray(reports) && reports.length > 0) {
    reportSample = reports[0];
  } else {
    // @ts-ignore
    reportSample = undefined;
  }
  $: if ($isTemplateActive && $searchKeyword)
    getPlanDetail($searchKeyword).then((data) => {
      if (data.length) reportSample = data[0];
    });
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
            <span class="inline-block w-20">No. Plan</span> : {reportSample?.no_plan ||
              "-"}
          </p>
        </td>
        <td colspan="3" class="border-none">
          <p class="text-left">
            <span class="inline-block w-20">Tanggal</span> : {utcToDate(
              reportSample?.start
            ) || "-"}
            <span class="inline-block w-10 text-center">s/d</span>
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
        <th>Plan</th>
        <th>I</th>
        <th>II</th>
        <th>III</th>
        <th>IV</th>
        <th>V</th>
        <th>VI</th>
        <th>VII</th>
        {#if reportSample?.no_bagian === "T4"}
          <th>VIII</th>
        {/if}
        <th>OK</th>
        <th>NG</th>
        <th>TOTAL</th>
        <th>Keterangan</th>
        <th>LOT</th>
        <th>No. Plan</th>
      </tr>
      <tbody>
        {#if reports.length === 0}
          <tr>
            <td colspan="20" class="italic"
              >Laporan tidak ditemukan atau tidak ada</td
            >
          </tr>
        {:else}
          {#each reports as report, i (i)}
            <tr>
              <td>{i + 1}</td>
              <td class="!text-left"><p class="part">{report.barang}</p></td>
              <td class="!text-left operator"
                ><p class="min-w-32">
                  {$isTemplateActive ? "" : report.nama_operator.trim() || "-"}
                </p></td
              >
              <td>{$isTemplateActive ? "" : report.kode_mesin || "-"}</td>
              <td
                ><p class="min-w-16">
                  {$isTemplateActive
                    ? ""
                    : utcToDate(report.start, "HH:mm") || "-"}
                </p></td
              >
              <td
                ><p class="min-w-16">
                  {$isTemplateActive
                    ? ""
                    : utcToDate(report.finish, "HH:mm") || "-"}
                </p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report.plan || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["01"] || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["02"] || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["03"] || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["04"] || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["05"] || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["06"] || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report["07"] || "-"}</p></td
              >
              {#if reportSample?.no_bagian === "T4"}
                <td class="template-td">
                  <p>
                    {$isTemplateActive ? "" : report["08"] || "-"}
                  </p>
                </td>
              {/if}
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report.OK || "-"}</p></td
              >
              <td class="template-td"
                ><p>{$isTemplateActive ? "" : report.NG || "-"}</p></td
              >
              <td class="template-td"
                ><p>
                  {$isTemplateActive ? "" : report.OK - report.NG || "-"}
                </p></td
              >
              <td class="!text-left print:whitespace-normal print:w-40 w-20"
                ><p>
                  {$isTemplateActive ? "" : report.keterangan || "-"}
                </p></td
              >
              <td
                ><p>
                  {$isTemplateActive ? "" : report.lot_material || "-"}
                </p></td
              >
              <td><p>{$isTemplateActive ? "" : report.no_plan || "-"}</p></td>
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

  .template-td p {
    @apply min-w-10;
  }
</style>
