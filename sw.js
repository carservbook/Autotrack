/* [v2.11.17] تغییر نسبت به gh8: CACHE_NAME → gh9 + فیکس حیاتی activate: قبل از حذف کش قدیمی،
   دارایی‌های precache نشده از جدیدترین کش قدیمی کپی می‌شوند — دیگر آپدیت‌ها کشِ آفلاین را نمی‌کشند.
/* [v2.11.15] تغییر نسبت به gh6: فقط CACHE_NAME → gh7 — رساندن index.html جدید
   (تشخیص شفاف sync: ثبت علت خطا + نمایش در پروفایل + تست اتصال دو مسیر + هندل 401
   در پوش خودکار + فیکس پیش‌پرواز: پروب به /version.json). هیچ منطق کش/API در SW عوض نشده. */
/* [v2.11.14] تغییر نسبت به gh5: فقط CACHE_NAME → gh6 — رساندن index.html جدید
   (فیل‌اور سریع GET: تایم‌اوت تلاش اول ۸ثانیه + پیش‌پرواز API: مسابقهٔ دو مسیر در
   بوت/برگشت اینترنت/برگشت به اپ). هیچ منطق کش/پل عوض نشده. */
/* [v2.11.13] تغییر نسبت به gh4: فقط CACHE_NAME → gh5 — رساندن index.html جدید
   (سپر ایمنی داده: خودترمیمی بعد از گارد سرور + راهنمای «حساب خالی» + confirmWipe).
   هیچ منطق کش/پل عوض نشده. */
/* [v2.11.12] تغییر نسبت به gh3: فقط CACHE_NAME → gh4 — رساندن index.html جدید
   (فیکس ورود گوگل در TWA: مسیر مطلق OAuth + back + بازگشت #hb= به همین شِل).
   هیچ منطق کش/پل عوض نشده. */
/* [v2.11.10] تغییر نسبت به v34: CACHE_NAME → v35 + فقط یک افزودنی در صفحهٔ آفلاین:
   دکمهٔ سوم «باز کردن از آدرس پشتیبان گیتهاب» (https://carservbook.github.io/Autotrack/) —
   مسیر سومِ کاملاً مستقل (دامنه/زیرساخت دیگر، بدون کلودفلر) برای دستگاه‌هایی که هیچ‌کدام
   از دو مسیر کلودفلری برایشان باز نمی‌شود. هیچ منطق کش/API/ناوبری/نجات شِل عوض نشده. */
/* [v2.11.9] تغییر نسبت به v33: CACHE_NAME → v34 + دو فیکسِ «اپ باز نمی‌شود» (FIX N-02):
   ۱) ناوبری‌ها cache-first شدند (stale-while-revalidate): هر بازشدنِ اپی که یک‌بار
      باز شده، همان لحظه از کش باز می‌شود — حتی با اینترنت مرده/فیلترشده — و
      نسخهٔ تازه در پس‌زمینه کش می‌شود. قبلاً ناوبری شبکه‌محور بود: هر بازشدن اول
      ۲.۵ثانیه منتظر شبکه می‌ماند و با کشِ خالی (دستگاه جدید/اپ‌پاک‌کن/پاک‌کردن
      دادهٔ مرورگر) به صفحهٔ خطا می‌رسید — اسکرین‌شات «اتصال برقرار نشد» دقیقاً
      همین مسیر بود.
   ۲) نجات شِل از مسیر پشتیبان: اگر شِل نه در کش بود و نه از مسیر اصلی قابل گرفتن،
      همان صفحه از autotrack.carservbook.ir با mode:'cors' گرفته می‌شود (ورکر برای
      دامنه‌های خودمان Access-Control-Allow-Origin را روی استاتیک‌ها منعکس می‌کند).
      URL سند روی دامنهٔ اصلی می‌ماند → توکن و دادهٔ محلی دست‌نخورده می‌ماند.
   + صفحهٔ آفلاین فارسی حالا دکمهٔ دوم «ورود از مسیر پشتیبان» دارد (ناوبری مستقیم
   به زیردامنه — آخرین خط دفاع برای دستگاه‌های بدون کش).
   /api/* همچنان هرگز کش نمی‌شود (پچ B-01)؛ منطق API/چیپ/فیلاور دست‌نخورده. */
/* [v2.11.8] تغییر نسبت به v31/v32: فقط CACHE_NAME → v33 — رساندن index.html جدید
   (فیلاور API: اگر api.carservbook.ir در دسترس نبود، همهٔ تماس‌های /api/* خودکار و بی‌صدا از
   مسیر پشتیبان autotrack.carservbook.ir می‌روند — همان ورکر؛ + preconnect مسیر دوم).
   /api/* همچنان هرگز کش نمی‌شود (پچ B-01) و هیچ منطق کش/API در SW عوض نشده. */
/* [v2.11.7] تغییر نسبت به v30/v31: فقط CACHE_NAME → v32 — رساندن index.html جدید
   (چیپ آرام: شکست اولِ هر دورهٔ خطا بی‌صدا، از دومی کهرباییِ موقت ۸ثانیه‌ای، قرمزِ ماندگار
   فقط بعد از ۴ شکستِ پشت‌سرهم + بک‌آف نمایی ۳۰ثانیه تا ۸دقیقه). هیچ منطق کش/API عوض نشده. */
/* [v2.11.6] تغییر نسبت به v29/v30: فقط CACHE_NAME → v31 — رساندن index.html جدید
   (فیکس UI: دایرهٔ خالی انتخاب ماشین که به‌خاطر تزاحم کلاس عمومی .empty به بیضی بزرگ
   تبدیل شده بود؛ اکنون دقیقاً هم‌اندازهٔ دایرهٔ نارنجی تیک‌دار است). هیچ منطق کش/API عوض نشده. */
/* [v2.11.5] تغییر نسبت به v28/v29: فقط CACHE_NAME → v30 — رساندن index.html جدید
   (موتور اطمینان همگام‌سازی: timeout برای همهٔ تماس‌های API + چیپ وضعیت sync + صندوق
   ارسال مجدد خودکار + مقایسهٔ معنایی به‌جای رشتهٔ خام = حذف مودال تعارض کاذب +
   همگام‌سازی روی online/برگشت به اپ/دوره‌ای). هیچ منطق کش/API عوض نشده. */
/* [v2.11.4] تغییر نسبت به v27/v28: فقط CACHE_NAME → v29 + APP_VERSION — همراهی با
   زیرساخت assetlinks ورکر (مسیر /.well-known/assetlinks.json روی دامنهٔ اصلی).
   تغییر frontend: هیچ؛ فقط هم‌نسخه‌سازی شماره‌ها. */
/* [v2.11.3] تغییر نسبت به v26/v27: فقط CACHE_NAME → v28 — رساندن index.html جدید
   (گیت کاربران نصب‌کرده در پل مهاجرت: کاربر TWA بازار / PWA نصب‌شده دیگر منتقل نمی‌شود
   تا هرگز از scope اپ خارج نشود و نوار آدرس نبیند). هیچ منطق کش/API عوض نشده. */
/* [v2.11.2] تغییر نسبت به v25/v26: فقط CACHE_NAME → v27 — رساندن index.html جدید
   (پروفایل: «حساب کاربری:» به‌جای «وارد شدی با:» + خط «نسخه:» سبز بالای خط
   همگام‌سازی + APP_VERSION 2.11.2). هیچ منطقی در کش/API/پل مهاجرت تغییر نکرده؛
   ارتقای کش برای رسیدن شِل جدید به کاربران نصب‌کرده ضروری است. */
/* [v2.11.1] تغییر نسبت به v25: CACHE_NAME → v26 — رساندن index.html جدید (پل
   مهاجرت نرم: انتقال توکن/داده از دامنه‌های قدیمی به دامنهٔ اصلی با #hb=).
   بلوک «خودبازنشستگی» v2.11.0 حذف شد: در دورهٔ گذار سرویس‌ورکر باید روی
   دامنه‌های قدیمی هم سالم بماند تا فال‌بک آفلاین کاربران قدیمی از کار نیفتد؛
   خودِ شِل با اسنیپت head انتقال را انجام می‌دهد. بازنشستگی SWهای دامنه‌های
   قدیمی به نسخهٔ «پس از بازنشستگی دامنه» موکول شد. */
/* [v2.10.3] تغییر نسبت به v23: CACHE_NAME → v24 — رساندن index.html جدید (نسخهٔ 2.10.3؛ ریدایرکت canonical و هش PBKDF2 سمت ورکر است) */
/* [v2.10.2] تغییر نسبت به v22: CACHE_NAME → v23 — رساندن index.html جدید (اصلاح حلقهٔ بیرون‌افتادن از اکانت: لاگین گوگل برگشت به همان دامنهٔ شِل) */
/* [v2.10.1] تغییر نسبت به v21: CACHE_NAME → v22 — رساندن index.html جدید (حذف سپر S-08: پرش مستقیم ورود گوگل به لیست اکانت‌ها + CSP دامنهٔ api) */
/* [v2.10.0] تغییر نسبت به v20: CACHE_NAME → v21 — رساندن index.html جدید (API_BASE روی api.carservbook.ir + لینک اشتراکی داینامیک) */
/* [v2.9.0] تغییر نسبت به v18: CACHE_NAME → v19 (رساندن index.html جدید: لینک مکانیک + کش مدیریت)
   + عبور مستقیم مسیرهای /s/<کلید> و /share.html (صفحهٔ عمومی مکانیک — بدون دخالت کش؛
   مخصوصاً برای مهمان/مکانیک که هیچ کشی از اپ ندارد). */
/* [v2.8.0] تغییر نسبت به v17: فقط ارتقای CACHE_NAME به v18 برای رساندن index.html جدید
   (ثبت سریع + گزارش هزینه + خلاصهٔ مکانیک + جستجوی تاریخچه) */
/* [v2.7.1] تغییر نسبت به v16: فقط ارتقای CACHE_NAME به v17 — آیتم «مدیریت» به بالای منو منتقل شد */
/* ============================================================
   Service Worker v16 — v2.7.0 «یادآور هوشمند + تله‌متری + پنل ادمین»
   تغییر نسبت به v15: فقط ارتقای CACHE_NAME به v16 برای رساندن index.html جدید
   به کاربران فعلی (یادآور هوشمند با اعلان «نزدیکه»، صفحهٔ پیش‌روها، تنظیمات یادآور
   با ساعات سکوت، یادگیری بازه از تاریخچه، تله‌متری خطا/پینگ، پنل ادمین، بنر پیام
   همگانی، گارد state ورود گوگل). هیچ منطقی در کش/API تغییر نکرده.
   تغییر نسبت به v14: فقط ارتقای CACHE_NAME به v15 برای رساندن index.html جدید
   به کاربران فعلی (افزودن «تماس با ما و پشتیبانی» به منو/پروفایل/مودال ورود/درباره
   + نمایش ایمیل پشتیبانی داخل مودال اختلال ورود گوگل S-08).
   هیچ منطقی در کش/API تغییر نکرده. تاریخچهٔ v14 در ادامه آمده است.
   تغییر نسبت به v13:
   ۱) ارتقای CACHE_NAME به v14 برای رسیدن index.html جدید به کاربران فعلی.
   ۲) تغییر در index.html — پچ S-08: دکمهٔ «ورود سریع با گوگل» قبل از پرش به
      accounts.google.com دسترسی شبکه به گوگل را می‌سنجد؛ مسیر مختل → مودال راهنمای
      فارسی (تلاش مجدد / ادامهٔ دستی) به‌جای صفحهٔ خطای خام مرورگر.
      CSP (_headers و security-headers-worker.js): connect-src اجازهٔ accounts.google.com.
   ۳) تغییر نسبت به v12 — ارتقای CACHE_NAME به v13 + پچ S-07 (ضد-پاک‌سازی):
   ۴) تغییر در index.html — پچ S-07 (ضد-پاک‌سازی):
      - initCloudSync محتوا-محور شد: سرور داده دارد + دستگاه خالی → همیشه پول؛
        سرور خالی + دستگاه داده دارد → پوش بازیابی؛ هر دو خالی → هیچ نوشتنی؛
        پوشِ خودکار حالتِ خالی و پولِ نسخهٔ خالی روی دادهٔ غیرخالی در هیچ شاخه‌ای نیست.
      - doCloudPush: پوشِ حالتِ خالی ممنوع (مگر انتخاب صریح کاربر با allowEmpty).
      - applyCloudState: آخرین خط دفاع — نسخهٔ خالی سرور هرگز جای دادهٔ غیرخالی دستگاه نمی‌نشیند.
      - flushSyncOnHide: بستنِ صفحه با دستگاهِ خالی دیگر بیکانِ پاک‌کننده نمی‌فرستد.
      - manualSync: مسیر پوشِ خالیِ باقی‌مانده از v2.6.5 بسته شد.
      - updateViaCache:'none' در ثبت SW → sw.js همیشه تازه چک می‌شود.
   تغییر نسبت به v11:
   ۱) ارتقای CACHE_NAME به v12 برای رسیدن index.html جدید به کاربران فعلی.
   ۲) تغییر در index.html:
      - S-06: اگر هنگام خروج، دادهٔ ماشینِ همگام‌نشده روی دستگاه باشد، مودال خروج اول
        «همگام‌سازی الان» و «خروجی گرفتن (JSON)» را پیشنهاد می‌دهد (خروج اجباری نیست).
      - S-05: همگام‌سازی دستی جهت‌آگاه (اول GET؛ سرورِ جلوتر گرفته می‌شود نه پاک).
      - S-05: دکمهٔ «همگام‌سازی الان» دیگر پوشِ بی‌قیدوشرط نیست؛ اول وضعیت سرور خوانده
        می‌شود — اگر سرور جلوتر بود نسخهٔ سرور گرفته می‌شود (قبلاً فشردن دکمه روی دستگاه
        خالی می‌توانست دادهٔ سرور را با حالت خالی بازنویسی/پاک کند).
        تعارض واقعی → مودال انتخاب + پشتیبان خودکار (مکانیزم S-03).
   منطق‌های بحرانی بدون تغییر ماندند:
   - /api/* هرگز از کش سرو/کش نمی‌شود (پچ B-01)
   - فونت وزیرمتن هم‌مبدا در precache (پچ P-01)
   - خروج امن + سپر تعویض حساب (پچ L-02 — در index.html)
   - تعارض همگام‌سازی + «آخرین همگام‌سازی موفق» (S-03/S-04 — در index.html)
   ============================================================ */
var CACHE_NAME = 'car-service-cache-gh10';
var STATIC_ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './Vazirmatn-var.woff2'];
var RETRY_TIMEOUT_MS = 8000;
var NAV_TIMEOUT_MS = 2500;

/* [v2.11.1] نکته: بلوک «خودبازنشستگی روی دامنه‌های قدیمی» که در v2.11.0 اضافه
   شده بود، حذف شد — در دورهٔ گذار، SW دامنه‌های قدیمی باید سالم بماند (کاربرِ
   آفلاین/شبکه‌شل به فال‌بک کش نیاز دارد). وقتی دامنه‌های قدیمی رسمی بازنشسته
   شدند، همین بلوک در نسخهٔ بعدی برگردانده می‌شود. */

function withTimeout(promise, ms){
  return new Promise(function(resolve, reject){
    var timer = setTimeout(function(){ reject(new Error('timeout')); }, ms);
    promise.then(function(v){ clearTimeout(timer); resolve(v); }, function(e){ clearTimeout(timer); reject(e); });
  });
}

/* صفحه فالبک فارسی برای وقتی که هم شبکه و هم کش در دسترس نیست —
   به‌جای صفحه خطای پیش‌فرض مرورگر (This site can't be reached).
   [v2.11.9] دکمهٔ دوم: «ورود از مسیر پشتیبان» — ناوبری مستقیم به زیردامنهٔ
   autotrack.carservbook.ir (همان ورکر/اپ). چون دامنه عوض می‌شود، localStorage
   آن دامنه جدا است و ممکن است یک‌بار ورود بخواهد — آخرین خط دفاع، صادقانه.
   [v2.11.10] دکمهٔ سوم: «باز کردن از آدرس پشتیبان گیتهاب» — مسیر سوم کاملاً مستقل
   (دامنهٔ github.io + زیرساخت Fastly، بدون کلودفلر)؛ برای وقتی که کل رنج
   آی‌پی کلودفلر در دسترس نیست. دادهٔ آن نسخه جدا ذخیره می‌شود و پل مهاجرت #hb
   آن را هر وقت اپ اصلی در دسترس شد خودکار به اپ اصلی منتقل می‌کند. */
function offlineFallback(){
  var html = '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>دفترچه سرویس خودرو</title></head>'
    + '<body style="margin:0;font-family:Tahoma,sans-serif;background:#111417;color:#e8eaed;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;direction:rtl">'
    + '<div style="padding:24px">'
    + '<h2 style="margin:0 0 10px;font-size:22px">اتصال برقرار نشد</h2>'
    + '<p style="color:#9aa0a6;margin:0 0 22px;line-height:1.9">دسترسی به سرور ممکن نیست.<br>چند لحظه بعد دوباره تلاش کنید؛ اگر تکرار شد، اینترنت را یک‌بار قطع و وصل کنید.</p>'
    + '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'
    + '<button onclick="location.reload()" style="background:#4c8dff;color:#fff;border:0;border-radius:10px;padding:10px 28px;font-size:16px">تلاش دوباره</button>'
    + '<button onclick="location.replace(\'https://autotrack.carservbook.ir/\')" style="background:#232931;color:#e8eaed;border:1px solid #3a424c;border-radius:10px;padding:10px 22px;font-size:15px">ورود از مسیر پشتیبان</button>'
    + '<button onclick="location.replace(\'https://carservbook.github.io/Autotrack/\')" style="background:#1f3d2b;color:#8ee6a8;border:1px solid #2f5c40;border-radius:10px;padding:10px 22px;font-size:15px">باز کردن از آدرس پشتیبان گیتهاب</button>'
    + '</div>'
    + '<p style="color:#5f6771;font-size:12.5px;margin:18px 0 0;line-height:1.8">«مسیر پشتیبان» همان اپ با همان سرور است؛ فقط ممکن است یک‌بار ورود بخواهد.<br>«آدرس گیتهاب» نسخهٔ اضطراری مستقل از سرور اصلی است؛ اطلاعاتش بعداً خودکار به اپ اصلی منتقل می‌شود.</p>'
    + '</div></body></html>';
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

/* [v2.11.9] نجات شِل از مسیر پشتیبان — وقتی شِل نه در کش است و نه از مسیر اصلی
   می‌آید، همان صفحه از autotrack.carservbook.ir (همان ورکر، همان فایل) با
   mode:'cors' گرفته می‌شود؛ هدر Access-Control-Allow-Origin را ورکر فقط برای
   دامنه‌های خودمان روی استاتیک‌ها منعکس می‌کند (v2.11.9). پاسخ cors برای
   navigation مجاز است و URL سند روی دامنهٔ اصلی می‌ماند → localStorage/توکن
   همان دامنهٔ قبلی می‌ماند و کاربر هیچ‌چیز حس نمی‌کند. */
var SHELL_FALLBACK_ORIGIN = 'https://autotrack.carservbook.ir';
function fetchShellFromFallback(req){
  var path = '/';
  try{ var u = new URL(req.url); path = u.pathname || '/'; }catch(e){}
  return fetch(SHELL_FALLBACK_ORIGIN + path, { mode: 'cors', cache: 'no-store', redirect: 'follow' }).then(function(r){
    if(!(r && r.status === 200 && r.type === 'cors')) throw new Error('no-rescue');
    var cl = r.clone();
    try{ caches.open(CACHE_NAME).then(function(c){ c.put(req, cl); }); }catch(eC){}
    return r;
  });
}

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      /* نصب مقاوم: اگر در لحظه نصب حتی یک فایل (مثلاً به‌دلیل فیلترینگ)
         در دسترس نبود، کل نصب fail نمی‌شود — هر فایل جدا تلاش می‌شود و
         نبودنش نادیده گرفته می‌شود. مهم‌ترین فایل، شِل اپ ('/') است. */
      return Promise.all(STATIC_ASSETS.map(function(u){
        return cache.add(u).catch(function(){ /* این فایل نبود؛ مهم نیست */ });
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      var oldKeys=keys.filter(function(k){ return k!==CACHE_NAME; });
      /* [v2.11.17] فیکس «اپ آفلاین باز نمی‌شود بعد از آپدیت»: قبلاً کشِ قدیمی بی‌قید حذف می‌شد
         حتی اگر precache نسخهٔ جدید ناقص مانده باشد (نصب مقاوم فایل‌های ناموفق را نادیده می‌گیرد)
         → کاربرِ آفلاین شِل را از دست می‌داد. حالا اول هر داراییِ غایب از جدیدترین کشِ قدیمی
         کپی می‌شود و بعد کش‌های کهنه حذف می‌شوند. */
      return caches.open(CACHE_NAME).then(function(newCache){
        return Promise.all(STATIC_ASSETS.map(function(u){
          return newCache.match(u).then(function(hit){
            if(hit) return undefined;
            for(var i=0;i<oldKeys.length;i++){
              /* کپی از اولین کش قدیمی که دارد — ترتیب keys از جدید به قدیم تضمینی نیست ولی
                 محتوای همهٔ کش‌های قدیمی معتبرند (هر کدام مربوط به یک نسخهٔ شِل) */
            }
            return Promise.all(oldKeys.map(function(k){
              return caches.open(k).then(function(oc){ return oc.match(u); });
            })).then(function(hits){
              var good=hits.filter(function(h){ return h; })[0];
              if(good) return newCache.put(u, good);
              return undefined;
            });
          });
        })).then(function(){
          return Promise.all(oldKeys.map(function(k){ return caches.delete(k); }));
        });
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  var req = event.request;
  var url;
  try{ url = new URL(req.url); }catch(e){ return; }

  /* ---------- B-01 FIX: API هرگز از کش سرو نمی‌شود ---------- */
  if(url.pathname.indexOf('/api/') === 0){
    if(req.method === 'GET'){
      event.respondWith(fetch(req));
    }
    /* غیر GET (مثل POST /api/data): رفتار پیش‌فرض مرورگر — قابل کش نیست */
    return;
  }

  /* [v2.9.0] صفحهٔ عمومی لینک مکانیک — مستقیم از شبکه (بدون کش) تا مهمان/مکانیک
     همیشه نسخهٔ واقعی را ببیند و فالبک آفلاین اشتباهی شِل اپ را نشان ندهد */
  if(url.pathname === '/share.html' || url.pathname.indexOf('/s/') === 0){
    return;
  }

  /* cross-origin را دخالت نده (الان دیگر هیچ دارایی cross-origin‌ای نداریم؛
     این قاعده به‌عنوان محافظ برای آینده می‌ماند) — HTTP cache خود مرورگر کافی است */
  if(url.origin !== self.location.origin){
    return;
  }

  var isNavigation = req.mode === 'navigate' || (req.method==='GET' && req.headers.get('accept') && req.headers.get('accept').indexOf('text/html')>-1);

  if(isNavigation){
    event.respondWith(
      caches.match(req).then(function(cached){
        /* FIX N-01b (باگ واقعی): وقتی کش HIT است، cached یک Response است نه Promise؛
           صدا زدن .then روی Response خطای TypeError می‌دهد و پاسخ navigation را می‌شکند
           (نتیجه: صفحه خطای کروم در حالت آفلاین/شبکه کند — حتی با کش پُر!).
           حالت HIT با Promise.resolve لفاف‌دهی می‌شود تا هر دو مسیر Promise باشند. */
        var cachedFallback = cached ? Promise.resolve(cached) : caches.match('./');
        /* [v2.11.9] FIX N-02: ناوبری cache-first شد (stale-while-revalidate).
           کش پُر = بازشدنِ فوری حتی با شبکهٔ مرده + به‌روزرسانیِ پس‌زمینه؛
           کشِ خالی = همان زنجیرهٔ مقاوم قبلی: شبکه → تلاش مجدد → نجاتِ شِل از
           مسیر پشتیبان → صفحهٔ فارسی آفلاین. */
        return Promise.resolve(cachedFallback).then(function(hit){
          if(hit){
            var refresh = fetch(req).then(function(resp){
              if(resp && resp.status===200){
                var cl=resp.clone();
                return caches.open(CACHE_NAME).then(function(c){ return c.put(req, cl); });
              }
              return undefined;
            }).catch(function(){});
            try{ event.waitUntil(refresh); }catch(eW){}
            return hit;
          }
          /* کش خالی (اولین بازدید/کش پاک‌شده) — شبکه با سقف زمانی */
          return withTimeout(fetch(req), NAV_TIMEOUT_MS).then(function(resp){
            if(resp && resp.status===200){
              var clone=resp.clone();
              caches.open(CACHE_NAME).then(function(cache){ cache.put(req, clone); });
            }
            return resp;
          }).catch(function(){
            /* یک تلاش دیگر با سقف بلندتر */
            return withTimeout(fetch(req), RETRY_TIMEOUT_MS).catch(function(){
              /* [v2.11.9] آخرین فرصت قبل از صفحهٔ خطا: نجات شِل از مسیر پشتیبان —
                 «اگر از مسیر اصلی باز نشد، از autotrack.carservbook.ir باز کن» */
              return fetchShellFromFallback(req).catch(function(){
                return offlineFallback();
              });
            });
          });
        });
      })
    );
    return;
  }

  /* بقیه درخواست‌ها: استاتیک same-origin — cache-first اشکال ندارد */
  event.respondWith(
    caches.match(req).then(function(cached){
      return cached || fetch(req).then(function(resp){
        if(req.method==='GET' && resp && resp.status===200){
          var clone=resp.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, clone); });
        }
        return resp;
      }).catch(function(){ return cached; });
    })
  );
});

/* ---------- Background push notifications (بدون تغییر) ---------- */
self.addEventListener('push', function(event){
  var data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){
    data = { title:'دفترچه سرویس خودرو', body: event.data ? event.data.text() : '' };
  }
  var title = data.title || 'دفترچه سرویس خودرو';
  var options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'car-service-reminder',
    dir: 'rtl',
    lang: 'fa'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(clientList){
      for(var i=0;i<clientList.length;i++){
        if('focus' in clientList[i]) return clientList[i].focus();
      }
      if(clients.openWindow) return clients.openWindow('/');
    })
  );
});
