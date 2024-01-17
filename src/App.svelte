<script lang="ts">
  import Icon from "@iconify/svelte";
  import moment from "moment";
  import "moment/dist/locale/id";
  import { Route, Router, navigate } from "svelte-routing";
  import Select from "svelte-select";
  import Loading from "./lib/components/loading.svelte";
  import LaporanProduksi from "./lib/routes/laporan-produksi.svelte";
  import NotFound from "./lib/routes/not-found.svelte";
  import PortalLaporan from "./lib/routes/portal-laporan.svelte";
  import RencanaProduksi from "./lib/routes/rencana-produksi.svelte";
  import { getPlansList } from "./lib/services/laporan-produksi";
  import { findReports } from "./lib/services/portal-laporan";
  import { findPlanProduction } from "./lib/services/rencana-produksi";
  import { contentLoading, searchKeyword } from "./lib/store";
  import FormKepatuhanPress from "./lib/routes/form-kepatuhan-press.svelte";
  import { getSelectItems } from "./lib/services/kepatuhan-karyawan";
  import AutoImportLogs from "./lib/routes/auto-import-logs.svelte";
  moment.locale("id");

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
      component: NotFound,
    },
    {
      label: "Auto Import Logs",
      slug: "auto-import-logs",
      icon: "icon-park-outline:upload-logs",
      component: AutoImportLogs,
    },
  ];
  const groupBy = (item: any) => item?.group;
  let selectedNav: string = navItems[0].slug;
  let selectedValue: any;
  const openNav = (slug: string) => () => (selectedNav = slug);

  function loadOptinsHandler(currentNav: string) {
    return async (text: string) => {
      try {
        if (currentNav === "portal-laporan") {
          const lists = await findReports(text);
          return lists.map((r) => ({
            value: r.kode_barang,
            label: r.nama_barang.concat(" | ", r.kode_barang),
          }));
        } else if (currentNav === "laporan-produksi") {
          const lists = await getPlansList(text);
          return lists;
        } else if (currentNav === "rencana-produksi") {
          const lists = await findPlanProduction(text);
          return lists;
        } else if (currentNav === "kepatuhan-press") {
          return await getSelectItems(text);
        }

        throw new Error("Current Nav is not available or undefined");
      } catch (error) {
        console.log("Load Options:", error);
        return [];
      }
    };
  }

  function printPage() {
    window.print();
  }
  const basepath = import.meta.env.VITE_BASEPATH;
  export let url = "";

  $: navigate(selectedNav);
  $: selectedNav, ($searchKeyword = "");
  $: selectedNav, (selectedValue = null);
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
          class:active={item.slug === selectedNav}
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
        bind:value={selectedValue}
        loadOptions={loadOptinsHandler(selectedNav)}
        placeholder="Cari nomor plan, nama part, atau tanggal"
      />
      <button
        on:click={printPage}
        class="flex items-center gap-2 bg-gradient-to-b from-green-500 to-green-600 text-slate-100 px-8 py-3 rounded-lg font-semibold duration-200 active:scale-90"
      >
        <Icon icon="material-symbols:print" class="text-lg" />
        <h1>Cetak</h1>
      </button>
    </div>
    <div
      class="bg-white rounded-lg p-5 overflow-auto flex-grow print:p-0 print:m-0 print:overflow-auto print:rounded-none"
    >
      <Router {url} {basepath}>
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
</style>
