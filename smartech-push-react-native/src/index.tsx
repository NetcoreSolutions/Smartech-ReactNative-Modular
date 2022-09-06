import { DeviceEventEmitter, EmitterSubscription, NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'smartech-push-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SmartechEventEmitter = NativeModules.SmartechPushReactEventEmitter ? new NativeEventEmitter(NativeModules.SmartechPushReactEventEmitter) : DeviceEventEmitter;
const SmartechPushReactNative = NativeModules.SmartechPushReactNative
  ? NativeModules.SmartechPushReactNative
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
  SmartechPushReactNative[method].apply(this, args);
}

var SmartechReact = {
      
    // All the constants declared in the Smartech React Bridge.
    SmartechDeeplinkNotification: SmartechPushReactNative.SmartechDeeplinkNotification,

    // This method is used to register listener.
    addListener: function (eventName: string, handler: (data: any) => void) {
      if (SmartechEventEmitter) {
          SmartechEventEmitter.addListener(eventName, handler);
      }
    },

    // This method is used to unregister registered listener.
    removeListener: function (eventName: string, handler: (...args: any[]) => any) {
        if (SmartechEventEmitter) {
            SmartechEventEmitter.removeListener(eventName, handler);
        }
    },

    // This method is used to register listener.
    addDeepLinkListener: function (eventName: string, handler: (data: any) => void, callback: (arg0: EmitterSubscription) => void) {
        if (SmartechEventEmitter) {
          const eventEmitter = SmartechEventEmitter.addListener(eventName, handler);
          callback(eventEmitter)
        }
    },

    /**
     *  This method will be used to handle the deeplink
     *  used to open the app.
     */
     getDeepLinkUrl: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getDeepLinkUrl', null, callback);
    },


    // ----- GDPR Methods ----- 

    /**
     * This method is used to opt push notifications.
     * If you call this method then we will opt in or opt out the user of recieving push notifications.
     */
    optPushNotification: function (isPushNotificationOpted: boolean) {
      SmartechPushReactNative.optPushNotification(isPushNotificationOpted);
    },

    /**
     * This method is used to get the current status of opt push notification.
     * If you call this method you will get the current status of the tracking which can be used to render the UI at app level.
     */
    hasOptedPushNotification: function (callback: ((err: any, res: any) => void) | null) {
        callWithCallback('hasOptedPushNotification', null, callback);
    },

    // ----- Helper Methods ----- 

    /**
     * This method is used to get the device push token used by Smartech SDK.
     * If you call this method you will get the device push token which is used for sending push notification.
     */
    getDevicePushToken: function (callback: ((err: any, res: any) => void) | null) {
        callWithCallback('getDevicePushToken', null, callback);
    },

    /**
     * This method is used to set the device push token used by Smartech SDK.
     * If you call this method you will set the device push token which is used for sending push notification.
     */
    setDevicePushToken: function (token: string) {
      SmartechPushReactNative.setDevicePushToken(token);
    },

    registerForPushNotificationWithAuthorizationOptions: function (enableAlert: boolean, enableBadge: boolean, enableSound: boolean) {
      SmartechPushReactNative.registerForPushNotificationWithAuthorizationOptions(enableAlert, enableBadge, enableSound);
    }
};

module.exports = SmartechReact;

