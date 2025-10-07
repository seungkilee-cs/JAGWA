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
  <button on:click={handleSubmit} class="search__button">
    Go
  </button>
</div>

<style>
  .search {
    display: flex;
    gap: 0.75rem;
    margin: 1.5rem auto 2.5rem;
    max-width: 520px;
    width: 100%;
    align-items: center;
  }

  .search__field {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-radius: 1.5rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.3);
    backdrop-filter: blur(16px);
  }

  .search__icon {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .search__input {
    flex: 1;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.95);
    font-size: 1rem;
    outline: none;
  }

  .search__input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .search__clear {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    line-height: 1;
  }

  .search__button {
    padding: 0.85rem 1.5rem;
    border-radius: 1.5rem;
    border: none;
    background: linear-gradient(120deg, rgba(59, 130, 246, 0.9), rgba(96, 165, 250, 0.8));
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 10px 24px rgba(59, 130, 246, 0.35);
  }

  .search__button:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(59, 130, 246, 0.42);
  }

  @media (max-width: 520px) {
    .search {
      flex-direction: column;
      align-items: stretch;
    }

    .search__button {
      width: 100%;
    }
  }
</style>
