#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "SmartechPushReactnative.h"
#import "SmartechPushReactEventEmitter.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@interface AppDelegate () <UNUserNotificationCenterDelegate, SmartechDelegate> {
  NSMutableDictionary *smtDeeplinkData;
}

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"TestingSmartModule"
                                            initialProperties:nil];
  
  NSLog(@"[SMT-APP] didFinishLaunchingWithOptions = %@", launchOptions);
  // Smartech Native SDK
  [[Smartech sharedInstance] initSDKWithDelegate:self withLaunchOptions:launchOptions];
  [[Smartech sharedInstance] setDebugLevel:SMTLogLevelVerbose];
  //[[SmartPush sharedInstance] registerForPushNotificationWithDefaultAuthorizationOptions];
  [[Smartech sharedInstance] trackAppInstallUpdateBySmartech];
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  smtDeeplinkData = [[NSMutableDictionary alloc] init];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleNotificationInTerminatedSate:) name:@"OnloadEvent" object:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"[SMT-APP] didRegisterForRemoteNotificationsWithDeviceToken");
  [[SmartPush sharedInstance] didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"[SMT-APP] didFailToRegisterForRemoteNotificationsWithError = %@", [error localizedFailureReason]);
  [[SmartPush sharedInstance] didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"[SMT-APP] didReceiveRemoteNotification Silent Notification");
  if ([[SmartPush sharedInstance] isNotificationFromSmartech:userInfo]) {
    [[SmartPush sharedInstance] didReceiveRemoteNotification:userInfo withCompletionHandler:^(UIBackgroundFetchResult bgFetchResult) {
      completionHandler(bgFetchResult);
    }];
  }
  else {
    completionHandler(UIBackgroundFetchResultNewData);
  }
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  NSLog(@"[SMT-APP] application Active");
}

#pragma mark - UNUserNotificationCenterDelegate Methods

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSLog(@"[SMT-APP] willPresentNotification");
  [[SmartPush sharedInstance] willPresentForegroundNotification:notification];
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"[SMT-APP] didReceiveNotificationResponse %@",response.notification.request.content);
  [[SmartPush sharedInstance] didReceiveNotificationResponse:response];
  completionHandler();
}

#pragma mark Smartech Deeplink Delegate

- (void)handleDeeplinkActionWithURLString:(NSString *)deeplinkURLString andCustomPayload:(NSDictionary *_Nullable)customPayload {
  
  NSMutableDictionary *smtData = [[NSMutableDictionary alloc] init];
  smtData[kSMTDeeplinkIdentifier] = deeplinkURLString ? deeplinkURLString : @"";
  smtData[kSMTCustomPayloadIdentifier] = customPayload ? customPayload : @{};
  smtDeeplinkData = smtData;
  [[NSNotificationCenter defaultCenter] postNotificationName:kSMTDeeplinkNotificationIdentifier object:nil userInfo:smtData];
}

- (void)handleNotificationInTerminatedSate:(NSNotification *)notification {
  if (smtDeeplinkData.count > 0) {
    [self handleDeeplinkActionWithURLString:smtDeeplinkData[kSMTDeeplinkIdentifier] andCustomPayload:smtDeeplinkData[kSMTCustomPayloadIdentifier]];
    smtDeeplinkData = [[NSMutableDictionary alloc] init];
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//    [[Smartech sharedInstance] application:app openURL:url options:options];
//    return YES;
//}

@end
