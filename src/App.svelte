<script lang="ts">
  import Icon from "@iconify/svelte";
  import ExcellentExport from "excellentexport";
  import moment from "moment";
  import "moment/dist/locale/id";
  import { onMount } from "svelte";
  import { Route, Router, navigate } from "svelte-routing";
  import Select from "svelte-select";
  import Loading from "./lib/components/loading.svelte";
  import AutoImportLogs from "./lib/routes/auto-import-logs.svelte";
  import FormKepatuhanPress from "./lib/routes/form-kepatuhan-press.svelte";
  import FormKepatuhanWelding from "./lib/routes/form-kepatuhan-welding.svelte";
  import LaporanProduksi from "./lib/routes/laporan-produksi.svelte";
  import PortalLaporan from "./lib/routes/portal-laporan.svelte";
  import RencanaProduksi from "./lib/routes/rencana-produksi.svelte";
  import {
    getSelectItemsByDate,
    getSelectItemsByMonth,
    getSelectItemsByWorker,
  } from "./lib/services/kepatuhan-karyawan";
  import { getPlansList } from "./lib/services/laporan-produksi";
  import { findReports } from "./lib/services/portal-laporan";
  import { findPlanProduction } from "./lib/services/rencana-produksi";
  import {
    contentLoading,
    currentKepatuhanSearchType,
    isTemplateActive,
    searchKeyword,
    selectedValue,
  } from "./lib/store";

  moment.locale("id");
  let placeholderSelect: string = "";

  const navItems = [
    {
      label: "Laporan Produksi",
      slug: "laporan-produksi",
      icon: "streamline:production-belt-solid",
      component: LaporanProduksi,
    },
    {
      label: "Rencana Produksi",
      slug: "rencana-produksi",
      icon: "icon-park-solid:plan",
      component: RencanaProduksi,
    },
    {
      label: "Portal Laporan",
      slug: "portal-laporan",
      icon: "bxs:report",
      component: PortalLaporan,
    },
    {
      label: "Kepatuhan Press",
      slug: "kepatuhan-press",
      icon: "mdi:user-tie",
      component: FormKepatuhanPress,
    },
    {
      label: "Kepatuhan Welding",
      slug: "kepatuhan-welding",
      icon: "mdi:user-tie",
      component: FormKepatuhanWelding,
    },
    {
      label: "Auto Import Logs",
      slug: "auto-import-logs",
      icon: "icon-park-outline:upload-logs",
      component: AutoImportLogs,
    },
  ];
  const groupBy = (item: any) => item?.group;
  let selectedNav: string = "";
  let activeNav: string = "";
  let exportedFilename: string = "";
  let exportedTableId: string = "";
  const openNav = (slug: string) => () => {
    selectedNav = slug;
    activeNav = slug;
  };

  function loadOptinsHandler(currentNav: string) {
    return async (text: string) => {
      try {
        switch (currentNav) {
          case "portal-laporan":
            const lists = await findReports(text);
            return lists.map((r) => ({
              value: r.kode_barang,
              label: r.nama_barang.concat(" | ", r.kode_barang),
            }));
          case "laporan-produksi":
            return await getPlansList(text);

          case "rencana-produksi":
            return await findPlanProduction(text);

          case "kepatuhan-press":
            const byMonthPress = await getSelectItemsByMonth(text, "press");
            if (byMonthPress.length) {
              $currentKepatuhanSearchType = "worker";
              return byMonthPress;
            }
            const byDatePress = await getSelectItemsByDate(text, "press");
            if (byDatePress.length) {
              $currentKepatuhanSearchType = "date";
              return byDatePress;
            }
            const byWorkerPress = await getSelectItemsByWorker(text, "press");
            if (byWorkerPress.length) {
              $currentKepatuhanSearchType = "worker";
              return byWorkerPress;
            }

          case "kepatuhan-welding":
            const byMonthWelding = await getSelectItemsByMonth(text, "welding");
            if (byMonthWelding.length) {
              $currentKepatuhanSearchType = "worker";
              return byMonthWelding;
            }
            const byDateWelding = await getSelectItemsByDate(text, "welding");
            if (byDateWelding.length) {
              $currentKepatuhanSearchType = "date";
              return byDateWelding;
            }
            const byWorkerWelding = await getSelectItemsByWorker(
              text,
              "welding"
            );
            if (byWorkerWelding.length) {
              $currentKepatuhanSearchType = "worker";
              return byWorkerWelding;
            }
          default:
            console.log("Current Nav is not available or undefined");
            break;
        }
      } catch (error) {
        console.log("Load Options:", error);
        return [];
      }
    };
  }

  function printPage() {
    window.print();
  }

  function exportExcel(tableId: string) {
    return function (
      e: Event & { currentTarget: HTMLAnchorElement & EventTarget }
    ) {
      try {
        if (!tableId) throw new Error("Table ID is undefined");
        const target = e.currentTarget;
        const table = document.querySelector(tableId) as HTMLTableElement;
        return ExcellentExport.excel(target, table, "Sheet1");
      } catch (error) {
        console.log(error);
        e.preventDefault();
      }
    };
  }

  const basepath = import.meta.env.VITE_BASEPATH;

  onMount(() => {
    const { pathname } = window.location;
    if (pathname === basepath) {
      selectedNav = activeNav = navItems[0].slug;
    } else {
      const currentNavItem = navItems.find((item) => {
        const regex = new RegExp(item.slug);
        return regex.test(pathname);
      });
      if (!currentNavItem) return console.log("currentNavItem is undefined");
      activeNav = selectedNav = currentNavItem.slug;
    }
  });

  $: navigate(selectedNav);
  $: selectedNav, ($searchKeyword = "");
  $: selectedNav, ($selectedValue = undefined);
  $: {
    const space = $searchKeyword ? " " : "";
    switch (activeNav || selectedNav) {
      case "portal-laporan":
        placeholderSelect = "Cari nama part item..";
        exportedFilename = "Report Portal Laporan".concat(
          space,
          $searchKeyword || ""
        );
        exportedTableId = "#table-portal-laporan";
        break;
      case "laporan-produksi":
        placeholderSelect = "Cari nomor plan produksi..";
        exportedFilename = "Report Laporan Produksi".concat(
          space,
          $searchKeyword || ""
        );
        exportedTableId = "#table-laporan-produksi";
        break;
      case "rencana-produksi":
        placeholderSelect = "Cari nomor plan produksi..";
        exportedFilename = "Report Rencana Produksi".concat(
          space,
          $searchKeyword || ""
        );
        exportedTableId = "#table-rencana-produksi";
        break;
      case "kepatuhan-press":
        placeholderSelect = `Cari tanggal (ex: `.concat(
          moment().format("DD-MM-YYYY"),
          `), bulan, nama atau nik karyawan`
        );
        exportedFilename = "Report Kepatuhan Press".concat(
          space,
          $searchKeyword || ""
        );
        exportedTableId = "#table-kepatuhan-press";
        break;
      case "kepatuhan-welding":
        placeholderSelect = `Cari tanggal (ex: `.concat(
          moment().format("DD-MM-YYYY"),
          `), bulan, nama atau nik karyawan`
        );
        exportedFilename = "Report Kepatuhan Welding".concat(
          space,
          $searchKeyword || ""
        );
        exportedTableId = "#table-kepatuhan-welding";
        break;
      default:
        placeholderSelect = "";
        exportedFilename = "";
        exportedTableId = "";
        break;
    }
  }
</script>

<svelte:head>
  <title>Reports Gateway | NKP</title>
</svelte:head>
<main
  class="grid grid-cols-12 gap-2 h-screen overflow-hidden print:h-full print:m-0 print:p-0 print:overflow-auto"
>
  <nav class="h-full col-span-2 pl-5 py-10 text-slate-200 print:hidden">
    <div>
      <h1 class="font-bold text-lg">Gateway Reports</h1>
    </div>
    <div class="my-16"></div>
    <div class="flex flex-col gap-2.5">
      {#each navItems as item, i (i)}
        <button
          on:click={openNav(item.slug)}
          class="btn"
          class:active={item.slug === activeNav}
        >
          <Icon icon={item.icon} class="text-xl" />
          <h1>{item.label}</h1>
        </button>
      {/each}
    </div>
  </nav>
  <div
    class="col-span-10 print:col-span-12 h-full flex flex-col gap-2 overflow-hidden print:overflow-auto print:h-fit p-5 relative"
  >
    {#if $contentLoading}
      <Loading />
    {/if}
    <div class="flex items-center gap-2 print:hidden">
      <Select
        searchable
        loading
        {groupBy}
        bind:justValue={$searchKeyword}
        bind:value={$selectedValue}
        loadOptions={loadOptinsHandler(activeNav || selectedNav)}
        placeholder={placeholderSelect}
        debounceWait={1000}
      />
      <button on:click={printPage} class="btn-header">
        <Icon icon="material-symbols:print" class="text-lg" />
        <h1>Cetak</h1>
      </button>
      {#if [activeNav, selectedNav].includes("laporan-produksi")}
        <button
          class="btn-header"
          class:template-active={$isTemplateActive}
          on:click={() => ($isTemplateActive = !$isTemplateActive)}
        >
          <Icon icon="tabler:template" class="text-lg" />
          <h1>Template</h1>
        </button>
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="#"
        download={exportedFilename.concat(".xls")}
        on:click={exportExcel(exportedTableId)}
      >
        <button class="btn-header">
          <Icon icon="icon-park-outline:excel" class="text-lg" />
          <h1>Export</h1>
        </button>
      </a>
    </div>
    <div
      class="bg-white rounded-lg p-5 overflow-auto flex-grow print:p-0 print:m-0 print:overflow-auto print:rounded-none"
    >
      <Router {basepath}>
        {#each navItems as item, i (i)}
          <Route component={item.component} path={"/" + item.slug} />
        {/each}
      </Router>
    </div>
  </div>
</main>

<style lang="scss">
  .btn {
    @apply flex items-center gap-2 p-3 duration-200 rounded-lg font-semibold text-slate-300;
  }

  .active {
    @apply bg-gradient-to-b from-slate-700 to-slate-800 text-slate-200;
  }

  .btn-header {
    @apply flex items-center gap-2 bg-gradient-to-b from-green-500 to-green-600 text-slate-100 px-8 py-3 rounded-lg font-semibold duration-200 enabled:active:scale-90 disabled:grayscale enabled:cursor-pointer;
  }

  .template-active {
    @apply from-slate-50 to-slate-100 text-green-500;
  }
</style>
