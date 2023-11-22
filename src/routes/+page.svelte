<script>
    import {supabase} from "$lib/supaBaseClient.js";
    import {signIn, signOut} from "@auth/sveltekit/client";

    /** @type {import('./$types').PageData} */
    export let data;

    /** @type {import('./$types').ActionData} */
    export let form;

    const {zitate, session} = data;


</script>


<div
        class="flex flex-col justify-center items-center py-4 gap-2"
>
    <div
            class=" flex flex-row justify-center items-center gap-2 w-full "
    >
        <h1
                class="font-bold text-6xl text-white mb-4"
        >
            HTL Zitate
        </h1>
    </div>


    <div
            class="flex flex-col lg:flex-row justify-center items-center gap-4 drop-shadow-lg"

    >
    <form

            method="POST"
           >
        <input
                type="text"
                name="quote"
                required
                placeholder="Zitat"
                class="border-2 border-gray-300 rounded-md p-2"
        >
        <input
                name="person"
                type="text"
                required
                placeholder="Autor"
                class="border-2 border-gray-300 rounded-md p-2"
        >

        <button
                class={`bg-green-500 rounded-md p-2 ${!session ? "opacity-50 cursor-not-allowed bg-gray-500" : ""}`}
                type="submit"
                disabled={!session}

        >
            Hinzufügen
        </button>




    </form>
    {#if !session}
        <button class="bg-blue-900 text-white font-bold py-2 px-4 rounded"
                on:click={()=>signIn("azure-ad","/")}
        >
            Login
        </button>
    {:else}
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                on:click={()=>signOut()}
        >
            Logout
        </button>
    {/if}
    </div>

    {
            #if !session
    }
    <p
            class="text-white text-lg text-center"
    >
        Zitate sind anonym um Spam zu vermeiden ist ein Login nötig
    </p>
    {
            /if
    }

</div>

<div
        class="flex flex-col justify-center items-center p-4"
>
    {#each zitate as zitat}
        <div
                class="flex flex-col justify-center my-2 items-center bg-white rounded-md p-4 w-full lg:w-[80%] drop-shadow-lg"
        >
            <p
                    class="text-xl font-bold"
            >
                "{zitat.quote}"
            </p>
            <p
                    class="text-lg"
            >
                {zitat.person}
            </p>
            <p
                    class="text-lg"
            >
                {new Date(zitat.created_at).toLocaleDateString()}
            </p>

        </div>

    {/each}
</div>
