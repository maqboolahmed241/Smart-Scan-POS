import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

window.SSPBarcodeScanner = BarcodeScanner;
window.SSPNativeBackup = {
  async saveBackup(jsonText) {
    return await Filesystem.writeFile({
      path: 'Smart Scan POS/smart-scan-pos-backup.json',
      data: jsonText,
      directory: Directory.Documents,
      recursive: true,
      encoding: 'utf8'
    });
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
