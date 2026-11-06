# Keep WebView bridge and models
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
