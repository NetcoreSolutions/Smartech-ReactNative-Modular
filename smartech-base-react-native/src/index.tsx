import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'smartech-base-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SmartechBaseReactnativeModule = NativeModules.SmartechBaseReactNative
  ? NativeModules.SmartechBaseReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );


function defaultCallback(method: string, err: any, res: any) {
  if (err) {
      console.log('Smartech ' + method + ' default callback error', err);
  }
  else {
      console.log('Smartech ' + method + ' default callback result', res);
  }
}

// Used to handle callback
function callWithCallback(this: any, method: string, args: any[] | null, callback: ((err: any, res: any) => void) | null) {
  if (typeof callback === 'undefined' || callback == null || typeof callback !== 'function') {
      callback = (err, res) => {
          defaultCallback(method, err, res);
      };
  }
  if (args == null) {
      args = [];
  }
  args.push(callback);
  SmartechBaseReactnativeModule[method].apply(this, args);
}

var SmartechReact = {

  /**
   * This method is used to track app update event.
   * This method should be called by the developer to track the app updates event to Smartech.
   */
  trackAppInstall: function () {
    SmartechBaseReactnativeModule.trackAppInstall();
  },

  /**
   * This method is used to track app update event.
   * This method should be called by the developer to track the app updates event to Smartech.
   */
  trackAppUpdate: function () {
    SmartechBaseReactnativeModule.trackAppUpdate();
  },

  /**
   * This method is used to track app install or update event by Smartech SDK itself.
   * This method should be called by the developer to track the app install or update event by Smartech SDK itself. 
   * If you are calling this method then you should not call trackAppInstall or trackAppUpdate method.
   */
  trackAppInstallUpdateBySmartech: function () {
    SmartechBaseReactnativeModule.trackAppInstallUpdateBySmartech();
  },

  /**
   * This method is used to track custom event done by the user.
   * This method should be called by the developer to track any custom activites
   * that is performed by the user in the app to Smartech backend.
   */
  trackEvent: function (eventName: string, payload: any) {
    SmartechBaseReactnativeModule.trackEvent(eventName, payload);
  },

  /**
   * This method is used to send login event to Smartech backend.
   * This method should be called only when the app gets the user's identity
   * or when the user does a login activity in the application.
   */
  login: function (identity: string) {
    SmartechBaseReactnativeModule.login(identity);
  },

  /**
   * This method would logout the user and clear identity on Smartech backend.
   * This method should be called only when the user log out of the application.
   */
  logoutAndClearUserIdentity: function (isLougoutClearIdentity: boolean) {
    SmartechBaseReactnativeModule.logoutAndClearUserIdentity(isLougoutClearIdentity)
  },

  /**
   * This method would set the user identity locally and with all subsequent events this identity will be send.
   * This method should be called only when the user gets the identity.
   */
  setUserIdentity: function (identity: string, callback: ((err: any, res: any) => void) | null) {
      callWithCallback('setUserIdentity', [identity], callback);
  },

 /**
   * This method would get the user identity that is stored in the SDK.
   * This method should be called to get the user's identity.
   */
  getUserIdentity: function (callback: ((err: any, res: any) => void) | null) {
    callWithCallback('getUserIdentity', null, callback);
  },

  /**
   * This method would clear the identity that is stored in the SDK.
   * This method will clear the user's identity by removing it from.
   */
  clearUserIdentity: function () {
    SmartechBaseReactnativeModule.clearUserIdentity();
  },

  /**
   * This method is used to update the user profile.
   * This method should be called by the developer to update all the user related attributes to Smartech.
   */
  updateUserProfile: function (profilePayload: any) {
    SmartechBaseReactnativeModule.updateUserProfile(profilePayload);
  },

  // ----- GDPR Methods ----- 

  /**
   * This method is used to opt tracking.
   * If you call this method then we will opt in or opt out the user of tracking.
   */
  optTracking: function (isTrackingOpted: boolean) {
    SmartechBaseReactnativeModule.optTracking(isTrackingOpted);
  },

  /**
   * This method is used to get the current status of opt tracking.
   * If you call this method you will get the current status of the tracking which can be used to render the UI at app level.
   */
  hasOptedTracking: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('hasOptedTracking', null, callback);
  },

  /**
   * This method is used to opt in-app messages.
   * If you call this method then we will opt in or opt out the user of in-app messages.
   */
  optInAppMessage: function (isInappOpted: boolean) {
    SmartechBaseReactnativeModule.optInAppMessage(isInappOpted);
  },

  /**
   * This method is used to get the current status of opt in-app messages.
   * If you call this method you will get the current status of the opt in-app messages which can be used to render the UI at app level.
   */
  hasOptedInAppMessage: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('hasOptedInAppMessage', null, callback);
  },

  // ----- Location Methods ----- 

    /**
     * This method is used to set the user's location to the SDK.
     * You need to call this method to set location which will be passed on the Smartech SDK.
     */
     setUserLocation: function (latitude: number, longitude: number) {
      SmartechBaseReactnativeModule.setUserLocation(latitude, longitude);
   },

  // ----- Helper Methods ----- 

  /**
   * This method is used to get the app id used by the Smartech SDK.
   * If you call this method you will get the app id used by the Smartech SDK.
   */

  getAppId: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getAppId', null, callback);
  },

  /**
   * This method is used to get the device unique id used by Smartech SDK.
   * If you call this method you will get the device unique id which is used to identify a device on Smartech.
   */

  getDeviceGuid: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getDeviceGuid', null, callback);
  },

  /**
   * This method is used to get the current Smartech SDK version.
   * If you call this method you will get the current Smartech SDK version used inside the app.
   */
  getSDKVersion: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getSDKVersion', null, callback);
  },

};

module.exports = SmartechReact;
