import humps from 'humps';
import history from 'app/utils/myHistory';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _empty from 'lodash/isEmpty';
import { toastr } from 'react-redux-toastr';
import { push } from 'react-router-redux';
import * as ampTypes from 'app/constants/AmplitudeActions';
import { createLoadingSelector } from 'app/reducers/loading';
import { userIdFromMfaToken, decodeJWT } from 'app/utils/jwtHelper';
import {
    CREDIT_COMMITTEE_USERS,
    BUSINESS_DASHBOARD_USERS,
    DATA_SCIENCE_USERS,
    USER_TYPES,
    GROUPS,
    ROLE,
    INTERNAL_ACTORS,
} from 'app/constants/Constants';
import * as types from '../constants/ActionTypes';
import * as RouterUtils from '../utils/RouterUtils';
import * as fetchUtils from '../utils/FetchUtils';
import Logger from '../utils/Logger';
import Auth from '../utils/Auth';
import { EventTypes } from '../utils/reduxAmplitude';
import { fetchUser } from '../reducers/entities';
import { CLIENT_DEFAULT } from '../actors/client/constants/Routes';
import { ADMIN_TRANS_LIST } from '../actors/admin/constants/Routes';
import { INVESTOR_DASHBOARD } from '../actors/investor/constants/Routes';
import { ACTOR_DEFAULT_HOME, CAG_DEFAULT_HOME, FORGOT_PASSWORD } from '../constants/Routes';

const EXCLUDE_URL = ['/logout-all-devices'];

function checkMfaToken(token) {
    let updateToken = token;
    if (Auth.isMfaTokenValid() && !Auth.isMfaTokenExpiring() && getActiveUserId() === userIdFromMfaToken(Auth.getMFAToken())) {
        updateToken = {
            ...token,
            mfaToken: Auth.getMFAToken(),
        };
    } else {
        const mfaToken = Auth.getMFAToken();
        if (mfaToken) {
            Auth.setOTPMail(true);
        }
        Auth.removeMfa();
        updateToken = {
            ...token,
            mfaToken: null,
        };
    }
    return updateToken;
}

/* eslint-disable consistent-return */
function handleRedirection() {
    const nextUrl = Auth.getNextUrl();
    if (nextUrl && nextUrl !== '/') {
        if (!nextUrl.startsWith('/')) {
            window.location = nextUrl;
            return;
        }
        return nextUrl;
    }
    const redirectUrl = getHomeUrl(Auth.getActiveUserGroup().group) || '/';
    if (!redirectUrl.startsWith('/')) {
        window.location = redirectUrl;
        return;
    }
    return redirectUrl;
}

function isValidToken(token) {
    if (!token) return false;
    const authJWT = decodeJWT(token);
    return authJWT && authJWT[`${process.env.REACT_APP_AUTH_AUDIENCE}/user_metadata`];
}

export function initAuth() {
    return (dispatch) => {
        if (Auth.loggedIn()) {
            const token = Auth.getToken();
            if (!isValidToken(token.idToken) || _empty(Auth.getActiveUserGroup())) {
                return dispatch(logoutUser());
            }
            return dispatch(authUser(checkMfaToken(token)));
        }
        if (!Auth.loggedIn() && Auth.getIdToken()) {
            Auth.renewToken()
                .then(() => {
                    const token = Auth.getToken();
                    const mfaValidatedToken = checkMfaToken(token);
                    return dispatch(authUser(mfaValidatedToken));
                })
                .catch(() => dispatch(logoutUser()));
        } else {
            return dispatch({ type: types.CHECKED_AUTHED, isAuthChecked: true });
        }
    };
}

// Old method needs to be removed after switch role is table
export function getActorHomeUrl(idToken) {
    const jwt = decodeJWT(idToken);
    if (!jwt) return '/';
    const groups = jwt[`${process.env.REACT_APP_AUTH_AUDIENCE}/groups`];
    const defaultActor = humps.decamelize(humps.camelize(groups[0].toLowerCase()), {
        separator: '-',
    });
    if (groups && groups.length > 0) {
        switch (groups[0].toLowerCase()) {
            case 'customer':
                return CLIENT_DEFAULT;
            case 'investor': {
                return INVESTOR_DASHBOARD;
            }
            case 'product':
                return ADMIN_TRANS_LIST;
            case 'client_acquisition_group':
                return CAG_DEFAULT_HOME;
            default:
                return RouterUtils.parsedRoute({
                    path: ACTOR_DEFAULT_HOME,
                    keys: { actor: defaultActor },
                });
        }
    }
    return '/';
}

export function getHomeUrl(group) {
    try {
        const defaultActor = humps.decamelize(humps.camelize(group), {
            separator: '-',
        });
        if (group) {
            switch (group) {
                case GROUPS.CLIENT:
                    return CLIENT_DEFAULT;
                case GROUPS.INVESTOR:
                    return INVESTOR_DASHBOARD;
                case GROUPS.PRODUCT:
                    return ADMIN_TRANS_LIST;
                case GROUPS.CAG:
                    return CAG_DEFAULT_HOME;
                default:
                    return RouterUtils.parsedRoute({
                        path: ACTOR_DEFAULT_HOME,
                        keys: { actor: defaultActor },
                    });
            }
        }
    } catch (e) {
        Logger.logException(e);
    }
}

export function getPermissions() {
    const { role, group } = Auth.getActiveUserGroup();
    return {
        isAdmin: ROLE.ADMIN === role,
        isProduct: GROUPS.PRODUCT === group,
        isInvestor: GROUPS.INVESTOR === group,
        isClient: GROUPS.INVESTOR === group,
    };
}

export function getEntityDetails() {
    return fetchUtils
        .getJSON(`${process.env.REACT_APP_MP_API_HOST}/entities/${getActiveEntityId()}`)
        .then((d) => humps.camelizeKeys(d))
        .catch(() => []);
}

export function getActiveEntityId() {
    return Auth.getEntityId();
}

export function getActiveUser() {
    const group = Auth.getGroup();
    if (!group) return {};
    return {
        isProduct: group.includes('product'),
        isClient: group.includes('customer'),
        isInvestor: group.includes(USER_TYPES.INVESTOR),
        isTreasury: group.includes(USER_TYPES.TREASURY),
        isAuditor: group.includes(USER_TYPES.AUDITOR),
        isLawfirm: group.includes(USER_TYPES.LAW_FIRM),
        isTrustee: group.includes(USER_TYPES.TRUSTEE),
        isRatingagency: group.includes(USER_TYPES.RATING_AGENCY),
        isOperation: group.includes(USER_TYPES.OPERATIONS),
        isRisk: group.includes('risk'),
        isCAG: group.includes('client_acquisition_group'),
        isInternal: checkInternalUser(),
    };
}

export function getUserId(idToken) {
    const jwt = decodeJWT(idToken);
    if (!jwt) return '';
    return jwt[`${process.env.REACT_APP_AUTH_AUDIENCE}/local_user_id`];
}

// FIXME: Need to rewrite below method

export function checkInternalUserOld() {
    const idToken = Auth.getIdToken();
    const jwt = decodeJWT(idToken);
    if (!jwt) return null;
    return jwt[`${process.env.REACT_APP_AUTH_AUDIENCE}/internal`];
}

export function checkInternalUser() {
    let isInternal = false;
    const activeGroup = Auth.getActiveUserGroup();
    if (_has(activeGroup, 'group')) {
        isInternal = INTERNAL_ACTORS.some((v) => v.value === humps.decamelize(activeGroup.group));
        if (!isInternal) {
            isInternal = Auth.isInternalCookie();
        }
    }
    return isInternal;
}

export function getActiveUserId() {
    const idToken = Auth.getIdToken();
    return idToken ? getUserId(idToken) : '';
}

export function getActiveActorHomeUrl() {
    const { group } = Auth.getActiveUserGroup();
    return group ? getHomeUrl(group) : '/';
}

export function handleAuthentication(hash) {
    return (dispatch) =>
        Auth.parseHash(hash)
            .then((token) => {
                if (!token) {
                    throw new Error("Couldn't find token!");
                }
                dispatch(authUser(checkMfaToken(token)));
                return token;
            })
            .then((token) => {
                dispatch(push(handleRedirection(token)));
            })
            .catch((err) => {
                const { name } = err;
                Logger.logException(err);
                const errorMessage =
                    name.toLowerCase() === 'access_denied'
                        ? 'Something went wrong while authenticating, try <a target="_blank" href="/auth/help-cookies">enabling</a> third party cookies from your browser if it is disabled or contact our support team for help.'
                        : 'Something went wrong while authenticating, please try again after sometime or contact our support team for help.';
                return dispatch({
                    type: types.AUTH_FAILED,
                    errorMsg: errorMessage,
                });
            });
}

export function login(formData, nextUrl) {
    return (dispatch) => {
        dispatch({ type: types.AUTH_REQUEST });
        const { email, password } = formData;
        Auth.setNextUrl(RouterUtils.locationToUrl(nextUrl, '/'), EXCLUDE_URL);
        return Auth.login(email, password)
            .then((token) => {
                dispatch(authUser(token));
            })
            .then(() => {
                if (nextUrl) {
                    return dispatch(push(nextUrl));
                }
                return dispatch(push('/'));
            })
            .catch((err) => {
                const { name, message } = err;
                if (name !== 'access_denied') {
                    Logger.logException(err);
                }
                const parsedMessage = isJson(message)
                    ? 'No internet connection or contact your IT support to whitelist *.vivriticapital.com & *.amazonaws.com in your firewall settings to login'
                    : message;
                return dispatch({
                    type: types.AUTH_FAILED,
                    errorMsg: parsedMessage,
                });
            });
    };
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function forgotPasswordRes(response) {
    return {
        type: types.FORGOT_PASSWORD_RESPONSE,
        response,
    };
}

export const mfaAuthLoader = createLoadingSelector(['MFA']);
export const mfaOtpLoader = createLoadingSelector(['MFA_OTP']);
export const LOGOUT_ALL_LOADING = createLoadingSelector(['LOGOUT_ALL']);

export function generateMfaOtp(entityId, userId) {
    return (dispatch) => {
        dispatch({ type: types.MFA_OTP_REQUEST });
        return fetchUtils
            .patchJSON(`${process.env.REACT_APP_MP_API_HOST}/entities/${entityId}/users/${userId}/mfa`, {})
            .then((d) => {
                if (d.success) {
                    dispatch({ type: types.MFA_OTP_SUCCESS, errorMsg: null });
                    toastr.success('OTP Sent', 'Please check your inbox');
                }
            })
            .catch((ex) =>
                fetchUtils.handleErrorV2(dispatch, ex).then((m) => {
                    dispatch({ type: types.MFA_OTP_FAILURE, errorMsg: m });
                }),
            );
    };
}

export function mfaOtpAuthentication(entityId, userId, otp, nextUrl) {
    return (dispatch) => {
        dispatch({ type: types.MFA_REQUEST });
        Auth.setNextUrl(RouterUtils.locationToUrl(nextUrl, '/'), EXCLUDE_URL);
        return fetchUtils
            .patchJSON(`${process.env.REACT_APP_MP_API_HOST}/entities/${entityId}/users/${userId}/mfa_verify`, otp)
            .then((d) => {
                if (d.mfa_token) {
                    Auth.setMfa(d.mfa_token);
                    dispatch({ type: types.MFA_SUCCESS });
                    return dispatch(authUser(checkMfaToken(Auth.getToken())));
                }
                dispatch({
                    type: types.MFA_FAILURE,
                    errorMsg: 'Token not found',
                });
            })
            .then(() => dispatch(push(handleRedirection(Auth.getToken()))))
            .catch((ex) =>
                fetchUtils.handleErrorV2(dispatch, ex).then((m) => {
                    dispatch({ type: types.MFA_FAILURE, errorMsg: m });
                }),
            );
    };
}

export function resetForgotPasswordView() {
    return (dispatch) => dispatch({ type: types.FORGOT_PASSWORD_RESET_VIEW });
}

export function forgotPassword(formData) {
    return (dispatch) => {
        dispatch({ type: types.FORGOT_PASSWORD_REQUEST });
        return fetchUtils
            .putJSON(`${process.env.REACT_APP_MP_API_HOST}/users/forgot_password`, {
                email: formData.email,
            })
            .then(() => {
                toastr.success('Reset Password', 'Password reset link has been sent to your email');
                dispatch(forgotPasswordRes({ resetPassword: true, err: null }));
            })
            .catch((err) => {
                toastr.error('Reset Error', 'User Not found');
                dispatch(forgotPasswordRes({ resetPassword: false, err }));
            });
    };
}

export function isActivated(userId) {
    return (dispatch) =>
        fetchUtils
            .getJSON(`${process.env.REACT_APP_MP_API_HOST}/users/can_update_password?user_id=${userId}`)
            .then((d) => {
                dispatch({ type: types.SET_PASSWORD_EXISTING_USER, data: d.user_email });
                if (!d.can_update) {
                    dispatch(push(FORGOT_PASSWORD));
                }
            })
            .catch((ex) =>
                fetchUtils.handleErrorV2(dispatch, ex).then((m) =>
                    dispatch({
                        type: types.AUTH_FAILED,
                        errorMsg: m,
                    }),
                ),
            );
}

export function setPassword(entityId, userId, token, data) {
    return (dispatch) => {
        Auth.removeMfa();
        dispatch({ type: types.SET_PASSWORD_REQUEST });
        return fetchUtils
            .putJSON(`${process.env.REACT_APP_MP_API_HOST}/entities/${entityId}/users/${userId}/activate`, {
                password: _get(data, 'password'),
                token,
                terms_and_conditions_accepted: _get(data, 'termsAndConditionsAccepted'),
            })
            .then((d) => {
                if (d.mfa_token) {
                    Auth.setMfa(d.mfa_token);
                    return;
                }
                dispatch({
                    type: types.MFA_FAILURE,
                    errorMsg: 'Token not found',
                });
            })
            .then(() => toastr.success('New Password!', 'Your new password has been updated successfully'))
            .then(() => {
                Auth.logout();
                if (data.email) {
                    dispatch(login({ email: data.email, password: data.password }, '/'));
                    return;
                }
                history.push('/login');
            })
            .catch((ex) =>
                fetchUtils.handleErrorV2(dispatch, ex).then((m) =>
                    dispatch({
                        type: types.AUTH_FAILED,
                        errorMsg: m,
                    }),
                ),
            );
    };
}

export function changePassword(entityId, data) {
    return (dispatch) => {
        dispatch({ type: types.CHANGE_PASSWORD_REQUEST });
        return fetchUtils
            .putJSON(`${process.env.REACT_APP_MP_API_HOST}/entities/${entityId}/users/change_password`, {
                password: data && data.password,
            })
            .then((d) => {
                toastr.success('New Password!', 'Your new password has been updated successfully');
                dispatch(login({ email: d.email, password: data.password }, '/'));
            })
            .catch((ex) =>
                fetchUtils.handleErrorV2(dispatch, ex).then((m) => {
                    toastr.error('Error while updating new password', m);
                }),
            );
    };
}

export function logoutUser() {
    return (dispatch) => {
        Auth.logout();
        dispatch(resetAuthed());
        dispatch(initAuth());
    };
}

export function logoutFromAllDevices() {
    return (dispatch) => {
        dispatch({ type: types.LOGOUT_ALL_REQUEST });
        return fetchUtils
            .postJSON(`${process.env.REACT_APP_MP_API_HOST}/entities/${getActiveEntityId()}/users/${getActiveUserId()}/logout_from_all_devices`, {})
            .then(() => {
                dispatch(logoutUser());
                dispatch({ type: types.LOGOUT_ALL_SUCCESS });
            })
            .catch((ex) =>
                fetchUtils.handleErrorV2(dispatch, ex).then((m) => {
                    dispatch({ type: types.LOGOUT_ALL_FAILURE });
                    toastr.error('Error while trying to logout', m);
                }),
            );
    };
}

function authUser(token) {
    return (dispatch) => dispatch(fetchAuthedUser(token));
}

function fetchAuthedUser(token) {
    return (dispatch) => {
        dispatch(receiveAuthedUserPre(token, null));
        if (!Auth.isMfaTokenValid()) {
            return dispatch({ type: types.CHECKED_AUTHED, isAuthChecked: true });
        }
        return fetchUser(getActiveEntityId(), getActiveUserId())
            .then((r) => dispatch(receiveAuthedUserPre(token, r)))
            .catch(() => {
                dispatch({ type: types.CHECKED_AUTHED, isAuthChecked: true });
                // throw err;
            });
    };
}

function receiveAuthedUserPre(token, user) {
    return (dispatch) => {
        dispatch(receiveAccessToken(token));
        if (user) {
            getEntityDetails().then((d) => {
                const owner = _get(d, 'owner', false);
                Auth.setInternalCookie(owner);
                dispatch(
                    receiveAuthedUser({
                        ...user,
                        entity: d.companyName,
                        liveDeals: _get(d, 'liveDeals', false),
                        settledDeals: _get(d, 'settledDeals', false),
                        newOffers: _get(d, 'newOffers', false),
                        owner,
                    }),
                );
            });
        }
    };
}

function resetAuthed() {
    return {
        type: types.RESET_AUTHED,
        meta: {
            amplitude: {
                eventType: EventTypes.track,
                eventPayload: {
                    eventName: ampTypes.LOGOUT,
                },
            },
        },
    };
}

function receiveAccessToken(token) {
    return {
        type: types.RECEIVE_ACCESS_TOKEN,
        token,
    };
}

function receiveAuthedUser(user) {
    const { sub, email, name, entity, ...rest } = user;
    const idToken = Auth.getIdToken();
    const jwt = decodeJWT(idToken);
    const userName = (jwt && jwt.name) || 'unknown';

    if (window.FreshWidget) {
        window.FreshWidget.update({
            queryString: `&widgetType=popup&searchArea=no&helpdesk_ticket[requester]=${email}&helpdesk_ticket[name]=${name}`,
        });
    }
    return {
        type: types.RECEIVE_AUTHED_USER,
        user,
        meta: {
            amplitude: [
                {
                    eventType: EventTypes.identify,
                    eventPayload: {
                        userId: sub,
                        name,
                        ...rest,
                        userName,
                        entityName: entity,
                    },
                },
                {
                    eventType: EventTypes.track,
                    eventPayload: {
                        eventName: ampTypes.LOGIN,
                        sub,
                        name,
                        userName,
                        entityName: entity,
                        ...rest,
                    },
                },
            ],
        },
    };
}

export const isCreditCommitteeUser = () => {
    const { email } = Auth.getProfile();
    return CREDIT_COMMITTEE_USERS.includes(email);
};

export const isBusinessDashboardUser = () => {
    const { email } = Auth.getProfile();
    return BUSINESS_DASHBOARD_USERS.includes(email);
};

export const isDataScienceUser = () => {
    const { email } = Auth.getProfile();
    return DATA_SCIENCE_USERS.includes(email);
};
