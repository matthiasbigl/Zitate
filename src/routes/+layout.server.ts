import type { LayoutServerLoad } from "./$types";
import type {Session} from "@auth/core/types";



interface AuthSession extends Session {
    id_token?: string;
    roles?: Roles[];
}
enum Roles{
    STUDENT="GradingBot.Student",
    TEACHER="GradingBot.Teacher",

}


export const load: LayoutServerLoad = async (event) => {

    const session = await event.locals.getSession() as AuthSession;

    return {
        session: session,
    }

}
