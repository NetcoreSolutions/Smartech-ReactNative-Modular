#import "SmartechBaseReactNative.h"
#import <Smartech/Smartech.h>
#import <React/RCTLog.h>

@implementation SmartechBaseReactNative

RCT_EXPORT_MODULE()


#pragma mark - Event Tracking Methods

/**
 @brief This method is used to track app install event.
 
 @discussion This method should be called by the developer to track the app install event to Smartech.
 */
RCT_EXPORT_METHOD(trackAppInstall) {
    RCTLogInfo(@"[Smartech trackAppInstall]");
    @try {
        [[Smartech sharedInstance] trackAppInstall];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in trackAppInstall %@", exception.reason);
    }
}

/**
 @brief This method is used to track app update event.
 
 @discussion This method should be called by the developer to track the app updates event to Smartech.
 */
RCT_EXPORT_METHOD(trackAppUpdate) {
    RCTLogInfo(@"[Smartech trackAppUpdate]");
    @try {
        [[Smartech sharedInstance] trackAppUpdate];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in trackAppUpdate %@", exception.reason);
    }
}

/**
 @brief This method is used to track app install or update event by Smartech SDK itself.
 
 @discussion This method should be called by the developer to track the app install or update event by Smartech SDK itself. If you are calling this method then you should not call trackAppInstall or trackAppUpdate method.
 */
RCT_EXPORT_METHOD(trackAppInstallUpdateBySmartech) {
    RCTLogInfo(@"[Smartech trackAppInstallUpdateBySmartech]");
    @try {
        [[Smartech sharedInstance] trackAppInstallUpdateBySmartech];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in trackAppInstallUpdateBySmartech %@", exception.reason);
    }
}

/**
 @brief This method is used to track custom event done by the user.
 
 @discussion This method should be called by the developer to track any custom activites that is performed by the user in the app to Smartech backend.
 */
RCT_EXPORT_METHOD(trackEvent:(NSString *)eventName andPayload:(NSDictionary *)payload) {
    RCTLogInfo(@"[Smartech trackEvent]");
    @try {
        [[Smartech sharedInstance] trackEvent:eventName andPayload:payload];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in trackEvent %@", exception.reason);
    }
}

/**
 @brief This method is used to send login event to Smartech backend.
 
 @discussion This method should be called only when the app gets the user's identity or when the user does a login activity in the application.
 */
RCT_EXPORT_METHOD(login:(NSString *)userIdentity) {
    RCTLogInfo(@"[Smartech login]");
    @try {
        [[Smartech sharedInstance] login:userIdentity];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in login %@", exception.reason);
    }
}

/**
 @brief This method would logout the user and clear identity on Smartech backend.
 
 @discussion This method should be called only when the user log out of the application.
 */
RCT_EXPORT_METHOD(logoutAndClearUserIdentity:(BOOL)clearUserIdentity) {
    RCTLogInfo(@"[Smartech logoutAndClearUserIdentity]");
    @try {
        [[Smartech sharedInstance] logoutAndClearUserIdentity:clearUserIdentity];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in logoutAndClearUserIdentity %@", exception.reason);
    }
}

/**
 @brief This method would set the user identity locally and with all subsequent events this identity will be send.
 
 @discussion This method should be called only when the user gets the identity.
 */
RCT_EXPORT_METHOD(setUserIdentity:(NSString *)userIdentity callback:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"[Smartech setUserIdentity]");
    @try {
        [[Smartech sharedInstance] setUserIdentity:userIdentity];
        if([userIdentity isEqualToString:@""] || (userIdentity == nil)){
            [self returnResult:@"Expected one non-empty string argument." withCallback:callback andError:nil];
        }else{
            [[Smartech sharedInstance] setUserIdentity:userIdentity];
            [self returnResult:@"Identity is set successfully." withCallback:callback andError:nil];
        }
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in setUserIdentity %@", exception.reason);
    }
}

/**
 @brief This method would get the user identity that is stored in the SDK.
 
 @discussion This method should be called to get the user's identity.
 */
RCT_EXPORT_METHOD(getUserIdentity:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[Smartech getUserIdentity]");
    @try {
        [self returnResult:[[Smartech sharedInstance] getUserIdentity] withCallback:callback andError:nil];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getUserIdentity %@", exception.reason);
    }
}

/**
 @brief This method would clear the identity that is stored in the SDK.
 
 @discussion This method will clear the user's identity by removing it from.
 */
RCT_EXPORT_METHOD(clearUserIdentity) {
    RCTLogInfo(@"[Smartech clearUserIdentity]");
    @try {
        [[Smartech sharedInstance] clearUserIdentity];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in clearUserIdentity %@", exception.reason);
    }
}

/**
 @brief This method is used to update the user profile.
 
 @discussion This method should be called by the developer to update all the user related attributes to Smartech.
 */
RCT_EXPORT_METHOD(updateUserProfile:(NSDictionary *)payloadDictionary) {
    RCTLogInfo(@"[Smartech updateUserProfile]");
    @try {
        [[Smartech sharedInstance] updateUserProfile:payloadDictionary];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in updateUserProfile %@", exception.reason);
    }
}


#pragma mark - GDPR Methods

/**
 @brief This method is used to opt tracking.
 
 @discussion If you call this method then we will opt in or opt out the user of tracking.
 */
RCT_EXPORT_METHOD(optTracking:(BOOL)isOpted) {
    RCTLogInfo(@"[Smartech optTracking]");
    @try {
        [[Smartech sharedInstance] optTracking:isOpted];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in optTracking %@", exception.reason);
    }
}

/**
 @brief This method is used to get the current status of opt tracking.
 
 @discussion If you call this method you will get the current status of the tracking which can be used to render the UI at app level.
 */
RCT_EXPORT_METHOD(hasOptedTracking) {
    RCTLogInfo(@"[Smartech hasOptedTracking]");
    @try {
        [[Smartech sharedInstance] hasOptedTracking];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in hasOptedTracking %@", exception.reason);
    }
}

/**
 @brief This method is used to opt in-app messages.
 
 @discussion If you call this method then we will opt in or opt out the user of in-app messages.
 */
RCT_EXPORT_METHOD(optInAppMessage:(BOOL)isOpted) {
    RCTLogInfo(@"[Smartech optInAppMessage]");
    @try {
        [[Smartech sharedInstance] optInAppMessage:isOpted];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in optInAppMessage %@", exception.reason);
    }
}

/**
 @brief This method is used to get the current status of opt in-app messages.
 
 @discussion If you call this method you will get the current status of the opt in-app messages which can be used to render the UI at app level.
 */
RCT_EXPORT_METHOD(hasOptedInAppMessage) {
    RCTLogInfo(@"[Smartech hasOptedInAppMessage]");
    @try {
        [[Smartech sharedInstance] hasOptedInAppMessage];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in hasOptedInAppMessage %@", exception.reason);
    }
}


#pragma mark - Location Methods

/**
 @brief This method is used to set the user's location to the SDK.
 
 @discussion You need to call this method to set location which will be passed on the Smartech SDK.
 */
RCT_EXPORT_METHOD(setUserLocation:(double)latitude longitude:(double)longitude) {
    RCTLogInfo(@"[Smartech setUserLocation]");
    @try {
        CLLocationCoordinate2D userLocationCordinate = CLLocationCoordinate2DMake(latitude, longitude);
        [[Smartech sharedInstance] setUserLocation:userLocationCordinate];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in setUserLocation %@", exception.reason);
    }
}

#pragma mark - Helper Methods

/**
 @brief This method is used to get the app id used by the Smartech SDK.
 
 @discussion If you call this method you will get the app id used by the Smartech SDK.
 */
RCT_EXPORT_METHOD(getAppId:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[Smartech getAppId]");
    @try {
        NSString *smartechAppId = [[Smartech sharedInstance] getAppId];
        [self returnResult:smartechAppId withCallback:callback andError:nil];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getAppId %@", exception.reason);
    }
}

/**
 @brief This method is used to get the device unique id used by Smartech SDK.
 
 @discussion If you call this method you will get the device unique id which is used to identify a device on Smartech.
 */
RCT_EXPORT_METHOD(getDeviceGuid:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[Smartech getDeviceGuid]");
    @try {
        NSString *deviceGuid = [[Smartech sharedInstance] getDeviceGuid];
        [self returnResult:deviceGuid withCallback:callback andError:nil];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getDeviceGuid %@", exception.reason);
    }
}

/**
 @brief This method is used to get the current Smartech SDK version.
 
 @discussion If you call this method you will get the current Smartech SDK version used inside the app.
 */
RCT_EXPORT_METHOD(getSDKVersion:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[Smartech getSDKVersion]");
    @try {
        NSString *sdkVersion = [[Smartech sharedInstance] getSDKVersion];
        [self returnResult:sdkVersion withCallback:callback andError:nil];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getSDKVersion %@", exception.reason);
    }
}


#pragma mark - Empty Methods Used In Android

/**
 @brief This method is used in the Android SDK to initialise the SDK for handling deeplink. In iOS it will be an empty implementation.
 */
RCT_EXPORT_METHOD(initSDK) {
    RCTLogInfo(@"[Smartech initSDK]");
}

/**
 @brief This method is used in the Android SDK to fetch the existing device Token already generated by FCM. In iOS it will be an empty implementation.
 */
RCT_EXPORT_METHOD(fetchAlreadyGeneratedTokenFromFCM) {
    RCTLogInfo(@"[Smartech fetchAlreadyGeneratedTokenFromFCM is not implemented only on Android]");
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


@end
