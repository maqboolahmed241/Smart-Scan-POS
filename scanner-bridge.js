import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

window.SSPBarcodeScanner = BarcodeScanner;
window.SSPNativeBackup = {
  async shareBackup(jsonText) {
    const fileName = 'smart-scan-pos-backup.json';
    const saved = await Filesystem.writeFile({
      path: fileName,
      data: jsonText,
      directory: Directory.Cache,
      recursive: true,
      encoding: 'utf8'
    });
    await Share.share({
      title: 'Smart Scan POS Backup',
      text: 'Smart Scan POS مکمل ڈیٹا بیک اپ',
      files: [saved.uri],
      dialogTitle: 'بیک اپ محفوظ کریں یا شیئر کریں'
    });
    return true;
  }
};
