//
//  SmartechPushReactEventEmitter.m
//  SmartechPushReactNative
//
//  Created by Shubham on 12/07/22.
//  Copyright © 2022 Facebook. All rights reserved.
//
#import "SmartechPushReactEventEmitter.h"

@implementation SmartechPushReactEventEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[kSMTDeeplinkNotificationIdentifier];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:kSMTDeeplinkNotificationIdentifier
                                               object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)emitEventInternal:(NSNotification *)notification {
    [self sendEventWithName:notification.name body:notification.userInfo];
}

@end
