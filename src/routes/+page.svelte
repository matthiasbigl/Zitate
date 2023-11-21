<script>
    import {supabase} from "$lib/supaBaseClient.js";

    /** @type {import('./$types').PageData} */
    export let data;

    /** @type {import('./$types').ActionData} */
    export let form;

    const {zitate} = data;
</script>


<div class="min-h-screen  bg-gradient-to-r from-cyan-500 to-blue-500">

    <div
    class="flex flex-col justify-center items-center py-4 gap-2"
    >
        <h1
                class="font-bold text-6xl text-white"
        >
            HTL Zitate
        </h1>

        <form

                method="POST"
                class="flex flex-row justify-center items-center gap-4 drop-shadow-lg"
        >
            <input
                    type="text"
                    name="quote"
                    placeholder="Zitat"
                    class="border-2 border-gray-300 rounded-md p-2"
            >
            <input
                    name="person"
                    type="text"
                    placeholder="Autor"
                    class="border-2 border-gray-300 rounded-md p-2"
            >
            <button
                    class="bg-green-500 text-white rounded-md p-2"
                    type="submit"
            >
                Hinzufügen
            </button>

        </form>

    </div>

    <div
            class="flex flex-col justify-center items-center p-4"
    >
        {#each zitate as zitat}
        <div
                class="flex flex-col justify-center my-2 items-center bg-white rounded-md p-4 w-[80%] drop-shadow-lg"
        >
            <p
                    class="text-xl font-bold"
            >
                {zitat.quote}
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

</div>