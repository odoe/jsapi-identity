import IdentityManager from '@arcgis/core/identity/IdentityManager';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import Portal from '@arcgis/core/portal/Portal';

/**
 * Register application ID and Portal URL
 * with the IdentityManager
 * @param appId
 * @param portalUrl
 * @returns Promise<void>
 */
export const initialize = (appId) => {
    const oauthInfo = new OAuthInfo({ appId });
    IdentityManager.registerOAuthInfos([oauthInfo]);
    return oauthInfo;
};

/**
 * Check current logged in status for current portal
 * @returns Promise<void>
 */
export const checkCurrentStatus = async (oauthInfo) => {
    try {
        const credential = await IdentityManager.checkSignInStatus(
            `${oauthInfo.portalUrl}/sharing`
        );
        return credential;
    } catch (error) {
        console.warn(error);
    }
};

/**
 * Attempt to sign in,
 * first check current status
 * if not signed in, then go through
 * steps to get credentials
 * @returns Promise<`esri/identity/Credential`>
 */
export const signIn = async (oauthInfo) => {
    try {
        const credential = await checkCurrentStatus(oauthInfo)
            || await fetchCredentials(oauthInfo);
        return credential;
    } catch (error) {
        const credential = await fetchCredentials(oauthInfo);
        return credential;
    }
};

/**
 * Sign the user out, but if we checked credentials
 * manually, make sure they are registered with
 * IdentityManager, so it can destroy them properly
 * @returns Promise<void>
 */
export const signOut = async () => {
    IdentityManager.destroyCredentials();
    window.location.reload();
};

/**
 * Get the credentials for the provided portal
 * @returns Promise<`esri/identity/Credential`>
 */
export const fetchCredentials = async (oauthInfo) => {
    try {
        const credential = await IdentityManager.getCredential(
            `${oauthInfo.portalUrl}/sharing`
        );
        return credential;
    } catch (error) {
        console.warn(error);
    }
};

export const fetchUser = async () => {
    const portal = new Portal();
    await portal.load();
    return portal.user;
};