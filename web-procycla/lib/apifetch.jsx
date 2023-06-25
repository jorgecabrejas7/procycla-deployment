import { signOut } from "next-auth/react";
import { toast } from 'react-toastify';

export function apiUrl(url, api_url = undefined) {
    if(api_url) return `${api_url}${url}`;
    else {
        const { NEXT_PUBLIC_API_URL } = process.env;

        if(!NEXT_PUBLIC_API_URL)
        throw new Error("NEXT_PUBLIC_API_URL not defined");
        
        return `${NEXT_PUBLIC_API_URL}${url}`;
    }
}

export async function unprotectedFetch(url, method = "get", body = null, t = null) {
    try {
        console.log(`Fetching ${url} from apifetch unprotected`)
        console.log("Lo coge el cambio")
        console.log("Let's see what's wrong, hero you have env ", process.env)
        const res = await fetch(url, {
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json'
            }), 
            body: body
        });

        if(res.status !== 200) {
            const { message } = await res.json();
            
            if(message.includes('INVALID_CREDENTIALS') || message.includes('BANNED_ACCOUNT')) signOut();
            else toast.error(t === null ? message : t(message));
        }

        return res;
    }
    catch(error) {
        toast.error(t("API.NETWORK_ERROR"));
        return {
            status: 500
        };
    }
}

export async function protectedFetch(session, url, method = "get", body = null, t = null, isFile = false) {
    try {
        const user = session.data.user;
        const { accessToken } = user;
        const res = await fetch(url, {
            method: method,
            headers: isFile ? new Headers({
                'Authorization': `Bearer ${ accessToken }`
            }) :
            new Headers({
                'Authorization': `Bearer ${ accessToken }`, 
                'Content-Type': 'application/json'
            }), 
            body: body
        });

        if(res.status !== 200) {
            const { message } = await res.json();
            
            if(message.includes('INVALID_CREDENTIALS') || message.includes('BANNED_ACCOUNT')) signOut();
            else toast.error(t === null ? message : t(message));
        }

        return res;
    }
    catch(error) {
        toast.error(t("API.NETWORK_ERROR"));
        return {
            status: 500
        };
    }
}