<script lang="ts">
  import QRCode from "qrcode";
  import logo from "../../assets/logo.png";
  import type { IPortalLaporan } from "../types";
  import { findReports } from "../services/portal-laporan";
  import { contentLoading, searchKeyword } from "../store";
  let report: IPortalLaporan;

  async function generateQrcode(code: string) {
    if (!code) return;
    return await QRCode.toDataURL(code, { margin: 0, scale: 3.5 });
  }

  async function getReport(itemCode: string) {
    try {
      $contentLoading = true;
      const result = await findReports(itemCode);
      if (result.length === 0) throw new Error("There is no result");
      report = result.find((r) => r.kode_barang === itemCode) as IPortalLaporan;
      $contentLoading = false;
    } catch (error) {
      $contentLoading = false;
    }
  }
  $: getReport($searchKeyword);
</script>

<div class="portal-laporan">
  <table class="w-full" id="table-portal-laporan">
    <tbody>
      <tr>
        <td colspan="13">
          <p class="text-[9px] font-bold -my-0.5">FPSM-7-5-1-03/R0</p>
        </td>
      </tr>
      <tr>
        <td colspan="4"
          ><img
            src={logo}
            alt="Logo"
            class="mx-auto w-20 bg-blend-multiply"
          /></td
        >
        <td colspan="9" rowspan="2">
          <div class="flex gap-2 items-center p-1.5">
            <p class="flex-grow font-black text-xl whitespace-nowrap">
              LAPORAN PRODUKSI HARIAN OPERATOR
            </p>
            {#await generateQrcode(report?.qrcode) then qrcode}
              {#if qrcode}
                <img src={qrcode} alt="qr-code" />
              {/if}
            {/await}
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <p class="whitespace-nowrap text-center text-[10px] -my-1">
            PT. NANDYA KARYA PERKASA
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="border-none pl-2">Bagian</td>
        <td colspan="9" class="border-none">:</td>
      </tr>
      <tr>
        <td colspan="4" class="border-none pl-2">No. Dies & Nama Dies / Jig</td>
        <td colspan="9" class="border-none">:</td>
      </tr>
      <tr>
        <td colspan="4" class="border-none pl-2">Proses</td>
        <td colspan="9" class="border-none">
          <div class="flex items-center gap-2">
            <p>:</p>
            <p class="font-bold">{report?.nama_barang || ""}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="border-none pl-2">Circle Time</td>
        <td colspan="9" class="border-none">:</td>
      </tr>
      <tr class="text-center">
        <td rowspan="2"><p class="px-0.5">No</p></td>
        <td rowspan="2"><p class="px-6">Tanggal</p></td>
        <td rowspan="2"
          ><div class="flex items-center justify-center rotate-90">
            Shift
          </div></td
        >
        <td colspan="2">Jam Kerja</td>
        <td rowspan="2"><p class="w-14 mx-auto">No Nama Mesin</p></td>
        <td rowspan="2">Operator</td>
        <td rowspan="2"><p class="w-14 mx-auto">Rencana Produksi</p></td>
        <td colspan="3">Hasil Aktual</td>
        <td rowspan="2">Cek Jig</td>
        <td rowspan="2"><p class="px-6">Keterangan</p></td>
      </tr>
      <tr class="text-center">
        <td><p class="w-10 mx-auto">Start</p></td>
        <td><p class="w-10 mx-auto">Finish</p></td>
        <td><p class="w-8 mx-auto">OK</p></td>
        <td><p class="w-8 mx-auto">NG</p></td>
        <td><p class="w-8 mx-auto">Total</p></td>
      </tr>
      {#each Array(29) as _item, i (i)}
        <tr>
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
          <td class="py-3.5" />
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  table {
    @apply w-full text-[11px] leading-4;
  }

  tr,
  td {
    @apply border border-black;
  }
</style>
