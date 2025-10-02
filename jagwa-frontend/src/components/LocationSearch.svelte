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

<div class="search-container">
  <input
    type="text"
    bind:value={query}
    placeholder="Enter location..."
    on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
    class="search-input"
  />
  <button on:click={handleSubmit} class="search-button">
    Search
  </button>
</div>

<style>
  .search-container {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .search-button {
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
  }
  
  .search-button:hover {
    background: #45a049;
  }
</style>
