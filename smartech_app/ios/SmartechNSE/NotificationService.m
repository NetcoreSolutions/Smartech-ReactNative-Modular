//
//  NotificationService.m
//  SmartechNSE
//
//  Created by Shubham on 26/07/22.
//

#import "NotificationService.h"
#import <SmartPush/SmartPush.h>

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

SMTNotificationServiceExtension *smartechServiceExtension;

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    if ([[SmartPush sharedInstance] isNotificationFromSmartech:request.content.userInfo]) {
       smartechServiceExtension = [[SMTNotificationServiceExtension alloc] init];
       [smartechServiceExtension didReceiveNotificationRequest:request withContentHandler:contentHandler];
   }
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    [smartechServiceExtension serviceExtensionTimeWillExpire];
    self.contentHandler(self.bestAttemptContent);
}

@end
