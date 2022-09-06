package com.smartechbasereactnative;

import android.content.Context;
import android.location.Location;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.netcore.android.Smartech;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Iterator;

@ReactModule(name = SmartechBaseReactNativeModule.NAME)
public class SmartechBaseReactNativeModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SmartechBaseReactNative";
    private Smartech smartech = null;
    private final ReactApplicationContext reactContext;
    private static final String TAG = SmartechBaseReactNativeModule.class.getSimpleName();

    public SmartechBaseReactNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
      this.reactContext = reactContext;
      initSDK();
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private void initSDK() {
      if (smartech == null) {
        try {
          smartech = Smartech.getInstance(new WeakReference<Context>(this.reactContext));
        } catch (Throwable e) {
          e.printStackTrace();
        }
      }
    }
  // This method is used to track app install event.
  @ReactMethod
  public void trackAppInstall() {
    try {
      smartech.trackAppInstall();
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method is used to track app update event.
  @ReactMethod
  public void trackAppUpdate() {
    try {
      smartech.trackAppUpdate();
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method is used to track app install or update event by Smartech SDK itself.
  @ReactMethod
  public void trackAppInstallUpdateBySmartech() {
    try {
      smartech.trackAppInstallUpdateBySmartech();
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method is used to track custom event done by the user.
  @ReactMethod
  public void trackEvent(String eventName, ReadableMap payload) {
    try {
      HashMap<String, Object> hmapPayload = SmartechHelper.convertReadableMapToHashMap(payload);
      smartech.trackEvent(eventName, hmapPayload);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  /**
   * This method is used to send login event to Smartech backend.
   * This method should be called only when the app gets the user's identity
   * or when the user does a login activity in the application.
   */
  @ReactMethod
  public void login(String identity) {
    try {
      smartech.setUserIdentity(identity);
      smartech.login(identity);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  /**
   * This method would logout the user and clear identity on Smartech backend.
   * This method should be called only when the user log out of the application.
   */
  @ReactMethod
  public void logoutAndClearUserIdentity(Boolean isLogout) {
    try {
      smartech.logoutAndClearUserIdentity(isLogout);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method would set the user identity locally and with all subsequent events this identity will be send.
  @ReactMethod
  public void setUserIdentity(String identity, Callback callback) {
    try {
      if (identity != null && identity.length() > 0) {
        smartech.setUserIdentity(identity);
        callbackHandler(callback, "Identity is set successfully.");
      } else {
        callbackHandler(callback, "Expected one non-empty string argument.");
      }
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

  // This method would get the user identity that is stored in the SDK.
  @ReactMethod
  private void getUserIdentity(Callback callback) {
    try {
      String userIdentity = smartech.getUserIdentity();
      callbackHandler(callback, userIdentity);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

  // This method would clear the identity that is stored in the SDK.
  @ReactMethod
  public void clearUserIdentity() {
    try {
      smartech.clearUserIdentity();
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method is used to update the user profile.
  @ReactMethod
  public void updateUserProfile(ReadableMap profileData) {
    try {
      HashMap<String, Object> hmapProfile = SmartechHelper.convertReadableMapToHashMap(profileData);
      smartech.updateUserProfile(hmapProfile);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // ----- GDPR Methods -----

  // This method is used to opt tracking.
  @ReactMethod
  public void optTracking(Boolean value) {
    try {
      smartech.optTracking(value);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // This method is used to get the current status of opt tracking.
  @ReactMethod
  public void hasOptedTracking(Callback callback) {
    try {
      Boolean isTracking = smartech.hasOptedTracking();
      callbackHandler(callback, isTracking);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

   //  This method is used to opt in-app messages.
    @ReactMethod
    public void optInAppMessage(Boolean value) {
        try {
            smartech.optInAppMessage(value);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    // This method is used to get the current status of opt in-app messages.
    @ReactMethod
    public void hasOptedInAppMessage(Callback callback) {
        try {
            Boolean isInAppOpted = smartech.hasOptedInAppMessage();
            callbackHandler(callback, isInAppOpted);
        } catch (Throwable e) {
            e.printStackTrace();
            callbackHandler(callback, "Exception: " + e.getMessage());
        }
    }


  // ----- Location Methods -----

  // This method is used to set the user's location to the SDK.
  @ReactMethod
  public void setUserLocation(Double latitude, Double longitude) {
    try {
      Location location = new Location("Smartech");
      location.setLatitude(latitude);
      location.setLongitude(longitude);
      smartech.setUserLocation(location);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  // ----- Helper Methods -----

  // This method is used to get the app id used by the Smartech SDK.
  @ReactMethod
  public void getAppId(Callback callback) {
    try {
      String appId = smartech.getAppID();
      callbackHandler(callback, appId);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

  // This method is used to get the device unique id used by Smartech SDK.
  @ReactMethod
  public void getDeviceGuid(Callback callback) {
    try {
      String GUID = smartech.getDeviceUniqueId();
      callbackHandler(callback, GUID);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
    }
  }

  // This method is used to get the current Smartech SDK version.
  @ReactMethod
  public void getSDKVersion(Callback callback) {
    try {
      String sdkVersion = smartech.getSDKVersion();
      callbackHandler(callback, sdkVersion);
    } catch (Throwable e) {
      e.printStackTrace();
      callbackHandler(callback, "Exception: " + e.getMessage());
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
