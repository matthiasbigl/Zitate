import {supabase} from "$lib/supaBaseClient.js";
import {signIn} from "@auth/sveltekit/client";
import {redirect} from "@sveltejs/kit";

// @ts-ignore
export async function load(event) {

    const session = event.locals.session;

    const {data} = await supabase.from("zitate").select('*');

    data?.reverse();

    return {
        zitate: data
    }
}


/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, request, locals}) => {

        // @ts-ignore

        const session =await locals.getSession()

        if (!session) {
            return redirect(301,"/auth/login");
        }



        const dataSvelte = await request.formData();
        const quote = dataSvelte.get('quote');
        const person = dataSvelte.get('person');

        if (!quote || !person) {
            return {
                status: 400,
                body: {
                    error: "quote and person are required"
                }
            }
        }
        if (String(quote).length > 500) {
            return {
                status: 400,
                body: {
                    error: "quote is too long"
                }
            }
        }
        if (String(person).length > 100) {
            return {
                status: 400,
                body: {
                    error: "person is too long"
                }
            }
        }

        //check if there are only spaces in the quote or person
        if (String(quote).trim().length === 0 || String(person).trim().length === 0) {
            return {
                status: 400,
                body: {
                    error: "quote and person are required"
                }
            }
        }

        console.log(quote);

        const {data, error} = await supabase
            .from('zitate')
            .insert([
                {quote: quote, person: person, user_email: session.user?.email,},
            ])
            .select()

        if (error) {
            console.log(error);
            return {
                status: 500,
                body: {
                    error: error.message
                }
            }
        }
        return {
            status: 200,
            body: {
                data: data
            }
        }

    },

};