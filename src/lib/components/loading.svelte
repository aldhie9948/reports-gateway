<script lang="ts">
  import Icon from "@iconify/svelte";
  import { fade } from "svelte/transition";
</script>

<div class="loading" transition:fade>
  <Icon
    icon="gg:spinner"
    class="animate-spin text-slate-100 drop-shadow"
    width="4rem"
  />
</div>

<style lang="scss">
  .loading {
    @apply grid place-content-center h-full inset-0 absolute z-10;
  }

  .loading::before {
    content: "";
    @apply absolute inset-0 bg-black/50;
  }
</style>
