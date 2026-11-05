const fs = require('fs');
const p = 'android/app/src/main/AndroidManifest.xml';
let s = fs.readFileSync(p, 'utf8');
if (!s.includes('android.permission.CAMERA')) s = s.replace('<manifest', '<manifest\n    xmlns:tools="http://schemas.android.com/tools"');
if (!s.includes('android.permission.CAMERA')) s = s.replace(/<application/, '    <uses-permission android:name="android.permission.CAMERA" />\n    <application');
if (!s.includes('com.google.mlkit.vision.DEPENDENCIES')) s = s.replace(/<application([^>]*)>/, '<application$1>\n        <meta-data android:name="com.google.mlkit.vision.DEPENDENCIES" android:value="barcode_ui" />');
fs.writeFileSync(p, s);
