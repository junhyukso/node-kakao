import * as request from "request-promise";
import * as querystring from "querystring";

/*
 * Created on Sun Oct 13 2019
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class KakaoAPI {

    static get LocoPEMPublicKey() {
        return `-----BEGIN PUBLIC KEY-----\nMIIBIDANBgkqhkiG9w0BAQEFAAOCAQ0AMIIBCAKCAQEApElgRBx+g7sniYFW7LE8ivrwXShKTRFV8lXNItMXbN5QSC8vJ/cTSOTS619Xv5Zx7xXJIk4EKxtWesEGbgZpEUP2xQ+IeH9oz0JxayEMvvD1nVNAWgpWE4pociEoArsK7qY3YwXb1CiDHo9hojLv7djbo3cwXvlyMh4TUrX2RjCZPlVJxk/LVjzcl9ohJLkl3eoSrf0AE4kQ9mk3+raEhq5Dv+IDxKYX+fIytUWKmrQJusjtre9oVUX5sBOYZ0dzez/XapusEhUWImmB6mciVXfRXQ8IK4IH6vfNyxMSOTfLEhRYN2SMLzplAYFiMV536tLS3VmG5GJRdkpDubqPeQIBAw==\n-----END PUBLIC KEY-----`;
    }

    static get LocoPublicKey() {
        return {
            n: Buffer.from('a44960441c7e83bb27898156ecb13c8afaf05d284a4d1155f255cd22d3176cde50482f2f27f71348e4d2eb5f57bf9671ef15c9224e042b1b567ac1066e06691143f6c50f88787f68cf42716b210cbef0f59d53405a0a56138a6872212802bb0aeea6376305dbd428831e8f61a232efedd8dba377305ef972321e1352b5f64630993e5549c64fcb563cdc97da2124b925ddea12adfd00138910f66937fab68486ae43bfe203c4a617f9f232b5458a9ab409bac8edadef685545f9b013986747737b3fd76a9bac121516226981ea67225577d15d0f082b8207eaf7cdcb13123937cb12145837648c2f3a65018162315e77ead2d2dd5986e46251764a43b9ba8f79', 'hex'),
            e: 0x03
        };
    }
    
    static get Agent() {
        return 'win32';
    }

    static get Version() {
        return '3.0.7';
    }

    static get InternalAppVersion() {
        return `${this.Version}.${this.InternalAppSubVersion}`;
    }

    static get InternalAppSubVersion() {
        return '2319';
    }

    static get OSVersion() {
        return '10.0';
    }

    static get Language() {
        return 'ko';
    }

    static get AuthUserAgent() {
        return `KT/${KakaoAPI.Version} Wd/${KakaoAPI.OSVersion} ${KakaoAPI.Language}`;
    }

    static get AuthHeaderAgent() {
        return `${KakaoAPI.Agent}/${KakaoAPI.Version}/${KakaoAPI.Language}`;
    }

    static get InternalProtocol() {
        return 'https';
    }

    static get AccountInternalHost() {
        return 'ac-sb-talk.kakao.com';
    }

    static get InternalHost() {
        return 'sb-talk.kakao.com';
    }

    static get LocoEntry() {
        return 'booking-loco.kakao.com';
    }

    static get LocoEntryPort() {
        return 443;
    }

    static get AccountInternalURL() {
        return `${KakaoAPI.InternalProtocol}://${KakaoAPI.AccountInternalHost}`;
    }

    static get InternalURL() {
        return `${KakaoAPI.InternalProtocol}://${KakaoAPI.InternalHost}`;
    }

    static get AccountPath() {
        return 'account';
    }




    static get Account() {
        return Account;
    }

    static get LogonAccount() {
        return LogonAccount;
    }



    static getInternalURL(type: LogonAccount) {
        return `${KakaoAPI.InternalURL}/${KakaoAPI.Agent}/${KakaoAPI.AccountPath}/${type}`;
    }

    static getAccountInternalURL(type: Account) {
        return `${KakaoAPI.AccountInternalURL}/${KakaoAPI.Agent}/${KakaoAPI.AccountPath}/${type}`;
    }

    static getAuthHeader(verifyCodeExtra: string, contentLength: number) {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contentLength,
            'Host': KakaoAPI.AccountInternalHost,
            'A': KakaoAPI.AuthHeaderAgent,
            'X-VC': verifyCodeExtra,
            'User-Agent': KakaoAPI.AuthUserAgent,
            'Accept': '*/*',
            'Accept-Language': KakaoAPI.Language
        };
    }

    static getSessionHeader(accessToken: string, deviceUUID: string) {
        return {
            'Host': KakaoAPI.InternalHost,
            'Authorization': `${accessToken}-${deviceUUID}`,
            'A': KakaoAPI.AuthHeaderAgent,
            'User-Agent': KakaoAPI.AuthUserAgent,
            'Accept': '*/*',
            'Accept-Language': KakaoAPI.Language
        };
    }

    static getLoginData(email: string, password: string, deviceUUID: string, deviceName: string, permanent = true, osVersion: string = KakaoAPI.OSVersion) {
        return {
            'email': email,
            'password': password,
            'device_uuid': deviceUUID,
            'os_version': osVersion,
            'device_name': deviceName,
            'permanent': permanent
        }
    }

    static getDeviceRegisterData(email: string, password: string, deviceUUID: string, deviceName: string, passcode: string, permanent = true, osVersion: string = KakaoAPI.OSVersion) {
        return {
            'email': email,
            'password': password,
            'device_uuid': deviceUUID,
            'os_version': osVersion,
            'device_name': deviceName,
            'permanent': permanent,
            'passcode': passcode
        }
    }
    
    static requestLogin(verifyCodeExtra: string, email: string, password: string, deviceUUID: string, deviceName: string, permanent?: boolean, osVersion?: string) {
        let loginData = KakaoAPI.getLoginData(email, password, deviceUUID, deviceName, permanent, osVersion);

        let queryData = querystring.stringify(loginData);
        
        return request({
            url: KakaoAPI.getAccountInternalURL(Account.LOGIN),
            headers: KakaoAPI.getAuthHeader(verifyCodeExtra, queryData.length),
            body: queryData,
            method: 'POST'
        });
    }

    static requestPasscode(verifyCodeExtra: string, email: string, password: string, deviceUUID: string, deviceName: string, permanent?: boolean, osVersion?: string) {
        let loginData = KakaoAPI.getLoginData(email, password, deviceUUID, deviceName, permanent, osVersion);

        let queryData = querystring.stringify(loginData);
        
        return request({
            url: KakaoAPI.getAccountInternalURL(Account.REQUEST_PASSCODE),
            headers: KakaoAPI.getAuthHeader(verifyCodeExtra, queryData.length),
            body: queryData,
            method: 'POST'
        });
    }

    static registerDevice(passcode: string, verifyCodeExtra: string, email: string, password: string, deviceUUID: string, deviceName: string, permanent?: boolean, osVersion?: string) {
        let deviceRegisterData = KakaoAPI.getDeviceRegisterData(email, password, deviceUUID, deviceName, passcode, permanent, osVersion);

        let queryData = querystring.stringify(deviceRegisterData);
        
        return request({
            url: KakaoAPI.getAccountInternalURL(Account.REGISTER_DEVICE),
            headers: KakaoAPI.getAuthHeader(verifyCodeExtra, queryData.length),
            body: queryData,
            method: 'POST'
        });
    }

    static requestAccountSettings(accessToken: string, deviceUUID: string, since: number = 0, language: string = KakaoAPI.Language) {
        return request({
            url: `${KakaoAPI.getInternalURL(LogonAccount.MORE_SETTINGS)}?since=0&lang=${language}`,
            headers: KakaoAPI.getSessionHeader(accessToken, deviceUUID),
            method: 'GET'
        });
    }

    static requestAutoLoginToken(accessToken: string, deviceUUID: string) {
        return request({
            url: `${KakaoAPI.getInternalURL(LogonAccount.LOGIN_TOKEN)}`,
            headers: KakaoAPI.getSessionHeader(accessToken, deviceUUID),
            method: 'GET'
        });
    }
}

enum Account {
    LOGIN = 'login.json',
    REGISTER_DEVICE = 'register_device.json',
    REQUEST_PASSCODE = 'request_passcode.json',
    LOGIN_TOKEN = 'login_token.json',
    REQUEST_VERIFY_EMAIL = 'request_verify_email.json',
    RENEW_TOKEN = 'renew_token.json',
    CHANGE_UUID = 'change_uuid.json',
    CAN_CHANGE_UUID = 'can_change_uuid.json',

}

enum LogonAccount {
    MORE_SETTINGS = 'more_settings.json',
    LESS_SETTINGS = 'less_settings.json',
    BLOCKED_LIST = 'blocked.json',
    LOGIN_TOKEN = 'login_token.json'
}