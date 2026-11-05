import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { registerPlugin } from '@capacitor/core';

const NativeBackup = registerPlugin('NativeBackup');

window.SSPBarcodeScanner = BarcodeScanner;
window.SSPNativeBackup = {
  async saveBackup(jsonText) {
    return await NativeBackup.saveBackup({ jsonText });
  },
  async shareBackup(jsonText) {
    const saved = await Filesystem.writeFile({
      path: 'smart-scan-pos-backup.json',
      data: jsonText,
      directory: Directory.Cache,
      recursive: true,
      encoding: 'utf8'
    });
    await Share.share({
      title: 'Smart Scan POS Backup',
      text: 'Smart Scan POS مکمل ڈیٹا بیک اپ',
      files: [saved.uri],
      dialogTitle: 'بیک اپ شیئر کریں یا Drive میں محفوظ کریں'
    });
    return true;
  }
};
