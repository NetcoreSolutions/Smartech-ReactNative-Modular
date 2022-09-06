package com.smartechappinboxreactnative;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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
import com.netcore.android.smartechappinbox.SmartechAppInbox;
import com.netcore.android.smartechappinbox.network.listeners.SMTInboxCallback;
import com.netcore.android.smartechappinbox.network.model.SMTActionButton;
import com.netcore.android.smartechappinbox.network.model.SMTCarousel;
import com.netcore.android.smartechappinbox.network.model.SMTInboxCategory;
import com.netcore.android.smartechappinbox.network.model.SMTInboxMessageData;
import com.netcore.android.smartechappinbox.utility.SMTAppInboxMessageType;
import com.netcore.android.smartechappinbox.utility.SMTAppInboxRequestBuilder;
import com.netcore.android.smartechappinbox.utility.SMTInboxDataType;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ReactModule(name = SmartechAppinboxReactNativeModule.NAME)
public class SmartechAppinboxReactNativeModule extends ReactContextBaseJavaModule implements SmartechDeeplinkReceivers.OnDeeplinkReceive {
  public static final String NAME = "SmartechAppinboxReactNative";
  private SmartechAppInbox smartechAppInbox = null;
  private static final String TAG = SmartechAppinboxReactNativeModule.class.getSimpleName();
  private final ReactApplicationContext reactContext;
  private static final String SmartechDeepLinkIdentifier = "deeplink";
  private static final String SmartechCustomPayloadIdentifier = "customPayload";
  private static final String SmartechAppInboxDeeplinkNotification = "SmartechAppInboxDeeplinkNotification";

  public SmartechAppinboxReactNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    initSDK();
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
    constants.put(SmartechAppInboxDeeplinkNotification, SmartechAppInboxDeeplinkNotification);
    return constants;
  }

  private void initSDK() {
    if (smartechAppInbox == null) {
      try {
        smartechAppInbox = SmartechAppInbox.getInstance(new WeakReference<Context>(this.reactContext));
        SmartechDeeplinkReceivers.setRegisterCallback(this);
        SmartechDeeplinkReceivers deeplinkReceiver = new SmartechDeeplinkReceivers();
        IntentFilter filter = new IntentFilter("com.smartech.EVENT_PN_INBOX_CLICK");
        this.reactContext.registerReceiver(deeplinkReceiver, filter);
      } catch (Throwable e) {
        e.printStackTrace();
      }
    }
  }

  @ReactMethod
  public void getAppInboxMessages(Integer messageType, Callback callback) {
    try {
      ArrayList appInbox;
      switch (messageType) {
        default:
          appInbox = smartechAppInbox.getAppInboxMessages(SMTAppInboxMessageType.INBOX_MESSAGE);
          break;
        case 2:
          appInbox = smartechAppInbox.getAppInboxMessages(SMTAppInboxMessageType.READ_MESSAGE);
          break;
        case 3:
          appInbox = smartechAppInbox.getAppInboxMessages(SMTAppInboxMessageType.UNREAD_MESSAGE);
          break;
      }
      getAppInboxMessage(appInbox, callback);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void getAppInboxCategoryList(Callback callback) {
    try {
      ArrayList categoryList = smartechAppInbox.getAppInboxCategoryList();
      JSONArray array = new JSONArray();
      for (int i = 0; (i < categoryList.size()); i++) {
        JSONObject object1 = new JSONObject();
        try {
          object1.put("categoryName", ((SMTInboxCategory) categoryList.get(i)).getName());
          object1.put("isSelected", (((SMTInboxCategory) categoryList.get(i)).getState()));
          array.put(object1);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
      callbackHandler(callback, array.toString());
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void getAppInboxMessagesWithCategory(String categoryData, Callback callback) {
    try {
      ArrayList<String> categoryList = new ArrayList<String>();
      JSONArray array_cat = new JSONArray(categoryData);
      for (int i = 0; i < array_cat.length(); i++) {
        JSONObject object1 = array_cat.getJSONObject(i);
        try {
          categoryList.add(object1.get("categoryName").toString());
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
      ArrayList appinbox = smartechAppInbox.getAppInboxMessages(categoryList);
      getAppInboxMessage(appinbox, callback);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void getAppInboxMessageCount(Integer messageType, Callback callback) {
    try {
      Integer inboxCount;
      switch (messageType) {
        default:
          inboxCount = smartechAppInbox.getAppInboxMessageCount(SMTAppInboxMessageType.INBOX_MESSAGE);
          break;
        case 2:
          inboxCount = smartechAppInbox.getAppInboxMessageCount(SMTAppInboxMessageType.READ_MESSAGE);
          break;
        case 3:
          inboxCount = smartechAppInbox.getAppInboxMessageCount(SMTAppInboxMessageType.UNREAD_MESSAGE);
          break;
      }
      callbackHandler(callback, inboxCount);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void getAppInboxMessagesByApiCall(int messageLimit, int messageType, String categoryData, Callback callback) {
    try {
      ArrayList<String> categoryList = new ArrayList<String>();
      JSONArray array_cat = new JSONArray(categoryData);
      for (int i = 0; i < array_cat.length(); i++) {
        JSONObject object1 = array_cat.getJSONObject(i);
        try {
          categoryList.add(object1.get("categoryName").toString());
        } catch (Throwable e) {
          e.printStackTrace();
        }
      }

      SmartechAppInbox smartechAppInbox = SmartechAppInbox.getInstance(new WeakReference<>(this.reactContext));
      SMTInboxDataType messageDataType = SMTInboxDataType.ALL;

      switch (messageType) {
        default:
          messageDataType = SMTInboxDataType.ALL;
          break;
        case 2:
          messageDataType = SMTInboxDataType.LATEST;
          break;
        case 3:
          messageDataType = SMTInboxDataType.EARLIEST;
          break;
      }

      SMTAppInboxRequestBuilder builder = new SMTAppInboxRequestBuilder.Builder(messageDataType)
        .setCallback(new SMTInboxCallback() {
          @Override
          public void onInboxProgress() {

          }

          @Override
          public void onInboxSuccess(@Nullable List<SMTInboxMessageData> list) {
            try {
              ArrayList appinbox = smartechAppInbox.getAppInboxMessages(categoryList);
              getAppInboxMessage(appinbox, callback);
            } catch (Throwable e) {
               e.printStackTrace();
            }
          }
          @Override
          public void onInboxFail() {

          }
        })
        .setCategory(categoryList).setLimit(messageLimit).build();
      smartechAppInbox.getAppInboxMessages(builder);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }


  @ReactMethod
  public void markMessageAsViewed(String inboxMesaage) {
    try {
      JSONObject objInbox = new JSONObject(inboxMesaage);
      SMTInboxMessageData appInboxMessage = smartechAppInbox.getAppInboxMessageById((String) objInbox.get("trid"));
      smartechAppInbox.markMessageAsViewed(appInboxMessage);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

 @ReactMethod
  public void markMessageAsClicked(String trid, String deeplink) {
    try {
      SMTInboxMessageData appInboxMessage = smartechAppInbox.getAppInboxMessageById(trid);
      smartechAppInbox.markMessageAsClicked(deeplink, appInboxMessage);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void copyMessageAsClicked(String actionButton, String trid) {
    try {
      JSONObject object1 = new JSONObject(actionButton);
      ClipboardManager clipboard = (ClipboardManager) reactContext.getSystemService(Context.CLIPBOARD_SERVICE);
      ClipData clip = ClipData.newPlainText(null, object1.get("config_ctxt").toString());
      clipboard.setPrimaryClip(clip);
      if (object1.get("actionDeeplink").toString().length() > 0){
        SMTInboxMessageData appInboxMessage = smartechAppInbox.getAppInboxMessageById(trid);
        smartechAppInbox.markMessageAsClicked(object1.get("actionDeeplink").toString(), appInboxMessage);
      }
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

  @ReactMethod
  public void markMessageAsDismissed(String inboxMesaage, Callback callback) {
    try {
      JSONObject objInbox = new JSONObject(inboxMesaage);
      SMTInboxMessageData appInboxMessage = smartechAppInbox.getAppInboxMessageById((String) objInbox.get("trid"));
      smartechAppInbox.markMessageAsDismissed(appInboxMessage);
      callbackHandler(callback, true);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  private void getAppInboxMessage(ArrayList appinbox, Callback callback) {
    JSONArray array = new JSONArray();
    for (int i = 0; (i < appinbox.size()); i++) {
      JSONObject appInboxMessage = new JSONObject();
      try {
        String notificationType = ((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getType();
        ArrayList<JSONObject> carouselArray = new ArrayList<JSONObject>();
        ArrayList<JSONObject> actionArray = new ArrayList<JSONObject>();

        appInboxMessage.put("title", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getTitle()));
        appInboxMessage.put("subtitle", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getSubTitle()));
        appInboxMessage.put("description", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getBody()));
        appInboxMessage.put("notificationCategory", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getAppInboxCategory()));
        appInboxMessage.put("trid", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getTrid()));
        appInboxMessage.put("deeplink", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getDeeplink()));
        appInboxMessage.put("mediaURL", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getMediaUrl()));
        appInboxMessage.put("publishedDate", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getPublishedDate()));
        appInboxMessage.put("status", (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getStatus()));
        appInboxMessage.put("notificationType", notificationType);

        if (notificationType.equals("CarouselLandscape") || notificationType.equals("CarouselPortrait")) {
          ArrayList<SMTCarousel> carouselAppInboxArray = ((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getCarousel();
          for (SMTCarousel carousel : carouselAppInboxArray) {
            JSONObject carouselObject = new JSONObject();
            carouselObject.put("imgUrl", carousel.getImgUrl());
            carouselObject.put("imgUrlPath", carousel.getImgUrl());
            carouselObject.put("imgTitle", carousel.getImgTitle());
            carouselObject.put("imgMsg", carousel.getImgMsg());
            carouselObject.put("imgDeeplink", carousel.getImgDeeplink());
            carouselArray.add(carouselObject);
          }
        }

        if (((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getActionButton().size() > 0) {
          ArrayList<SMTActionButton> actionButtonArray = (ArrayList<SMTActionButton>) ((SMTInboxMessageData) appinbox.get(i)).getSmtPayload().getActionButton();
          for (SMTActionButton actions : actionButtonArray) {
            JSONObject actionObject = new JSONObject();
            actionObject.put("actionDeeplink", actions.getActionDeeplink());
            actionObject.put("actionName", actions.getActionName());
            actionObject.put("aTyp", actions.getATyp());
            actionObject.put("callToAction", actions.getCallToAction());
            actionObject.put("config_ctxt", actions.getConfig_ctxt());
            actionArray.add(actionObject);
          }
        }

        appInboxMessage.put("carousel", carouselArray);
        appInboxMessage.put("actionButton", actionArray);

        array.put(appInboxMessage);
      } catch (Throwable e) {
        e.printStackTrace();
      }
    }
    callbackHandler(callback, array.toString());
  }

  // Used to handle callback.
  private void callbackHandler(Callback callback, Object response) {
    if (callback == null) {
      Log.i(TAG, "Callback is null.");
      return;
    }

    try {
      callback.invoke("Error", response);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  @Override
  public void onDeeplinkReceive(Intent intent) {
    try {
      ReadableMap deeplinkPayload = processDeeplinkIntent(intent);
      System.out.println("Deeplink Pyload : "+deeplinkPayload);
      this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(SmartechAppInboxDeeplinkNotification, deeplinkPayload);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }
}
