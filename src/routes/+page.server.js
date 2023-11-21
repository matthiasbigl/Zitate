import {supabase} from "$lib/supaBaseClient.js";

export async function load() {
    const { data } = await supabase.from("zitate").select('*');
    console.log(data);


    data?.reverse();

    return {
       zitate: data
    }
}
/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies, request }) => {
        const dataSvelte = await request.formData();
        const quote = dataSvelte.get('quote');
        const person = dataSvelte.get('person');

        if(!quote || !person){
            return {
                status: 400,
                body: {
                    error: "quote and person are required"
                }
            }
        }

        console.log(quote);

        const { data, error } = await supabase
            .from('zitate')
            .insert([
                { quote: quote, person: person },
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