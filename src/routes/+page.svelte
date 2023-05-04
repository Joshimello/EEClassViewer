<script>
  let courseid = ''
  let cookie = ''

  let msg
  let load = false

  const action = async () => {
    msg = undefined
    load = true

    const res = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ courseid, cookie })
    })

    res.json().then(res=>{
      msg = res
      load = false
    })
  }
</script>

<div class="p-8 flex flex-col gap-1">
  <span class="text-xl tracking-widest font-mono">
    COURSE ID
  </span>
  <input bind:value={courseid} class="bg-transparent border-b-2 text-2xl outline-none" type="number" />

  <span class="text-xl tracking-widest font-mono mt-8">
    COOKIE
  </span>
  <input bind:value={cookie} class="bg-transparent border-b-2 text-2xl outline-none" type="text" />
  <span class="text-sm">
    run this in console after login: 
    <span class="text-purple-500">
      document.cookie.match(/quizAnswerCorrected-([a-zA-Z0-9]+)=;/)[1]</span>
    </span>
  {#if !load}
    <button
      on:click={action}
      class="text-xl tracking-widest font-mono bg-blue-100 rounded-xl p-3 mt-8"
    >
      MAGIC
    </button>
  {:else}
    <div class="text-xl tracking-widest font-mono bg-gray-200 rounded-xl p-3 mt-8 text-center">LOADING</div>
  {/if}

  <span class="text-xl font-mono text-center">
    {#if msg}
      {#if msg.length}
        <span class="text-green-400">
          Success: viewed {msg.length} posts
        </span>
      {:else}
        <span class="text-red-400">
          Error: found no posts
        </span>
      {/if}
    {/if}
  </span>
</div>