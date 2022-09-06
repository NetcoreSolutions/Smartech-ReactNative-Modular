package com.smartechappinboxreactnative;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class SmartechDeeplinkReceivers extends BroadcastReceiver {
  public  static  OnDeeplinkReceive onDeeplinkReceive1;

  public static void setRegisterCallback(OnDeeplinkReceive onDeeplinkReceive) {
   onDeeplinkReceive1 = onDeeplinkReceive;
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    try {
      onDeeplinkReceive1.onDeeplinkReceive(intent);
    } catch (Throwable e) {
      e.printStackTrace();
    }
  }

  interface OnDeeplinkReceive{
    void onDeeplinkReceive(Intent deeplinkPayload);
  }

}
