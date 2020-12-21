<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let name = "";
  export let value = "";
  let localValue = value;

  export let isNew = false;

  function copyWebPageInfo() {
    dispatch("copy", { value });
  }

  function addFormat() {
    dispatch("add", { name, value: localValue });
    name = "";
    value = "";
    localValue = "";
  }

  function updateFormat() {
    dispatch("update", { name, value: localValue });
    value = localValue;
  }

  function removeFormat() {
    dispatch("remove", { name });
  }
</script>

<style>
  .format {
    width: 100%;
  }
  .name {
    width: 70%;
  }
</style>

<div>
  {#if !isNew}
    <button on:click={(e) => copyWebPageInfo()}>{name}</button>
    <button on:click={(e) => updateFormat()}>更新</button>
    <button on:click={(e) => removeFormat()}>削除</button>
    <input type="text" class="format" bind:value={localValue} />
  {:else}
    <input type="text" class="name" bind:value={name} data-testid="new-name" />
    <button on:click={(e) => addFormat()}>登録</button>
    <input
      type="text"
      class="format"
      bind:value={localValue}
      data-testid="new-value" />
  {/if}
</div>
