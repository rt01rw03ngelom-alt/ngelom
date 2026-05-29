// ==========================================
// KONFIGURASI ID SPREADSHEET (RT)
// ==========================================
const SHEET_ID = '1MvPDS5xQJMM2vsUhP-LKBkIaPfa-eM1tKwfUQ_9g70s';
const IURAN_SHEET_ID = '1wAuLWzGtVXqvnJEE9v8kl3BuVOj7jWOgF16Nb6TOmcE';
const FOLDER_ID = '1AqBH61ykSCaH6xlO3jrFzb9ChRBRtq-5';
const FOLDER_FOTO_ID = '1gqlzxToyuu4IoRWNVnKKA2T0DFoNgDEh';

// ==========================================
// KONFIGURASI ID SPREADSHEET (RONDA)
// ==========================================
const RONDA_SHEET_ID = '1xwaluroh9mBTBWESxSknfMhtIX0pLzhqHs3ymX-x-Y4';

// ========================================== 
// KONFIGURASI ID SPREADSHEET (PKK)
// ==========================================
const PKK_SHEET_ID = '1RnrsT6sU_kjVm_XK-Zu_0thkINzkzXQFZqKrzsI9eiY';
const PKK_FOLDER_ID = '1jvnw0MbZK8YpzeaBIMndhHAdlJuBIx0w';

// ==========================================
// KONFIGURASI ID SPREADSHEET (KARANG TARUNA)
// ==========================================
const KT_SHEET_ID = '1vHQFw2T9JVYOWHlwPz97rx68Nkz8UFOgBKc4qRmLT-Q';
const KT_FOLDER_ID = '1X3tCjMZi10d0vfdNNKbtm2lcxYJJLATU'; 

// Konfigurasi Waktu Cache (Detik)
const CACHE_TTL = {
  SESSION: 21600, // 6 Jam
  DATA: 600       // 10 Menit (untuk Kas, Jadwal, dll)
};

/**
 * Handler untuk API Request dari Cloudflare
 */
function doPost(e) {
  // CORS: supaya browser bisa membaca response dari origin lain
  const corsOrigin = '*';
  const baseHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600'
  };

  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    let contents;
    if (e && e.postData && e.postData.contents) {
      contents = e.postData.contents;
    } else {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', pesan: "No data received by GAS" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const request = JSON.parse(contents);
    const action = request.action;
    const args = request.data || [];
    let result;

    // Routing fungsi berdasarkan nama action
    switch (action) {
      case 'checkSession': result = checkSession(...args); break;
      case 'prosesLoginStay': result = prosesLoginStay(...args); break;
      case 'prosesLogout': result = prosesLogout(...args); break;
      case 'prosesDaftar': result = prosesDaftar(...args); break;
      case 'resetPasswordDirect': result = resetPasswordDirect(...args); break;
      case 'getJadwalKegiatan': result = getJadwalKegiatan(...args); break;
      case 'simpanJadwal': result = simpanJadwal(...args); break;
      case 'hapusJadwal': result = hapusJadwal(...args); break;
      case 'getRonda': result = getRonda(...args); break;
      case 'simpanRonda': result = simpanRonda(...args); break;
      case 'hapusRonda': result = hapusRonda(...args); break;
      case 'getTahunRondaList': result = getTahunRondaList(...args); break;
      case 'getKontakPengurus': result = getKontakPengurus(...args); break;
      case 'simpanKontak': result = simpanKontak(...args); break;
      case 'hapusKontak': result = hapusKontak(...args); break;
      case 'getAllUsersWithWarga': result = getAllUsersWithWarga(...args); break;
      case 'simpanUser': result = simpanUser(...args); break;
      case 'toggleUserStatus': result = toggleUserStatus(...args); break;
      case 'hapusUser': result = hapusUser(...args); break;
      case 'getKasWarga': result = getKasWarga(...args); break;
      case 'getKasWargaByDateRange': result = getKasWargaByDateRange(...args); break;
      case 'simpanKasWarga': result = simpanKasWarga(...args); break;
      case 'hapusKasWarga': result = hapusKasWarga(...args); break;
      case 'getDaftarRole': result = getDaftarRole(...args); break;
      case 'tambahRoleBaru': result = tambahRoleBaru(...args); break;
      case 'getIuranPerTahun': result = getIuranPerTahun(...args); break;
      case 'updateIuranCell': result = updateIuranCell(...args); break;
      case 'updateKategoriWarga': result = updateKategoriWarga(...args); break;
      case 'hapusIuranWarga': result = hapusIuranWarga(...args); break;
      case 'getDaftarKategori': result = getDaftarKategori(...args); break;
      case 'tambahKategori': result = tambahKategori(...args); break;
      case 'editKategori': result = editKategori(...args); break;
      case 'hapusKategori': result = hapusKategori(...args); break;
      case 'getDaftarWarga': result = getDaftarWarga(...args); break;
      case 'tambahWargaIuran': result = tambahWargaIuran(...args); break;
      case 'getTahunIuranList': result = getTahunIuranList(...args); break;
      case 'getGaleriKegiatan': result = getGaleriKegiatan(...args); break;
      case 'simpanGaleriKegiatan': result = simpanGaleriKegiatan(...args); break;
      case 'hapusGaleriKegiatan': result = hapusGaleriKegiatan(...args); break;
      case 'ktGetKas': result = ktGetKas(...args); break;
      case 'getNotifikasiTerbaru': result = getNotifikasiTerbaru(...args); break;
      case 'getNotifikasiHistory': result = getNotifikasiHistory(...args); break;
      case 'adminTambahNotifikasi': result = adminTambahNotifikasi(...args); break;
      case 'adminEditNotifikasi': result = adminEditNotifikasi(...args); break;
      case 'adminHapusNotifikasi': result = adminHapusNotifikasi(...args); break;
      case 'ubahPassword': result = ubahPassword(...args); break;
      case 'prosesPengaduan': result = prosesPengaduan(...args); break;
      case 'getHistoriPengaduan': result = getHistoriPengaduan(...args); break;
      case 'getSemuaPengaduan': result = getSemuaPengaduan(...args); break;
      case 'updateStatusPengaduan': result = updateStatusPengaduan(...args); break;
      case 'hapusPengaduan': result = hapusPengaduan(...args); break;
      case 'pkkGetJadwal': result = pkkGetJadwal(...args); break;
      case 'pkkSimpanJadwal': result = pkkSimpanJadwal(...args); break;
      case 'pkkHapusJadwal': result = pkkHapusJadwal(...args); break;
      case 'pkkGetKader': result = pkkGetKader(...args); break;
      case 'pkkSimpanKader': result = pkkSimpanKader(...args); break;
      case 'pkkHapusKader': result = pkkHapusKader(...args); break;
      case 'pkkKirimLaporan': result = pkkKirimLaporan(...args); break;
      case 'pkkGetLaporan': result = pkkGetLaporan(...args); break;
      case 'pkkGetLaporanByPelapor': result = pkkGetLaporanByPelapor(...args); break;
      case 'pkkUpdateStatusLaporan': result = pkkUpdateStatusLaporan(...args); break;
      case 'pkkHapusLaporan': result = pkkHapusLaporan(...args); break;
      case 'pkkGetGaleri': result = pkkGetGaleri(...args); break;
      case 'pkkSimpanGaleri': result = pkkSimpanGaleri(...args); break;
      case 'pkkHapusGaleri': result = pkkHapusGaleri(...args); break;
      case 'pkkGetKas': result = pkkGetKas(...args); break;
      case 'pkkSimpanKas': result = pkkSimpanKas(...args); break;
      case 'pkkHapusKas': result = pkkHapusKas(...args); break;
      case 'pkkGetWargaBinaan': result = pkkGetWargaBinaan(...args); break;
      case 'pkkSimpanWargaBinaan': result = pkkSimpanWargaBinaan(...args); break;
      case 'pkkHapusWargaBinaan': result = pkkHapusWargaBinaan(...args); break;
      case 'ktGetJadwal': result = ktGetJadwal(...args); break;
      case 'ktSimpanJadwal': result = ktSimpanJadwal(...args); break;
      case 'ktHapusJadwal': result = ktHapusJadwal(...args); break;
      case 'ktGetKader': result = ktGetKader(...args); break;
      case 'ktSimpanKader': result = ktSimpanKader(...args); break;
      case 'ktHapusKader': result = ktHapusKader(...args); break;
      case 'ktSimpanKas': result = ktSimpanKas(...args); break;
      case 'ktHapusKas': result = ktHapusKas(...args); break;
      case 'ktGetGaleri': result = ktGetGaleri(...args); break;
      case 'ktSimpanGaleri': result = ktSimpanGaleri(...args); break;
      case 'ktHapusGaleri': result = ktHapusGaleri(...args); break;
      case 'gantiNamaWargaIuran': result = gantiNamaWargaIuran(...args); break;
      case 'getSettings': result = getSettings(); break;
      case 'ubahNama': result = ubahNama(...args); break;
      case 'saveSettings': result = saveSettings(...args); break;
      // Tambahkan case fungsi lainnya di sini sesuai kebutuhan frontend
      default: throw new Error("Aksi tidak dikenal: " + action);
    }

    const out = ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    // Tidak bisa set header secara langsung di ContentService, jadi embed header via headerless hack tidak tersedia.
    // Namun CORS akan didukung jika Anda menggunakan deployment yang mengaktifkan CORS proxy (Cloudflare).
    return out;
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', pesan: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Mengambil pengaturan aplikasi (seperti nomor admin)
 */
function getSettings() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Settings');
    if (!sheet) {
      sheet = ss.insertSheet('Settings');
      sheet.appendRow(['Key', 'Value']);
      sheet.appendRow(['admin_whatsapp', '6285236356569']);
    }
    var data = sheet.getDataRange().getValues();
    var settings = {};
    for (var i = 1; i < data.length; i++) {
      settings[data[i][0]] = data[i][1];
    }
    return { status: 'success', data: settings };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function saveSettings(key, value) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Settings');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == key) { sheet.getRange(i + 1, 2).setValue(value); return { status: 'success' }; }
    }
    sheet.appendRow([key, value]);
    return { status: 'success' };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Portal RT01-RW03')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function formatTanggal(val, format) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, "GMT+7", format || "dd/MM/yyyy HH:mm");
  }
  return val;
}

function buatId(prefix) {
  return prefix + '-' + new Date().getTime();
}

// ====================== SESSION TOKEN (tidak berubah) ======================
function generateToken(userId, email) {
  return Utilities.base64Encode(userId + '|' + email + '|' + new Date().getTime() + '|' + Math.random());
}

function saveSession(token, userId, email, expiryHours = 720, source = 'Warga') {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) {
    sheet = ss.insertSheet('Sessions');
    sheet.appendRow(['token', 'userId', 'email', 'createdAt', 'expiryAt', 'source']);
  }
  var now = new Date();
  var expiry = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
  sheet.appendRow([token, userId, email, now, expiry, source]);
  
  // Optimasi Cleanup: Jangan hapus baris satu per satu (sangat lambat)
  var data = sheet.getDataRange().getValues();
  var rowsToKeep = [data[0]]; // Header
  var hasExpired = false;
  var nowTs = now.getTime();

  for (var i = 1; i < data.length; i++) {
    var expiryTs = new Date(data[i][4]).getTime();
    if (expiryTs >= nowTs) {
      rowsToKeep.push(data[i]);
    } else {
      hasExpired = true;
    }
  }

  if (hasExpired) {
    sheet.clearContents();
    sheet.getRange(1, 1, rowsToKeep.length, rowsToKeep[0].length).setValues(rowsToKeep);
  }
  return true;
}

function checkSession(token) {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("session_" + token);
    if (cached) return JSON.parse(cached);

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Sessions');
    if (!sheet) return null;
    var data = sheet.getDataRange().getValues();
    var now = new Date();

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == token && new Date(data[i][4]) > now) {
        var userId = data[i][1];
        var source = data[i][5] || 'Warga';
        
        // Cek Cache User Info
        const cachedUser = cache.get("user_profile_" + userId);
        if (cachedUser) {
          const userObj = JSON.parse(cachedUser);
          userObj.token = token;
          return userObj;
        }

        // Langsung cari ke sheet sumber yang tepat (Sangat Cepat)
        var targetSheet = ss.getSheetByName(source === 'Users' ? 'Users' : 'Warga');
        if (targetSheet) {
          var userData = targetSheet.getDataRange().getValues();
          for (var j = 1; j < userData.length; j++) {
            if (userData[j][0] == userId) {
            const user = {
              status: 'success',
              id: userData[j][0],
              nama: userData[j][1],
              email: userData[j][2],
              role: (userData[j][4] || (source === 'Users' ? 'pengurus rt' : 'warga')).toString().toLowerCase(),
              token: token,
              permissions: userData[j][5] ? userData[j][5].split(',') : []
            };
            cache.put("user_profile_" + userId, JSON.stringify(user), CACHE_TTL.SESSION);
            cache.put("session_" + token, JSON.stringify(user), CACHE_TTL.SESSION);
            return user;
            }
          }
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

function destroySession(token) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sessions');
    if (!sheet) return;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == token) {
        const cache = CacheService.getScriptCache();
        cache.remove("session_" + token);
        sheet.deleteRow(i + 1);
        break;
      }
    }
  } catch (e) {}
}

function prosesLoginStay(email, password) {
  var result = prosesLogin(email, password);
  if (result.status === 'success') {
    // Bersihkan cache user lama saat login baru
    CacheService.getScriptCache().remove("user_profile_" + result.id);
    
    var token = generateToken(result.id, result.email);
    saveSession(token, result.id, result.email, 720, result.sumber);
    result.token = token;
  }
  return result;
}

function prosesLogout(token) {
  destroySession(token);
  return { status: 'success' };
}

// ====================== LOGIN & DAFTAR (tidak berubah) ======================
function prosesLogin(email, password) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    
    // 1. Cek di sheet Users (Admin/Pengurus)
    var sheetUsers = ss.getSheetByName('Users');
    if (sheetUsers) {
      var dataUsers = sheetUsers.getDataRange().getValues();
      for (var i = 1; i < dataUsers.length; i++) {
        if (dataUsers[i][2] == email && dataUsers[i][3] == password) {
          if (dataUsers[i][6] === 'suspended') return { status: 'gagal', pesan: 'Akun Anda ditangguhkan (suspended). Silakan hubungi pengurus.' };
          var roleVal = (dataUsers[i][4] || 'pengurus rt').toString().toLowerCase();
          return {
            status: 'success',
            id: dataUsers[i][0],
            nama: dataUsers[i][1],
            email: dataUsers[i][2],
            sumber: 'Users',
            role: roleVal,
            permissions: dataUsers[i][5] ? dataUsers[i][5].split(',') : []
          };
        }
      }
    }

    // 2. Cek di sheet Warga
    var sheetWarga = ss.getSheetByName('Warga');
    if (sheetWarga) {
      var dataWarga = sheetWarga.getDataRange().getValues();
      for (var j = 1; j < dataWarga.length; j++) {
        if (dataWarga[j][2] == email && dataWarga[j][3] == password) {
          if (dataWarga[j][6] === 'suspended') return { status: 'gagal', pesan: 'Akun Anda ditangguhkan (suspended). Silakan hubungi pengurus.' };
          return {
            status: 'success',
            id: dataWarga[j][0],
            nama: dataWarga[j][1],
            email: dataWarga[j][2],
            sumber: 'Warga',
            role: (dataWarga[j][4] || 'warga').toString().toLowerCase(),
            permissions: dataWarga[j][5] ? dataWarga[j][5].split(',') : []
          };
        }
      }
    }

    return { status: 'gagal', pesan: 'Email atau Password salah!' };
  } catch (e) {
    return { status: 'error', pesan: e.toString() };
  }
}

function prosesDaftar(nama, email, password) {
  try {
    if (!email || !nama || !password) return { status: 'error', pesan: 'gagal mendaftarkan akun' };
    const normalizedEmail = email.toString().toLowerCase().trim();
    const normalizedNama = nama.toString().trim();
    
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheetWarga = ss.getSheetByName('Warga');
    if (!sheetWarga) return { status: 'error', pesan: 'Sheet "Warga" belum dibuat!' };
    
    // Optimasi: Hanya cek kolom email (Kolom C) untuk mempercepat proses
    var lastRow = sheetWarga.getLastRow();
    if (lastRow > 1) {
      var emails = sheetWarga.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (emails[i][0] && emails[i][0].toString().toLowerCase().trim() === normalizedEmail) {
          return { status: 'error', pesan: 'akun sudah terdaftar di database' }; // Pesan sesuai instruksi
        }
      }
    }

    // Cek di sheet Users (Admin/Pengurus) untuk keamanan tambahan
    var sheetUsers = ss.getSheetByName('Users');
    if (sheetUsers) {
      var lastRowU = sheetUsers.getLastRow();
      if (lastRowU > 1) {
        var emailsU = sheetUsers.getRange(2, 3, lastRowU - 1, 1).getValues();
        for (var j = 0; j < emailsU.length; j++) {
          if (emailsU[j][0].toString().toLowerCase().trim() === normalizedEmail) {
            return { status: 'error', pesan: 'akun sudah terdaftar di database' }; // Pesan sesuai instruksi
          }
        }
      }
    }

    var newId = buatId('WRG');
    // Struktur baris: ID, Nama, Email, Password, Role, Permissions, Status
    sheetWarga.appendRow([newId, normalizedNama, normalizedEmail, password, 'warga', '', 'aktif']);
    return { status: 'success', pesan: 'akun sudah berhasil di buat' }; // Pesan sesuai instruksi
  } catch (error) {
    return { status: 'error', pesan: 'gagal mendaftarkan akun' }; // Pesan sesuai instruksi
  }
}

// ====================== LUPA PASSWORD (tidak berubah) ======================
function resetPasswordDirect(email) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheetUsers = ss.getSheetByName('Users');
    var sheetWarga = ss.getSheetByName('Warga');
    var found = false;
    var newPassword = Math.floor(100000 + Math.random() * 900000).toString(); // PIN 6 digit lebih mudah diketik di HP
    var userName = '';
    if (sheetUsers) {
      var dataUsers = sheetUsers.getDataRange().getValues();
      for (var i = 1; i < dataUsers.length; i++) {
        if (dataUsers[i][2] == email) {
          sheetUsers.getRange(i + 1, 4).setValue(newPassword);
          userName = dataUsers[i][1];
          found = true;
          break;
        }
      }
    }
    if (!found && sheetWarga) {
      var dataWarga = sheetWarga.getDataRange().getValues();
      for (var j = 1; j < dataWarga.length; j++) {
        if (dataWarga[j][2] == email) {
          sheetWarga.getRange(j + 1, 4).setValue(newPassword);
          userName = dataWarga[j][1];
          found = true;
          break;
        }
      }
    }
    if (!found) return { status: 'error', pesan: 'Email tidak terdaftar!' };

    // Mengirim Email Reset Password menggunakan layanan Google Mail
    try {
      MailApp.sendEmail({
        to: email,
        subject: "🔒 Reset Password - Portal RT01/RW03",
        htmlBody: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
            <h2 style="color: #ef4444;">Reset Password Berhasil</h2>
            <p>Halo <b>${userName}</b>,</p>
            <p>Kami telah mengatur ulang password akun Anda. Silakan gunakan password sementara berikut untuk masuk:</p>
            <div style="background: #f1f5f9; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; color: #0f172a; border-radius: 8px; border: 1px dashed #cbd5e1;">
              ${newPassword}
            </div>
            <p style="font-size: 13px; color: #64748b;">*Segera ganti password ini melalui menu <b>Profil</b> setelah Anda berhasil login demi keamanan.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">Portal RT01/RW03 Ngelom - Sistem Manajemen Warga</p>
          </div>`
      });
    } catch (mailErr) {
      console.error("Gagal mengirim email: " + mailErr.toString());
      // Tetap lanjutkan agar password muncul di UI sebagai fallback jika kuota email habis
    }

    return {
      status: 'success',
      pesan: 'Password baru telah dikirim ke email Anda. Silakan periksa Inbox atau folder Spam.',
      passwordBaru: newPassword, // Backup jika email gagal terkirim
      nama: userName
    };
  } catch (e) {
    return { status: 'error', pesan: 'Gagal reset password: ' + e.message };
  }
}

function ubahPassword(email, oldPass, newPass) {
  try {
    if (!email || !oldPass || !newPass) return { status: 'error', pesan: 'Data tidak lengkap.' };
    const normalizedEmail = email.toString().toLowerCase().trim();
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheets = ['Users', 'Warga'];
    var found = false;
    
    for (var s = 0; s < sheets.length; s++) {
      var sheet = ss.getSheetByName(sheets[s]);
      if (!sheet) continue;
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][2] && data[i][2].toString().toLowerCase().trim() === normalizedEmail) {
          if (data[i][3].toString() !== oldPass.toString()) {
            return { status: 'error', pesan: 'Password lama salah!' };
          }
          sheet.getRange(i + 1, 4).setValue(newPass);
          // Bersihkan cache agar sesi tetap valid namun data profil diperbarui
          CacheService.getScriptCache().remove("user_profile_" + data[i][0]);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) return { status: 'success', pesan: 'Password berhasil diperbarui!' };
    return { status: 'error', pesan: 'Email tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: 'Gagal ubah password: ' + e.message };
  }
}

/**
 * Mengubah nama tampilan user di database
 */
function ubahNama(email, newNama, token) {
  try {
    if (!email || !newNama) return { status: 'error', pesan: 'Data tidak lengkap.' };
    const normalizedEmail = email.toString().toLowerCase().trim();
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheets = ['Users', 'Warga'];
    var found = false;
    
    for (var s = 0; s < sheets.length; s++) {
      var sheet = ss.getSheetByName(sheets[s]);
      if (!sheet) continue;
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][2] && data[i][2].toString().toLowerCase().trim() === normalizedEmail) {
          sheet.getRange(i + 1, 2).setValue(newNama);
          
          // Bersihkan cache profil dan sesi agar data terbaru langsung tampil
          const cache = CacheService.getScriptCache();
          cache.remove("user_profile_" + data[i][0]);
          if (token) cache.remove("session_" + token);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) return { status: 'success', pesan: 'Nama berhasil diperbarui!' };
    return { status: 'error', pesan: 'Email tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: 'Gagal ubah nama: ' + e.message };
  }
}

// ====================== PENGADUAN (tidak berubah) ======================
function prosesPengaduan(obj) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pengaduan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Pengaduan" belum dibuat!' };
    var fileUrl = "";
    if (obj.dataFile) {
      var folder;
      try { folder = DriveApp.getFolderById(FOLDER_FOTO_ID); } catch(err) { folder = DriveApp.getRootFolder(); } 
      if (!folder) folder = DriveApp.getRootFolder();
      var blob = Utilities.newBlob(Utilities.base64Decode(obj.dataFile), obj.mimeType, obj.fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }
    var timestamp = new Date();
    var idPengaduan = buatId('PGD');
    sheet.appendRow([idPengaduan, timestamp, obj.pelapor, obj.isi, fileUrl, 'Belum teratasi']);

    // Notifikasi otomatis: pengaduan baru
       _buatNotifikasiOtomatis_(
      'Laporan Pengaduan Warga',
      'Pengaduan baru dari ' + obj.pelapor + ':\n' + (obj.isi || ''),
      'admin,pengurus rt',
      'pengaduan'
    );


    return { status: 'success', pesan: 'Pengaduan berhasil dikirim!' };
  } catch (error) {
    return { status: 'error', pesan: 'Gagal mengirim: ' + error.toString() };
  }
}

function getHistoriPengaduan(namaPelapor) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pengaduan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Pengaduan" belum ada.' };
    var data = sheet.getDataRange().getValues();
    var histori = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][2] === namaPelapor) {
        var waktu = formatTanggal(data[i][1], "dd/MM/yyyy HH:mm");
        histori.push({
          id: data[i][0],
          waktu: waktu,
          isi: data[i][3],
          fotoUrl: data[i][4],
          status: data[i][5]
        });
      }
    }
    return { status: 'success', data: histori.reverse() };
  } catch (error) {
    return { status: 'error', pesan: 'Gagal mengambil histori.' };
  }
}

function getSemuaPengaduan() {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pengaduan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Pengaduan" belum ada.' };
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var waktu = formatTanggal(data[i][1], "dd/MM/yyyy HH:mm");
      list.push({
        id: data[i][0],
        waktu: waktu,
        pelapor: data[i][2],
        isi: data[i][3],
        fotoUrl: data[i][4],
        status: data[i][5]
      });
    }
    return { status: 'success', data: list.reverse() };
  } catch (error) {
    return { status: 'error', pesan: 'Gagal memuat laporan.' };
  }
}

function updateStatusPengaduan(id, statusBaru) {

  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pengaduan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Pengaduan" belum ada.' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        var pelapor = data[i][2];
        var isi = data[i][3];
        sheet.getRange(i + 1, 6).setValue(statusBaru);

              _buatNotifikasiOtomatis_(
          'Update Pengaduan Warga',
          'Status pengaduan: ' + statusBaru + '\n' + (pelapor ? ('Pelapor: ' + pelapor + '\n') : '') + (isi || ''),
          'admin,pengurus rt',
          'pengaduan'
        );


        return { status: 'success', pesan: 'Status pengaduan berhasil diubah!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function hapusPengaduan(id) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pengaduan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Pengaduan" belum ada.' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        if (data[i][4] && data[i][4].startsWith('https://drive.google.com/')) {
          try {
            var fileId = data[i][4].match(/[-\w]{25,}/);
            if (fileId) DriveApp.getFileById(fileId[0]).setTrashed(true);
          } catch (e) {}
        }
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Pengaduan berhasil dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// ====================== JADWAL KEGIATAN (RT) ======================
function getJadwalKegiatan() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("data_jadwal_rt");
    if (cached) return JSON.parse(cached);

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Jadwal Kegiatan');
    if (!sheet) {
      sheet = ss.insertSheet('Jadwal Kegiatan');
      sheet.appendRow(['ID', 'Nama', 'Perihal', 'Waktu', 'Tempat']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var waktu = formatTanggal(data[i][3], "yyyy-MM-dd'T'HH:mm");
      list.push({
        id: String(data[i][0] || ''),
        nama: String(data[i][1] || ''),
        perihal: String(data[i][2] || ''),
        waktu: waktu || '',
        tempat: String(data[i][4] || '')
      });
    }
    const result = { status: 'success', data: list.reverse() };
    cache.put("data_jadwal_rt", JSON.stringify(result), CACHE_TTL.DATA);
    return result;
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function _buatNotifikasiOtomatis_(judul, isi, targetRole, targetPage) {
  try {
    // pakai fungsi backend yang sudah ada
    adminTambahNotifikasi(judul, isi, targetRole, targetPage);
  } catch (e) {
    // jangan sampai gagal simpan memutus transaksi utama
  }
}

// Helper: normalisasi targetPage untuk disimpan sebagai lower-case di backend
function _normTargetPage_(tp) {
  try {
    return (tp || '').toString().trim().toLowerCase();
  } catch (e) {
    return '';
  }
}

function _notifTargetPages_() {
  return {
    pengaduan: 'pengaduan',
    jadwal: 'jadwal',
    kas: 'kas',
    galeri: 'galeri',
    pkkjadwal: 'pkkjadwal',
    pkkkirimlaporan: 'pkkkirimlaporan',
    pkkhistori: 'pkkhistori',
    pkkgaleri: 'pkkgaleri'
  };
}



function simpanJadwal(id, nama, perihal, waktu, tempat) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Jadwal Kegiatan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Jadwal Kegiatan" belum dibuat!' };
    if (!nama || !perihal) return { status: 'error', pesan: 'Nama dan Perihal wajib diisi!' };
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.getRange(i + 1, 2, 1, 4).setValues([[nama, perihal, waktu || '', tempat || '']]);
          CacheService.getScriptCache().remove("data_jadwal_rt");
          SpreadsheetApp.flush();
          // Notifikasi otomatis: warga + pengurus
          _buatNotifikasiOtomatis_(
            'Info Jadwal Kegiatan',
            'Ada pembaruan jadwal: ' + nama + '\n' + (waktu ? 'Waktu: ' + waktu + '\n' : '') + 'Perihal: ' + perihal,
            'all',
            'jadwal'
          );

          return { status: 'success', pesan: 'Jadwal berhasil diperbarui!' };
        }
      }
    } else {
      id = buatId('JDW');
      sheet.appendRow([id, nama, perihal, waktu || '', tempat || '']);
      CacheService.getScriptCache().remove("data_jadwal_rt");
      SpreadsheetApp.flush();
      _buatNotifikasiOtomatis_(
        'Info Jadwal Kegiatan',
        'Ada jadwal baru: ' + nama + '\n' + (waktu ? 'Waktu: ' + waktu + '\n' : '') + 'Perihal: ' + perihal,
        'all',
        'jadwal'
      );

      return { status: 'success', pesan: 'Jadwal berhasil ditambahkan!' };
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function hapusJadwal(id) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Jadwal Kegiatan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Jadwal Kegiatan" belum dibuat!' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        CacheService.getScriptCache().remove("data_jadwal_rt");
        return { status: 'success', pesan: 'Jadwal dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Jadwal tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// ====================== KONTAK PENGURUS (RT) ======================
function getKontakPengurus() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName("Kontak Pengurus");
    if (!sheet) {
      sheet = ss.insertSheet("Kontak Pengurus");
      sheet.appendRow(['ID', 'Nama', 'Jabatan', 'NoHP', 'AtasanId', 'FotoUrl']);
      return { status: "success", data: [] };
    }
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { status: "success", data: [] };
    var hasil = [];
    for (var i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      hasil.push({
        id: String(data[i][0] || ""),
        nama: String(data[i][1] || ""),
        jabatan: String(data[i][2] || ""),
        nohp: String(data[i][3] ? data[i][3].toString() : ""),
        atasanId: String(data[i][4] || ""),
        fotoUrl: String(data[i][5] || "")
      });
    }
    return { status: "success", data: hasil };
  } catch (e) {
    return { status: "error", pesan: e.message };
  }
}

function simpanKontak(id, nama, jabatan, nohp, atasanId, dataFile, mimeType, fileName) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Kontak Pengurus");
    if (!sheet) return { status: "error", pesan: "Sheet Kontak Pengurus tidak ditemukan" };
    if (!nama) return { status: "error", pesan: "Nama wajib diisi" };

    var fileUrl = "";
    if (dataFile) {
      var folder;
      try { 
        folder = DriveApp.getFolderById(FOLDER_FOTO_ID); 
      } catch(err) { 
        folder = DriveApp.getRootFolder(); 
      }
      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    var data = sheet.getDataRange().getValues();
    if (id) {
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          var existingFoto = data[i][5] || "";
          var finalFoto = fileUrl || existingFoto;
          sheet.getRange(i + 1, 2, 1, 5).setValues([[nama, jabatan || "", String(nohp), atasanId || "", finalFoto]]);
          SpreadsheetApp.flush();
          return { status: "success", pesan: "Kontak berhasil diperbarui" };
        }
      }
      return { status: "error", pesan: "Data tidak ditemukan untuk update" };
    }
    var newId = buatId("KTK");
    sheet.appendRow([newId, nama, jabatan || "", String(nohp), atasanId || "", fileUrl]);
    SpreadsheetApp.flush();
    return { status: "success", pesan: "Kontak berhasil ditambahkan" };
  } catch (e) {
    return { status: "error", pesan: e.message };
  }
}

function hapusKontak(id) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Kontak Pengurus");
    if (!sheet) return { status: "error", pesan: "Sheet tidak ditemukan" };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: "success", pesan: "Kontak berhasil dihapus" };
      }
    }
    return { status: "error", pesan: "Data tidak ditemukan" };
  } catch (e) {
    return { status: "error", pesan: e.message };
  }
}

// ====================== KELOLA USER (RT) ======================
function getAllUsersWithWarga() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheetUsers = ss.getSheetByName('Users');
    var sheetWarga = ss.getSheetByName('Warga');

    var list = [];

    // 1) Isi dari sheet Users
    if (sheetUsers) {
      var dataUsers = sheetUsers.getDataRange().getValues();
      for (var i = 1; i < dataUsers.length; i++) {
        list.push({
          id: dataUsers[i][0],
          nama: dataUsers[i][1],
          email: dataUsers[i][2],
          // normalisasi role biar konsisten
          role: (dataUsers[i][4] || 'pengurus rt').toString().toLowerCase(),
          sumber: 'users',
          permissions: dataUsers[i][5] ? dataUsers[i][5].split(',') : [],
          status: dataUsers[i][6] || 'aktif'
        });
      }
    }

    // 2) Gabungkan/override dari sheet Warga
    if (sheetWarga) {
      var dataWarga = sheetWarga.getDataRange().getValues();
      for (var j = 1; j < dataWarga.length; j++) {
        var emailW = dataWarga[j][2];
        var namaW = dataWarga[j][1];
        var roleW = (dataWarga[j][4] || 'warga').toString().toLowerCase();
        var idW = dataWarga[j][0];

        // cari user dengan email yang sama
        var idx = -1;
        for (var k = 0; k < list.length; k++) {
          if (list[k].email === emailW) {
            idx = k;
            break;
          }
        }

        if (idx === -1) {
          // belum ada di Users
          list.push({
            id: idW,
            nama: namaW,
            email: emailW,
            role: roleW,
            sumber: 'warga',
            permissions: dataWarga[j][5] ? dataWarga[j][5].split(',') : [],
            status: dataWarga[j][6] || 'aktif'
          });
        } else {
          // sudah ada: role warga harus mengikuti sheet Warga
          list[idx].id = idW;
          list[idx].nama = namaW;
          list[idx].role = roleW;
          list[idx].sumber = 'warga';
          list[idx].status = dataWarga[j][6] || 'aktif';
        }
      }
    }

    return { status: 'success', data: list };
  } catch (e) {
    return { status: 'error', pesan: 'Gagal memuat data user: ' + e.toString() };
  }
}


function simpanUser(id, nama, email, role, password, permissions) {
  try {
    role = (role || '').toString().trim().toLowerCase();
    id = id ? id.toString() : '';

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheetUsers = ss.getSheetByName('Users');
    var sheetWarga = ss.getSheetByName('Warga');

    // Jika role = warga, simpan/update di sheet Warga
    // Jika role selain warga, simpan/update di sheet Users
    var targetSheet = (role === 'warga') ? sheetWarga : sheetUsers;
    var otherSheet = (role === 'warga') ? sheetUsers : sheetWarga;

    if (!targetSheet) {
      return { status: 'error', pesan: 'Sheet target belum dibuat!' };
    }

    // Hapus dari sheet lain jika ada (untuk menjaga konsistensi role)
    if (otherSheet) {
      var otherData = otherSheet.getDataRange().getValues();
      for (var k = 1; k < otherData.length; k++) {
        if (String(otherData[k][2]) === String(email)) {
          otherSheet.deleteRow(k + 1);
          break;
        }
      }
    }

    var data = targetSheet.getDataRange().getValues();

    // Update by ID
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) == String(id)) {
        targetSheet.getRange(i + 1, 2, 1, 2).setValues([[nama, email]]);
        targetSheet.getRange(i + 1, 5).setValue(role);
        if (password && String(password).trim()) {
          targetSheet.getRange(i + 1, 4).setValue(password);
        }
        targetSheet.getRange(i + 1, 6).setValue(permissions || '');
        // Status tetap terjaga atau default aktif jika baru
        if (!data[i][6]) targetSheet.getRange(i + 1, 7).setValue('aktif');
        SpreadsheetApp.flush();
        return { status: 'success', pesan: 'Perubahan user berhasil disimpan!' };
      }
    }

    // Fallback update by email
    for (var j = 1; j < data.length; j++) {
      if (String(data[j][2]) == String(email)) {
        targetSheet.getRange(j + 1, 2, 1, 2).setValues([[nama, email]]);
        targetSheet.getRange(j + 1, 5).setValue(role);
        if (password && String(password).trim()) {
          targetSheet.getRange(j + 1, 4).setValue(password);
        }
        targetSheet.getRange(j + 1, 6).setValue(permissions || '');
        SpreadsheetApp.flush();
        return { status: 'success', pesan: 'User diperbarui!' };
      }
    }

    // Kalau tidak ada, buat baru di target sheet
    if (role === 'warga') {
      var newId = buatId('WRG');
      targetSheet.appendRow([newId, nama, email, (password || ''), 'warga', (permissions || ''), 'aktif']);
      SpreadsheetApp.flush();
      return { status: 'success', pesan: 'User ditambahkan sebagai warga!' };
    }

    var newId2 = buatId('USR');
    targetSheet.appendRow([newId2, nama, email, (password || ''), role, (permissions || ''), 'aktif']);
    SpreadsheetApp.flush();
    return { status: 'success', pesan: 'User ditambahkan!' };

  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function toggleUserStatus(id, currentStatus) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheets = ['Users', 'Warga'];
    var newStatus = (currentStatus === 'suspended') ? 'aktif' : 'suspended';
    
    for (var s = 0; s < sheets.length; s++) {
      var sheet = ss.getSheetByName(sheets[s]);
      if (!sheet) continue;
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(id)) {
          sheet.getRange(i + 1, 7).setValue(newStatus);
          return { status: 'success', pesan: 'Status user diubah menjadi ' + newStatus };
        }
      }
    }
    return { status: 'error', pesan: 'User tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}


function hapusUser(id) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheets = ['Users', 'Warga'];
    var found = false;

    for (var s = 0; s < sheets.length; s++) {
      var sheet = ss.getSheetByName(sheets[s]);
      if (!sheet) continue;
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(id)) {
          sheet.deleteRow(i + 1);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) return { status: 'success', pesan: 'User berhasil dihapus!' };
    return { status: 'error', pesan: 'User tidak ditemukan di database.' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// ====================== KAS WARGA (RT) ======================
function getKasWarga() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get("data_kas_warga");
    if (cached) return JSON.parse(cached);

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Kas Warga');
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet('Kas Warga');
      sheet.appendRow(['ID', 'Tanggal', 'Deskripsi', 'Jenis', 'Kategori', 'Subkategori', 'Jumlah']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return { status: 'success', data: [] };
    var list = [];
    var saldoKas = 0;
    var totalUangKematian = 0;
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var jenis = row[3];
      var jumlah = parseFloat(row[6]) || 0;
      var kategori = row[4] || '';
      if (jenis === 'Pemasukan') saldoKas = Number((saldoKas + jumlah).toFixed(2));
      else if (jenis === 'Pengeluaran') saldoKas = Number((saldoKas - jumlah).toFixed(2));

      // toleran terhadap variasi penulisan kategori kematian (case-insensitive & trims)
      var kat = String(kategori || '').toLowerCase().trim();
      var isKematian = (kat === 'kematian' || kat.indexOf('kematian') !== -1);
      if (jenis === 'Pemasukan' && isKematian) totalUangKematian = Number((totalUangKematian + jumlah).toFixed(2));
      var tanggal = formatTanggal(row[1], "yyyy-MM-dd");
      list.push({
        id: String(row[0]),
        tanggal: tanggal,
        deskripsi: String(row[2] || ''),
        jenis: jenis,
        kategori: String(kategori),
        subkategori: String(row[5] || ''),
        jumlah: jumlah,
        saldo: saldoKas,
        uangKematian: totalUangKematian
      });
    }
    const result = { status: 'success', data: list.reverse(), totalSaldo: Number(saldoKas.toFixed(2)), totalUangKematian: Number(totalUangKematian.toFixed(2)) };
    cache.put("data_kas_warga", JSON.stringify(result), CACHE_TTL.DATA);
    return result;
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getKasWargaByDateRange(startDateStr, endDateStr) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Kas Warga');
    if (!sheet) return { status: 'success', data: [] };
    var data = sheet.getDataRange().getValues();
    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);
    if (data.length < 2) return { status: 'success', data: [] };
    var list = [];
    var saldo = 0;
    var totalUangKematian = 0;
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var tgl = new Date(row[1]);
      if (tgl >= startDate && tgl <= endDate) {
        var jenis = row[3];
        var jumlah = parseFloat(row[6]) || 0;
        var kategori = row[4] || '';
        if (jenis === 'Pemasukan') {
          saldo = Number((saldo + jumlah).toFixed(2));
          var kat = String(kategori || '').toLowerCase().trim();
          var isKematian = (kat === 'kematian' || kat.indexOf('kematian') !== -1);
          if (isKematian) totalUangKematian = Number((totalUangKematian + jumlah).toFixed(2));
        } else if (jenis === 'Pengeluaran') saldo = Number((saldo - jumlah).toFixed(2));
        list.push({
          id: String(row[0]),
          tanggal: formatTanggal(row[1], "yyyy-MM-dd"),
          deskripsi: String(row[2] || ''),
          jenis: jenis,
          kategori: String(kategori),
          subkategori: String(row[5] || ''),
          jumlah: jumlah,
          saldo: saldo
        });
      }
    }
    return { status: 'success', data: list.reverse(), totalUangKematian: Number(totalUangKematian.toFixed(2)) };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function simpanKasWarga(id, tanggal, deskripsi, jenis, kategori, subkategori, jumlah) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Kas Warga');
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet('Kas Warga');
      sheet.appendRow(['ID', 'Tanggal', 'Deskripsi', 'Jenis', 'Kategori', 'Subkategori', 'Jumlah']);
    }
    if (!tanggal || !deskripsi || !jenis || !jumlah) return { status: 'error', pesan: 'Tanggal, Deskripsi, Jenis, dan Jumlah wajib diisi!' };
    var jumlahNum = Number(parseFloat(jumlah).toFixed(2));
    if (isNaN(jumlahNum) || jumlahNum <= 0) return { status: 'error', pesan: 'Jumlah harus angka positif!' };
    kategori = kategori || '';
    subkategori = subkategori || '';
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.getRange(i + 1, 2, 1, 6).setValues([[tanggal, deskripsi, jenis, kategori, subkategori, jumlahNum]]);
          CacheService.getScriptCache().remove("data_kas_warga");
          SpreadsheetApp.flush();

          _buatNotifikasiOtomatis_(
            'Update Laporan Kas Warga',
            'Ada pembaruan transaksi kas (' + jenis + ') pada ' + tanggal + '\nKeterangan: ' + deskripsi,
            'all',
            'kas'
          );

          return { status: 'success', pesan: 'Transaksi berhasil diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan' };
    } else {
      var newId = buatId('KAS');
      sheet.appendRow([newId, tanggal, deskripsi, jenis, kategori, subkategori, jumlahNum]);
      CacheService.getScriptCache().remove("data_kas_warga");
      SpreadsheetApp.flush();

      _buatNotifikasiOtomatis_(
        'Update Laporan Kas Warga',
        'Ada transaksi kas baru (' + jenis + ') pada ' + tanggal + '\nKeterangan: ' + deskripsi,
        'all',
        'kas'
      );


      return { status: 'success', pesan: 'Transaksi berhasil ditambahkan!' };
    }
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getDaftarRole() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Roles');
    if (!sheet) {
      sheet = ss.insertSheet('Roles');
      sheet.appendRow(['Nama Role']);
      var defaults = ['Admin', 'Warga', 'Pengurus RT', 'Pengurus PKK', 'Pengurus Karang Taruna'];
      defaults.forEach(function(r) { sheet.appendRow([r]); });
    }
    var data = sheet.getDataRange().getValues();
    var roles = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) roles.push(data[i][0].toString());
    }
    return { status: 'success', data: roles };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function tambahRoleBaru(nama) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Roles');
    if (!sheet) getDaftarRole(); 
    sheet.appendRow([nama]);
    return { status: 'success', pesan: 'Role "' + nama + '" berhasil ditambahkan!' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function hapusKasWarga(id) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Kas Warga');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Kas Warga" belum dibuat!' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        CacheService.getScriptCache().remove("data_kas_warga");
        return { status: 'success', pesan: 'Transaksi berhasil dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// ====================== IURAN WARGA (tidak berubah) ======================
function getIuranPerTahun(tahun) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheetName = tahun.toString();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var iuranBulanan = [];
      for (var b = 0; b < 12; b++) {
        var val = row[2 + b];
        iuranBulanan.push(isNaN(parseFloat(val)) ? 0 : parseFloat(val));
      }
      list.push({
        id: 'temp-' + i,
        nama: String(row[0]),
        kategori: String(row[1] || ''),
        tahun: tahun,
        iuranBulanan: iuranBulanan
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

function updateIuranCell(nama, tahun, bulan, jumlah) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheetName = tahun.toString();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: 'error', pesan: 'Sheet tahun ' + tahun + ' tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == nama) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) {
      var newRow = [nama, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      sheet.appendRow(newRow);
      rowIndex = sheet.getLastRow() - 1;
    }
    var colIndex = 2 + bulan;
    sheet.getRange(rowIndex + 1, colIndex).setValue(jumlah);
    SpreadsheetApp.flush();
    return { status: 'success' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function updateKategoriWarga(nama, tahun, kategoriBaru) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheetName = tahun.toString();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: 'error', pesan: 'Sheet tahun ' + tahun + ' tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == nama) {
        rowIndex = i;
        break;
      }
    }
    if (rowIndex === -1) {
      var newRow = [nama, kategoriBaru, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      sheet.appendRow(newRow);
    } else {
      sheet.getRange(rowIndex + 1, 2).setValue(kategoriBaru);
    }
    SpreadsheetApp.flush();
    return { status: 'success' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function hapusIuranWarga(nama, tahun) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheetName = tahun.toString();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == nama) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Data iuran berhasil dihapus' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getRingkasanIuranTahunan(tahun) {
  try {
    var iuranList = getIuranPerTahun(tahun);
    var totalIuran = 0;
    for (var j = 0; j < iuranList.length; j++) {
      var w = iuranList[j];
      for (var bln = 0; bln < 12; bln++) {
        if (w.iuranBulanan[bln] > 0) totalIuran += 50000;
      }
    }
    return { status: 'success', data: { totalIuran: totalIuran } };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getDaftarKategori() {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheet = ss.getSheetByName('KategoriMaster');
    if (!sheet) {
      sheet = ss.insertSheet('KategoriMaster');
      sheet.appendRow(['ID', 'NamaKategori', 'NominalIuran']);
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        list.push({
          id: data[i][0],
          nama: String(data[i][1]),
          nominal: parseFloat(data[i][2]) || 0
        });
      }
    }
    if (list.length === 0) {
      var defaultCategories = [['Jalan Raya', 50000], ['Gang 4 A', 40000], ['Gang 4 B', 40000], ['Kos-Kosan', 30000], ['Toko-Toko/PKL', 75000]];
      for (var j = 0; j < defaultCategories.length; j++) {
        var newId = buatId('KAT');
        sheet.appendRow([newId, defaultCategories[j][0], defaultCategories[j][1]]);
        list.push({ id: newId, nama: defaultCategories[j][0], nominal: defaultCategories[j][1] });
      }
    }
    return list;
  } catch (e) {
    return [];
  }
}

function tambahKategori(namaKategori, nominal) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheet = ss.getSheetByName('KategoriMaster');
    if (!sheet) {
      sheet = ss.insertSheet('KategoriMaster');
      sheet.appendRow(['ID', 'NamaKategori', 'NominalIuran']);
    }
    var newId = buatId('KAT');
    sheet.appendRow([newId, namaKategori, nominal]);
    return { status: 'success', pesan: 'Kategori ditambahkan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function editKategori(id, namaBaru, nominal) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheet = ss.getSheetByName('KategoriMaster');
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 2).setValue(namaBaru);
        sheet.getRange(i + 1, 3).setValue(nominal);
        return { status: 'success', pesan: 'Kategori diperbarui' };
      }
    }
    return { status: 'error', pesan: 'Kategori tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function hapusKategori(id) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheet = ss.getSheetByName('KategoriMaster');
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Kategori dihapus' };
      }
    }
    return { status: 'error', pesan: 'Kategori tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getDaftarWarga() {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheets = ss.getSheets();
    var namaSet = new Set();
    sheets.forEach(function(sh) {
      var name = sh.getName();
      // Hanya scan sheet yang namanya berupa 4 digit tahun
      if (/^\d{4}$/.test(name)) {
        var data = sh.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][0]) namaSet.add(String(data[i][0]));
        }
      }
    });
    var list = [];
    namaSet.forEach(function(nama) { list.push({ id: buatId('WRG'), nama: nama }); });
    return list;
  } catch (e) { return []; }
}

function gantiNamaWargaIuran(namaLama, namaBaru) {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheets = ss.getSheets();
    var count = 0;
    sheets.forEach(function(sh) {
      if (/^\d{4}$/.test(sh.getName())) {
        var data = sh.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (data[i][0] == namaLama) { sh.getRange(i + 1, 1).setValue(namaBaru); count++; }
        }
      }
    });
    if (count === 0) return { status: 'error', pesan: 'Nama warga tidak ditemukan.' };
    SpreadsheetApp.flush();
    return { status: 'success', pesan: 'Nama diperbarui di ' + count + ' tabel tahun!' };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function tambahWargaIuran(namaWarga) {
  try {
    var tahun = new Date().getFullYear();
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheetName = tahun.toString();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(['Nama', 'Kategori', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agust', 'Sept', 'Okto', 'Nov', 'Des']);
    }
    sheet.appendRow([namaWarga, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    return { status: 'success', pesan: 'Warga ditambahkan ke tahun ' + tahun };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getTahunIuranList() {
  try {
    var ss = SpreadsheetApp.openById(IURAN_SHEET_ID);
    var sheets = ss.getSheets();
    var tahunList = [];
    for (var i = 0; i < sheets.length; i++) {
      var sheetName = sheets[i].getName();
      if (/^\d{4}$/.test(sheetName)) tahunList.push(parseInt(sheetName));
    }
    tahunList.sort(function(a, b) { return b - a; });
    return { status: 'success', data: tahunList };
  } catch (e) {
    return { status: 'error', data: [] };
  }
}

// ====================== GALERI KEGIATAN (RT) ======================
function getGaleriKegiatan() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Galeri Kegiatan');
    if (!sheet) {
      sheet = ss.insertSheet('Galeri Kegiatan');
      sheet.appendRow(['ID', 'Caption', 'URL', 'Tanggal', 'Uploader']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var tgl = formatTanggal(data[i][3], "dd/MM/yyyy HH:mm");
      list.push({
        id: String(data[i][0]),
        caption: String(data[i][1] || ''),
        imageUrl: String(data[i][2] || ''),
        tanggal: tgl,
        uploader: String(data[i][4] || '')
      });
    }
    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function simpanGaleriKegiatan(id, caption, dataFile, mimeType, fileName, videoUrl) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Galeri Kegiatan');
    if (!sheet) {
      sheet = ss.insertSheet('Galeri Kegiatan');
      sheet.appendRow(['ID', 'Caption', 'URL', 'Tanggal', 'Uploader']);
    }
    if (!caption) return { status: 'error', pesan: 'Caption wajib diisi!' };

    var fileUrl = videoUrl || "";
    if (dataFile) {
      var folder; 
      try { folder = DriveApp.getFolderById(FOLDER_FOTO_ID); } catch(err) {
        Logger.log("Error getting folder by ID " + FOLDER_FOTO_ID + ": " + err.message);
        try { folder = DriveApp.getRootFolder(); } catch(e2) { return { status: 'error', pesan: 'Gagal akses Drive: ' + e2.message }; }
      }
      if (!folder) folder = DriveApp.getRootFolder();
      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] && String(data[i][0]) == String(id)) {
          var existingImageUrl = data[i][2];
          sheet.getRange(i + 1, 2).setValue(caption);
          sheet.getRange(i + 1, 3).setValue(fileUrl || existingImageUrl); // Update URL column, keep existing if no new file
          SpreadsheetApp.flush();
          return { status: 'success', pesan: 'Galeri diperbarui!' };
        }
      }
    }

    var timestamp = new Date();
    var newId = buatId('GAL');
    var currentUser = Session.getActiveUser().getEmail() || 'Admin';
    sheet.appendRow([newId, caption, fileUrl, timestamp, currentUser]);
    SpreadsheetApp.flush();
    return { status: 'success', pesan: 'Foto berhasil ditambahkan ke galeri!' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function hapusGaleriKegiatan(id) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Galeri Kegiatan');
    if (!sheet) return { status: 'error', pesan: 'Sheet "Galeri Kegiatan" belum dibuat!' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        var imageUrl = data[i][2];
        if (imageUrl && imageUrl.startsWith('https://drive.google.com/')) {
          try {
            var fileId = imageUrl.match(/[-\w]{25,}/);
            if (fileId) DriveApp.getFileById(fileId[0]).setTrashed(true);
          } catch (e) {}
        }
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Foto berhasil dihapus dari galeri!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pancingIzinDrive() {
  DriveApp.getRootFolder();
}

/**
 * Robust Date Parser untuk format "30 May 2026", "15 Agst 2026", dll.
 * Mengembalikan objek Date atau null jika gagal parsing.
 */
function _parseRondaDate_(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  // Support format angka tanggal Spreadsheet (Excel Serial Date)
  if (typeof dateStr === 'number') {
    const date = new Date(Math.round((dateStr - 25569) * 86400 * 1000));
    return isNaN(date.getTime()) ? null : date;
  }

  // Try parsing as a standard Date object first (e.g., "2023-01-15")
  // Ganti nama bulan Indonesia ke Inggris agar didukung browser secara universal
  let cleanStr = String(dateStr).toLowerCase()
    .replace(/mei/g, 'may').replace(/agu/g, 'aug').replace(/okt/g, 'oct').replace(/des/g, 'dec');

  const standardDate = new Date(cleanStr);
  if (!isNaN(standardDate.getTime())) {
    return new Date(standardDate.getTime());
  }

  // Perbaikan: Support format DD/MM/YYYY atau DD-MM-YYYY
  if (typeof dateStr === 'string' && (dateStr.includes('/') || dateStr.includes('-'))) {
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length === 3 && parts[0].length <= 2) {
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const y = parts[2].length === 2 ? 2000 + parseInt(parts[2]) : parseInt(parts[2]);
      const check = new Date(y, m, d);
      if (!isNaN(check.getTime())) return check;
    }
  }

  // Fallback for custom formats like "30 May 2026" or "15 Agst 2026"
  const monthMap = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'mei': 4,
    'jun': 5, 'jul': 6, 'agu': 7, 'ags': 7, 'agst': 7, 'aug': 7,
    'sep': 8, 'sep': 8, 'sept': 8, 'okt': 9, 'oct': 9, 'nov': 10, 'des': 11, 'dec': 11
  };
  const p = dateStr.toLowerCase().trim().split(/\s+/);
  if (p.length < 3) return null; // Expects at least "Day Month Year"

  const day = parseInt(p[0]);
  const mKey = p[1].substring(0, 3); // Take first 3 chars for month key
  const month = monthMap[mKey];
  const year = parseInt(p[2]);

  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  const parsedDate = new Date(year, month, day);
  // Basic validation to ensure the date is not completely off (e.g., day 32)
  if (parsedDate.getDate() !== day || parsedDate.getMonth() !== month || parsedDate.getFullYear() !== year) {
    return null;
  }
  return parsedDate;
}

// ====================== MODUL PKK (TERPISAH 100%) ======================
// 1. Jadwal Kegiatan PKK
function pkkGetJadwal() {
  try {
    var ss = SpreadsheetApp.openById(PKK_SHEET_ID);
    var sheet = ss.getSheetByName('Jadwal PKK');
    if (!sheet) { // Ensure sheet exists, create if not
      sheet = ss.insertSheet('Jadwal PKK');
      sheet.appendRow(['ID', 'Nama', 'Waktu', 'Tempat', 'PIC', 'Keterangan']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      list.push({
        id: String(row[0]),
        nama: String(row[1] || ''), // Ensure string conversion
        // Memastikan format tanggal konsisten untuk diproses frontend
        waktu: row[2] instanceof Date ? Utilities.formatDate(row[2], "GMT+7", "yyyy-MM-dd'T'HH:mm") : String(row[2] || ''),
        tempat: String(row[3] || ''),
        pic: String(row[4] || ''),
        keterangan: String(row[5] || '')
      });
    }
    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkSimpanJadwal(id, nama, waktu, tempat, pic, keterangan) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Jadwal PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet "Jadwal PKK" belum dibuat!' };
    if (!nama) return { status: 'error', pesan: 'Nama kegiatan wajib diisi!' };
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.getRange(i + 1, 2, 1, 5).setValues([[nama, waktu || '', tempat || '', pic || '', keterangan || '']]);
          SpreadsheetApp.flush();
          return { status: 'success', pesan: 'Jadwal PKK diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan' };
    } else {
      var newId = buatId('PKKJDW');
      sheet.appendRow([newId, nama, waktu || '', tempat || '', pic || '', keterangan || '']); // Append new row
      SpreadsheetApp.flush();
      return { status: 'success', pesan: 'Jadwal PKK ditambahkan!' };
    }
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkHapusJadwal(id) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Jadwal PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Jadwal dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// 2. Daftar Kader PKK (Kontak Pengurus PKK)
function pkkGetKader() {
  try {
    var ss = SpreadsheetApp.openById(PKK_SHEET_ID);
    var sheet = ss.getSheetByName('Kader PKK'); // Ensure sheet exists
    if (!sheet) {
      sheet = ss.insertSheet('Kader PKK');
      sheet.appendRow(['ID', 'Nama', 'Jabatan', 'NoHP', 'Alamat', 'Email', 'FotoUrl']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      list.push({
        id: String(row[0]), // Ensure string conversion
        nama: String(row[1] || ''),
        jabatan: String(row[2] || ''),
        nohp: String(row[3] || ''),
        alamat: String(row[4] || ''),
        email: String(row[5] || ''),
        fotoUrl: String(row[6] || '')
      });
    }
    return { status: 'success', data: list };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkSimpanKader(id, nama, jabatan, nohp, dataFile, mimeType, fileName) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Kader PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet "Kader PKK" belum dibuat!' };
    if (!nama) return { status: 'error', pesan: 'Nama wajib diisi!' };

    var fileUrl = "";
    if (dataFile) {
      var folder;
      try { 
        folder = DriveApp.getFolderById(PKK_FOLDER_ID); 
      } catch(err) { 
        folder = DriveApp.getRootFolder(); 
      }
      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          var existingFoto = data[i][6] || "";
          var finalFoto = fileUrl || existingFoto;
          // Struktur: ID, Nama, Jabatan, NoHP, Alamat(Kosong), Email(Kosong), FotoUrl
          sheet.getRange(i + 1, 2, 1, 6).setValues([[nama, jabatan || '', String(nohp), "", "", finalFoto]]);
          SpreadsheetApp.flush(); // Flush changes
          return { status: 'success', pesan: 'Kader diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan' };
    } else {
      var newId = buatId('PKKKDR');
      sheet.appendRow([newId, nama, jabatan || '', String(nohp), "", "", fileUrl]); // Append new row
      SpreadsheetApp.flush();
      return { status: 'success', pesan: 'Kader ditambahkan!' };
    }
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkHapusKader(id) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Kader PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Kader dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// 3. Laporan Kegiatan PKK (Kirim Laporan)
function pkkKirimLaporan(obj) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Laporan Kegiatan PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet "Laporan Kegiatan PKK" belum dibuat!' };
    var fileUrl = "";
    if (obj.dataFile) {
      var folder;
      try { folder = DriveApp.getFolderById(FOLDER_FOTO_ID); } catch(err) { folder = DriveApp.getRootFolder(); } 
      if (!folder) folder = DriveApp.getRootFolder();
      var blob = Utilities.newBlob(Utilities.base64Decode(obj.dataFile), obj.mimeType, obj.fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }
    var timestamp = new Date();
    var idLaporan = buatId('PKLLP');
    sheet.appendRow([idLaporan, timestamp, obj.pelapor, obj.judul, obj.deskripsi, fileUrl, 'Menunggu']); // Append new row
    return { status: 'success', pesan: 'Laporan kegiatan PKK berhasil dikirim!' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkGetLaporan() {
  try {
    var ss = SpreadsheetApp.openById(PKK_SHEET_ID); // Ensure sheet exists
    var sheet = ss.getSheetByName('Laporan Kegiatan PKK');
    if (!sheet) {
      sheet = ss.insertSheet('Laporan Kegiatan PKK');
      sheet.appendRow(['ID', 'Timestamp', 'Pelapor', 'Judul', 'Deskripsi', 'FotoUrl', 'Status']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      list.push({ // Push data to list
        id: String(row[0]),
        tanggal: formatTanggal(row[1], "dd/MM/yyyy HH:mm"),
        pelapor: String(row[2] || ''),
        judul: String(row[3] || ''),
        deskripsi: String(row[4] || ''),
        fotoUrl: String(row[5] || ''),
        status: String(row[6] || 'Menunggu')
      });
    }
    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkGetLaporanByPelapor(pelapor) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Laporan Kegiatan PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'success', data: [] };
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[2] === pelapor) {
        list.push({
          id: String(row[0]),          timestamp: formatTanggal(row[1], "dd/MM/yyyy HH:mm"),
          pelapor: String(row[2] || ''),
          judul: String(row[3] || ''),
          deskripsi: String(row[4] || ''),
          fotoUrl: String(row[5] || ''),
          status: String(row[6] || 'Menunggu')
        });
      }
    }
    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkUpdateStatusLaporan(id, statusBaru) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Laporan Kegiatan PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 7).setValue(statusBaru);
        return { status: 'success', pesan: 'Status laporan diubah!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkHapusLaporan(id) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Laporan Kegiatan PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        var fotoUrl = data[i][5];
        if (fotoUrl && fotoUrl.startsWith('https://drive.google.com/')) {
          try {
            var fileId = fotoUrl.match(/[-\w]{25,}/);
            if (fileId) DriveApp.getFileById(fileId[0]).setTrashed(true);
          } catch (e) {}
        }
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Laporan dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// 4. Galeri Dokumentasi PKK
function pkkGetGaleri() {
  try {
    var ss = SpreadsheetApp.openById(PKK_SHEET_ID); // Ensure sheet exists
    var sheet = ss.getSheetByName('Galeri PKK');
    if (!sheet) {
      sheet = ss.insertSheet('Galeri PKK');
      sheet.appendRow(['ID', 'Caption', 'URL', 'Tanggal', 'Uploader']);
    }

    var data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return { status: 'success', data: [] };

    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = row[0];
      var caption = row[1];
      var imageUrl = row[2];
      var tanggalRaw = row[3];
      var uploader = row[4];

      var hasId = id !== null && id !== undefined && String(id).trim() !== '';
      var hasCaptionOrImage = (caption && String(caption).trim() !== '') || (imageUrl && String(imageUrl).trim() !== '');
      if (!hasId && !hasCaptionOrImage) continue;

      var tanggal;
      try {
        tanggal = (tanggalRaw instanceof Date) ? formatTanggal(tanggalRaw, "dd/MM/yyyy HH:mm") : String(tanggalRaw || '');
      } catch (e) {
        tanggal = String(tanggalRaw || '');
      }

      list.push({
        id: String(id || ''),
        caption: String(caption || ''),
        imageUrl: String(imageUrl || ''),
        tanggal: tanggal,
        uploader: String(uploader || '')
      });
    }

    list = list.filter(function(x) {
      return (x.id && x.id.trim()) || (x.imageUrl && x.imageUrl.trim()) || (x.caption && x.caption.trim());
    });

    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: 'Gagal memuat data user: ' + e.toString() };
  }
}

function pkkSimpanGaleri(id, caption, dataFile, mimeType, fileName, videoUrl) {
  try {
    var ss = SpreadsheetApp.openById(PKK_SHEET_ID); // Ensure sheet exists
    var sheet = ss.getSheetByName('Galeri PKK');
    if (!sheet) {
      sheet = ss.insertSheet('Galeri PKK');
      sheet.appendRow(['ID', 'Caption', 'URL', 'Tanggal', 'Uploader']);
    }
    if (!caption) return { status: 'error', pesan: 'Caption wajib diisi!' };

    var fileUrl = videoUrl || "";
    if (dataFile) {
      var folder;
      try { folder = DriveApp.getFolderById(PKK_FOLDER_ID); } catch(err) {
        Logger.log("Error getting folder by ID " + PKK_FOLDER_ID + ": " + err.message);
        try { folder = DriveApp.getRootFolder(); } catch(e2) { return { status: 'error', pesan: 'Gagal akses Drive: ' + e2.message }; }
      }
      if (!folder) folder = DriveApp.getRootFolder();

      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob);
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch(e) {
        Logger.log("Gagal set sharing: " + e.message);
      }
      fileUrl = file.getUrl();
    }

    // Pastikan minimal ada URL media atau videoLink
    // (kalau update caption saja, kita ambil URL lama)
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) == String(id)) {
          var existingImageUrl = data[i][2] || "";
          var finalUrl = fileUrl || existingImageUrl;

          if (!finalUrl) {
            return { status: 'error', pesan: 'URL Foto/Video kosong. Pilih file atau isi link video.' };
          }

          sheet.getRange(i + 1, 2).setValue(caption);
          sheet.getRange(i + 1, 3).setValue(finalUrl);
          SpreadsheetApp.flush();
          return { status: 'success', pesan: 'Galeri PKK diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan untuk update.' };
    }

    // Insert baru
    if (!fileUrl) return { status: 'error', pesan: 'Foto/Video wajib dipilih!' };

    var timestamp = new Date();
    var newId = buatId('PKKGAL');
    var currentUser = Session.getActiveUser().getEmail() || 'Admin';
    sheet.appendRow([newId, caption, fileUrl, timestamp, currentUser]);
    SpreadsheetApp.flush();
    return { status: 'success', pesan: 'Foto ditambahkan ke galeri PKK!' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkHapusGaleri(id) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Galeri PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        var imageUrl = data[i][2];
        if (imageUrl && imageUrl.startsWith('https://drive.google.com/')) {
          try {
            var fileId = imageUrl.match(/[-\w]{25,}/);
            if (fileId) DriveApp.getFileById(fileId[0]).setTrashed(true);
          } catch (e) {}
        }
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Foto dihapus dari galeri PKK!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// 5. Kas PKK (opsional, jika diperlukan)
function pkkGetKas() {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Kas PKK'); // Ensure sheet exists
    if (!sheet) {
      sheet = SpreadsheetApp.openById(PKK_SHEET_ID).insertSheet('Kas PKK');
      sheet.appendRow(['ID', 'Tanggal', 'Deskripsi', 'Jenis', 'Kategori', 'Jumlah']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    var saldo = 0;
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var jenis = row[3];
      var jumlah = parseFloat(row[5]) || 0;
      if (jenis === 'Pemasukan') saldo += jumlah;
      else saldo -= jumlah;
      list.push({
        id: String(row[0]),
        tanggal: formatTanggal(row[1], "yyyy-MM-dd"),
        deskripsi: String(row[2] || ''),
        jenis: jenis,
        kategori: String(row[4] || ''),
        jumlah: jumlah,
        saldo: saldo
      });
    }
    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkSimpanKas(id, tanggal, deskripsi, jenis, kategori, jumlah) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Kas PKK'); // Ensure sheet exists
    if (!sheet) {
      sheet = SpreadsheetApp.openById(PKK_SHEET_ID).insertSheet('Kas PKK');
      sheet.appendRow(['ID', 'Tanggal', 'Deskripsi', 'Jenis', 'Kategori', 'Jumlah']);
    }
    if (!tanggal || !deskripsi || !jenis || !jumlah) return { status: 'error', pesan: 'Tanggal, Deskripsi, Jenis, Jumlah wajib diisi!' };
    var jumlahNum = parseFloat(jumlah);
    if (isNaN(jumlahNum) || jumlahNum <= 0) return { status: 'error', pesan: 'Jumlah harus angka positif!' };
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.getRange(i + 1, 2, 1, 5).setValues([[tanggal, deskripsi, jenis, kategori || '', jumlahNum]]);
          SpreadsheetApp.flush();
          return { status: 'success', pesan: 'Transaksi kas PKK diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan' };
    } else {
      var newId = buatId('PKKKAS');
      sheet.appendRow([newId, tanggal, deskripsi, jenis, kategori || '', jumlahNum]);
      SpreadsheetApp.flush();
      return { status: 'success', pesan: 'Transaksi kas PKK ditambahkan!' };
    }
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkHapusKas(id) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Kas PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Transaksi kas PKK dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// 6. Laporan Warga Binaan PKK
function pkkGetWargaBinaan() {
  try {
    var ss = SpreadsheetApp.openById(PKK_SHEET_ID); // Ensure sheet exists
    var sheet = ss.getSheetByName('Warga Binaan PKK');
    if (!sheet) {
      sheet = ss.insertSheet('Warga Binaan PKK');
      sheet.appendRow(['ID', 'Nama', 'Alamat', 'Program', 'Tanggal Masuk', 'Keterangan']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      list.push({
        id: String(row[0]), // Ensure string conversion
        nama: String(row[1] || ''),
        alamat: String(row[2] || ''),
        program: String(row[3] || ''),
        tanggalMasuk: formatTanggal(row[4], "yyyy-MM-dd"),
        keterangan: String(row[5] || '')
      });
    }
    return { status: 'success', data: list };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkSimpanWargaBinaan(id, nama, alamat, program, tanggalMasuk, keterangan) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Warga Binaan PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet "Warga Binaan PKK" belum dibuat!' };
    if (!nama) return { status: 'error', pesan: 'Nama warga wajib diisi!' };
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.getRange(i + 1, 2, 1, 5).setValues([[nama, alamat || '', program || '', tanggalMasuk || '', keterangan || '']]);
          SpreadsheetApp.flush();
          return { status: 'success', pesan: 'Data warga binaan diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan' };
    } else {
      var newId = buatId('PKKWB');
      sheet.appendRow([newId, nama, alamat || '', program || '', tanggalMasuk || '', keterangan || '']); // Append new row
      SpreadsheetApp.flush();
      return { status: 'success', pesan: 'Warga binaan ditambahkan!' };
    }
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function pkkHapusWargaBinaan(id) {
  try {
    var sheet = SpreadsheetApp.openById(PKK_SHEET_ID).getSheetByName('Warga Binaan PKK'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet tidak ditemukan' };
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Warga binaan dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

// ====================== MODUL KARANG TARUNA ======================

// 1. Jadwal Kegiatan KT
function ktGetJadwal() {
  try {
    var ss = SpreadsheetApp.openById(KT_SHEET_ID);
    var sheet = ss.getSheetByName('Jadwal KT');
    if (!sheet) {
      sheet = ss.insertSheet('Jadwal KT');
      sheet.appendRow(['ID', 'Nama', 'Waktu', 'Tempat', 'Perihal', 'Deskripsi']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      list.push({
        id: String(data[i][0]),
            nama: String(data[i][1] || ''),
            waktu: data[i][2] instanceof Date ? Utilities.formatDate(data[i][2], "GMT+7", "yyyy-MM-dd'T'HH:mm") : String(data[i][2] || ''),
        tempat: String(data[i][3] || ''),
        perihal: String(data[i][4] || ''),
        deskripsi: String(data[i][5] || '')
      });
    }
    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function ktSimpanJadwal(id, nama, waktu, tempat, perihal, deskripsi) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Jadwal KT'); // Ensure sheet exists
    if (!sheet) return { status: 'error', pesan: 'Sheet Jadwal KT belum dibuat!' };
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.getRange(i + 1, 2, 1, 5).setValues([[nama, waktu, tempat, perihal, deskripsi]]);
          return { status: 'success', pesan: 'Jadwal Karang Taruna diperbarui!' };
        }
      }
    } else {
      sheet.appendRow([buatId('KTJDW'), nama, waktu, tempat, perihal, deskripsi]);
      return { status: 'success', pesan: 'Jadwal Karang Taruna ditambahkan!' };
    }
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function ktHapusJadwal(id) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Jadwal KT'); // Ensure sheet exists
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) { sheet.deleteRow(i + 1); return { status: 'success', pesan: 'Jadwal dihapus!' }; }
    }
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

// 2. Data Anggota (Kader KT)
function ktGetKader() {
  try {
    var ss = SpreadsheetApp.openById(KT_SHEET_ID); // Ensure sheet exists
    var sheet = ss.getSheetByName('Anggota KT');
    if (!sheet) {
      sheet = ss.insertSheet('Anggota KT');
      sheet.appendRow(['ID', 'Nama', 'Usia', 'Alamat', 'NoHP', 'Status', 'Jabatan', 'FotoUrl']);
      return { status: 'success', data: [] };
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      list.push({
        id: String(data[i][0]), // Ensure string conversion
        nama: String(data[i][1] || ''),
        usia: String(data[i][2] || ''),
        alamat: String(data[i][3] || ''),
        nohp: String(data[i][4] || ''),
        status: String(data[i][5] || ''),
        jabatan: String(data[i][6] || ''),
        fotoUrl: String(data[i][7] || '')
      });
    }
    return { status: 'success', data: list };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function ktSimpanKader(id, nama, jabatan, nohp, dataFile, mimeType, fileName) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Anggota KT'); // Ensure sheet exists
    if (!nama) return { status: 'error', pesan: 'Nama wajib diisi!' };

    var fileUrl = "";
    if (dataFile) {
      var folder;
      try { 
        folder = DriveApp.getFolderById(KT_FOLDER_ID); 
      } catch(e) { 
        folder = DriveApp.getRootFolder();
      }
      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          var existingFoto = data[i][7] || "";
          var finalFoto = fileUrl || existingFoto;
          // Struktur: ID, Nama, Usia(Kosong), Alamat(Kosong), NoHP, Status(Kosong), Jabatan, FotoUrl
          sheet.getRange(i + 1, 2, 1, 7).setValues([[nama, "", "", String(nohp), "", jabatan || "", finalFoto]]);
          return { status: 'success', pesan: 'Data Anggota diperbarui!' }; // Return success
        }
      }
    } else {
      sheet.appendRow([buatId('KTKDR'), nama, "", "", String(nohp), "", jabatan || "", fileUrl]);
      return { status: 'success', pesan: 'Anggota berhasil didaftarkan!' };
    }
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function ktHapusKader(id) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Anggota KT'); // Ensure sheet exists
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) { sheet.deleteRow(i + 1); return { status: 'success', pesan: 'Anggota dihapus!' }; }
    }
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

// 3. Kas KT
function ktGetKas() {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Kas KT'); // Ensure sheet exists
    if (!sheet) {
      sheet = SpreadsheetApp.openById(KT_SHEET_ID).insertSheet('Kas KT');
      sheet.appendRow(['ID', 'Tanggal', 'Jenis', 'Nominal', 'Keterangan', 'BuktiNota']);
    }
    var data = sheet.getDataRange().getValues();
    var list = [];
    var saldo = 0;
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var nominal = parseFloat(row[3]) || 0;
      if (row[2] === 'Pemasukan') saldo += nominal;
      else saldo -= nominal;
      list.push({
        id: String(row[0]),
        tanggal: formatTanggal(row[1], "yyyy-MM-dd"),
        jenis: row[2],
        nominal: nominal,
        keterangan: String(row[4] || ''),
        bukti: String(row[5] || ''),
        saldo: saldo
      });
    }
    return { status: 'success', data: list.reverse(), totalSaldo: saldo };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function ktSimpanKas(id, tanggal, jenis, nominal, keterangan, dataFile, mimeType, fileName) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Kas KT'); // Ensure sheet exists
    var fileUrl = "";
    if (dataFile) {
      var folder = DriveApp.getFolderById(KT_FOLDER_ID);
      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }
    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          var currentNota = sheet.getRange(i+1, 6).getValue();
          sheet.getRange(i+1, 2, 1, 4).setValues([[tanggal, jenis, nominal, keterangan]]);
          if (fileUrl) sheet.getRange(i+1, 6).setValue(fileUrl);
          return { status: 'success', pesan: 'Transaksi Karang Taruna diperbarui!' }; // Return success
        }
      }
    } else {
      sheet.appendRow([buatId('KTKAS'), tanggal, jenis, nominal, keterangan, fileUrl]);
      return { status: 'success', pesan: 'Transaksi Karang Taruna berhasil dicatat!' };
    }
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function ktHapusKas(id) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Kas KT'); // Ensure sheet exists
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) { sheet.deleteRow(i+1); return { status: 'success', pesan: 'Transaksi dihapus!' }; }
    }
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

// 4. Galeri KT
function ktGetGaleri() {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Galeri KT'); // Ensure sheet exists
    if (!sheet) return { status: 'success', data: [] };

    var data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return { status: 'success', data: [] };

    var list = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = row[0];
      var judul = row[1];
      var url = row[2];
      var tanggalRaw = row[3];
      var deskripsi = row[4];

      // valid jika minimal ada ID dan salah satu media/judul terisi
      var hasId = id !== null && id !== undefined && String(id).trim() !== '';
      var hasMediaOrJudul = (url && String(url).trim() !== '') || (judul && String(judul).trim() !== '');
      if (!hasId && !hasMediaOrJudul) continue;

      var tanggal;
      try {
        tanggal = (tanggalRaw instanceof Date) ? formatTanggal(tanggalRaw, "dd/MM/yyyy") : String(tanggalRaw || '');
      } catch (e) {
        tanggal = String(tanggalRaw || '');
      }

      list.push({
        id: String(id || ''),
        judul: String(judul || ''),
        url: String(url || ''),
        tanggal: tanggal,
        deskripsi: String(deskripsi || '')
      });
    }

    // filter lagi: buang item yang benar-benar tanpa url & judul
    list = list.filter(function(x) {
      return (x.id && x.id.trim()) || (x.url && x.url.trim()) || (x.judul && x.judul.trim());
    });

    return { status: 'success', data: list.reverse() };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function ktSimpanGaleri(id, judul, dataFile, mimeType, fileName, deskripsi, videoUrl) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Galeri KT'); // Ensure sheet exists
    if (!sheet) {
      sheet = SpreadsheetApp.openById(KT_SHEET_ID).insertSheet('Galeri KT');
      sheet.appendRow(['ID', 'Judul', 'URL', 'Tanggal', 'Deskripsi']);
    }

    var finalUrl = videoUrl || "";
    if (dataFile) {
      var folder;
      try { 
        folder = DriveApp.getFolderById(KT_FOLDER_ID); 
      } catch(e) { 
        try { folder = DriveApp.getRootFolder(); } catch(e2) { return { status: 'error', pesan: 'Gagal akses Drive: ' + e2.message }; }
      }
      var blob = Utilities.newBlob(Utilities.base64Decode(dataFile), mimeType, fileName);
      var file = folder.createFile(blob); 
      try {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch(e) {
        Logger.log("Gagal set sharing KT: " + e.message);
      }
      finalUrl = file.getUrl();
    }

    if (id) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] && String(data[i][0]) == String(id)) {
          var existingImageUrl = data[i][2]; // Get existing URL
          var urlToSave = finalUrl || existingImageUrl; // Use new finalUrl if provided, otherwise keep existing
          sheet.getRange(i + 1, 2, 1, 4).setValues([[judul, urlToSave, new Date(), deskripsi]]); // Corrected line
          SpreadsheetApp.flush();
          return { status: 'success', pesan: 'Dokumentasi diperbarui!' };
        }
      }
      return { status: 'error', pesan: 'Data tidak ditemukan untuk update.' }; // Add error for not found
    }
    if (!finalUrl) return { status: 'error', pesan: 'URL Foto/Video kosong. Pilih file atau isi link video.' };
    sheet.appendRow([buatId('KTGAL'), judul, finalUrl, new Date(), deskripsi]);
    SpreadsheetApp.flush();
    return { status: 'success', pesan: 'Dokumentasi berhasil diunggah!' };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

function ktHapusGaleri(id) {
  try {
    var sheet = SpreadsheetApp.openById(KT_SHEET_ID).getSheetByName('Galeri KT'); // Ensure sheet exists
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        var url = data[i][2];
        if (url && url.startsWith('https://drive.google.com/')) {
          try {
            var fileId = url.match(/[-\w]{25,}/);
            if (fileId) DriveApp.getFileById(fileId[0]).setTrashed(true);
          } catch (e) {}
        }
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Dokumentasi dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan' };
  } catch (e) { return { status: 'error', pesan: e.message }; }
}

// =================================================================

// ====================== JADWAL RONDA (BACKEND) ======================
function getRonda(bulanInput, tahunInput) {
  try {
    const ss = SpreadsheetApp.openById(RONDA_SHEET_ID);
    const sheet = ss.getSheets()[0];
    if (!sheet) throw new Error('Sheet Database Ronda tidak ditemukan');

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return { status: 'success', data: [] };

    const targetBulan = (bulanInput !== undefined && bulanInput !== "" && bulanInput !== "0") ? parseInt(bulanInput) - 1 : null; // 0-11
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const targetTahun = (tahunInput !== undefined && tahunInput !== "") ? parseInt(tahunInput) : null;

    const hasil = [];
    // Start from index 1 (skip header)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[0]) continue;

      // Robust Date Parsing
      let dateObj = row[0] instanceof Date ? row[0] : _parseRondaDate_(String(row[0]).trim());
      if (!dateObj || isNaN(dateObj.getTime())) continue;

      const itemBulan = dateObj.getMonth();
      const itemTahun = dateObj.getFullYear();

      // Filter logic: Jika bulanInput adalah 0 (Semua) atau cocok dengan target
      const isModeAll = (bulanInput == 0 || bulanInput === "0");
      const matchBulan = isModeAll || (targetBulan !== null && itemBulan === targetBulan);
      const matchTahun = (targetTahun === null || itemTahun === targetTahun);

      if (matchBulan && matchTahun) {
        let kelompokRaw = String(row[1] === null || row[1] === undefined ? '' : row[1]).trim();
        let petugasRaw = String(row[2] === null || row[2] === undefined ? '' : row[2]).trim();
        let petugasArr = [];
        
        // Handle "Ditiadakan" or "LIBUR" status for petugas
        if (petugasRaw.toLowerCase() === 'ditiadakan' || !petugasRaw || kelompokRaw.toLowerCase() === 'libur') {
          petugasArr = ['Ditiadakan'];
        } else {
          petugasArr = petugasRaw.split(/[,;\n\r]+/).map(s => s.trim()).filter(s => s !== '');
        }

        hasil.push({
          row: i + 1, // Keep original row index for update/delete
          tanggal: Utilities.formatDate(dateObj, "GMT+7", "yyyy-MM-dd"), // Standard ISO format for frontend
          tanggalRaw: String(row[0] || ""), // Keep original raw string for display if needed
          kelompok: kelompokRaw,
          petugas: Array.isArray(petugasArr) ? petugasArr.join('\n') : (petugasArr || "") // Memastikan petugas selalu string untuk diproses search & display di frontend
        });
      }
    }

    // Urutkan berdasarkan tanggal (naik)
    hasil.sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    const labelBulanSekarang = months[new Date().getMonth()];
    const bulanLabel = (bulanInput != 0 && targetBulan !== null) ? months[targetBulan] : labelBulanSekarang;
    return { status: 'success', data: hasil, targetBulan: bulanLabel };
  } catch (e) {
    // Log the error for debugging purposes in Apps Script logs
    Logger.log("Error in getRonda: " + e.message + " Stack: " + e.stack);
    return { status: 'error', pesan: e.toString() }; // Return error message for frontend
  }
}






// ====================== NOTIFIKASI / PENGUMUMAN (RT/PKK) ======================
const NOTIF_SHEET_NAME = 'Notifikasi';

function _getOrCreateNotifikasiSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(NOTIF_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(NOTIF_SHEET_NAME);
    // Kolom:
    // A: id
    // B: timestamp
    // C: authorRole
    // D: authorNama
    // E: judul
    // F: isi
    // G: targetRole ("all" untuk semua)
    // H: status (active)
    // Kolom tambahan:
    // I: targetPage
    sheet.appendRow(['id', 'timestamp', 'authorRole', 'authorNama', 'judul', 'isi', 'targetRole', 'status', 'targetPage']);
  }
  return sheet;
}

function adminTambahNotifikasi(judul, isi, targetRole, targetPage) {
  try {
    judul = (judul || '').toString().trim();
    isi = (isi || '').toString().trim();
    if (!judul || !isi) {
      return { status: 'error', pesan: 'Judul dan isi notifikasi wajib diisi!' };
    }

    // targetRole default: semua role
    if (!targetRole) targetRole = 'all';
    targetRole = (targetRole || '').toString().trim().toLowerCase();

    var sheet = _getOrCreateNotifikasiSheet_();
    var idNot = buatId('NTF');

    // ambil author dari session active user email/role (limit: hanya untuk author display)
    var activeEmail = '';
    try { activeEmail = Session.getActiveUser().getEmail() || ''; } catch (e) { activeEmail = ''; }

    // authorRole: ambil dari email cocok di Users/Warga
    var authorRole = 'admin';
    var authorNama = activeEmail || 'Admin';
    // fallback: gunakan nilai aktif role kalau ada (tidak wajib)
    // kita tidak punya token user role di server call ini, jadi hanya default. Admin/pengurus tetap bisa tambah.

    // targetPage (I)
    var tp = (targetPage || '').toString().trim();
    sheet.appendRow([idNot, new Date(), authorRole, authorNama, judul, isi, targetRole, 'active', tp]);
    SpreadsheetApp.flush();
    return { status: 'success', pesan: 'Notifikasi berhasil ditambahkan!' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function adminEditNotifikasi(id, judul, isi, targetRole, targetPage) {
  try {
    var sheet = _getOrCreateNotifikasiSheet_();
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        // Update kolom: E (Judul), F (Isi), G (TargetRole), I (TargetPage)
        sheet.getRange(i + 1, 5).setValue(String(judul).trim());
        sheet.getRange(i + 1, 6).setValue(String(isi).trim());
        sheet.getRange(i + 1, 7).setValue(targetRole || 'all');
        sheet.getRange(i + 1, 9).setValue(targetPage || '');
        SpreadsheetApp.flush();
        return { status: 'success', pesan: 'Notifikasi berhasil diperbarui!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function adminHapusNotifikasi(id) {
  try {
    var sheet = _getOrCreateNotifikasiSheet_();
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.deleteRow(i + 1);
        return { status: 'success', pesan: 'Notifikasi berhasil dihapus!' };
      }
    }
    return { status: 'error', pesan: 'Data tidak ditemukan.' };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getNotifikasiTerbaru(lastTs, token) {
  try {
    // Ambil user berdasarkan token untuk keamanan (jangan percaya role dari client)
    var userSession = checkSession(token);
    if (!userSession) return { status: 'error', pesan: 'Sesi tidak valid' };
    
    var role = (userSession.role || 'warga').toString().trim().toLowerCase();
    var lastDate = null;
    if (lastTs) {
      // lastTs bisa number ms
      if (typeof lastTs === 'number') lastDate = new Date(lastTs);
      else lastDate = new Date(parseInt(lastTs, 10));
      if (isNaN(lastDate.getTime())) lastDate = null;
    }

    var sheet = _getOrCreateNotifikasiSheet_();
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return { status: 'success', data: [], latestTs: (lastDate ? lastDate.getTime() : 0) };

    var list = [];
    var latest = 0;

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = row[0];
      var ts = row[1];
      var authorRole = row[2];
      var authorNama = row[3];
      var judul = row[4];
      var isi = row[5];
      var targetRole = row[6];
      var status = row[7];

      if (!id) continue;
      if (status && status.toString().toLowerCase() !== 'active') continue;

      // filter targetRole: all atau cocok
      var target = (targetRole || 'all').toString().toLowerCase();
      var targetArr = target.split(',').map(function(s) { return s.trim(); });
      if (targetArr.indexOf('all') === -1 && targetArr.indexOf(role) === -1) continue;

      // ts
      var tsDate = ts instanceof Date ? ts : new Date(ts);
      var tsMs = tsDate.getTime();
      if (!isNaN(tsMs) && tsMs > latest) latest = tsMs;

      if (lastDate) {
        if (tsDate && tsDate > lastDate) {
          list.push({
            id: String(id),
            timestamp: tsDate instanceof Date ? tsDate.getTime() : tsMs,
            authorRole: String(authorRole || ''),
            authorNama: String(authorNama || ''),
            judul: String(judul || ''),
            isi: String(isi || ''),
            targetPage: String((row[8] || '')).toLowerCase()
          });
        }
      } else {
        // jika belum ada lastTs, kirim 1 terbaru saja biar tidak spam
        // (polling tetap bisa menangkap setelahnya)
      }
    }

    // jika lastTs kosong, kirim 1 terbaru sesuai role
    if (!lastDate && list.length === 0) {
      // cari terbaru
      var latestItem = null;
      for (var j = 1; j < data.length; j++) {
        var r2 = data[j];
        var id2 = r2[0];
        if (!id2) continue;
        var ts2 = r2[1];
        var tsDate2 = ts2 instanceof Date ? ts2 : new Date(ts2);
        var tsMs2 = tsDate2.getTime();
        if (isNaN(tsMs2)) continue;

        var target2 = (r2[6] || 'all').toString().toLowerCase();
        var targetArr2 = target2.split(',').map(function(s) { return s.trim(); });
        var status2 = (r2[7] || 'active').toString().toLowerCase();
        if (status2 !== 'active') continue;
        if (targetArr2.indexOf('all') === -1 && targetArr2.indexOf(role) === -1) continue;

        if (!latestItem || tsMs2 > latest) {
          latest = tsMs2;
          latestItem = {
            id: String(id2),
            timestamp: tsMs2,
            authorRole: String(r2[2] || ''),
            authorNama: String(r2[3] || ''),
            judul: String(r2[4] || ''),
            isi: String(r2[5] || ''),
            targetPage: String((r2[8] || '')).toLowerCase()
          };
        }
      }
      if (latestItem) list.push(latestItem);
    }

    // urutkan sesuai timestamp naik
    list.sort(function(a, b) { return a.timestamp - b.timestamp; });
    return { status: 'success', data: list, latestTs: latest };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}

function getNotifikasiHistory(role, limit) {
  try {
    role = (role || '').toString().trim().toLowerCase();
    limit = parseInt(limit, 10) || 20;

    var sheet = _getOrCreateNotifikasiSheet_();
    var data = sheet.getDataRange().getValues();
    var list = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = row[0];
      var ts = row[1];
      if (!id) continue;
      var status = row[7];
      if (status && status.toString().toLowerCase() !== 'active') continue;
      var targetRole = (row[6] || 'all').toString().toLowerCase();
      var targetArr = targetRole.split(',').map(function(s) { return s.trim(); });
      if (targetArr.indexOf('all') === -1 && targetArr.indexOf(role) === -1) continue;

      var tsDate = ts instanceof Date ? ts : new Date(ts);
      var tsMs = tsDate.getTime();
      if (isNaN(tsMs)) continue;

      list.push({
        id: String(id),
        timestamp: tsMs,
        authorRole: String(row[2] || ''),
        authorNama: String(row[3] || ''),
        judul: String(row[4] || ''),
        isi: String(row[5] || ''),
        targetRole: String(row[6] || 'all'),
        targetPage: String(row[8] || '')
      });
    }

    list.sort(function(a, b) { return b.timestamp - a.timestamp; });
    return { status: 'success', data: list.slice(0, limit) };
  } catch (e) {
    return { status: 'error', pesan: e.message };
  }
}
