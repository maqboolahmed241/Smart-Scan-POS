const fs = require('fs');
const path = require('path');
const pkg = 'com/maqboolahmed/smartscanpos';
const base = path.join('android/app/src/main/java', pkg);
fs.mkdirSync(base, { recursive: true });
fs.writeFileSync(path.join(base, 'NativeBackupPlugin.java'), `package com.maqboolahmed.smartscanpos;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "NativeBackup")
public class NativeBackupPlugin extends Plugin {
    @PluginMethod
    public void saveBackup(PluginCall call) {
        String jsonText = call.getString("jsonText");
        if (jsonText == null || jsonText.isEmpty()) {
            call.reject("Backup data is empty");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, "smart-scan-pos-backup.json");
        startActivityForResult(call, intent, "saveBackupResult");
    }

    @ActivityCallback
    private void saveBackupResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Save cancelled");
            return;
        }
        Uri uri = result.getData().getData();
        String jsonText = call.getString("jsonText");
        try (OutputStream output = getContext().getContentResolver().openOutputStream(uri)) {
            if (output == null) throw new Exception("Could not open selected file");
            output.write(jsonText.getBytes(StandardCharsets.UTF_8));
            output.flush();
            JSObject response = new JSObject();
            response.put("uri", uri.toString());
            call.resolve(response);
        } catch (Exception error) {
            call.reject("Could not save backup: " + error.getMessage(), error);
        }
    }
}
`);
const main = path.join(base, 'MainActivity.java');
fs.writeFileSync(main, `package com.maqboolahmed.smartscanpos;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeBackupPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
`);
