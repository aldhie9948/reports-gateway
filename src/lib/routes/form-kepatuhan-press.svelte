<script lang="ts">
  import moment from "moment";
  import { getKepatuhanPress } from "../services/kepatuhan-karyawan";
  import { contentLoading, searchKeyword } from "../store";
  import type { IKepatuhanPress } from "../types";

  let formPress: IKepatuhanPress[] = [];
  let selectedDate: string;
  async function fetchData(date: string) {
    try {
      $contentLoading = true;
      formPress = await getKepatuhanPress(date);
      $contentLoading = false;
    } catch (error) {
      $contentLoading = false;
    }
  }
  $: $searchKeyword, fetchData($searchKeyword);
  $: selectedDate = $searchKeyword;
</script>

<div class="overflow-auto mb-5">
  <table id="main">
    <thead class="header">
      <tr class="bg-white">
        <th colspan="31" class="!border-none font-normal !p-0">
          <p class="text-right">FPK-PROD-41-02/R0</p>
        </th>
      </tr>
      <tr class="bg-white">
        <th colspan="31" class="!border-none font-normal !p-0">
          <p class="text-left">
            TANGGAL :
            {#if selectedDate}
              {moment(selectedDate).format("DD/MM/YYYY")}
            {:else}
              ..............................
            {/if}
          </p>
        </th>
      </tr>
      <tr>
        <th colspan="31">FORM KONTROL KEPATUHAN OPERATOR</th>
      </tr>
    </thead>
    <tbody>
      <tr class="header">
        <td rowspan="3">NO</td>
        <td rowspan="3">NAMA OPERATOR</td>
        <td rowspan="3">NIK</td>
        <td rowspan="3">PROSES</td>
        <td colspan="12">KONDISI SAFETY MESIN</td>
        <td colspan="6">KELENGKAPAN DAN SIKAP KERJA OPERATOR</td>
        <td colspan="8">LINGKUNGAN KERJA</td>
        <td rowspan="3">CATATAN</td>
      </tr>
      <tr class="header break-header">
        <td colspan="2"><p>CHECK SHEET MESIN</p></td>
        <td colspan="2"><p>VERIFIKASI SET UP</p></td>
        <td colspan="2"><p>SENSOR</p></td>
        <td colspan="2"><p>KONDISI SENSOR</p></td>
        <td colspan="2"><p>SOP</p></td>
        <td colspan="2"><p>KESESUAIAN SOP</p></td>
        <td colspan="2"><p>EAR PLUG</p></td>
        <td colspan="2"><p>SEPATU SAFETY</p></td>
        <td colspan="2"><p>GANJAL TOMBOL</p></td>
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
        <td><p>AKTIF</p></td>
        <td><p>TDK AKTIF</p></td>
        <td><p>ADA</p></td>
        <td><p>TDK ADA</p></td>
        <td><p>SESUAI</p></td>
        <td><p>TDK SESUAI</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>PAKAI</p></td>
        <td><p>TDK PAKAI</p></td>
        <td><p>YA</p></td>
        <td><p>TIDAK</p></td>
        <td><p>ADA</p></td>
        <td><p>TIDAK</p></td>
        <td><p>SESUAI</p></td>
        <td><p>TIDAK</p></td>
        <td><p>KMBLI</p></td>
        <td><p>TDK KMBLI</p></td>
        <td><p>ADA</p></td>
        <td><p>TDK ADA</p></td>
      </tr>
      {#if formPress.length < 1}
        <tr>
          <td colspan="31">
            <p class="italic font-light">Data tidak ditemukan</p>
          </td>
        </tr>
      {:else}
        {#each formPress as item, i (item.id)}
          <tr class="content">
            <td><p class="text-center">{i + 1}</p></td>
            <td
              ><p class="print:!max-w-[10rem] print:!whitespace-normal">
                {item.karyawan}
              </p></td
            >
            <td><p class="text-center">{item.nik || "-"}</p></td>
            <td
              ><p class="print:max-w-[4rem] print:whitespace-normal">
                {item.proses}
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
                {item.sensor ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.sensor ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.kondisi_sensor ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.kondisi_sensor ? "✓" : ""}
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
                {item.kesesuaian_sop ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.kesesuaian_sop ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {item.ear_plug ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.ear_plug ? "✓" : ""}
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
                {item.ganjal_tombol ? "✓" : ""}
              </p></td
            >
            <td
              ><p class="text-center font-bold">
                {!item.ganjal_tombol ? "✓" : ""}
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
                {item.catatan}
              </p></td
            >
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<div class="flex items-center justify-end">
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
  #main {
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
    #main {
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
