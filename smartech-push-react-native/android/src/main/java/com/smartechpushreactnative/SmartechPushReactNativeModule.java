package com.smartechpushreactnative;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.netcore.android.smartechpush.SmartPush;
import com.netcore.android.smartechpush.notification.SMTNotificationClickListener;
//import com.netcore.android.smartechpush.notification.SMTNotificationOptions;
//import com.netcore.android.smartechpush.notification.channel.SMTNotificationChannel;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@ReactModule(name = SmartechPushReactNativeModule.NAME)
public class SmartechPushReactNativeModule extends ReactContextBaseJavaModule implements SMTNotificationClickListener {
  public static final String NAME = "SmartechPushReactNative";
  private SmartPush smartechpush = null;
  private final ReactApplicationContext reactContext;
  public static Intent mIntent = null;
  private static final String MODULE_NAME = "SmartechReactNative";
  private static final String SmartechDeeplinkNotification = "SmartechDeeplinkNotification";
  private static final String SmartechDeepLinkIdentifier = "deeplink";
  private static final String SmartechCustomPayloadIdentifier = "customPayload";
  private static final String TAG = SmartechPushReactNativeModule.class.getSimpleName();

  public SmartechPushReactNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    initSDK();
  }

  private void initSDK() {
    if (smartechpush == null) {
      try {
        smartechpush = SmartPush.getInstance(new WeakReference<Context>(this.reactContext));
        smartechpush.setSMTNotificationClickListener(this);
      } catch (Throwable e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @javax.annotation.Nullable
  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(SmartechDeeplinkNotification, SmartechDeeplinkNotification);
    return constants;
  }

  @ReactMethod
  public static void init(Intent intent) {
    mIntent = intent;
  }

  @ReactMethod
  public void getDeepLinkUrl(Callback callback) {
    ReadableMap payload = processDeeplinkIntent(mIntent);
    callbackHandler(callback, payload);
  }

  // This method will be handle notification click.
  @Override
  public void onNotificationClick(@NotNull Intent intent) {
    try {
      ReadableMap deeplinkPayload = processDeeplinkIntent(intent);
      System.out.println("Deeplink Pyload : "+deeplinkPayload);
      this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(SmartechDeeplinkNotification, deeplinkPayload);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // Used to process intent.
  private ReadableMap processDeeplinkIntent(Intent intent) {
    WritableMap smtData = new WritableNativeMap();
    if (intent != null) {
      Bundle extras = intent.getExtras();
      if (extras != null) {
        String value = extras.toString();
        String deeplinkPath = "";
        String customPayload = "";
        if (extras.containsKey("clickDeepLinkPath")) {
          deeplinkPath = extras.getString("clickDeepLinkPath");
          System.out.println("Deeplink Pyload : "+deeplinkPath);
          if (extras.containsKey("clickCustomPayload")) {
            customPayload = extras.getString("clickCustomPayload");
          }
          try {
            smtData.putString(SmartechDeepLinkIdentifier, deeplinkPath);
            smtData.putString(SmartechCustomPayloadIdentifier, customPayload);
          } catch (Throwable e) {
            e.printStackTrace();
          }
        }
      }
    }
    return smtData;
  }


  // This method is used to opt push notifications.
  @ReactMethod
  public void optPushNotification(Boolean value) {
    try {
      smartechpush.optPushNotification(value);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method is used to get the current status of opt push notification.
  @ReactMethod
  public void hasOptedPushNotification(Callback callback) {
    try {
      Boolean isPushNotificationOpted = smartechpush.hasOptedPushNotification();
      callbackHandler(callback, isPushNotificationOpted);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

  // This method is used to get the device push token used by Smartech SDK.
  @ReactMethod
  public void getDevicePushToken(Callback callback) {
    try {
      String token = smartechpush.getDevicePushToken();
      callbackHandler(callback, token);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

  // This method is used to set device push tokens which is used by SDK to send notifications.
  @ReactMethod
  public void setDevicePushToken(String token) {
    try {
      smartechpush.setDevicePushToken(token);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }
  
  // This is empty method used in iOS only..
  @ReactMethod
  public void registerForPushNotificationWithAuthorizationOptions(boolean alert, boolean badge, boolean sound) {}

  // This method will be used to fetch already generated tokens for existings users.
  @ReactMethod
  public void fetchAlreadyGeneratedTokenFromFCM() {
    try {
      smartechpush.fetchAlreadyGeneratedTokenFromFCM();
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // Used to handle callback.
  private void callbackHandler(Callback callback, Object response) {
    if (callback == null) {
      Log.i(TAG, "Callback is null.");
      return;
    }

    try {
      callback.invoke(response);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // for convertind JSON to hashmap.
  private static HashMap<String, Object> jsonToHashMap(JSONObject jsonObject) throws JSONException {
    HashMap<String, Object> hashMap = new HashMap<>();
    Iterator<String> iterator = jsonObject.keys();
    try {
      while (iterator.hasNext()) {
        String key = iterator.next();
        Object value = jsonObject.get(key);
        hashMap.put(key, value);
      }
    } catch (Throwable e) {
      e.printStackTrace();
    }
    return hashMap;
  }
}

