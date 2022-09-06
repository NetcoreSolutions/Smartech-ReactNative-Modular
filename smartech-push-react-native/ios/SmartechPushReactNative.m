#import "SmartechPushReactNative.h"
#import <CoreLocation/CoreLocation.h>
#import <React/RCTLog.h>
#import <SmartPush/SmartPush.h>

@implementation SmartechPushReactNative

RCT_EXPORT_MODULE()

/**
 @brief This method is used to opt push notifications.
 
 @discussion If you call this method then we will opt in or opt out the user of recieving push notifications.
 */
RCT_EXPORT_METHOD(optPushNotification:(BOOL)isOpted) {
    RCTLogInfo(@"[Smartech optPushNotification]");
    @try {
        [[SmartPush sharedInstance] optPushNotification:isOpted];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in optPushNotification %@", exception.reason);
    }
}

/**
 @brief This method is used to get the current status of opt push notification.
 
 @discussion If you call this method you will get the current status of the tracking which can be used to render the UI at app level.
 */
RCT_EXPORT_METHOD(hasOptedPushNotification) {
    RCTLogInfo(@"[Smartech hasOptedPushNotification]");
    @try {
        [[SmartPush sharedInstance] hasOptedPushNotification];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in hasOptedPushNotification %@", exception.reason);
    }
}

/**
 @brief This method is used in the Android SDK to handle passing of deeplink in terminate/background state. In iOS it will be an empty implementation.
 */
RCT_EXPORT_METHOD(getDeepLinkUrl:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[Smartech getDeepLinkUrl]");
}

RCT_EXPORT_METHOD(postNotification:(NSString *)name) {
  [[NSNotificationCenter defaultCenter] postNotificationName:name object:nil userInfo:nil];
}

RCT_EXPORT_METHOD(registerForPushNotificationWithAuthorizationOptions:(BOOL)alert withBadge:(BOOL)badge andSound:(BOOL)sound) {
    UNAuthorizationOptions options = UNAuthorizationOptionNone;
    if (alert) {
        options += UNAuthorizationOptionAlert;
    }
    if (badge) {
        options += UNAuthorizationOptionBadge;
    }
    if (sound) {
        options += UNAuthorizationOptionSound;
    }
    [[SmartPush sharedInstance] registerForPushNotificationWithAuthorizationOptions:options];
}

/**
 @brief This method is used in the Android SDK to get device push token. In iOS it will be an empty implementation.
 */
RCT_EXPORT_METHOD(getDevicePushToken:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[Smartech getDevicePushToken]");
    [self returnResult:@"" withCallback:callback andError:nil];
}

/**
 @brief This method is used in the Android SDK to set the device push token. In iOS it will be an empty implementation.
 */
RCT_EXPORT_METHOD(setDevicePushToken:(NSString *)token) {
    RCTLogInfo(@"[Smartech setDevicePushToken is not implemented only on Android]");
}

#pragma mark - Helpers Methods

- (void)returnResult:(id)result withCallback:(RCTResponseSenderBlock)callback andError:(NSString *)error {
    if (callback == nil) {
        RCTLogInfo(@"Smartech callback was nil");
        return;
    }
    id errorValue = error != nil ? error : [NSNull null];
    id resultValue = result != nil ? result : [NSNull null];
    callback(@[errorValue, resultValue]);
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (NSDictionary *)constantsToExport {
    return @{
        kSMTDeeplinkNotificationIdentifier : kSMTDeeplinkNotificationIdentifier,
        kSMTDeeplinkIdentifier : kSMTDeeplinkIdentifier,
        kSMTCustomPayloadIdentifier : kSMTCustomPayloadIdentifier
    };
}

@end
