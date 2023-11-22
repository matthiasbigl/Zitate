<script>



import {signIn} from "@auth/sveltekit/client";
</script>


<div
        class="flex flex-col justify-center items-center py-4 gap-2 min-h-screen"
>

    <h1>
        In order to post a new Quote you need to be logged in.
    </h1>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    on:click={()=>signIn("azure-ad","..")}
    >
        Login
    </button>




</div>

