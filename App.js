/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import {
  BackHandler,
  Platform,
  ActivityIndicator,
  AppRegistry,
  View,
  Text,
} from "react-native";

const App = () => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onAndroidBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, [canGoBack]);

  const jsCode = `
    var cookie={};
    document.cookie.split('; ').forEach(function(i){cookie[i.split('=')[0]]=i.split('=')[1]});
    document.querySelector('#username').value=cookie['username'] || '';
    document.querySelector('#password').value=cookie['password'] || '';
    document.querySelector('.Button Button--primary').onclick = function(){
        document.cookie = 'username='+document.querySelector('#username').value;
        document.cookie = 'password='+document.querySelector('#password').value;
    };
  `;

  return (
    <>
      <StatusBar backgroundColor="#2888a1" />
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black", fontSize: 20, marginBottom: 20 }}>
            Please wait while the data loads.
          </Text>
          <ActivityIndicator size="large" color={"black"} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        source={{ uri: "https://github.com/kundan175" }}
        javaScriptEnabled={true}
        injectedJavaScript={jsCode}
        domStorageEnabled={true}
        cacheEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        pullToRefreshEnabled={true}
        style={{ marginTop: 30, opacity: isLoading ? 0 : 1 }}
        onLoadStart={() => {}}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
      />
    </>
  );
};

AppRegistry.registerComponent("App", () => App);

export default App;
