<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  let query = '';
  const dispatch = createEventDispatcher();
  
  function handleSubmit() {
    if (query.trim()) {
      dispatch('search', query.trim());
      query = '';
    }
  }
</script>

<div class="search">
  <div class="search__field">
    <span class="search__icon" aria-hidden="true">🔍</span>
    <input
      type="text"
      bind:value={query}
      placeholder="Search for a city"
      on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
      class="search__input"
      aria-label="Search for a city"
    />
    {#if query}
      <button type="button" class="search__clear" on:click={() => (query = '')} aria-label="Clear search">
        ×
      </button>
    {/if}
  </div>
</div>

<style>
  .search {
    flex: 1;
    max-width: 300px;
  }

  .search__field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
  }

  .search__field:focus-within {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .search__icon {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .search__input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    font-size: 0.9rem;
    outline: none;
    font-weight: 400;
  }

  .search__input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .search__clear {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 0.9rem;
    line-height: 1;
    transition: background 0.2s ease;
  }

  .search__clear:hover {
    background: rgba(255, 255, 255, 0.25);
  }
</style>
