import { NativeModules, Platform, DeviceEventEmitter, NativeEventEmitter, EmitterSubscription } from 'react-native';

const LINKING_ERROR =
  `The package 'smartech-appinbox-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SmartechEventEmitter = NativeModules.SmartechAppinboxReactEventEmitter ? new NativeEventEmitter(NativeModules.SmartechAppinboxReactEventEmitter) : DeviceEventEmitter;

const SmartechAppinboxReactnativeModule = NativeModules.SmartechAppinboxReactNative
  ? NativeModules.SmartechAppinboxReactNative
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
  SmartechAppinboxReactnativeModule[method].apply(this, args);
}

var SmartechReact = {

    // All the constants declared in the Smartech React Bridge.
    SmartechAppInboxDeeplinkNotification: SmartechAppinboxReactnativeModule.SmartechAppInboxDeeplinkNotification,

    // This method is used to register listener.
    addDeepLinkListener: function (eventName: string, handler: (data: any) => void, callback: (arg0: EmitterSubscription) => void) {
        if (SmartechEventEmitter) {
          const eventEmitter = SmartechEventEmitter.addListener(eventName, handler);
          callback(eventEmitter)
        }
    },
    
      
    /**
     *  This method is used to  get the  list of available categories
     */
     getAppInboxCategoryList: function (callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getAppInboxCategoryList', null, callback);
    },

    /**
     *  This method is used to  get the  list of available messages based on selected categories
     */
    getAppInboxMessagesWithCategory: function (appInboxCategoryArray: any, callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getAppInboxMessagesWithCategory', [appInboxCategoryArray], callback);
    },

    /**
     *  This method is used to  get the  list of available messages based on message type
     */
    getAppInboxMessages: function (messageType: any, callback: ((err: any, res: any) => void) | null) {
      callWithCallback('getAppInboxMessages', [messageType], callback);
    },

     /**
     *  This method is used to  get the  count of available messages based on message type
     */
      getAppInboxMessageCount: function (messageType: number, callback: ((err: any, res: any) => void) | null) {
        callWithCallback('getAppInboxMessageCount', [messageType], callback);
      },

     /**
     *  This method is used to  Send this event once the AppInbox message is visible to the user by Smartech APPInbox SDK.
     */
      markMessageAsViewed: function (appInboxMessage: any) {
        SmartechAppinboxReactnativeModule.markMessageAsViewed(appInboxMessage)
      },

        /**
       *  Onclick of AppInbox message, you need to send this event to SDK. This method takes 2 parameters that are deeplink and payload of AppInbox message.
       */
        markMessageAsClicked: function (trid: string,deeplink: string) {
          SmartechAppinboxReactnativeModule.markMessageAsClicked(trid,deeplink)
        },

        /**
       *  This method is used to mimic the feature of swipe to delete the messages from your TableView by Smartech APPInbox SDK.
       */
        markMessageAsDismissed: function (appInboxMessage: any, callback: ((err: any, res: any) => void) | null) {
          callWithCallback('markMessageAsDismissed', [appInboxMessage], callback);
        },

        /**
       *  This method is used to get the All, latest and earilier messages by API call from your TableView by Smartech APPInbox SDK.
       */
          getAppInboxMessagesByApiCall: function (messageLimit: number, messageType: number, appInboxCategoryArray: any, callback: ((err: any, res: any) => void) | null) {
          callWithCallback('getAppInboxMessagesByApiCall', [messageLimit, messageType , appInboxCategoryArray], callback);
        },


        /**
       *   This method is used to mimic the feature of copyMessaged with click event.
       */
        copyMessageAsClicked: function (selectedAction: any, trid: string) {
          SmartechAppinboxReactnativeModule.copyMessageAsClicked(selectedAction, trid)
        },
        
};

module.exports = SmartechReact;
