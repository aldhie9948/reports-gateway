<script lang="ts">
  import moment from "moment";
  import {
    contentLoading,
    currentKepatuhanSearchType,
    searchKeyword,
  } from "../store";
  import type { IKepatuhanWelding, KepatuhanSearchType } from "../types";
  import { utcToDate } from "../utils";
  import { getKepatuhanKaryawan } from "../services/kepatuhan-karyawan";
  import { disableIsDown, onMouseDown, onMouseMove } from "../drag-scoll";

  let formWelding: IKepatuhanWelding[] = [];
  let tableType: KepatuhanSearchType = "date";
  let selectedDate: string;
  async function fetchData(text: string, type: KepatuhanSearchType) {
    try {
      $contentLoading = true;
      formWelding = (await getKepatuhanKaryawan(
        text,
        type,
        "welding"
      )) as IKepatuhanWelding[];
      $contentLoading = false;
    } catch (error) {
      $contentLoading = false;
    }
  }
  $: fetchData($searchKeyword, tableType);
  $: selectedDate = $searchKeyword;
  $: tableType = $currentKepatuhanSearchType as KepatuhanSearchType;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="overflow-auto mb-5 pb-1 px-1"
  id="parent-table"
  on:mousedown={onMouseDown}
  on:mouseleave={disableIsDown}
  on:mouseup={disableIsDown}
  on:mousemove={onMouseMove}
>
  <table id="table-kepatuhan-welding">
    <thead class="header">
      <tr class="bg-white">
        <th
          colspan={tableType === "date" ? 30 : 31}
          class="!border-none font-normal !p-0"
        >
          <p class="text-right">FPK-PROD-41-02/R0</p>
        </th>
      </tr>
      <tr class="bg-white">
        <th
          colspan={tableType === "date" ? 30 : 31}
          class="!border-none font-normal !p-0"
        >
          <p class="text-left">
            TANGGAL :
            {#if tableType === "date" && selectedDate}
              {moment(selectedDate).format("DD/MM/YYYY")}
            {:else}
              ..............................
            {/if}
          </p>
        </th>
      </tr>
      <tr>
        <th colspan={tableType === "date" ? 30 : 31}
          >FORM KONTROL KEPATUHAN OPERATOR</th
        >
      </tr>
    </thead>
    <tbody>
      <tr class="header">
        <td rowspan="3">NO</td>
        {#if tableType === "worker"}
          <td rowspan="3">TANGGAL</td>
        {/if}
        <td rowspan="3">NAMA OPERATOR</td>
        <td rowspan="3">NIK</td>
        <td rowspan="3">KODE MESIN</td>
        <td rowspan="3">PROSES</td>
        <td colspan="6">KONDISI SAFETY MESIN</td>
        <td colspan="10">KELENGKAPAN DAN SIKAP KERJA OPERATOR</td>
        <td colspan="8">LINGKUNGAN KERJA</td>
        <td rowspan="3">CATATAN</td>
      </tr>
      <tr class="header break-header">
        <td colspan="2"><p>CHECK SHEET MESIN</p></td>
        <td colspan="2"><p>VERIFIKASI SET UP</p></td>
        <td colspan="2"><p>SOP</p></td>
        <td colspan="2"><p>TOPI KERJA</p></td>
        <td colspan="2"><p>SEPATU SAFETY</p></td>
        <td colspan="2"><p>APPRON DADA</p></td>
        <td colspan="2"><p>MASKER</p></td>
        <td colspan="2"><p>ALAT BANTU KERJA</p></td>
        <td colspan="2"><p>OLI DAN SAMPAH</p></td>
        <td colspan="2"><p>LINE MESIN</p></td>
        <td colspan="2"><p>JIG PROSES</p></td>
        <td colspan="2"><p>HISTORY CARD</p></td>
      </tr>
      <tr id="option" class="header">
        <td><p>DIISI</p></td>
        <td><p>TDK DIISI</p></td>
        <td><p>DIISI</p></td>
        <td><p>TDK DIISI</p></td>
        <td><p>ADA</p></td>
        <td><p>TDK ADA</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>ADA</p></td>
        <td><p>TIDAK</p></td>
        <td><p>SESUAI</p></td>
        <td><p>TIDAK</p></td>
        <td><p>KEMBALI</p></td>
        <td><p>TDK KMBL</p></td>
        <td><p>ADA</p></td>
        <td><p>TDK ADA</p></td>
      </tr>
      {#if formWelding.length < 1}
        <tr>
          <td colspan={tableType === "date" ? 32 : 33}>
            <p class="italic font-light">Data tidak ditemukan</p>
          </td>
        </tr>
      {:else}
        {#each formWelding as item, i (item.id)}
          <tr class="content">
            <td><p class="text-center">{i + 1}</p></td>
            {#if tableType === "worker"}
              <td><p class="text-center">{utcToDate(item.tgl)}</p></td>
            {/if}
            <td
              ><p class="print:!max-w-[8rem] print:!whitespace-normal">
                {item.karyawan}
              </p></td
            >
            <td><p>{item.nik || "-"}</p></td>
            <td><p>{item.kode_mesin || "-"}</p></td>
            <td
              ><p class="print:max-w-[4rem] print:whitespace-normal">
                {item.proses || "-"}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.checksheet ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.checksheet ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.verifikasi_setup ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.verifikasi_setup ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.sop ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.sop ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.topi_kerja ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.topi_kerja ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.sepatu_safety ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.sepatu_safety ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.appron_dada ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.appron_dada ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.masker ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.masker ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.alat_bantu_kerja ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.alat_bantu_kerja ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.oli_sampah ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.oli_sampah ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.line_mesin ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.line_mesin ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.jig_proses ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.jig_proses ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.history_card ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.history_card ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="print:max-w-[10rem] print:whitespace-normal">
                {item.catatan || "-"}
              </p></td
            >
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<div class="flex items-center justify-end px-1">
  <table id="footer">
    <thead>
      <tr>
        <th><p class="min-w-36">DIBUAT</p></th>
        <th><p class="min-w-36">DIPERIKSA</p></th>
        <th><p class="min-w-36">DIKETAHUI</p></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><p class="py-10"></p></td>
        <td><p class="py-10"></p></td>
        <td><p class="py-10"></p></td>
      </tr>
      <tr>
        <td>KARU</td>
        <td>KASIE</td>
        <td>KADEP</td>
      </tr>
    </tbody>
  </table>
</div>

<style lang="scss">
  #table-kepatuhan-welding {
    @apply w-full;
    .header {
      @apply bg-slate-500/30 font-bold;
    }
    th,
    td {
      @apply whitespace-nowrap border border-slate-800 text-center px-2;
    }
    #option {
      td {
        white-space: normal !important;
      }
      p {
        @apply w-[4rem] mx-auto;
      }
    }
    .content {
      @apply uppercase;

      td {
        @apply text-left;
      }
    }
  }

  #footer {
    @apply text-center;
    td,
    tr,
    th {
      @apply border border-slate-800;
    }
  }

  @media print {
    #table-kepatuhan-welding {
      font-size: 10px !important;
      line-height: 1rem;
      td,
      th {
        @apply px-1;
      }
      #option {
        td {
          @apply px-1;
        }
        p {
          @apply max-w-[2.3rem];
        }
      }
      .break-header {
        p {
          @apply whitespace-normal;
        }
      }
    }
  }
</style>
