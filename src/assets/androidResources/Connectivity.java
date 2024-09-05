package <filePath>;

import static androidx.core.content.ContextCompat.startActivity;

import android.content.Intent;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import <filePath>.MainActivity;
import <filePath>.MyReactActivity; 
import <filePath>.SecondActivity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class Connectivity extends ReactContextBaseJavaModule {

    private static final String TAG = "Connectivity";

    public Connectivity(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public String getName() {
        return "Connectivity";
    }

    @ReactMethod
    public void goToSecondActivity(String selectedAppsJson, Promise promise) {
        try {
            // Converting  JSON string back to JSONObject
            JSONArray selectedApps = new JSONArray(selectedAppsJson);

            // Using the data as needed and navigating to the second activity
             Intent intent = new Intent(getCurrentActivity(), SecondActivity.class);
             intent.putExtra("selectedApps", selectedApps.toString());
             getCurrentActivity().startActivity(intent);

            promise.resolve("Success");
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
}