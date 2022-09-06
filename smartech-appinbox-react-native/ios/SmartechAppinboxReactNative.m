#import "SmartechAppinboxReactNative.h"
#import <SmartechAppInbox/SmartechAppInbox.h>
#import <React/RCTLog.h>
#import <Smartech/Smartech.h>

// Rich Media Notifications That Smartech Panel Sends.
NSString *const kNotificationCategorySimpleNotification = @"SmartechSimpleNotification";
NSString *const kNotificationCategoryImageNotification = @"SmartechImageNotification";
NSString *const kNotificationCategoryGifNotification = @"SmartechGifNotification";
NSString *const kNotificationCategoryAudioNotification = @"SmartechAudioNotification";
NSString *const kNotificationCategoryVideoNotification = @"SmartechVideoNotification";

NSString *const kNotificationCategoryCarouselPortrait = @"SmartechCarouselPortraitNotification";
NSString *const kNotificationCategoryCarouselLandscape = @"SmartechCarouselLandscapeNotification";
NSString *const kNotificationCategoryCarouselFallback = @"SmartechCarouselFallbackNotification";

static NSUInteger units =
NSCalendarUnitYear |
NSCalendarUnitMonth |
NSCalendarUnitDay |
NSCalendarUnitWeekday |
NSCalendarUnitWeekdayOrdinal |
kCFCalendarUnitHour |
kCFCalendarUnitMinute |
kCFCalendarUnitSecond;

@implementation SmartechAppinboxReactNative

RCT_EXPORT_MODULE()

#pragma mark - App inbox Methods for Custom UI

/**
 @brief This method is used to  get the  list of available categories which is used filter the AppInbox messages list based on the category selected by the user by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(getAppInboxCategoryList:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[SmartechAppInbox getAppInboxCategoryList]");
    @try {
        NSArray *appInboxCategoryArray  = [[NSArray alloc] initWithArray:[[SmartechAppInbox sharedInstance] getAppInboxCategoryList]];
        NSMutableArray *categoryData = [[NSMutableArray alloc] init];
        for (SMTAppInboxCategoryModel *catObj in appInboxCategoryArray) {
            NSMutableDictionary * categoryDict = [[NSMutableDictionary alloc] initWithDictionary:@{ @"categoryName": [catObj categoryName],
                                                                                                    @"isSelected":  @([catObj isSelected]) }];
            [categoryData addObject:categoryDict];
        }
        [self returnResult:categoryData withCallback:callback andError:nil];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting app inbox category %@", exception.reason);
    }
}

/**
 @brief This method is used to  get the  list of available messages based on selected categories by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(getAppInboxMessagesWithCategory:(NSArray *)appInboxCategoryArray callback:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[SmartechAppInbox getAppInboxMessagesWithCategory]");
    NSMutableArray <SMTAppInboxCategoryModel *> *appInboxArray  = [[NSMutableArray alloc] init];
    @try {
        for (int i =0; i< appInboxCategoryArray.count; i++) {
            SMTAppInboxCategoryModel *notificationPayload = [[SMTAppInboxCategoryModel alloc] init];
            notificationPayload.categoryName = [[appInboxCategoryArray objectAtIndex:i] objectForKey:@"categoryName"];
            notificationPayload.isSelected = [NSNumber numberWithBool:[[appInboxCategoryArray objectAtIndex:i] objectForKey:@"isSelected"]];
            [appInboxArray addObject:notificationPayload];
        }
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting app inbox messages with category %@", exception.reason);
    }
    NSArray <SMTAppInboxMessage *>  *appInboxMessagesArray = [[SmartechAppInbox sharedInstance] getAppInboxMessageWithCategory:appInboxArray];
    [self getAppInboxMessages:appInboxMessagesArray withCallback:callback];
}

/**
 @brief This method is used to  get the  list of available messages based on message type by Smartech APPInbox SDK.
 //ALL_MESSAGE, DISMISS_MESSAGE, READ_MESSAGE, UNREAD_MESSAGE
 */
RCT_EXPORT_METHOD(getAppInboxMessages:(int)messageType callback:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[SmartechAppInbox getAppInboxMessages]");
    @try {
        NSArray *appInboxMessagesArray  = [[NSArray alloc] initWithArray:[[SmartechAppInbox sharedInstance] getAppInboxMessages:messageType]];
        [self getAppInboxMessages:appInboxMessagesArray withCallback:callback];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting app inbox messages %@", exception.reason);
    }
}


- (NSString *)timeIntervalStringFromDate:(NSDate *)date {
    
    NSDate *earlier = date;
    NSDate *today = [NSDate date];
    
    NSCalendar *gregorianCalendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    NSDateComponents *components = [gregorianCalendar components:units fromDate:earlier toDate:today options:0];

    NSInteger years = [components year];
    
    if (years >= 1) {
        return [NSString stringWithFormat:@"%ld %@ ago",(long)years, ((years > 1)? @"years" : @"year")];
    }
    
    NSInteger months = [components month];
    
    if (months >= 1) {
        return [NSString stringWithFormat:@"%ld %@ ago",(long)months, ((months > 1)? @"months" : @"month")];
    }
    
    NSInteger days = [components day];
    
    if (days >= 1) {
        return [NSString stringWithFormat:@"%ld %@ ago",(long)days, ((days > 1)? @"days" : @"day")];
    }
    
    NSInteger hour = [components hour];
    
    if (hour >= 1) {
        return [NSString stringWithFormat:@"%ld %@ ago",(long)hour, ((hour > 1)? @"hours" : @"hour")];
    }
    
    NSInteger minute = [components minute];
    
    if (minute >= 1) {
        return [NSString stringWithFormat:@"%ld %@ ago",(long)minute, ((minute > 1)? @"minutes" : @"minute")];
    }
    
    NSInteger second = [components second];
    
    if (second >= 1 && second <= 59) {
        return [NSString stringWithFormat:@"%ld %@ ago",(long)second, ((second > 1)? @"second" : @"second")];
    }
    
    return @"";
}


-(void)getAppInboxMessages:(NSArray *)appInboxMessagesArray withCallback:(RCTResponseSenderBlock)callback{
    NSMutableArray *appInboxArray = [[NSMutableArray alloc] init];
    @try {
        for (SMTAppInboxMessage *messageObj in appInboxMessagesArray) {
            SMTAppInboxMessageModel *notificationPayload = messageObj.payload;
            NSString *notificationCategory = notificationPayload.aps.category;
            NSString *publishDate = [self timeIntervalStringFromDate:messageObj.publishedDate];
            NSMutableDictionary * messageDict = [[NSMutableDictionary alloc] initWithDictionary:@{ @"title": notificationPayload.aps.alert.title,
                                                                                                   @"subtitle":notificationPayload.aps.alert.subtitle,
                                                                                                   @"description": notificationPayload.aps.alert.body,
                                                                                                   @"notificationType":notificationPayload.smtPayload.type,
                                                                                                   @"notificationCategory":notificationCategory,
                                                                                                   @"trid":notificationPayload.smtPayload.trid,
                                                                                                   @"deeplink":notificationPayload.smtPayload.deeplink,
                                                                                                   @"mediaURL":notificationPayload.smtPayload.mediaURL,
                                                                                                   @"status":notificationPayload.smtPayload.status,
                                                                                                   @"publishedDate":publishDate
                                                                                                }];
            
            if ([notificationCategory isEqualToString:kNotificationCategoryCarouselPortrait] || [notificationCategory isEqualToString:kNotificationCategoryCarouselLandscape] || [notificationCategory isEqualToString:kNotificationCategoryCarouselFallback]) {
                
                NSArray <SMTCarousel *>  *carouselAppInboxArray = notificationPayload.smtPayload.carousel;
                NSMutableArray *carouselArray = [[NSMutableArray alloc] init];
                for (SMTCarousel *carouselObj in carouselAppInboxArray) {
                    NSMutableDictionary * carouselDict = [[NSMutableDictionary alloc] initWithDictionary:@{ @"imgUrl": carouselObj.imgUrl,
                                                                                                            @"imgUrlPath": (carouselObj.imgUrlPath != nil) ? carouselObj.imgUrlPath : @"",
                                                                                                            @"imgTitle":carouselObj.imgTitle,
                                                                                                            @"imgMsg":carouselObj.imgMsg,
                                                                                                            @"imgDeeplink":carouselObj.imgDeeplink
                                                                                                         }];
                    [carouselArray addObject:carouselDict];
                }
                [messageDict setObject:carouselArray forKey:@"carousel"];
            }
            
            if (notificationPayload.smtPayload.actionButton.count > 0) {
                NSArray <SMTActionButton *> *actionButtonAppInboxArray = notificationPayload.smtPayload.actionButton;
                NSMutableArray *actionArray = [[NSMutableArray alloc] init];
                for (SMTActionButton *actionObj in actionButtonAppInboxArray) {
                    NSMutableDictionary *actionDict = [[NSMutableDictionary alloc] initWithDictionary:@{ @"actionDeeplink": actionObj.actionDeeplink,
                                                                                                         @"actionName": actionObj.actionName,
                                                                                                         @"aTyp":actionObj.actionType,
                                                                                                         @"callToAction":actionObj.actionName,
                                                                                                         @"config_ctxt":(actionObj.actionConfig.count >   0) ?      [actionObj.actionConfig objectForKey:@"ctxt"] :     @""
                                                                                                      }];
                    [actionArray addObject:actionDict];
                }
                [messageDict setObject:actionArray forKey:@"actionButton"];
            }else{
                [messageDict setObject:@[] forKey:@"actionButton"];
            }
            
            [appInboxArray addObject:messageDict];
        }
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting app inbox messages %@", exception.reason);
    }
    [self returnResult:appInboxArray withCallback:callback andError:nil];
}

/**
 @brief This method is used to  get their respective count. This method accepts SMTAppInboxMessageType as a parameter  by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(getAppInboxMessageCount:(int)messageType callback:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[SmartechAppInbox getAppInboxMessageCount]");
    @try {
        NSNumber *messageCount = @([[SmartechAppInbox sharedInstance] getAppInboxMessageCount:messageType]);//3
        [self returnResult:messageCount withCallback:callback andError:nil];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting App Inbox Message Count %@", exception.reason);
    }
}

/**
 @brief This method is used to  get latest inbox messages. This method accepts messageLimit, messagetype and appInboxCategoryArray as a parameter  by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(getAppInboxMessagesByApiCall:(int)messageLimit :(int)messageType :(NSArray *)appInboxCategoryArray callback:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[SmartechAppInbox getAppInboxMessagesByApiCall]");
    @try {
        SMTAppInboxFilter *inboxFilter = [[SmartechAppInbox sharedInstance] getPullToRefreshParameter];
        inboxFilter.limit = messageLimit; //[[inboxPayload objectForKey:@"messageLimit"] intValue];
        NSString *inboxDataType;
        switch (messageType) {
            default:
                inboxDataType = @"ALL";
              break;
            case 2:
                inboxDataType = @"LATEST";
              break;
            case 3:
                inboxDataType = @"EARLIEST";
              break;
        }
        
        inboxFilter.direction = inboxDataType.lowercaseString;
       
        [[SmartechAppInbox sharedInstance] getAppInboxMessage:inboxFilter withCompletionHandler:^(NSError *error,BOOL status) {
            if (appInboxCategoryArray.count == 0){
                NSArray <SMTAppInboxMessage *> *appInboxMessagesArray = [[SmartechAppInbox sharedInstance] getAppInboxMessageWithCategory:[[[SmartechAppInbox sharedInstance] getAppInboxCategoryList] mutableCopy]];
                [self getAppInboxMessages:appInboxMessagesArray withCallback:callback];
            }else{
                NSMutableArray <SMTAppInboxCategoryModel *> *appInboxArray  = [[NSMutableArray alloc] init];
                for (int i =0; i< appInboxCategoryArray.count; i++) {
                    SMTAppInboxCategoryModel *notificationPayload = [[SMTAppInboxCategoryModel alloc] init];
                    notificationPayload.categoryName = [[appInboxCategoryArray objectAtIndex:i] objectForKey:@"categoryName"];
                    notificationPayload.isSelected = [NSNumber numberWithBool:[[appInboxCategoryArray objectAtIndex:i] objectForKey:@"isSelected"]];
                    [appInboxArray addObject:notificationPayload];
                }
                NSArray <SMTAppInboxMessage *>  *appInboxMessagesArray = [[SmartechAppInbox sharedInstance] getAppInboxMessageWithCategory:appInboxArray];
                [self getAppInboxMessages:appInboxMessagesArray withCallback:callback];
            }
        }];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting App Inbox Messages with category %@", exception.reason);
    }
}

#pragma mark - App Inbox Methods For User Events

/**
 @brief This method is used to  Send this event once the AppInbox message is visible to the user by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(markMessageAsViewed:(NSDictionary *)inboxMesaage) {
    RCTLogInfo(@"[SmartechAppInbox markMessageAsViewed]");
    @try {
        SMTAppInboxMessage *appInboxMessage = [[SmartechAppInbox sharedInstance] getInboxMessageById:[inboxMesaage objectForKey:@"trid"]];
        [[SmartechAppInbox sharedInstance] markMessageAsViewed:appInboxMessage];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in markMessageAsViewed %@", exception.reason);
    }
}

/**
 @brief Onclick of AppInbox message, you need to send this event to SDK. This method takes 2 parameters that are deeplink and payload of AppInbox message. by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(markMessageAsClicked:(NSString *)trid deeplink:(NSString *)deeplink){
    RCTLogInfo(@"[SmartechAppInbox markMessageAsClicked]");
    @try {
        SMTAppInboxMessage *appInboxMessage = [[SmartechAppInbox sharedInstance] getInboxMessageById:trid];
        [[SmartechAppInbox sharedInstance] markMessageAsClicked:appInboxMessage withDeeplink:deeplink];
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in getting markMessageAsClicked %@", exception.reason);
    }
}

/**
 @brief This method is used to mimic the feature of swipe to delete the messages from your TableView by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(markMessageAsDismissed:(NSDictionary *)inboxMessage callback:(RCTResponseSenderBlock)callback) {
    RCTLogInfo(@"[SmartechAppInbox markMessageAsDismissed]");
    @try {
        if (inboxMessage) {
            SMTAppInboxMessage *appInboxMessage = [[SmartechAppInbox sharedInstance] getInboxMessageById:[inboxMessage objectForKey:@"trid"]];
            [[SmartechAppInbox sharedInstance] markMessageAsDismissed:appInboxMessage withCompletionHandler:^(NSError *error, BOOL status) {
                if (status) {
                    //Remove data from array and refresh the table view
                    [self returnResult:@(status) withCallback:callback andError:nil];
                }
            }];
        }
    } @catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in markMessageAsDismissed %@", exception.reason);
    }
}

/**
 @brief Onclick of AppInbox message, you need to send this event to SDK. This method takes 2 parameters that are copytext and deeplink of action button AppInbox message. by Smartech APPInbox SDK.
 */
RCT_EXPORT_METHOD(copyMessageAsClicked:(NSDictionary *)actionButton :(NSString *)trid){
    RCTLogInfo(@"[SmartechAppInbox markMessageAsClicked]");
    @try {
        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
        pasteboard.string = [actionButton objectForKey:@"config_ctxt"];
        if ([actionButton objectForKey:@"actionDeeplink"]){
            SMTAppInboxMessage *appInboxMessage = [[SmartechAppInbox sharedInstance] getInboxMessageById:trid];
            [[SmartechAppInbox sharedInstance] markMessageAsClicked:appInboxMessage withDeeplink:[actionButton objectForKey:@"actionDeeplink"]];
        }
    }@catch (NSException *exception) {
        NSLog(@"Smartech error: Exception caught in copyMessageAsClicked %@", exception.reason);
    }
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

@end
