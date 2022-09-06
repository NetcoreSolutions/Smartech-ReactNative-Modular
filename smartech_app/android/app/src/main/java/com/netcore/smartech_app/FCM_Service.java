package com.netcore.smartech_app;

import android.app.NotificationChannelGroup;
import android.app.NotificationManager;
import android.content.Context;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.netcore.android.Smartech;
import com.netcore.android.smartechpush.SmartPush;
import java.lang.ref.WeakReference;
import java.util.List;

public class FCM_Service extends FirebaseMessagingService {

        @Override
        public void onNewToken(@NonNull String token) {
                super.onNewToken(token);
                SmartPush.getInstance(new WeakReference<Context>(this)).setDevicePushToken(token);
        }

        @Override
        public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
                super.onMessageReceived(remoteMessage);
               SmartPush.getInstance(new WeakReference<>(getApplicationContext())).handlePushNotification(remoteMessage.getData().toString());
        }
}