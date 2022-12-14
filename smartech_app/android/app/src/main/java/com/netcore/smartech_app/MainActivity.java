package com.netcore.smartech_app;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.smartechpushreactnative.SmartechPushReactNativeModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TestingSmartModule";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SmartechPushReactNativeModule.init(getIntent());
  }

}