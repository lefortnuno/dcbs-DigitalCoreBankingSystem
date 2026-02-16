import Keycloak, { type KeycloakInitOptions } from 'keycloak-js';

export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_SERVER_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});
 
export const initOptions: KeycloakInitOptions = {
    onLoad: 'login-required',      
    pkceMethod: 'S256',             
    checkLoginIframe: false,        
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    flow: 'standard',              
};