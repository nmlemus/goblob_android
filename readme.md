PARA INSTALAR EL PLUGIN DE GOOGLE MAP EN CORDOVA HACEMOS:

1. $ keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

Que genera esta llave: 80:B5:14:1E:94:D9:13:95:A1:63:52:C6:59:DA:D1:CD:B5:9E:DF:A7

2. Obtain the Google Maps API Key for Android

    Go to Google APIs Console.
    Register your project
    Turn on Google Maps Android API v2
    Go to API Access page.
    Click [Create New Android Key] button
    In the resulting dialog, enter the SHA-1 fingerprint, then a semicolon, then your application's package name.
    Write down the API Key See [the official document: Get an Android certificate and the Google Maps API key]

3. $ cordova plugin add plugin.google.maps --variable API_KEY_FOR_ANDROID="YOUR_ANDROID_API_KEY_IS_HERE" --variable API_KEY_FOR_IOS="YOUR_IOS_API_KEY_IS_HERE"

YOUR_ANDROID_API_KEY_IS_HERE = AIzaSyD-hjyROMiVEfFeAU9QXOLNFPpGYjcFHAs

More information: https://github.com/wf9a5m75/phonegap-googlemaps-plugin/wiki/Tutorial-for-Mac
