import type {JWT} from "@auth/core/jwt";
import {SvelteKitAuth} from "@auth/sveltekit";
import type {SvelteKitAuthConfig} from "@auth/sveltekit";
import AzureAD from "@auth/core/providers/azure-ad";
import type {Account} from "@auth/core/types";
import {AZURE_AD_APP_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID, JWT_SECRET} from "$env/static/private";
import {sequence} from "@sveltejs/kit/hooks";


import type {Session} from "@auth/core/types";
import {redirect} from "@sveltejs/kit";

 enum Roles{
    STUDENT="GradingBot.Student",
    TEACHER="GradingBot.Teacher",

}

 interface AuthSession extends Session {
    id_token?: string;
    roles?: Roles[];
}




async function refreshAccessToken(token: JWT) {
    try {
        const url = `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:
                `grant_type=refresh_token` +
                `&client_secret=${ AZURE_AD_CLIENT_SECRET }` +
                `&refresh_token=${token.refreshToken as string}` +
                `&client_id=${ AZURE_AD_APP_ID }`,
        });

        const refreshedTokens = (await response.json()) as {
            token_type: string;
            scope: string;
            expires_in: number;
            ext_expires_in: number;
            access_token: string;
            refresh_token: string;
            id_token: string;
        };

        if (!response.ok) throw refreshedTokens;

        return {
            ...token,
            idToken: refreshedTokens.id_token,
            idTokenExpires: Date.now() + 3595000, // use 1 hour in milliseconds since no id token values are provided by endpoint
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export const authOptions: SvelteKitAuthConfig = {
    trustHost: true,
    //debug: true,
    providers: [
        AzureAD({
            clientId: AZURE_AD_APP_ID,
            clientSecret: AZURE_AD_CLIENT_SECRET,
            tenantId: AZURE_AD_TENANT_ID,
            authorization: {
                params: {
                    scope: 'offline_access openid email profile',
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }: { token: JWT; account?: Account | null }): Promise<JWT> {
            // Persist the Azure id_token to the token right after signin
            if (account) {
                token.idToken = account.id_token;
                token.idTokenExpires = (Date.now() + 3595000);
                token.refreshToken = account.refresh_token;
                return token;
            }


            if (token.idTokenExpires && Date.now() < (token.idTokenExpires as number)) {
                return token;
            }

            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            if (session) {


                const roles = ()=>{
                    const base64Url = String(token.idToken).split('.')[1];
                    if (!base64Url){
                        return [];
                    }
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }
                    ).join(''));
                    const payload = JSON.parse(jsonPayload);

                    return payload.roles as Roles[];

                }

                session = Object.assign({}, session, {
                    id_token: token.idToken,
                    roles: roles(),
                });
            }


            return session as AuthSession;
        },

    },

    secret: JWT_SECRET,
};

export const handle= sequence(SvelteKitAuth(authOptions));