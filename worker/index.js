// ============================================================
// بک‌اند دفترچه سرویس خودرو — Worker «autotrack» — نسخهٔ کامل v2.11.14
//
// v2.11.14 چی تغییر کرد؟ — همگام‌سازی مقاوم برای دادهٔ سنگین (ریشهٔ «اتصال هست ولی سینک نمی‌شود»):
//   ۱) /api/data با هدر X-Payload-Encoding: gzip → بدنهٔ فشرده باز و ذخیره می‌شود
//   ۲) /api/data-chunk + /api/data-chunk-final → پوش چندبخشی؛ هر بخش کوچک و مستقلاً قابل تلاش مجدد
//   ۳) جدول data_chunks (lazy) + پاک‌سازی بخش‌های بی‌صاحبِ قدیمی‌تر از ۲۴ ساعت
//   ۴) سقف روزانهٔ per-IP برای /api/register و /api/log-error (ضد اسپمِ سهمیهٔ KV/D1)
//   سازگاری کامل با همهٔ کلاینت‌های قدیمی: مسیرهای قبلی بدون تغییر کار می‌کنند.
// v2.11.13 چی تغییر کرد؟ — سپر ایمنی داده (ریشه‌یابی «اکانت خالی بعد از نصب مجدد TWA»)
//   • گزارش کاربر: بعد از نصب TWA جدید، اپ از اکانت می‌رود بیرون و بعد از ورود مجدد،
//     داده‌ها برنمی‌گردند. ریشه‌یابی: مسیر لاگین/پولِ سمت کلاینت و سرور سالم است
//     (googleCallback کاربر را با email پیدا می‌کند و همان user_id را می‌دهد؛
//     initCloudSync وقتی سرور داده دارد و دستگاه خالی است همیشه پول می‌کند).
//     پس «اکانت خالی» یعنی داده زیر یک اکانت/ایمیل دیگر است یا پوشِ خالیِ ناخواسته
//     رخ داده — این نسخه هر دو را می‌بندد:
//   ۱) بکاپ خودکار سمت سرور: قبل از هر بازنویسیِ «کاهش‌محتوا» (کاهش تعداد خودرو یا
//      نصف‌شدن ناگهانی حجم داده)، نسخهٔ قبلی در جدول data_backups (lazy CREATE TABLE)
//      نگه داشته می‌شود — ۳ نسخهٔ آخر هر کاربر. حتی اگر کلاینتی باگ داشته باشد،
//      داده از بین نمی‌رود و ادمین می‌تواند برگرداند.
//   ۲) گارد پاک‌شدگی: هیچ درخواستی نمی‌تواند نسخهٔ غیرخالی سرور را با «حالت خالی»
//      جایگزین کند مگر با confirmWipe:true (اقدام آگاهانهٔ کاربر) — پاسخ 409 needConfirm.
//      بیکون (sendBeacon موقع بسته‌شدن اپ) هرگز اجازهٔ پاک‌کردن ندارد.
//   ۳) مسیرهای نجات ادمین: /api/admin/find-data و /api/admin/get-backup و
//      /api/admin/restore-backup (فقط v27IsAdmin) — بدون کنسول D1.
//   ۴) کلاینت: after 409 → پول خودکار از سرور (خودترمیمی)؛ حذفِ آگاهانهٔ آخرین خودرو
//      → confirmWipe؛ راهنمای «حساب خالی» بعد از لاگین (بازگرداندن کاربر به حساب درست)؛
//      خط آموزشی در پنجرهٔ ورود. sw: CACHE v37.
//   • هیچ تغییری در auth/KV/کرن/assetlinks/گوگل-لاگین (v2.11.12 دست‌نخورده).
//
// v2.11.12 چی تغییر کرد؟ — فیکس «ورود با گوگل» در TWA کافه‌بازار و شِل گیتهاب
//   • ریشهٔ باگ: دکمهٔ ورود گوگل مسیر «نسبی» /api/google-login را باز می‌کرد؛ روی شِل
//     carservbook.github.io/Autotrack/ (جایی که TWA و اپ نصب‌شده واقعاً می‌مانند —
//     گیت v2.11.3) این مسیر به 404 گیتهاب می‌خورد و ورود گوگل داخل اپ مرده بود.
//     خطای ایمیل/رمز حساب‌های گوگلی («این حساب با گوگل ساخته شده…») رفتار درست سرور
//     است و ربطی به این باگ ندارد.
//   • کلاینت (هر دو شِل): مسیر OAuth حالا «مطلق» به اورجین فعال API می‌رود (با احترام
//     به فیلاور v2.11.8) + پارامتر back = آدرس شِل مبدأ.
//   • ورکر: googleLogin مقدار back را با allowlist سخت (سه دامنهٔ خودمان) اعتبارسنجی و
//     داخل رکورد state در KV ذخیره می‌کند؛ googleCallback در پایان به جای ثبت محلی،
//     توکن/خطا را با #hb= به شِل مبدأ برمی‌گرداند (گیرندهٔ #hb= از v2.11.1 در head همهٔ
//     شِل‌ها هست؛ حالا err را هم می‌فهمد). back نامعتبر/هم‌اورجین = مسیر قدیمی.
//   • کلاینت: برداشت نشست پس از بستن Custom Tab (visibilitychange → reload یک‌باره،
//     فقط ۱۰ دقیقهٔ اول). redirect_uri گوگل همان api.carservbook.ir قبلی است —
//     هیچ تغییری در Google Console لازم نیست.
//   • sw: CACHE_NAME → v36 (رساندن index.html جدید). auth/KV/D1/کرن/assetlinks دست‌نخورده.
//
// v2.11.10 چی تغییر کرد؟ — لایهٔ سوم پشتیبان: نسخهٔ گیتهاب (GitHub Pages)
//   • زمینه: نسخهٔ پشتیبان استاتیک اپ روی https://carservbook.github.io/Autotrack/ منتشر شد
//     (دامنه و زیرساخت کاملاً مستقل از کلودفلر — Fastly). برای اتصال sync از همان اورجین:
//     ۱) اورجین گیتهاب به V210_API_ORIGINS اضافه شد → preflight OPTIONS و همهٔ پاسخ‌های
//        /api/* برای آن اورجین ACAO می‌گیرند (همان ساز‌و‌کار دامنه‌های خودمان).
//     ۲) هیچ چیز دیگر: auth/KV/D1/کرن/assetlinks/فیلاور API (v2.11.8)/نجات شِل (v2.11.9)
//        همه دست‌نخورده. بازدید عادی از دامنه‌های خودمان بیت‌به‌بیت مثل قبل.
//   • سمت sw: صفحهٔ آفلاین حالا دکمهٔ سوم «باز کردن از آدرس پشتیبان گیتهاب» دارد + CACHE v35.
//   • امنیت: اورجین گیتهاب فقط کدِ خودِ ما را سرو می‌کند (ریپوی عمومی ما)؛ نشت توکنی که
//        کاربر عمداً در نسخهٔ گیتهاب وارد کند همان ریسک ورود در هر اورجین متعلق به ماست.
//
// v2.11.9 چی تغییر کرد؟ — فیکس «اپ اصلاً باز نمی‌شود» (FIX N-02) + OAuth مستقل مسیر پشتیبان
//   • گزارش کاربر ۱۴۰۵/۸/۱۲ (سه اسکرین‌شات): یک اکانت sync نمی‌کرد، اکانت دیگر کلاً باز نمی‌شد
//     (صفحهٔ فارسی «اتصال برقرار نشد» = صفحهٔ فالبک sw.js؛ یعنی کش خالی + شبکهٔ مرده).
//   • تغییرات بک‌اند حداقلی است:
//     ۱) انعکاس Access-Control-Allow-Origin روی فایل‌های استاتیک فقط برای دامنه‌های خودمان
//        (V210_API_ORIGINS) — پیش‌نیاز «نجات شِل از مسیر پشتیبان» در سرویس‌ورکر: پاسخ بدون
//        ACAO opaque می‌شود و مرورگر برای navigation آن را رد می‌کند. بازدید عادی (بدون
//        هدر Origin) هیچ تغییری نمی‌بیند.
//     ۲) معافیت زیردامنهٔ autotrack.carservbook.ir از ریدایرکت canonical مسیرهای OAuth —
//        ورود گوگل وقتی از مسیر پشتیبان شروع شود روی همان دامنه کامل می‌شود
//        (redirect_uri = https://autotrack.carservbook.ir/api/google-callback — باید یک‌بار
//        در Google Console به Authorized redirect URIs اضافه شود؛ ریدایرکت دو دامنهٔ قدیمی
//        مثل قبل به api.carservbook.ir می‌ماند). پل مهاجرت بعداً کاربر مرورگر را با #hb=
//        به دامنهٔ اصلی برمی‌گرداند.
//   • سمت کلاینت/sw: ناوبری cache-first + به‌روزرسانی پس‌زمینه، نجات شِل از مسیر پشتیبان،
//     دکمهٔ «ورود از مسیر پشتیبان» در صفحهٔ آفلاین، خط «مسیر اتصال» در پروفایل، CACHE v34.
//   • هیچ تغییری در auth/KV/D1/کرن/assetlinks/چیپ آرام/فیلاور API (v2.11.8 دست‌نخورده).
//
// v2.11.8 چی تغییر کرد؟ — فیلاور API: مسیر پشتیبان autotrack.carservbook.ir
//   • زیردامنهٔ جدید autotrack.carservbook.ir (روی همان ورکر) به‌عنوان مسیر پشتیبان رسمی API
//     ثبت شد: اگر api.carservbook.ir موقتاً پاسخ ندهد (فیلترینگ هاست‌نیم/اختلال مسیر/DNS اپراتور)،
//     کلاینت بی‌صدا از مسیر دوم ادامه می‌دهد — همان ورکر، همان داده، همان توکن.
//   • تغییرات بک‌اند حداقلی است: ۱) مجوز CORS برای دامنهٔ پشتیبان در V210_API_ORIGINS
//     (پیش‌پرواز OPTIONS + Reflection روی /api/*). ۲) هیچ تغییری در auth/KV/D1/کرن/assetlinks.
//   • سمت کلاینت (index.html): apiFetch ← اول مسیر اصلی، روی خطای شبکه مسیر دوم؛
//     چیپ آرام v2.11.7 دست‌نخورده. CSP در public/_headers: connect-src += دامنهٔ پشتیبان.
//   • frontend: APP_VERSION 2.11.8 + version.json + CACHE v33 + preconnect مسیر دوم.
//   • نکتهٔ تست زنده: preflight OPTIONS و POST /api/ping روی زیردامنهٔ پشتیبان ۲۰۴/200 با
//     access-control-allow-origin صحیح پاسخ دادند (قبل از این نسخه هم ورکر روی آن هاست
//     کامل جواب می‌داد؛ فقط مجوز CORS صریح و CSP کلاینت اضافه شد).
//
// v2.11.6 چی تغییر کرد؟ — فیکس UI «بیضی به‌جای دایرهٔ خالی» (فقط frontend؛ بک‌اند دست‌نخورده):
//   • گزارش کاربر: در فهرست انتخاب ماشین، دایرهٔ خالیِ ماشین انتخاب‌نشده خیلی بزرگ است و
//     شکل بیضی دارد (باید هم‌اندازهٔ دایرهٔ نارنجی تیک‌دار باشد).
//   • ریشه: span دایره کلاس‌های «car-check empty» را با هم دارد؛ کلاس عمومی .empty
//     (بلوک «هنوز کاری ثبت نشده») padding:50px 20px تزریق می‌کرد → جعبهٔ 43×103 با
//     border-radius:50% = بیضی. فیکس: padding:0 در .car-check.empty (specificity بالاتر).
//   • frontend: APP_VERSION 2.11.6 + version.json + CACHE v31. منطق کش/API/بک‌اند عوض نشده.
//
// v2.11.5 چی تغییر کرد؟ — «موتور اطمینان همگام‌سازی» (تغییر frontend؛ بک‌اند دست‌نخورده):
//   • گزارش کاربر: همگام‌سازی به‌سختی انجام می‌شود؛ بعد از معطلیِ طولانی مودال تعارض
//     می‌آید و با انتخاب «ارسال نسخهٔ دستگاه» فقط بکاپ شروع می‌شود و هیچ اتفاقی نمی‌افتد.
//   • ریشه‌ها (همه در کلاینت): apiFetch بدون timeout (آویزان‌شدن دقیقه‌ای روی شبکهٔ کند)،
//     قورت‌دادنِ بی‌صدای خطاها در doCloudPush (catch خالی)، نبودِ تلاش مجدد/همگام‌سازی
//     روی online/دوره‌ای، و مقایسهٔ خام JSON که تعارض کاذب (ترتیب کلید/فلگ اعلان هر دستگاه) می‌ساخت.
//   • راهکار: timeout ۲۰ثانیه‌ای + خطای TYPEدار + چیپ وضعیت sync + صندوق ارسال مجدد خودکار
//     (۳۰ثانیه‌ای تا موفقیت) + مقایسهٔ معنایی (کلیدهای مرتب + نادیده‌گرفتن notified) +
//     reconcile خودکار روی online/برگشت به اپ/هر ۵دقیقه (کول‌داون ۶۰ثانیه + گارد تعارض باز) +
//     بازخورد واقعی «در حال ارسال/ذخیره شد/ناموفق» در حل تعارض.
//   • frontend: APP_VERSION 2.11.5 + version.json + CACHE v30. منطق کش/API عوض نشده.
//     (در v2.11.6 فقط شماره‌ها به 2.11.6/v31 ارتقا یافت.)
//
// v2.11.4 چی تغییر کرد؟ — زیرساخت Digital Asset Links برای آپدیت APK بازار:
//   • مسیر جدید /.well-known/assetlinks.json فقط روی api.carservbook.ir —
//     مقادیر واقعی (پکیج ir.carservbook.app + فینگرپرینت SHA-256 امضا + statement
//     اعتبارسنجی کافه‌بازار) داخل کد پخته شده‌اند؛ ASSETLINKS_JSON فقط رونویسی
//     اختیاری است (خالی/نامعتبر = همان پیش‌فرض واقعی سرو می‌شود).
//   • روی دامنه‌های قدیمی هیچ مداخله‌ای نیست (assetlinks موجود TWA فعلی حفظ می‌شود).
//   • هدف: APK جدید با launch URL = api.carservbook.ir بدون نوار آدرس fullscreen بماند.
//   • frontend: فقط هم‌نسخه‌سازی (APP_VERSION 2.11.4، version.json، CACHE v29).
//
// v2.11.3 چی تغییر کرد؟ — «گیت کاربران نصب‌کرده» در پل مهاجرت (بدون تغییر بک‌اند):
//   • مشکل: اپ نصب‌شده (TWA کافه بازار / PWA صفحهٔ اصلی) فقط برای دامنهٔ مبدأِ خودش
//     fullscreen است؛ پرش به api.carservbook.ir یعنی خروج از scope → اندروید صفحه
//     را در نمای مرورگر با «نوار آدرس» بالا نشان می‌دهد.
//   • راهکار: کاربر نصب‌کرده اصلاً منتقل نمی‌شود (سیگنال‌ها: display-mode
//     standalone/minimal-ui، navigator.standalone، referrer با android-app:).
//     اپش روی دامنهٔ فعلی سرو می‌شود که الان هم کامل کار می‌کند. مهاجرت فقط برای
//     کاربر مرورگر است. مسیر آینده: آپدیت APK بازار با آدرس جدید + assetlinks.json.
//
// v2.11.2 چی تغییر کرد؟ — صرفاً UI پروفایل (بدون هیچ تغییری در بک‌اند/کش/API/پل):
//   • پروفایل: «وارد شدی با:» ← «حساب کاربری:»
//   • پروفایل: خط جدید «نسخه:» بالای «آخرین همگام‌سازی موفق با سرور:» با شمارهٔ
//     نسخه به رنگ سبز (کلاس version-highlight، هم‌رنگ ایمیل/تأییدحساب)
//   • index.html: APP_VERSION → 2.11.2 + version.json → 2.11.2 (سازگار با
//     بنر به‌روزرسانی checkForUpdate) + sw.js: CACHE_NAME → v27 برای رسیدن
//     شِل جدید به کاربران نصب‌کرده.
//
// v2.11.1 چی تغییر کرد؟ — فاز B نسخهٔ ۲: «پل مهاجرت نرم» با انتقال توکن
//   • مشکل نسخهٔ 2.11.0: ریدایرکت سختِ همهٔ ناوبری‌ها یعنی کاربرِ نصب‌کردهٔ کافه
//     بازار با باز کردن آیکونش یک بار لاگین می‌خورد (توکن در localStorage و
//     دامنه‌محور است) و صفحهٔ خالیِ ورود برایش نگران‌کننده است. v2.11.1 این را به
//     «پل نرم» تبدیل می‌کند: شِلِ کامل روی دامنه‌های قدیمی هم سرو می‌شود (کاربر
//     هیچ‌چیز حس نمی‌کند) و اسنیپتِ head، بعد از تأیید دسترس‌پذیری دامنهٔ اصلی،
//     توکن + دادهٔ محلی + تنظیمات را با #hb= منتقل می‌کند → جابه‌جایی بدون لاگین
//     مجدد و بدون گم‌شدن تغییراتِ همگام‌نشده. اگر دامنهٔ اصلی در دسترس نبود
//     (آفلاین/شبکهٔ شل)، اپ قدیمی همان‌جا به کار عادی ادامه می‌دهد.
//   • ورکر: canonical redirect فقط برای /s/* و /api/google-login و
//     /api/google-callback (ناوبری سند) — توکن گوگل همیشه روی دامنهٔ اصلی
//     ثبت می‌شود؛ بقیهٔ ناوبری‌ها و fetch/XHR/beacon/preflight دست‌نخورده.
//   • index.html: «گیرندهٔ #hb=» در head (بازیابی state + پاک‌سازی فوری هش از
//     نوار آدرس) + پیام خوش‌آمد یک‌باره + APP_VERSION.
//   • sw.js: CACHE_NAME → v26؛ بلوک خودبازنشستگی v2.11.0 حذف شد — در دورهٔ گذار
//     SW دامنه‌های قدیمی باید برای فال‌بک آفلاین سالم بماند؛ بازنشستگی SWهای
//     قدیمی به نسخهٔ «پس از بازنشستگی دامنه» موکول شد.
//   • همهٔ اصلاحات امنیتی v2.10.3 (PBKDF2+salt، مقایسهٔ امنیت-زمانی، سقف بازیابی
//     رمز) و منطق ضدپاک‌سازی S-07 عیناً حفظ شده است.
//
// v2.11.0 چی تغییر کرد؟ — فاز B: تثبیت نهایی دامنهٔ اصلی api.carservbook.ir
//   • انتقال فراخوانی canonical redirect به «قبل از» شاخهٔ /api/ → از این به بعد
//     /api/google-login و /api/google-callback هم document ناوبری‌اند و به دامنهٔ
//     اصلی ریدایرکت می‌شوند؛ یعنی توکن گوگل همیشه روی api.carservbook.ir ثبت
//     می‌شود و مهاجرت کاربران قدیمی بی‌دردسر کامل می‌شود. تماس‌های fetch/XHR/
//     beacon/preflight (غیر ناوبری) همچنان ریدایرکت نمی‌شوند تا دورهٔ گذار سالم بماند.
//   • sw.js: CACHE_NAME → v25 + «خودبازنشستگی» سرویس‌ورکر روی دامنه‌های قدیمی
//     (پاک‌کردن همهٔ کش‌ها، unregister، رفرش پنجره‌های باز → ناوبری بعدی از شبکه
//     و از مسیر ریدایرکت ورکر عبور می‌کند).
//   • index.html: اسنیپت ریدایرکت اولیه در <head> (لایهٔ دوم دفاع برای HTML
//     قدیمی که احیاناً از کش روی دامنهٔ قدیمی سرو شود).
//   • همهٔ اصلاحات امنیتی v2.10.3 (PBKDF2+salt، مقایسهٔ امنیت-زمانی، سقف بازیابی
//     رمز، canonical redirect با no-store) عیناً حفظ شده است.
//
// v2.10.3 چی تغییر کرد؟ — تثبیت دامنهٔ مرجع + ارتقای امنیتی هش رمز
//   • canonical redirect: هر ناوبری سند (HTML) از carservbook.ir / www / workers.dev
//     به api.carservbook.ir هدایت می‌شود (302 + no-store) تا شِل و توکن همیشه
//     هم‌دامنه بمانند — ریشهٔ «بیرون‌افتادن از اکانت» ناسازگاری localStorage بین
//     دامنه‌ها بود. /api/* بدون ریدایرکت (CORS/OAuth سالم)؛ sw.js و manifest.json و
//     version.json هم navigation نیستند و دست‌نخورده می‌مانند (SWهای قدیمی سالم).
//   • امنیت: هش رمز از SHA-256 خام (بدون salt) به PBKDF2-SHA256 با salt تصادفی
//     ۱۶بایتی و مقایسهٔ امنیت-زمانی ارتقا یافت؛ هش‌های قدیمی در اولین ورود موفق
//     شفاف به فرمت جدید تبدیل می‌شوند (lazy migration).
//   • امنیت: بازیابی رمز محدود شد به ۵ تلاش در ۱۵ دقیقه برای هر ایمیل (KV).
// (ادامهٔ مستقیم v2.7.0؛ همهٔ امکانات قبلی سر جایشان است)
//
// v2.10.0 چی اضافه شد؟ — دامنهٔ API: api.carservbook.ir
//   • CORS روی /api/*: پاسخ به preflight (OPTIONS) + تزریق هدرهای
//     Access-Control روی همهٔ پاسخ‌های API (فقط برای دامنه‌های مجاز خودمان)
//   • کلاینت (index.html) از این نسخه API را روی https://api.carservbook.ir
//     صدا می‌زند؛ شِل/نمایش/لاگین/لینک‌های /s/ روی هر دامنه‌ای که ورکر
//     به آن وصل باشد کار می‌کنند (ورکر از هر دو دامنه سرو می‌کند)
//   • هدف: جداسازی آدرس API از دامنهٔ اصلی برای آزادی مهاجرت آینده
//
// v2.10.2 چی تغییر کرد؟ — اصلاح حلقهٔ بیرون‌افتادن از اکانت
//   • کلاینت: ناوبری ورود گوگل از API_BASE به مسیر نسبی برگشت؛ چون localStorage
//     به دامنه وابسته است، لاگین باید روی همان دامنه‌ای کامل شود که شِل از آن
//     باز شده وگرنه آن دامنه توکن ندارد و کاربر در هر بازشدن دوباره لاگین می‌کند.
//     منطق سرور و Console بدون تغییر (redirect_uri هر سه دامنه ثبت و تست شده).
//
// v2.10.1 چی تغییر کرد؟ — تجربهٔ طبیعی ورود گوگل
//   • کلاینت: سپر S-08 (probe شبکه + مودال «ورود با گوگل در دسترس نیست») حذف شد؛
//     دکمهٔ ورود مستقیم به API_BASE+'/api/google-login' می‌رود و گوگل با
//     prompt=select_account لیست اکانت‌ها را نشان می‌دهد. منطق سرور این مسیر
//     (googleLogin/googleCallback) هیچ تغییری نکرده است.
//   • CSP (_headers): connect-src دامنهٔ https://api.carservbook.ir اضافه شد تا
//     شِلِ بازشده از دامنه‌های دیگر هم بتواند API را صدا بزند.
//
// v2.9.0 چی اضافه شد؟ — «لینک اشتراکی مکانیک»
//   ۱) صاحب خودرو از داخل اپ یک لینک فقط-خواندنی می‌سازد:
//        https://carservbook.ir/s/<کلید ۳۲ کاراکتری هگز — ۱۲۸ بیت آنتروپی>
//      و برای مکانیک می‌فرستد. مکانیک بدون نصب اپ و بدون لاگین، مشخصات
//      عمومی + تاریخچهٔ سرویس همان خودرو را در صفحهٔ share.html می‌بیند.
//   ۲) ذخیرهٔ لینک‌ها در جدول جدید share_links روی همان D1 — در اولین
//      استفاده خودکار ساخته می‌شود (CREATE TABLE IF NOT EXISTS)؛ هیچ
//      دستور d1 execute و هیچ مهاجرتی لازم نیست.
//   ۳) حریم خصوصی: دادهٔ صفحه فقط name/model/year/plate/currentOdo +
//      سرویس‌ها (نام/یادداشت فنی/تاریخچه) است — بدون VIN، شماره موتور،
//      ایمیل و یادداشت خصوصی خودرو. لینک هر لحظه از اپ قابل حذف است.
//   ۴) سقف ۲۰ لینک فعال برای هر حساب + شمارش بازدید هر لینک.
//   ۵) پنل مدیریت: دو شمارندهٔ جدید (sharecreate / shareview).
//   ۶) کلاینت 2.9.0: کش آخرین آمار موفق «مدیریت» — بدون اینترنت/VPN
//      آخرین وضعیت آمار دیده می‌شود.
// ============================================================
// v2.8.0 چی اضافه شد؟
//   ۱) تله‌متری چهار قابلیت جدید کلاینت: qlog (ثبت سریع)، costview (گزارش
//      هزینه)، mechcopy (کپی خلاصهٔ مکانیک)، histsearch (جستجوی تاریخچه)
//      — فقط یک شمارندهٔ عددی در KV؛ هیچ دادهٔ شخصی به سرور نمی‌رود
//   ۲) نمایش همین شمارنده‌ها در /api/admin/stats (پنل مدیریت اپ)
//   ۳) توجه: خودِ گزارش هزینه و ثبت سریع کاملاً سمت کلاینت و آفلاین از روی
//      دفترچهٔ محلی کاربر محاسبه می‌شود — هیچ رکورد جدیدی به سرور نمی‌رود
//
// ┌────────────────── ارتقا از v2.7 به v2.8 (۳ دقیقه) ──────────────────┐
// │  ۱) wrangler.toml از v2.7 دست‌نخورده بماند (KV + کرن 30 5 * * * +     │
// │     D1 + assets همه داخلش هست) — هیچ تغییری لازم نیست.               │
// │  ۲) کل محتوای همین فایل را جایگزین کل index.js فعلی در پوشهٔ دیپلوی   │
// │     کنید (F:\CarService\my-worker\index.js).                          │
// │  ۳) سه فایل پوشهٔ public را هم جایگزین کنید: index.html ، sw.js ،      │
// │     version.json (بقیهٔ فایل‌های public دست نخورده می‌مانند).           │
// │  ۴) npx wrangler deploy — همان همیشه.                                │
// │  ✅ هیچ جدول D1 جدیدی ساخته نمی‌شود؛ هیچ Secret ای پاک نمی‌شود؛        │
// │     بایندینگ‌ها از wrangler.toml خوانده می‌شوند و دیگر نمی‌پرند.        │
// └────────────────────────────────────────────────────────────────────┘
// ============================================================

const VAPID_PUBLIC_KEY = 'BNdEMc736r2n-1cr4qby_P_OmI6sykpIoFQZ_JI9eM7CNfeGMjqEW1AmbCKXdiKfKCjrZULxpO48wg70jdsigdU';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 دقیقه

/* ---------- پیکربندی v2.7.0 ---------- */
const V27_ADMIN_EMAIL = 'carservbook@gmail.com';
const V27_KV = 'AUTOTRACK_V27';   // نام binding KV در تنظیمات Worker
const V27_LEAD_DAYS = 3;          // آستانهٔ «نزدیکه» در یادآور push سرور (روز)
const V27_KM_LEAD = 300;          // آستانهٔ «نزدیکه» کیلومتری

/* ---------- [v2.10.0] CORS برای API بین‌دامنه‌ای — فقط دامنه‌های خودمان ---------- */
const V210_API_ORIGINS = [
  'https://api.carservbook.ir',
  'https://carservbook.ir',
  'https://autotrack.carservbook.workers.dev',
  /* [v2.11.8] مسیر پشتیبان فیلاور API */
  'https://autotrack.carservbook.ir',
  /* [v2.11.10] نسخهٔ پشتیبان استاتیک روی GitHub Pages — sync از اورجین اضطراری */
  'https://carservbook.github.io'
];
function v210CorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const h = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (V210_API_ORIGINS.indexOf(origin) !== -1) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* [v2.11.4] Digital Asset Links برای دامنهٔ اصلی — پیش‌نیاز آپدیت APK کافه بازار:
       وقتی APK جدید با launch URL = api.carservbook.ir منتشر شود، کروم برای fullscreen
       ماندن TWA باید https://api.carservbook.ir/.well-known/assetlinks.json را با
       statement «android_app» (package_name + SHA-256 فینگرپرینت امضا) ببیند.
       فقط روی api.carservbook.ir سرو می‌شود — روی دامنه‌های قدیمی هیچ مداخله‌ای نیست
       تا assetlinks موجودِ TWA فعلی دست‌نخورده بماند. محتوای واقعی (پکیج
       ir.carservbook.app + فینگرپرینت امضا + statement بازار) داخل ASSETLINKS_DEFAULT
       پخته شده است؛ ASSETLINKS_JSON فقط رونویسی اختیاری است (خالی/نامعتبر = پیش‌فرض). */
    if (url.hostname === 'api.carservbook.ir' && url.pathname === '/.well-known/assetlinks.json') {
      return assetlinksResponse(env);
    }

    /* [v2.11.1] پل مهاجرت نرم — canonical redirect فقط برای /s/* و دو مسیر OAuth
       (ناوبری سند): توکن گوگل همیشه روی دامنهٔ اصلی ثبت می‌شود، حتی اگر لاگین از
       شِلِ کش‌شدهٔ دامنهٔ قدیمی شروع شده باشد. بقیهٔ ناوبری‌ها (شِل) روی همان دامنه
       سرو می‌شوند و اسنیپت head انتقال توکن را انجام می‌دهد. fetch/XHR/beacon/
       preflight هرگز ریدایرکت نمی‌شوند (دورهٔ گذار سالم بماند). */
    const v2103r = v2103CanonicalRedirect(request, url);
    if (v2103r) return v2103r;

    if (url.pathname.startsWith('/api/')) {
      /* [v2.10.0] CORS: پاسخ به preflight و تزریق هدرهای Access-Control روی همهٔ پاسخ‌های API */
      const cors = v210CorsHeaders(request);
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      let res;
      try {
        res = await handleApi(request, env, url);
      } catch (err) {
        res = json({ error: 'خطای سرور: ' + err.message }, 500);
      }
      const out = new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers });
      for (const key in cors) out.headers.set(key, cors[key]);
      return out;
    }

    /* [v2.11.1] فراخوانی پیش از شاخهٔ /api/ — فقط مسیرهای مجازِ فهرست‌شده در
       تابع ریدایرکت می‌شوند؛ شِلِ دامنه‌های قدیمی عمداً همین‌جا سرو می‌شود. */

    /* [v2.9.0] لینک اشتراکی مکانیک: /s/<کلید> → صفحهٔ عمومی share.html */
    const mShare = url.pathname.match(/^\/s\/([a-f0-9]{32})$/);
    if (mShare) {
      return env.ASSETS.fetch(new Request(new URL('/share.html', url.origin).toString()));
    }

    // هر آدرس دیگه‌ای -> همون فایل‌های استاتیک قبلی (index.html و...)
    const assetRes = await env.ASSETS.fetch(request);
    /* [v2.11.9] انعکاس Access-Control-Allow-Origin روی استاتیک‌ها فقط برای دامنه‌های
       خودمان — پیش‌نیاز «نجات شِل از مسیر پشتیبان» در سرویس‌ورکر: SW دامنهٔ اصلی وقتی
       شِل را از autotrack.carservbook.ir با mode:'cors' می‌گیرد، بدون این هدر پاسخ
       opaque می‌شود و مرورگر برای navigation آن را رد می‌کند. برای بازدید عادی
       (بدون هدر Origin) هیچ هدری اضافه نمی‌شود؛ برای دامنه‌های غریبه هم نه. */
    try {
      const org = request.headers.get('Origin');
      if (org && V210_API_ORIGINS.indexOf(org) !== -1 && !assetRes.headers.get('Access-Control-Allow-Origin')) {
        const out = new Response(assetRes.body, assetRes);
        out.headers.set('Access-Control-Allow-Origin', org);
        out.headers.set('Vary', 'Origin');
        return out;
      }
    } catch (eCors) { /* سرو عادی */ }
    return assetRes;
  },

  // این تابع رو Cloudflare خودش طبق زمان‌بندی Cron صدا می‌زنه
  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkAllUsersAndNotify(env));
  }
};

async function handleApi(request, env, url) {
  const path = url.pathname;

  if (path === '/api/register' && request.method === 'POST') return register(request, env);
  if (path === '/api/login' && request.method === 'POST') return login(request, env);
  if (path === '/api/logout' && request.method === 'POST') return logout(request, env);
  if (path === '/api/data' && request.method === 'GET') return getData(request, env);
  if (path === '/api/data' && request.method === 'POST') return saveData(request, env);
  if (path === '/api/data-beacon' && request.method === 'POST') return saveDataBeacon(request, env);
  if (path === '/api/google-login' && request.method === 'GET') return googleLogin(request, env);
  if (path === '/api/google-callback' && request.method === 'GET') return googleCallback(request, env, url);
  if (path === '/api/reset-password' && request.method === 'POST') return resetPassword(request, env);
  if (path === '/api/push-subscribe' && request.method === 'POST') return pushSubscribe(request, env);
  if (path === '/api/push-test' && request.method === 'POST') return pushTest(request, env);
  if (path === '/api/delete-account' && request.method === 'POST') return deleteAccount(request, env);
  if (path === '/api/me' && request.method === 'GET') return getMe(request, env);

  /* ---------- مسیرهای v2.7.0: تله‌متری / ادمین / پیام همگانی ---------- */
  if (path === '/api/ping' && request.method === 'POST') return handlePing(request, env);
  if (path === '/api/log-error' && request.method === 'POST') return handleLogError(request, env);
  if (path === '/api/broadcast' && request.method === 'GET') return handleBroadcastGet(env);
  if (path === '/api/admin/broadcast' && request.method === 'POST') return adminBroadcast(request, env);
  if (path === '/api/admin/stats' && request.method === 'GET') return adminStats(request, env);
  if (path === '/api/admin/errors' && request.method === 'GET') return adminErrors(request, env);

  /* ---------- مسیرهای v2.11.13: نجات داده — فقط ادمین ---------- */
  if (path === '/api/admin/find-data' && request.method === 'GET') return adminFindData(request, env);
  if (path === '/api/admin/get-backup' && request.method === 'GET') return adminGetBackup(request, env);
  if (path === '/api/admin/restore-backup' && request.method === 'POST') return adminRestoreBackup(request, env);

  /* ---------- مسیرهای v2.9.0: لینک اشتراکی مکانیک ---------- */
  if (path === '/api/share/create' && request.method === 'POST') return shareCreate(request, env);
  if (path === '/api/share/list' && request.method === 'POST') return shareList(request, env);
  if (path === '/api/share/revoke' && request.method === 'POST') return shareRevoke(request, env);
  if (path.indexOf('/api/share/') === 0 && request.method === 'GET') return shareView(request, env, url);

  /* ---------- مسیرهای v2.11.14: پوش چندبخشی ---------- */
  if (path === '/api/data-chunk' && request.method === 'POST') return dataChunkPut(request, env, url);
  if (path === '/api/data-chunk-final' && request.method === 'POST') return dataChunkFinal(request, env);

  return json({ error: 'مسیر پیدا نشد' }, 404);
}

/* ---------- ابزارهای کمکی ---------- */
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

/* ---------- [v2.10.3] هش رمز — PBKDF2-SHA256 با salt تصادفی و مقایسهٔ امنیت-زمانی ----------
   قبلی: SHA-256 خام بدون salt (آسیب‌پذیر به جدول رنگین‌کمان/پیش‌محاسبه).
   فرمت جدید ذخیره: pbkdf2$<iters>$<salt-hex>$<hash-hex>
   هش‌های قدیمی (۶۴ کاراکتر هگزِ SHA-256 خام) هنوز تایید می‌شوند و در اولین
   ورود/بازیابی موفق، شفاف به فرمت جدید ارتقا می‌یابند (lazy migration).
   نکتهٔ CPU: پلن رایگان Workers سقف ~۱۰ms دارد؛ ۱۰هزار تکرار PBKDF2 بومی ~۱-۲ms
   است و امن می‌ماند. روی پلن پرداختی می‌توان PBKDF2_ITERATIONS را بالا برد. */
const PBKDF2_ITERATIONS = 10000;
const PBKDF2_KEYLEN = 32; /* بایت */

function v2103Hex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function v2103RandomHex(nBytes) {
  const a = new Uint8Array(nBytes);
  crypto.getRandomValues(a);
  return v2103Hex(a.buffer);
}
function v2103ConstantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function pbkdf2Derive(password, saltHex, iterations) {
  const enc = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey('raw', enc, 'PBKDF2', false, ['deriveBits']);
  const saltBytes = new Uint8Array(saltHex.length / 2);
  for (let i = 0; i < saltBytes.length; i++) saltBytes[i] = parseInt(saltHex.substr(i * 2, 2), 16);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: iterations },
    key, PBKDF2_KEYLEN * 8
  );
  return v2103Hex(bits);
}
async function hashPassword(password) {
  const salt = v2103RandomHex(16);
  const hash = await pbkdf2Derive(password, salt, PBKDF2_ITERATIONS);
  return 'pbkdf2$' + PBKDF2_ITERATIONS + '$' + salt + '$' + hash;
}
async function verifyPassword(password, stored) {
  try {
    const s = String(stored || '');
    if (s.indexOf('pbkdf2$') === 0) {
      const parts = s.split('$');
      const iters = parseInt(parts[1], 10);
      const salt = parts[2], want = parts[3];
      if (!iters || !salt || !want) return { ok: false, legacy: false };
      const got = await pbkdf2Derive(password, salt, iters);
      return { ok: v2103ConstantTimeEqual(got, want), legacy: false };
    }
    /* فرمت قدیمی: SHA-256 خام */
    const legacy = v2103Hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)));
    return { ok: v2103ConstantTimeEqual(legacy, s), legacy: true };
  } catch (e) { return { ok: false, legacy: false }; }
}

/* ---------- [v2.11.1] پل مهاجرت نرم — canonical redirect محدودشده
   در دورهٔ گذار شِلِ کامل روی دامنه‌های قدیمی سرو می‌شود تا کاربران فعلی (نصب
   کافه بازار) هیچ‌چیز حس نکنند؛ خودِ شِل با اسنیپت head، توکن و داده را با #hb=
   به دامنهٔ اصلی منتقل می‌کند. ورکر فقط سه مسیرِ document را ریدایرکت می‌کند:
     ۱) /s/* — لینک‌های اشتراکی قدیمی (بدون نیاز به state محلی)
     ۲) /api/google-login و /api/google-callback — تا توکن گوگل همیشه روی
        دامنهٔ اصلی ثبت شود (حتی اگر لاگین از شِلِ کش‌شدهٔ قدیمی شروع شده باشد)
   بقیهٔ ناوبری‌ها + fetch/XHR/beacon/preflight: null (دست‌نخورده). */
/* [v2.11.4] Digital Asset Links — مقادیر واقعیِ تأییدشده به‌صورت پیش‌فرض پخته
   شده‌اند (پکیج ir.carservbook.app + فینگرپرینت SHA-256 کلید امضا) تا هیچ تنظیم
   اضافه‌ای لازم نباشد. ASSETLINKS_JSON در [vars] فقط برای رونویسی آینده است
   (مثلاً تعویض کلید امضا) — خالی/نامعتبر بودنش کاملاً بی‌خطر است.
   توجه: statement دوم با namespace «cafebazaar_twa» مال کروم نیست (کروم نادیده‌اش
   می‌گیرد چون فقط statementهای android_app را می‌خواند) و صرفاً طبق راهنمای
   انتشار TWA کافه‌بازار در همین فایل نگه داشته می‌شود. */
const ASSETLINKS_DEFAULT = JSON.stringify([
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "ir.carservbook.app",
      "sha256_cert_fingerprints": ["33:B5:66:B2:B1:00:74:5A:7D:ED:06:2C:C8:FE:CC:BA:75:07:F9:D0:11:50:FD:78:6D:6C:91:79:4F:02:E4:CA"]
    }
  },
  {
    "relation": ["check_validation"],
    "target": {
      "namespace": "cafebazaar_twa",
      "package_name": "ir.carservbook.app"
    }
  }
]);
function assetlinksResponse(env) {
  let body = null;
  try {
    const raw = env && typeof env.ASSETLINKS_JSON === 'string' ? env.ASSETLINKS_JSON.trim() : '';
    if (raw) {
      JSON.parse(raw); /* فقط اعتبارسنجی — ورودی نامعتبر یعنی خطای تایپ کاربر؛ قالب پیش‌فرض */
      body = raw;
    }
  } catch (e) { body = null; }
  if (!body) body = ASSETLINKS_DEFAULT;
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

function v2103CanonicalRedirect(request, url) {
  try {
    const host = url.hostname;
    if (host === 'api.carservbook.ir') return null;
    /* [v2.11.9] زیردامنهٔ پشتیبان فیلاور مسیر مستقل کامل است: OAuth هم روی خودش کامل
       می‌شود تا وقتی api.carservbook.ir موقتاً در دسترس نیست، ورود گوگل از مسیر پشتیبان
       هم کار کند. شرط فعال‌شدن: ثبت https://autotrack.carservbook.ir/api/google-callback
       در Google Console (Authorized redirect URIs). پل مهاجرت بعداً وقتی مسیر اصلی
       سالم شد، کاربر مرورگر را با #hb= برمی‌گرداند. */
    if (host === 'autotrack.carservbook.ir') return null;
    if (host !== 'carservbook.ir' && host !== 'www.carservbook.ir' && host !== 'autotrack.carservbook.workers.dev') return null;
    const accept = String(request.headers.get('Accept') || '');
    const isNav = request.mode === 'navigate' || accept.indexOf('text/html') !== -1;
    if (!isNav) return null;
    const p = url.pathname;
    const isShare = p === '/s' || p.indexOf('/s/') === 0;
    const isOAuthDoc = p === '/api/google-login' || p === '/api/google-callback';
    if (!isShare && !isOAuthDoc) return null;
    const target = new URL(url.toString());
    target.hostname = 'api.carservbook.ir';
    target.protocol = 'https:';
    return new Response(null, { status: 302, headers: { 'Location': target.toString(), 'Cache-Control': 'no-store' } });
  } catch (e) { return null; }
}

function makeToken() {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
}

function makeRecoveryCode() {
  // e.g. XKQP-7T2M-9RZL — easy to read/write down, hard to guess
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion
  const buf = new Uint8Array(12);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < 12; i++) {
    out += chars[buf[i] % chars.length];
    if (i % 4 === 3 && i !== 11) out += '-';
  }
  return out;
}

async function authenticate(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  const session = await env.DB.prepare('SELECT user_id FROM sessions WHERE token=?').bind(token).first();
  return session ? session.user_id : null;
}

/* ================================================================
   ابزارهای v2.7.0 (تله‌متری / ادمین / state) — روی KV با نام AUTOTRACK_V27
   ================================================================ */
function v27KV(env) {
  try { return env ? env[V27_KV] : null; } catch (e) { return null; }
}
function v27Day() {
  return new Date().toISOString().slice(0, 10);
}
function v27GetAuth(request) {
  try {
    const h = request.headers.get('Authorization') || '';
    return h.indexOf('Bearer ') === 0 ? h.slice(7).trim() : '';
  } catch (e) { return ''; }
}
async function v27Hash(str) {
  const data = new TextEncoder().encode(String(str));
  const buf = await crypto.subtle.digest('SHA-256', data);
  const arr = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < arr.length; i++) hex += ('0' + arr[i].toString(16)).slice(-2);
  return hex;
}
async function v27ReadInt(kv, key) {
  if (!kv) return 0;
  try { const v = await kv.get(key); return v ? (parseInt(v, 10) || 0) : 0; } catch (e) { return 0; }
}
async function v27Incr(kv, key, ttlDays) {
  if (!kv) return;
  try {
    const cur = await kv.get(key);
    const n = (cur ? (parseInt(cur, 10) || 0) : 0) + 1;
    const opts = ttlDays ? { expirationTtl: ttlDays * 86400 + 3600 } : {};
    await kv.put(key, String(n), opts);
  } catch (e) {}
}
async function v27IncrBy(kv, key, delta) {
  if (!kv) return;
  try {
    const cur = await kv.get(key);
    let n = (cur ? (parseInt(cur, 10) || 0) : 0) + delta;
    if (n < 0) n = 0;
    await kv.put(key, String(n));
  } catch (e) {}
}

/* ثبت یک ورود/ثبت‌نام موفق در شمارنده‌های آماری + ثبت توکن ادمین
   kind = 'login' | 'register' | 'google' */
async function v27NoteLogin(env, token, email, kind) {
  const kv = v27KV(env);
  if (!kv) return;
  try {
    const day = v27Day();
    const h = await v27Hash(token);
    if (kind === 'register') {
      await v27Incr(kv, 'totalAccounts');
      await v27Incr(kv, 'newAccounts:' + day, 45);
    } else {
      await v27Incr(kv, 'logins:' + day, 45);
      if (kind === 'google') await v27Incr(kv, 'loginsG:' + day, 45);
    }
    const seenRaw = await kv.get('seen:' + day);
    const seen = seenRaw ? JSON.parse(seenRaw) : [];
    if (Array.isArray(seen) && seen.indexOf(h) === -1) {
      seen.push(h);
      await kv.put('seen:' + day, JSON.stringify(seen), { expirationTtl: 40 * 86400 });
    }
    if (String(email || '').toLowerCase() === V27_ADMIN_EMAIL) {
      await kv.put('admin:' + h, '1', { expirationTtl: 35 * 86400 });
    }
  } catch (e) {}
}

/* گارد ادمین — دو مسیر:
   ۱) کش KV (ثبت‌شده هنگام ورود موفقِ ایمیل ادمین)
   ۲) روش اصلی: ایمیلِ صاحبِ نشست از D1 — با ورود با گوگل هم کار می‌کند */
async function v27IsAdmin(request, env, kv) {
  const tok = v27GetAuth(request);
  if (!tok) return false;
  if (kv) {
    try { if (await kv.get('admin:' + await v27Hash(tok))) return true; } catch (e) {}
  }
  try {
    const row = await env.DB.prepare(
      'SELECT u.email FROM sessions s INNER JOIN users u ON u.id = s.user_id WHERE s.token=?'
    ).bind(tok).first();
    if (row && String(row.email || '').toLowerCase() === V27_ADMIN_EMAIL) return true;
  } catch (e) {}
  return false;
}

/* صفحهٔ خطای state منقضی (جایگزین جریان ورود گوگل) */
function v27State400Page() {
  const html = '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1"><title>نشست ورود منقضی شد</title></head>'
    + '<body style="margin:0;font-family:Tahoma,sans-serif;background:#111417;color:#e8eaed;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;direction:rtl">'
    + '<div style="padding:24px"><h2 style="margin:0 0 10px;font-size:20px">نشست ورود منقضی شده</h2>'
    + '<p style="color:#9aa0a6;margin:0 0 20px;line-height:1.9">این نشست ورود معتبر شناخته نشد.<br>به اپ برگرد و دوباره «ورود با گوگل» را بزن.</p>'
    + '<button onclick="location.href=\'/\'" style="background:#4c8dff;color:#fff;border:0;border-radius:10px;padding:10px 28px;font-size:15px">بازگشت به اپ</button>'
    + '</div></body></html>';
  return new Response(html, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

/* ---------- ثبت‌نام ---------- */
async function register(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !email.includes('@')) return json({ error: 'ایمیل معتبر نیست' }, 400);
  if (password.length < 6) return json({ error: 'رمز عبور باید حداقل ۶ کاراکتر باشه' }, 400);
  /* [v2.11.14] سقف روزانهٔ ثبت‌نام per-IP — ضد اسپم */
  if (!(await rateLimitIP(v27KV(env), request, 'reg', 30))) return json({ error: 'تعداد ثبت‌نام از این آی‌پی بیش از حد مجاز است' }, 429);

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
  if (existing) return json({ error: 'این ایمیل قبلاً ثبت شده، وارد شو' }, 400);

  const id = crypto.randomUUID();
  const hash = await hashPassword(password);
  const recoveryCode = makeRecoveryCode();
  const recoveryHash = await hashPassword(recoveryCode);
  await env.DB.prepare('INSERT INTO users (id,email,password_hash,recovery_hash,created_at,verified) VALUES (?,?,?,?,?,0)')
    .bind(id, email, hash, recoveryHash, Date.now()).run();

  const token = makeToken();
  await env.DB.prepare('INSERT INTO sessions (token,user_id,created_at) VALUES (?,?,?)')
    .bind(token, id, Date.now()).run();

  /* [v2.7.0] آمار: حساب جدید + فعال‌بودن امروز */
  await v27NoteLogin(env, token, email, 'register');

  return json({ token, email, recoveryCode, verified: false });
}

/* ---------- ورود (با محدودیت تلاش‌های ناموفق) ---------- */
async function login(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!email) return json({ error: 'ایمیل یا رمز عبور اشتباهه' }, 400);

  const attempt = await env.DB.prepare('SELECT count, locked_until FROM login_attempts WHERE email=?').bind(email).first();
  const now = Date.now();
  if (attempt && attempt.locked_until && attempt.locked_until > now) {
    const minutesLeft = Math.ceil((attempt.locked_until - now) / 60000);
    return json({ error: `چندبار رمز اشتباه وارد شده. حدود ${minutesLeft} دقیقه‌ی دیگه دوباره امتحان کن` }, 429);
  }

  const user = await env.DB.prepare('SELECT id,password_hash,verified FROM users WHERE email=?').bind(email).first();
  /* [v2.10.3] تایید رمز با PBKDF2 (یا هش قدیمی) + ارتقای شفاف به فرمت جدید */
  let passwordOk = false;
  if (user && user.password_hash && password) {
    const v = await verifyPassword(password, user.password_hash);
    passwordOk = v.ok;
    if (v.ok && v.legacy) {
      try {
        const up = await hashPassword(password);
        await env.DB.prepare('UPDATE users SET password_hash=? WHERE id=?').bind(up, user.id).run();
      } catch (e) {}
    }
  }

  if (!user || !user.password_hash || !passwordOk) {
    // فقط وقتی کاربر واقعاً موجوده و پسورد داره (نه حساب گوگلی)، شمارشگر رو زیاد کن
    if (user && user.password_hash) {
      const newCount = (attempt ? attempt.count : 0) + 1;
      const lockedUntil = newCount >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_MS : null;
      await env.DB.prepare(
        `INSERT INTO login_attempts (email,count,locked_until) VALUES (?,?,?)
         ON CONFLICT(email) DO UPDATE SET count=excluded.count, locked_until=excluded.locked_until`
      ).bind(email, lockedUntil ? 0 : newCount, lockedUntil).run();
    }
    if (user && !user.password_hash) return json({ error: 'این حساب با گوگل ساخته شده. از دکمه ورود با گوگل استفاده کن' }, 400);
    return json({ error: 'ایمیل یا رمز عبور اشتباهه' }, 400);
  }

  // ورود موفق -> شمارشگر تلاش ناموفق پاک بشه
  if (attempt) await env.DB.prepare('DELETE FROM login_attempts WHERE email=?').bind(email).run();

  const token = makeToken();
  await env.DB.prepare('INSERT INTO sessions (token,user_id,created_at) VALUES (?,?,?)')
    .bind(token, user.id, now).run();

  /* [v2.7.0] آمار: ورود امروز + اگر ایمیل ادمین بود، ثبت توکن ادمین */
  await v27NoteLogin(env, token, email, 'login');

  return json({ token, email, verified: !!user.verified });
}

/* ---------- خروج ---------- */
async function logout(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token=?').bind(token).run();
  return json({ ok: true });
}

/* ---------- اطلاعات کاربر فعلی ---------- */
async function getMe(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  const user = await env.DB.prepare('SELECT email, verified, created_at FROM users WHERE id=?').bind(userId).first();
  if (!user) return json({ error: 'حساب پیدا نشد' }, 404);
  return json({ email: user.email, verified: !!user.verified, createdAt: user.created_at });
}

/* ---------- حذف کامل حساب کاربری ---------- */
async function deleteAccount(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);

  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(userId),
    env.DB.prepare('DELETE FROM user_data WHERE user_id=?').bind(userId),
    env.DB.prepare('DELETE FROM push_subscriptions WHERE user_id=?').bind(userId),
    env.DB.prepare('DELETE FROM notify_state WHERE user_id=?').bind(userId),
    env.DB.prepare('DELETE FROM users WHERE id=?').bind(userId)
  ]);

  /* [v2.7.0] آمار: کم‌شدن یک حساب */
  await v27IncrBy(v27KV(env), 'totalAccounts', -1);

  return json({ ok: true });
}

/* ---------- بازیابی رمز عبور با کد بازیابی ---------- */
async function resetPassword(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const recoveryCode = String(body.recoveryCode || '').trim().toUpperCase();
  const newPassword = String(body.newPassword || '');

  if (!email) return json({ error: 'ایمیل رو وارد کن' }, 400);
  if (!recoveryCode) return json({ error: 'کد بازیابی رو وارد کن' }, 400);
  if (newPassword.length < 6) return json({ error: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشه' }, 400);

  /* [v2.10.3] سقف تلاش بازیابی: ۵ بار در ۱۵ دقیقه برای هر ایمیل (KV) */
  const kvRp = v27KV(env);
  if (kvRp) {
    try {
      const rk = 'rp:' + email;
      const c = parseInt((await kvRp.get(rk)) || '0', 10) || 0;
      if (c >= 5) return json({ error: 'تلاش‌های بازیابی زیاد شده — حدود ۱۵ دقیقه بعد دوباره امتحان کن' }, 429);
      await kvRp.put(rk, String(c + 1), { expirationTtl: 900 });
    } catch (e) {}
  }

  const user = await env.DB.prepare('SELECT id,recovery_hash FROM users WHERE email=?').bind(email).first();
  if (!user || !user.recovery_hash) return json({ error: 'ایمیل یا کد بازیابی اشتباهه' }, 400);

  /* [v2.10.3] تایید کد بازیابی (فرمت جدید یا قدیمی) با مقایسهٔ امنیت-زمانی */
  const v = await verifyPassword(recoveryCode, user.recovery_hash);
  if (!v.ok) return json({ error: 'ایمیل یا کد بازیابی اشتباهه' }, 400);

  const newHash = await hashPassword(newPassword);
  /* کد بازیابی هم به فرمت جدید ارتقا می‌یابد (کد صحیح در دسترس است) */
  const newRecHash = await hashPassword(recoveryCode);
  await env.DB.prepare('UPDATE users SET password_hash=?, recovery_hash=? WHERE id=?').bind(newHash, newRecHash, user.id).run();
  // برای امنیت، همه‌ی نشست‌های قبلی این کاربر باطل بشن
  await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(user.id).run();
  /* [v2.10.3] شمارشگر تلاش بازیابی پاک شود */
  try { if (kvRp) await kvRp.delete('rp:' + email); } catch (e) {}

  return json({ ok: true });
}

/* ---------- دریافت اطلاعات کاربر ---------- */
async function getData(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  const row = await env.DB.prepare('SELECT data, updated_at FROM user_data WHERE user_id=?').bind(userId).first();
  return json({ data: row ? row.data : null, updatedAt: row ? row.updated_at : 0 });
}

/* ---------- ذخیره اطلاعات کاربر ---------- */
async function saveData(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  /* [v2.11.14] بدنهٔ فشردهٔ کلاینت (X-Payload-Encoding: gzip) → باز شدن قبل از پردازش */
  let body;
  if (request.headers.get('X-Payload-Encoding') === 'gzip') {
    try {
      body = JSON.parse(await gunzipToText(new Uint8Array(await request.arrayBuffer())));
    } catch (e) { return json({ error: 'بدنهٔ فشرده قابل خواندن نیست' }, 400); }
  } else {
    body = await request.json().catch(() => ({}));
  }
  const r = await saveDataForUser(env, userId, body.data, 'post', body && body.confirmWipe === true);
  if (r.guarded) {
    return json({ ok: false, error: 'پاک‌شدن کامل داده‌ها نیاز به تأیید دارد', code: 'empty-wipe-guard', needConfirm: true }, 409);
  }
  return json({ ok: true, updatedAt: r.updatedAt });
}

/* [v2.11.13] سپر ایمنی داده — سه لایه:
   ۱) بکاپ خودکار: قبل از هر بازنویسیِ «کاهش‌محتوا» (کاهش تعداد خودرو یا نصف‌شدن ناگهانی
      حجم داده)، نسخهٔ قبلی در data_backups نگه داشته می‌شود (۳ نسخهٔ آخر هر کاربر).
   ۲) گارد پاک‌شدگی: نسخهٔ غیرخالی سرور هرگز با «حالت خالی» جایگزین نمی‌شود، مگر با
      confirmWipe:true از درخواست عادی — بیکون هرگز اجازهٔ پاک‌کردن ندارد.
   ۳) بکاپ/گارد هرگز نباید ذخیرهٔ عادی را بشکنند — خطاها قورت داده می‌شوند. */
async function saveDataForUser(env, userId, data, source, confirmWipe) {
  let dataStr;
  try { dataStr = JSON.stringify(data || {}); } catch (e) { dataStr = '{}'; }
  const now = Date.now();

  /* شمارش خودروهای نسخهٔ جدید و نسخهٔ فعلی سرور */
  let newCars = null;
  try { const o = JSON.parse(dataStr); if (o && Array.isArray(o.cars)) newCars = o.cars.length; } catch (e) {}
  const existing = await env.DB.prepare('SELECT data, updated_at FROM user_data WHERE user_id=?').bind(userId).first();
  let oldCars = null, oldStr = null, oldUpdatedAt = 0;
  if (existing && existing.data) {
    oldStr = existing.data;
    oldUpdatedAt = existing.updated_at || 0;
    try { const o = JSON.parse(oldStr); if (o && Array.isArray(o.cars)) oldCars = o.cars.length; } catch (e) {}
  }

  /* لایهٔ ۲ — گارد پاک‌شدگی: خالیِ واردشده روی غیرخالی ممنوع (مگر حذفِ آگاهانه) */
  if (oldCars !== null && oldCars > 0 && newCars === 0) {
    const wipeAllowed = (source !== 'beacon') && confirmWipe === true;
    if (!wipeAllowed) {
      try { console.log('saveDataForUser: empty-wipe-guard fired | user=', userId, '| source=', source || 'post'); } catch (e) {}
      return { guarded: true };
    }
  }

  /* لایهٔ ۱ — بکاپ خودکار در گذارهای کاهش‌محتوا */
  try {
    const oldLen = oldStr ? oldStr.length : 0;
    const newLen = dataStr.length;
    const carDrop = (oldCars !== null && newCars !== null && newCars < oldCars);
    const sizeCollapse = (oldLen > 2000 && newLen < oldLen / 2 && newCars !== 0);
    if (oldStr && (carDrop || sizeCollapse) && dataStr !== oldStr) {
      await backupUserData(env, userId, oldStr, oldUpdatedAt);
    }
  } catch (e) { /* بکاپ هرگز نباید ذخیرهٔ اصلی را بشکند */ }

  await env.DB.prepare(
    `INSERT INTO user_data (user_id,data,updated_at) VALUES (?,?,?)
     ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`
  ).bind(userId, dataStr, now).run();
  return { ok: true, updatedAt: now };
}

/* [v2.11.13] جدول بکاپ — lazy migration مثل share_links؛ فقط ۳ نسخهٔ آخر هر کاربر */
let backupTableReady = false;
async function backupEnsureTable(env) {
  if (backupTableReady) return;
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS data_backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      data TEXT NOT NULL,
      cars INTEGER,
      created_at INTEGER
    )`
  ).run();
  try {
    await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_databackups_user ON data_backups(user_id, id)').run();
  } catch (e) {}
  backupTableReady = true;
}
async function backupUserData(env, userId, dataStr, ts) {
  await backupEnsureTable(env);
  let cars = null;
  try { const o = JSON.parse(dataStr); if (o && Array.isArray(o.cars)) cars = o.cars.length; } catch (e) {}
  await env.DB.prepare('INSERT INTO data_backups (user_id,data,cars,created_at) VALUES (?,?,?,?)')
    .bind(userId, dataStr, cars, ts || Date.now()).run();
  await env.DB.prepare(
    'DELETE FROM data_backups WHERE user_id=? AND id NOT IN (SELECT id FROM data_backups WHERE user_id=? ORDER BY id DESC LIMIT 3)'
  ).bind(userId, userId).run();
}

/* ---------- ذخیره از طریق sendBeacon (موقع بسته‌شدن اپ) — بدون هدر Authorization ---------- */
async function saveDataBeacon(request, env) {
  const body = await request.json().catch(() => ({}));
  const token = String(body.token || '').trim();
  if (!token) return json({ error: 'توکن ارسال نشده' }, 401);
  const session = await env.DB.prepare('SELECT user_id FROM sessions WHERE token=?').bind(token).first();
  if (!session) return json({ error: 'نشست معتبر نیست' }, 401);
  /* [v2.11.13] بیکون هرگز اجازهٔ پاک‌کردن دادهٔ غیرخالی سرور را ندارد */
  const r = await saveDataForUser(env, session.user_id, body.data, 'beacon', false);
  if (r.guarded) return json({ error: 'بیکون اجازهٔ پاک‌کردن داده ندارد', code: 'empty-wipe-guard' }, 409);
  return json({ ok: true, updatedAt: r.updatedAt });
}


/* ================= [v2.11.14] پوش مقاوم — gzip + چندبخشی ================= */
async function rateLimitIP(kv, request, kind, cap) {
  if (!kv) return true;
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const key = 'rl:' + v27Day() + ':' + kind + ':' + ip;
    const cur = parseInt((await kv.get(key)) || '0', 10) || 0;
    if (cur >= cap) return false;
    await kv.put(key, String(cur + 1), { expirationTtl: 2 * 86400 });
    return true;
  } catch (e) { return true; }
}
async function gunzipToText(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return await new Response(stream).text();
}
async function dataChunksEnsureTable(env) {
  await env.DB.prepare(
    'CREATE TABLE IF NOT EXISTS data_chunks (user_id TEXT NOT NULL, uid TEXT NOT NULL, seq INTEGER NOT NULL, total INTEGER NOT NULL, payload BLOB NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (user_id, uid, seq))'
  ).run();
}
async function dataChunksCleanup(env) {
  try {
    await env.DB.prepare('DELETE FROM data_chunks WHERE created_at < ?').bind(Date.now() - 24 * 3600 * 1000).run();
  } catch (e) {}
}
async function dataChunkPut(request, env, url) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  const uid = String(url.searchParams.get('uid') || '');
  const i = parseInt(url.searchParams.get('i') || '', 10);
  const n = parseInt(url.searchParams.get('n') || '', 10);
  if (!/^[0-9a-f]{8,64}$/.test(uid)) return json({ error: 'شناسهٔ ارسال نامعتبر است' }, 400);
  if (!Number.isInteger(n) || n < 1 || n > 64) return json({ error: 'تعداد بخش نامعتبر است' }, 400);
  if (!Number.isInteger(i) || i < 0 || i >= n) return json({ error: 'شمارهٔ بخش نامعتبر است' }, 400);
  const buf = new Uint8Array(await request.arrayBuffer());
  if (buf.length === 0 || buf.length > 300 * 1024) return json({ error: 'حجم بخش نامعتبر است' }, 413);
  await dataChunksEnsureTable(env);
  await env.DB.prepare(
    'INSERT INTO data_chunks (user_id, uid, seq, total, payload, created_at) VALUES (?,?,?,?,?,?) ' +
    'ON CONFLICT(user_id, uid, seq) DO UPDATE SET payload=excluded.payload, created_at=excluded.created_at'
  ).bind(userId, uid, i, n, buf, Date.now()).run();
  if (Math.random() < 0.05) await dataChunksCleanup(env);
  return json({ ok: true, received: i });
}
async function dataChunkFinal(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  const body = await request.json().catch(() => ({}));
  const uid = String(body.uid || '');
  const n = parseInt(body.n, 10);
  if (!/^[0-9a-f]{8,64}$/.test(uid)) return json({ error: 'شناسهٔ ارسال نامعتبر است' }, 400);
  if (!Number.isInteger(n) || n < 1 || n > 64) return json({ error: 'تعداد بخش نامعتبر است' }, 400);
  await dataChunksEnsureTable(env);
  const rows = await env.DB.prepare(
    'SELECT seq, payload FROM data_chunks WHERE user_id=? AND uid=? ORDER BY seq'
  ).bind(userId, uid).all();
  const parts = (rows && rows.results) ? rows.results : [];
  if (parts.length !== n) {
    return json({ error: 'بخش‌های ناقص — دوباره تلاش می‌شود', have: parts.length, need: n }, 409);
  }
  let total = 0;
  for (const p of parts) total += (p.payload && p.payload.length) || 0;
  if (total > 12 * 1024 * 1024) {
    await env.DB.prepare('DELETE FROM data_chunks WHERE user_id=? AND uid=?').bind(userId, uid).run();
    return json({ error: 'حجم داده بیش از حد مجاز است' }, 413);
  }
  const all = concatBytes(...parts.map(p => new Uint8Array(p.payload)));
  let obj = null;
  try {
    obj = JSON.parse(await gunzipToText(all));
  } catch (e) {
    await env.DB.prepare('DELETE FROM data_chunks WHERE user_id=? AND uid=?').bind(userId, uid).run();
    return json({ error: 'دادهٔ فشرده قابل خواندن نیست' }, 400);
  }
  /* [v2.11.14] گارد اول، حذفِ بخش‌ها بعد از موفقیت — تا تلاش مجددِ confirmWipe بخش داشته باشد */
  const r = await saveDataForUser(env, userId, obj ? obj.data : undefined, 'post', body && body.confirmWipe === true);
  if (r.guarded) {
    return json({ ok: false, error: 'پاک‌شدن کامل داده‌ها نیاز به تأیید دارد', code: 'empty-wipe-guard', needConfirm: true }, 409);
  }
  await env.DB.prepare('DELETE FROM data_chunks WHERE user_id=? AND uid=?').bind(userId, uid).run();
  await dataChunksCleanup(env);
  return json({ ok: true, updatedAt: r.updatedAt });
}
/* ================= پایان پوش مقاوم ================= */

/* ---------- ورود با گوگل: قدم ۱ - انتقال به صفحه‌ی گوگل ---------- */
async function googleLogin(request, env) {
  if (!env.GOOGLE_CLIENT_ID) return json({ error: 'ورود با گوگل هنوز تنظیم نشده (GOOGLE_CLIENT_ID خالیه)' }, 500);
  const clientId = String(env.GOOGLE_CLIENT_ID).trim();
  const redirectUri = new URL('/api/google-callback', request.url).toString();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email',
    prompt: 'select_account'
  });

  /* [v2.7.0] گارد state ضد CSRF: کلاینتِ 2.7.0 یک state تصادفی می‌فرستد؛
     اینجا ثبتش می‌کنیم (TTL ۱۰ دقیقه) و همان را به گوگل پاس می‌دهیم.
     کلاینت‌های قدیمی state نمی‌فرستند → هیچ تغییری برایشان رخ نمی‌دهد. */
  const st = String(new URL(request.url).searchParams.get('state') || '');
  if (/^[a-f0-9]{16,64}$/.test(st)) {
    const kv = v27KV(env);
    if (kv) {
      /* [v2.11.12] آدرس برگشتِ شِل (back) داخل رکورد state ذخیره می‌شود تا در callback
         توکن/خطا به همان شِل با #hb= برگردد. مقدار '1' یعنی مسیر قدیمی (ثبت محلی). */
      const backStored = v2112NormalizeBack(new URL(request.url).searchParams.get('back')) || '1';
      try { await kv.put('state:' + st, backStored, { expirationTtl: 600 }); } catch (e) {}
      params.set('state', st);
    }
  }

  return Response.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params.toString(), 302);
}

/* ---------- ورود با گوگل: قدم ۲ - بازگشت از گوگل و ساخت نشست ---------- */
async function googleCallback(request, env, url) {
  const kv = v27KV(env);

  /* [v2.7.0] اعتبارسنجی state — بخشنده: فقط وقتی state در درخواست هست چک می‌شود.
     state باید در KV ثبت‌شده و منقضی‌نشده باشد؛ مصرف‌شدنی است (یک‌بارمصرف). */
  let stateBack = null; /* [v2.11.12] مقصد برگشتِ شِل (از رکورد state) */
  try {
    const stc = String(url.searchParams.get('state') || '');
    if (kv && stc) {
      const found = await kv.get('state:' + stc);
      if (found) {
        stateBack = v2112NormalizeBack(found);
        try { await kv.delete('state:' + stc); } catch (e2) {}
      } else {
        return v27State400Page();
      }
    }
  } catch (e) {}

  /* [v2.7.0] آمار: تلاش ورود گوگل (موفق یا ناموفق) */
  await v27Incr(kv, 'oauth:' + v27Day(), 45);

  const code = url.searchParams.get('code');
  if (!code) return htmlBounce(request, null, 'ورود با گوگل لغو شد', stateBack);

  const redirectUri = new URL('/api/google-callback', request.url).toString();
  const clientId = String(env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = String(env.GOOGLE_CLIENT_SECRET || '').trim();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  const tokenData = await tokenRes.json().catch(() => ({}));
  if (!tokenData.id_token) {
    console.log('googleCallback: token exchange failed, status=', tokenRes.status, 'response=', JSON.stringify(tokenData));
    return htmlBounce(request, null, 'خطا در دریافت اطلاعات از گوگل', stateBack);
  }

  let payload;
  try {
    const b64 = tokenData.id_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    payload = JSON.parse(atob(b64));
  } catch (e) {
    return htmlBounce(request, null, 'خطا در پردازش پاسخ گوگل', stateBack);
  }
  const email = String(payload.email || '').toLowerCase();
  if (!email) return htmlBounce(request, null, 'ایمیل از گوگل دریافت نشد', stateBack);

  let user = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
  let userId;
  if (user) {
    userId = user.id;
    // اگه قبلاً با ایمیل/رمز ساخته شده بود، حالا که گوگل مالکیت ایمیل رو تایید کرده، علامت بزن
    await env.DB.prepare('UPDATE users SET verified=1 WHERE id=?').bind(userId).run();
  } else {
    userId = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO users (id,email,password_hash,created_at,verified) VALUES (?,?,?,?,1)')
      .bind(userId, email, '', Date.now()).run();
  }

  const token = makeToken();
  await env.DB.prepare('INSERT INTO sessions (token,user_id,created_at) VALUES (?,?,?)')
    .bind(token, userId, Date.now()).run();

  /* [v2.7.0] آمار: ورود موفق گوگل (googleLoginsToday + loginsToday + فعال‌بودن)
     + اگر ایمیلِ ادمین بود، توکنش ثبت می‌شود تا پنل مدیریت بدون ورودِ مجدد باز شود */
  await v27NoteLogin(env, token, email, 'google');

  return htmlBounce(request, { token, email }, null, stateBack);
}

/* [v2.11.12] encode بروی #hb= — همان قالبی که گیرندهٔ head شِل‌ها می‌خواند */
function v2112B64Url(s) {
  const bytes = new TextEncoder().encode(String(s));
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
/* [v2.11.12] allowlist سختِ مقصدهای برگشت — ضد open-redirect */
const V2112_BACK_URLS = [
  'https://api.carservbook.ir/',
  'https://autotrack.carservbook.ir/',
  'https://carservbook.github.io/Autotrack/'
];
function v2112NormalizeBack(raw) {
  try {
    let s = String(raw || '').trim();
    if (!s) return null;
    if (!/\/$/.test(s)) s += '/';
    return V2112_BACK_URLS.indexOf(s) !== -1 ? s : null;
  } catch (e) { return null; }
}
/* یه صفحه‌ی خیلی کوتاه که توکن رو ذخیره می‌کنه و برمی‌گرده به صفحه‌ی اصلی اپ */
function htmlBounce(request, auth, error, back) {
  const origin = new URL('/', request.url).toString();
  /* [v2.11.12] back مجاز و بین‌دامنه‌ای → توکن/خطا با #hb= به شِلِ مبدأ برمی‌گردد
     (گیرندهٔ #hb= از v2.11.1 در head همهٔ شِل‌هاست). back هم‌اورجین/نامعتبر/قدیمی
     (مقدار '1' یا بدون state) = همان مسیر قدیمی: ثبت localStorage روی همین دامنه. */
  if (back && back !== origin) {
    if (auth) {
      const frag = v2112B64Url(JSON.stringify({ v: 1, t: auth.token, e: auth.email, vf: '1' }));
      return v2112HbPage(back + '#hb=' + frag, 'در حال ورود…');
    }
    const frag2 = v2112B64Url(JSON.stringify({ v: 1, err: String(error || 'خطای ورود با گوگل').slice(0, 200) }));
    return v2112HbPage(back + '#hb=' + frag2, 'بازگشت به اپ…');
  }
  const script = auth
    ? `localStorage.setItem('carlog:token', ${JSON.stringify(auth.token)});
       localStorage.setItem('carlog:email', ${JSON.stringify(auth.email)});
       localStorage.setItem('carlog:verified', '1');
       location.replace(${JSON.stringify(origin)});`
    : `sessionStorage.setItem('carlog:loginError', ${JSON.stringify(error || 'خطای ورود')});
       location.replace(${JSON.stringify(origin)});`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#111417;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh">
  <div>در حال ورود...</div>
  <script>${script}</script>
  </body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

/* [v2.11.12] صفحهٔ واسطهٔ برگشت بین‌دامنه‌ای — فقط location.replace به شِل مبدأ با #hb= */
function v2112HbPage(url, label) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#111417;color:#eee;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh">
  <div>${label}</div>
  <script>try{location.replace(${JSON.stringify(url)});}catch(e){location.href=${JSON.stringify(url)};}</script>
  </body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

/* ================================================================
   نوتیفیکیشن پس‌زمینه — ثبت اشتراک، تست دستی، و بررسی دوره‌ای خودکار
   ================================================================ */

async function pushSubscribe(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  const body = await request.json().catch(() => ({}));
  const { endpoint, p256dh, auth } = body;
  if (!endpoint || !p256dh || !auth) return json({ error: 'اطلاعات اشتراک ناقصه' }, 400);

  // اگه قبلاً همین endpoint ثبت شده، جایگزینش کن (جلوگیری از رکورد تکراری)
  await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(endpoint).run();
  await env.DB.prepare(
    'INSERT INTO push_subscriptions (id,user_id,endpoint,p256dh,auth,created_at) VALUES (?,?,?,?,?,?)'
  ).bind(crypto.randomUUID(), userId, endpoint, p256dh, auth, Date.now()).run();

  return json({ ok: true });
}

async function pushTest(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ error: 'وارد نشدی' }, 401);
  const subs = await env.DB.prepare('SELECT * FROM push_subscriptions WHERE user_id=?').bind(userId).all();
  console.log('pushTest: found', subs.results ? subs.results.length : 0, 'subscription(s) for user', userId);
  if (!subs.results || !subs.results.length) return json({ error: 'هنوز نوتیفیکیشن پس‌زمینه رو فعال نکردی', code:'no_subscription' }, 400);

  let sent = 0, failed = 0;
  const details = [];
  for (const sub of subs.results) {
    const result = await sendWebPush(env, sub, {
      title: 'دفترچه سرویس خودرو 🔧',
      body: 'این یه نوتیفیکیشن آزمایشیه — اگه این رو می‌بینی، یعنی همه‌چیز درست کار می‌کنه!',
      tag: 'test'
    });
    console.log('pushTest: send result for endpoint', sub.endpoint.substring(0,60), '=>', JSON.stringify(result));
    if (result.ok) sent++; else failed++;
    details.push({ endpoint: sub.endpoint.substring(0,60), status: result.status, error: result.error });
  }
  if (sent === 0 && failed > 0) {
    return json({ error: 'اشتراک نوتیفیکیشن قبلی دیگه معتبر نیست، دوباره فعالش کن', code:'no_subscription', sent, failed, details }, 400);
  }
  return json({ ok: true, sent, failed, details });
}

/* ---------- بررسی دوره‌ای خودکار همه‌ی کاربرها (از Cron Trigger صدا زده میشه)
   [v2.7.0] نسخهٔ هوشمند:
   - «رسیده»: کارهایی که از موعدشون گذشته (مثل قبل)
   - «نزدیکه»: کارهایی که تا ۳ روز / ۳۰۰ کیلومتر دیگه به موعد می‌رسن
   - متن شخصی‌سازی‌شده: نام کار و ماشین + چند روز/کیلومتر مونده
   - برای هر کاربر حداکثر یک اعلان در روز (notify_state)                 ---------- */
async function checkAllUsersAndNotify(env) {
  const users = await env.DB.prepare(
    `SELECT DISTINCT u.id, u.email FROM users u
     INNER JOIN push_subscriptions p ON p.user_id = u.id`
  ).all();
  if (!users.results) return;

  const today = todayJalaliStr();

  for (const user of users.results) {
    try {
      const dataRow = await env.DB.prepare('SELECT data FROM user_data WHERE user_id=?').bind(user.id).first();
      if (!dataRow || !dataRow.data) continue;
      const state = JSON.parse(dataRow.data);
      if (!state.cars || !state.cars.length) continue;

      const notifyState = await env.DB.prepare('SELECT last_notified_date FROM notify_state WHERE user_id=?').bind(user.id).first();
      if (notifyState && notifyState.last_notified_date === today) continue; // امروز قبلاً فرستاده شده

      const dueItems = [];
      const soonItems = [];
      for (const car of state.cars) {
        for (const s of (car.services || [])) {
          if (isServiceDue(s, car)) {
            dueItems.push({ carName: car.name || 'خودرو', serviceName: s.name });
            continue;
          }
          const soon = getServiceDueSoonInfo(s, car, V27_LEAD_DAYS);
          if (soon) {
            soonItems.push({
              carName: car.name || 'خودرو',
              serviceName: s.name,
              daysLeft: soon.daysLeft,
              kmLeft: soon.kmLeft
            });
          }
        }
      }
      if (!dueItems.length && !soonItems.length) continue;

      const subs = await env.DB.prepare('SELECT * FROM push_subscriptions WHERE user_id=?').bind(user.id).all();
      if (!subs.results || !subs.results.length) continue;

      const title = 'یادآوری سرویس خودرو 🔧';
      let body, tag;
      if (dueItems.length === 1) {
        body = `${dueItems[0].carName} — ${dueItems[0].serviceName} به موعدش رسیده`;
        tag = 'due-reminder';
      } else if (dueItems.length > 1) {
        body = `${toFa(dueItems.length)} کار به موعدشون رسیده — برای جزئیات اپ رو باز کن`;
        tag = 'due-reminder';
      } else if (soonItems.length === 1) {
        body = `«${soonItems[0].serviceName}» (${soonItems[0].carName}) ${dueSoonPhrase(soonItems[0])}`;
        tag = 'due-soon';
      } else {
        soonItems.sort((a, b) => dueSoonScore(a) - dueSoonScore(b));
        const first = soonItems[0];
        body = `${toFa(soonItems.length)} کار به موعدشون نزدیکه — نزدیک‌ترین: «${first.serviceName}» (${first.carName}) ${dueSoonPhrase(first)}`;
        tag = 'due-soon';
      }

      for (const sub of subs.results) {
        await sendWebPush(env, sub, { title, body, tag });
      }

      await env.DB.prepare(
        `INSERT INTO notify_state (user_id,last_notified_date) VALUES (?,?)
         ON CONFLICT(user_id) DO UPDATE SET last_notified_date=excluded.last_notified_date`
      ).bind(user.id, today).run();
    } catch (e) {
      // یه کاربر خراب نباید بقیه رو متوقف کنه
      continue;
    }
  }
}

/* ---------- تشخیص اینکه آیا یه کار به موعدش رسیده (نسخه‌ی ساده‌شده‌ی سرور از منطق اپ) ---------- */
function isServiceDue(service, car) {
  const history = service.history || [];
  if (!history.length) return false;
  const last = history[history.length - 1];
  const lastJ = parseJalaliStr(last.date);
  if (!lastJ) return false;

  if (service.intervalKm && last.odometer != null && car.currentOdo != null) {
    const pctKm = (car.currentOdo - last.odometer) / service.intervalKm;
    if (pctKm >= 1) return true;
  }
  if (service.intervalDays) {
    const today = todayJalali();
    const elapsed = daysBetweenJalali(lastJ, today);
    const pctDay = elapsed / service.intervalDays;
    if (pctDay >= 1) return true;
  }
  return false;
}

/* ---------- [v2.7.0] آیا کار «نزدیک موعد» است؟ اطلاعات باقی‌مانده را برمی‌گرداند ---------- */
function getServiceDueSoonInfo(service, car, leadDays) {
  const history = service.history || [];
  if (!history.length) return null;
  const last = history[history.length - 1];
  const lastJ = parseJalaliStr(last.date);
  if (!lastJ) return null;

  let daysLeft = null, kmLeft = null;
  if (service.intervalDays) {
    const today = todayJalali();
    daysLeft = service.intervalDays - daysBetweenJalali(lastJ, today);
  }
  if (service.intervalKm && last.odometer != null && car.currentOdo != null) {
    kmLeft = service.intervalKm - (car.currentOdo - last.odometer);
  }
  if (daysLeft == null && kmLeft == null) return null;

  const dayNear = daysLeft != null && daysLeft >= 0 && daysLeft <= leadDays;
  const kmNear = kmLeft != null && kmLeft >= 0 && kmLeft <= V27_KM_LEAD;
  if (dayNear || kmNear) return { daysLeft, kmLeft };
  return null;
}

/* ---------- [v2.7.0] متن فارسی «چقدر مونده» ---------- */
function toFa(n) {
  return String(n).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}
function dueSoonPhrase(item) {
  if (item.daysLeft != null) {
    if (item.daysLeft <= 0) return 'امروز به موعدش می‌رسه';
    if (item.daysLeft === 1) return 'فردا به موعدش می‌رسه';
    return toFa(item.daysLeft) + ' روز دیگه به موعدش می‌رسه';
  }
  if (item.kmLeft != null) return 'حدود ' + toFa(Math.max(0, Math.round(item.kmLeft))) + ' کیلومتر به موعدش مونده';
  return 'به موعدش نزدیکه';
}
function dueSoonScore(item) {
  if (item.daysLeft != null) return item.daysLeft;
  if (item.kmLeft != null) return item.kmLeft;
  return 9999;
}

/* ---------- محاسبات تاریخ شمسی (نسخه‌ی سبک، بدون وابستگی) ---------- */
function jdiv(a, b) { return Math.trunc(a / b); }
function g2jServer(gy, gm, gd) {
  const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365*gy) + jdiv(gy2+3,4) - jdiv(gy2+99,100) + jdiv(gy2+399,400) - 80 + gd + g_d_m[gm-1];
  jy += 33*jdiv(days,12053);
  days %= 12053;
  jy += 4*jdiv(days,1461);
  days %= 1461;
  if (days > 365) { jy += jdiv(days-1,365); days = (days-1)%365; }
  const jm = (days < 186) ? 1+jdiv(days,31) : 7+jdiv(days-186,30);
  const jd = 1 + ((days < 186) ? (days%31) : ((days-186)%30));
  return [jy, jm, jd];
}
function j2gServer(jy, jm, jd) {
  let gy = (jy <= 979) ? 621 : 1600;
  jy -= (jy <= 979) ? 0 : 979;
  let days = (365*jy) + (jdiv(jy,33)*8) + jdiv(((jy%33)+3),4) + 78 + jd + ((jm<7) ? (jm-1)*31 : ((jm-7)*30)+186);
  gy += 400*jdiv(days,146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100*jdiv(days-1,36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4*jdiv(days,1461);
  days %= 1461;
  if (days > 365) { gy += jdiv(days-1,365); days = (days-1)%365; }
  let gd = days + 1;
  const isLeap = ((gy%4===0)&&(gy%100!==0)) || (gy%400===0);
  const sal_a = [0,31,isLeap?29:28,31,30,31,30,31,31,30,31,30,31];
  let gm = 0;
  for (gm=1; gm<13; gm++) { if (gd <= sal_a[gm]) break; gd -= sal_a[gm]; }
  return [gy, gm, gd];
}
function jalaliToJSDateServer(jy, jm, jd) {
  const g = j2gServer(jy, jm, jd);
  return new Date(Date.UTC(g[0], g[1]-1, g[2]));
}
function todayJalali() {
  const now = new Date();
  const g = g2jServer(now.getUTCFullYear(), now.getUTCMonth()+1, now.getUTCDate());
  return { jy:g[0], jm:g[1], jd:g[2] };
}
function todayJalaliStr() {
  const t = todayJalali();
  return t.jy + '/' + String(t.jm).padStart(2,'0') + '/' + String(t.jd).padStart(2,'0');
}
function parseJalaliStr(s) {
  if (!s) return null;
  const p = String(s).trim().split(/[\/\-]/).map(x => parseInt(x, 10));
  if (p.length !== 3 || p.some(isNaN)) return null;
  return { jy:p[0], jm:p[1], jd:p[2] };
}
function daysBetweenJalali(j1, j2) {
  const d1 = jalaliToJSDateServer(j1.jy, j1.jm, j1.jd);
  const d2 = jalaliToJSDateServer(j2.jy, j2.jm, j2.jd);
  return Math.round((d2 - d1) / 86400000);
}

/* ================================================================
   [v2.7.0] تله‌متری و ادمین — endpointهای جدید
   ================================================================ */

/* POST /api/ping — باز شدن اپ / نصب PWA / مودال S-08 / خلاصهٔ یادآور */
async function handlePing(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' });
  const b = await request.json().catch(() => ({}));
  const ev = String(b.ev || 'open').slice(0, 16);
  const v = String(b.v || '').slice(0, 16);
  const day = v27Day();

  if (ev === 'open') {
    await v27Incr(kv, 'opens:' + day, 45);
    if (v) {
      try {
        const m = JSON.parse(await kv.get('ver') || '{}');
        m[v] = (m[v] || 0) + 1;
        await kv.put('ver', JSON.stringify(m));
      } catch (e) {}
    }
  } else if (ev === 'install') {
    await v27Incr(kv, 'installs');
  } else if (ev === 's08') {
    await v27Incr(kv, 's08:' + day, 45);
  } else if (ev === 'qlog') {            /* [v2.8.0] استفاده از ثبت سریع */
    await v27Incr(kv, 'qlog:' + day, 45);
  } else if (ev === 'costview') {        /* [v2.8.0] باز کردن گزارش هزینه */
    await v27Incr(kv, 'costview:' + day, 45);
  } else if (ev === 'mechcopy') {        /* [v2.8.0] کپی خلاصهٔ مکانیک */
    await v27Incr(kv, 'mechcopy:' + day, 45);
  } else if (ev === 'histsearch') {      /* [v2.8.0] جستجوی تاریخچه */
    await v27Incr(kv, 'hsearch:' + day, 45);
  } else if (ev === 'reminder') {
    const tok = v27GetAuth(request);
    if (tok) {
      const h = await v27Hash(tok);
      const rec = {
        ts: Date.now(),
        lead: (parseInt(b.lead, 10) || 3),
        totals: (b.totals && typeof b.totals === 'object') ? b.totals : {},
        due: Array.isArray(b.due) ? b.due.slice(0, 20) : []
      };
      /* مجموع ماشین/کارها (دلتا نسبت به خلاصهٔ قبلی — بدون دیدن محتوای دفترچه) */
      try {
        const old = JSON.parse(await kv.get('acct:' + h) || 'null');
        const oc = (old && old.totals && old.totals.cars) || 0;
        const os = (old && old.totals && old.totals.services) || 0;
        const nc = (rec.totals && rec.totals.cars) || 0;
        const ns = (rec.totals && rec.totals.services) || 0;
        if (nc !== oc) await v27IncrBy(kv, 'sumCars', nc - oc);
        if (ns !== os) await v27IncrBy(kv, 'sumServices', ns - os);
      } catch (e) {}
      await kv.put('acct:' + h, JSON.stringify(rec), { expirationTtl: 40 * 86400 });
      if (b.push) {
        await kv.put('push:' + h, JSON.stringify({ token: tok, rec: rec }), { expirationTtl: 35 * 86400 });
      }
    }
  }
  return json({ ok: true });
}

/* POST /api/log-error — گزارش خطاهای کلاینت (آخرین ۵۰ تا نگه‌داری می‌شود) */
async function handleLogError(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' });
  /* [v2.11.14] سقف روزانهٔ تله‌متری per-IP — محافظ سهمیهٔ نوشتن KV */
  if (!(await rateLimitIP(kv, request, 'err', 60))) return json({ ok: false, error: 'rate limited' }, 429);
  const b = await request.json().catch(() => ({}));
  let list = [];
  try { list = JSON.parse(await kv.get('errors') || '[]'); } catch (e) {}
  if (Array.isArray(b.errors)) {
    b.errors.forEach(x => {
      list.push({
        t: x.t || Date.now(),
        v: String(x.v || b.v || '').slice(0, 16),   // نسخه از خود آیتم یا از بدنهٔ اصلی
        page: String(x.page || '').slice(0, 24),
        msg: String(x.msg || '').slice(0, 200)
      });
    });
  }
  list = list.slice(-50);
  try { await kv.put('errors', JSON.stringify(list)); } catch (e) {}
  return json({ ok: true });
}

/* GET /api/broadcast — پیام همگانی فعلی (عمومی؛ خالی یعنی پیامی منتشر نیست) */
async function handleBroadcastGet(env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false });
  let bc = null;
  try { bc = JSON.parse(await kv.get('broadcast') || 'null'); } catch (e) {}
  return json({ ok: true, message: (bc && bc.message) || '', ts: (bc && bc.ts) || 0 });
}

/* POST /api/admin/broadcast — انتشار/پاک‌کردن پیام همگانی (متن خالی = پاک شدن) */
async function adminBroadcast(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' }, 500);
  if (!await v27IsAdmin(request, env, kv)) return json({ ok: false, error: 'admin only' }, 403);
  const b = await request.json().catch(() => ({}));
  const msg = String(b.message || '').slice(0, 200);
  try { await kv.put('broadcast', JSON.stringify({ message: msg, ts: Date.now() })); } catch (e) {}
  return json({ ok: true });
}

/* GET /api/admin/stats — داشبورد ادمین (فقط اعداد کل؛ بدون محتوای دفترچه‌ی هیچ‌کس) */
async function adminStats(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' }, 500);
  if (!await v27IsAdmin(request, env, kv)) return json({ ok: false, error: 'admin only' }, 403);
  const day = v27Day();
  const stats = {
    totalAccounts: await v27ReadInt(kv, 'totalAccounts'),
    newToday:      await v27ReadInt(kv, 'newAccounts:' + day),
    loginsToday:   await v27ReadInt(kv, 'logins:' + day),
    googleLoginsToday: await v27ReadInt(kv, 'loginsG:' + day),
    logins7: 0,
    active7: 0, active30: 0,
    opensToday: await v27ReadInt(kv, 'opens:' + day),
    installs:   await v27ReadInt(kv, 'installs'),
    oauthToday: await v27ReadInt(kv, 'oauth:' + day),
    s08Today:   await v27ReadInt(kv, 's08:' + day),
    qlogToday:  await v27ReadInt(kv, 'qlog:' + day),          /* [v2.8.0] */
    costviewToday: await v27ReadInt(kv, 'costview:' + day),   /* [v2.8.0] */
    mechcopyToday: await v27ReadInt(kv, 'mechcopy:' + day),   /* [v2.8.0] */
    histsearchToday: await v27ReadInt(kv, 'hsearch:' + day),  /* [v2.8.0] */
    shareCreateToday: await v27ReadInt(kv, 'sharecreate:' + day),  /* [v2.9.0] */
    shareViewToday: await v27ReadInt(kv, 'shareview:' + day),      /* [v2.9.0] */
    totalCars:  await v27ReadInt(kv, 'sumCars'),
    totalServices: await v27ReadInt(kv, 'sumServices'),
    versions: {}
  };
  /* ورودهای ۷ روز + کاربران فعال ۷/۳۰ روز (مجموع مجموعه‌های روزانه) */
  const seen7 = {}, seen30 = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    stats.logins7 += await v27ReadInt(kv, 'logins:' + d);
    const s = await kv.get('seen:' + d);
    if (s) {
      try {
        JSON.parse(s).forEach(x => {
          if (i < 7) seen7[x] = 1;
          seen30[x] = 1;
        });
      } catch (e2) {}
    }
  }
  stats.active7 = Object.keys(seen7).length;
  stats.active30 = Object.keys(seen30).length;
  try { stats.versions = JSON.parse(await kv.get('ver') || '{}'); } catch (e4) {}
  return json({ ok: true, stats: stats });
}

/* ================================================================
   [v2.11.13] مسیرهای نجات داده — فقط ادمین (v27IsAdmin)
   هدف: وقتی کاربری گزارش «اکانت خالی» داد، ادمین بدون کنسول D1 بتواند
   پیدا کند دادهٔ او کجاست (کدام ایمیل/بکاپ) و در صورت نیاز برگرداند.
   ================================================================ */
async function v2113ResolveUser(env, request) {
  const u = new URL(request.url);
  const email = String(u.searchParams.get('email') || '').trim().toLowerCase();
  const userId = String(u.searchParams.get('user_id') || '').trim();
  if (userId) return { userId: userId };
  if (email) {
    const row = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
    if (row) return { userId: row.id };
  }
  return null;
}

/* GET /api/admin/find-data?email=... (یا user_id=...) — وضعیت دادهٔ فعلی + لیست بکاپ‌ها */
async function adminFindData(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' }, 500);
  if (!await v27IsAdmin(request, env, kv)) return json({ ok: false, error: 'admin only' }, 403);
  const found = await v2113ResolveUser(env, request);
  if (!found) return json({ ok: false, error: 'کاربر با این ایمیل/شناسه پیدا نشد' }, 404);
  const user = await env.DB.prepare('SELECT id, email, created_at FROM users WHERE id=?').bind(found.userId).first();
  if (!user) return json({ ok: false, error: 'کاربر پیدا نشد' }, 404);
  let current = null;
  const row = await env.DB.prepare('SELECT data, updated_at FROM user_data WHERE user_id=?').bind(found.userId).first();
  if (row && row.data) {
    let cars = null;
    try { const o = JSON.parse(row.data); if (o && Array.isArray(o.cars)) cars = o.cars.length; } catch (e) {}
    current = { bytes: row.data.length, cars: cars, updatedAt: row.updated_at || 0 };
  }
  await backupEnsureTable(env);
  const baks = await env.DB.prepare(
    'SELECT id, cars, created_at, length(data) AS bytes FROM data_backups WHERE user_id=? ORDER BY id DESC LIMIT 3'
  ).bind(found.userId).all();
  return json({ ok: true, user: { id: user.id, email: user.email, createdAt: user.created_at }, current: current, backups: (baks && baks.results) || [] });
}

/* GET /api/admin/get-backup?email=...&id=... — محتوای کامل یک بکاپ (خروجی: data قابل import) */
async function adminGetBackup(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' }, 500);
  if (!await v27IsAdmin(request, env, kv)) return json({ ok: false, error: 'admin only' }, 403);
  const found = await v2113ResolveUser(env, request);
  if (!found) return json({ ok: false, error: 'کاربر پیدا نشد' }, 404);
  const id = parseInt(new URL(request.url).searchParams.get('id') || '0', 10);
  if (!id) return json({ ok: false, error: 'شناسهٔ بکاپ لازم است' }, 400);
  await backupEnsureTable(env);
  const row = await env.DB.prepare('SELECT id, cars, created_at, data FROM data_backups WHERE user_id=? AND id=?').bind(found.userId, id).first();
  if (!row) return json({ ok: false, error: 'بکاپ پیدا نشد' }, 404);
  let parsed = null;
  try { parsed = JSON.parse(row.data); } catch (e) {}
  return json({ ok: true, backup: { id: row.id, cars: row.cars, createdAt: row.created_at, data: parsed || row.data } });
}

/* POST /api/admin/restore-backup {email|user_id, backupId} — برگرداندن بکاپ به user_data
   قبلش از دادهٔ فعلی خودکار بکاپ گرفته می‌شود تا خودِ بازیابی هم امن باشد. */
async function adminRestoreBackup(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' }, 500);
  if (!await v27IsAdmin(request, env, kv)) return json({ ok: false, error: 'admin only' }, 403);
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const uidRaw = String(body.user_id || '').trim();
  const backupId = parseInt(body.backupId || '0', 10) || parseInt(body.id || '0', 10);
  let userId = uidRaw;
  if (!userId && email) {
    const row = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
    if (row) userId = row.id;
  }
  if (!userId || !backupId) return json({ ok: false, error: 'ایمیل/شناسهٔ کاربر و backupId لازم است' }, 400);
  await backupEnsureTable(env);
  const bak = await env.DB.prepare('SELECT id, data FROM data_backups WHERE user_id=? AND id=?').bind(userId, backupId).first();
  if (!bak) return json({ ok: false, error: 'بکاپ پیدا نشد' }, 404);
  const cur = await env.DB.prepare('SELECT data FROM user_data WHERE user_id=?').bind(userId).first();
  if (cur && cur.data) { await backupUserData(env, userId, cur.data, Date.now()); }
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO user_data (user_id,data,updated_at) VALUES (?,?,?)
     ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`
  ).bind(userId, bak.data, now).run();
  return json({ ok: true, restoredFrom: backupId, updatedAt: now });
}


/* ================================================================
   [v2.9.0] لینک اشتراکی مکانیک — فقط-خواندنی، قابل حذف در هر لحظه
   کلید = ۳۲ کاراکتر هگز (۱۲۸ بیت آنتروپی از crypto.getRandomValues).
   جدول share_links در اولین استفاده ساخته می‌شود.
   ================================================================ */
const SHARE_PUBLIC_BASE = 'https://carservbook.ir/s/';
const SHARE_MAX_PER_USER = 20;
let shareTableReady = false;

function makeShareToken() {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < buf.length; i++) out += ('0' + buf[i].toString(16)).slice(-2);
  return out;
}

async function shareEnsureTable(env) {
  if (shareTableReady) return;
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS share_links (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      car_id TEXT NOT NULL,
      car_name TEXT,
      created_at INTEGER,
      views INTEGER DEFAULT 0,
      last_view_at INTEGER DEFAULT 0
    )`
  ).run();
  shareTableReady = true;
}

async function loadStateOfUser(env, userId) {
  const row = await env.DB.prepare('SELECT data FROM user_data WHERE user_id=?').bind(userId).first();
  if (!row || !row.data) return null;
  try { return JSON.parse(row.data); } catch (e) { return null; }
}

/* POST /api/share/create — ساخت لینک برای یک خودرو (نیاز به نشست) */
async function shareCreate(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ ok: false, error: 'وارد نشدی' }, 401);
  const body = await request.json().catch(() => ({}));
  const carId = String(body.carId || '').slice(0, 64);
  if (!carId) return json({ ok: false, error: 'خودرو مشخص نیست' }, 400);

  const state = await loadStateOfUser(env, userId);
  const car = state && Array.isArray(state.cars) ? state.cars.find(c => c && c.id === carId) : null;
  if (!car) return json({ ok: false, error: 'این خودرو در حسابت پیدا نشد' }, 400);

  await shareEnsureTable(env);
  const cnt = await env.DB.prepare('SELECT COUNT(*) AS n FROM share_links WHERE user_id=?').bind(userId).first();
  if (cnt && cnt.n >= SHARE_MAX_PER_USER) {
    return json({ ok: false, error: 'سقف ۲۰ لینک پر شده — چند لینک قدیمی را حذف کن' }, 400);
  }

  const token = makeShareToken();
  const carName = String(car.name || '').slice(0, 60);
  await env.DB.prepare(
    'INSERT INTO share_links (token,user_id,car_id,car_name,created_at,views,last_view_at) VALUES (?,?,?,?,?,0,0)'
  ).bind(token, userId, carId, carName, Date.now()).run();

  return json({ ok: true, token: token, url: SHARE_PUBLIC_BASE + token, carName: carName });
}

/* POST /api/share/list — لینک‌های کاربر (اختیاری: فقط یک خودرو) */
async function shareList(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ ok: false, error: 'وارد نشدی' }, 401);
  const body = await request.json().catch(() => ({}));
  const carId = body.carId ? String(body.carId).slice(0, 64) : null;

  await shareEnsureTable(env);
  let res;
  if (carId) {
    res = await env.DB.prepare(
      'SELECT token,car_id,car_name,created_at,views,last_view_at FROM share_links WHERE user_id=? AND car_id=? ORDER BY created_at DESC'
    ).bind(userId, carId).all();
  } else {
    res = await env.DB.prepare(
      'SELECT token,car_id,car_name,created_at,views,last_view_at FROM share_links WHERE user_id=? ORDER BY created_at DESC'
    ).bind(userId).all();
  }
  const links = (res.results || []).map(r => ({
    token: r.token,
    url: SHARE_PUBLIC_BASE + r.token,
    carId: r.car_id,
    carName: r.car_name,
    createdAt: r.created_at,
    views: r.views || 0,
    lastViewAt: r.last_view_at || 0
  }));
  return json({ ok: true, links: links });
}

/* POST /api/share/revoke — حذف لینک (یا همه با all:true) */
async function shareRevoke(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) return json({ ok: false, error: 'وارد نشدی' }, 401);
  const body = await request.json().catch(() => ({}));
  await shareEnsureTable(env);
  let del;
  if (body.all) {
    del = await env.DB.prepare('DELETE FROM share_links WHERE user_id=?').bind(userId).run();
  } else {
    const token = String(body.token || '').trim();
    if (!/^[a-f0-9]{32}$/.test(token)) return json({ ok: false, error: 'لینک معتبر نیست' }, 400);
    del = await env.DB.prepare('DELETE FROM share_links WHERE user_id=? AND token=?').bind(userId, token).run();
  }
  return json({ ok: true, deleted: (del.meta && del.meta.changes) || 0 });
}

/* GET /api/share/<token> — عمومی؛ بدون لاگین. فقط دادهٔ پاک‌سازی‌شدهٔ خودرو */
async function shareView(request, env, url) {
  let token = '';
  try { token = decodeURIComponent(url.pathname.slice('/api/share/'.length)).trim(); } catch (e) { token = ''; }
  if (!/^[a-f0-9]{32}$/.test(token)) return json({ ok: false, error: 'لینک معتبر نیست' }, 404);

  const row = await env.DB.prepare('SELECT * FROM share_links WHERE token=?').bind(token).first();
  if (!row) return json({ ok: false, error: 'این لینک پیدا نشد یا حذف شده است' }, 404);

  const state = await loadStateOfUser(env, row.user_id);
  const car = state && Array.isArray(state.cars) ? state.cars.find(c => c && c.id === row.car_id) : null;
  if (!car) return json({ ok: false, error: 'خودروی این لینک دیگر در دسترس نیست' }, 404);

  const snapshot = buildShareSnapshot(car);

  /* شمارش بازدید (به‌روزرسانی ردیف + تله‌متری روزانه) — خرابی‌اش مهم نیست */
  try {
    await env.DB.prepare('UPDATE share_links SET views=views+1, last_view_at=? WHERE token=?').bind(Date.now(), token).run();
    const kv = v27KV(env);
    if (kv) await v27Incr(kv, 'shareview:' + v27Day(), 45);
  } catch (e) {}

  return json({
    ok: true,
    share: {
      car: snapshot.car,
      services: snapshot.services,
      totals: snapshot.totals,
      createdAt: row.created_at || 0,
      views: (row.views || 0) + 1,
      generatedAt: Date.now()
    }
  });
}

/* اسنپ‌شات پاک‌سازی‌شدهٔ خودرو — فقط فیلدهای عمومی؛ بدون VIN/موتور/ایمیل */
function buildShareSnapshot(car) {
  const p1 = car.plateN1 != null ? String(car.plateN1).trim() : '';
  const p2 = car.plateN2 != null ? String(car.plateN2).trim() : '';
  const plate = (p1 && p2) ? {
    n1: p1.slice(0, 4),
    letter: String(car.plateLetter || '').slice(0, 4),
    n2: p2.slice(0, 4),
    region: String(car.plateRegion || '').slice(0, 2)
  } : null;

  const services = [];
  let records = 0, totalCost = 0;
  const srcServices = Array.isArray(car.services) ? car.services : [];
  for (const s of srcServices) {
    if (!s) continue;
    const hist = [];
    const srcHist = Array.isArray(s.history) ? s.history : [];
    for (const h of srcHist) {
      if (!h || !h.date) continue;
      const cost = (h.cost != null && isFinite(Number(h.cost)) && Number(h.cost) > 0) ? Math.round(Number(h.cost)) : null;
      const odo = (h.odometer != null && isFinite(Number(h.odometer))) ? Math.round(Number(h.odometer)) : null;
      hist.push({ date: String(h.date).slice(0, 12), odometer: odo, cost: cost });
      records++;
      if (cost) totalCost += cost;
    }
    if (!hist.length && !s.note) continue;
    services.push({
      name: String(s.name || '').slice(0, 60),
      note: s.note ? String(s.note).slice(0, 200) : null,
      intervalKm: (s.intervalKm && isFinite(Number(s.intervalKm))) ? Number(s.intervalKm) : null,
      intervalDays: (s.intervalDays && isFinite(Number(s.intervalDays))) ? Number(s.intervalDays) : null,
      history: hist
    });
  }

  return {
    car: {
      name: car.name ? String(car.name).slice(0, 60) : null,
      model: car.model ? String(car.model).slice(0, 60) : null,
      year: car.year ? String(car.year).slice(0, 10) : null,
      plate: plate,
      currentOdo: (car.currentOdo != null && isFinite(Number(car.currentOdo))) ? Math.round(Number(car.currentOdo)) : null
    },
    services: services,
    totals: { records: records, totalCost: totalCost }
  };
}

/* GET /api/admin/errors — آخرین خطاهای گزارش‌شده از کلاینت */
async function adminErrors(request, env) {
  const kv = v27KV(env);
  if (!kv) return json({ ok: false, error: 'KV not bound' }, 500);
  if (!await v27IsAdmin(request, env, kv)) return json({ ok: false, error: 'admin only' }, 403);
  let errs = [];
  try { errs = JSON.parse(await kv.get('errors') || '[]'); } catch (e) {}
  errs.reverse();
  return json({ ok: true, errors: errs.slice(0, 50) });
}

/* ================================================================
   ارسال Web Push استاندارد (RFC 8291 + VAPID) — بدون کتابخانه‌ی خارجی
   ================================================================ */

function b64urlToBytes(str) {
  str = String(str).trim().replace(/\s+/g, '');
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function bytesToB64url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function concatBytes(...arrs) {
  const len = arrs.reduce((s,a) => s+a.length, 0);
  const out = new Uint8Array(len);
  let offset = 0;
  for (const a of arrs) { out.set(a, offset); offset += a.length; }
  return out;
}
async function hmacSha256(keyBytes, dataBytes) {
  const key = await crypto.subtle.importKey('raw', keyBytes, {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, dataBytes);
  return new Uint8Array(sig);
}

async function createVapidJwt(audience, privateKeyB64) {
  const pubBytes = b64urlToBytes(VAPID_PUBLIC_KEY);
  const x = pubBytes.slice(1, 33);
  const y = pubBytes.slice(33, 65);
  const d = b64urlToBytes(privateKeyB64);

  const jwk = { kty:'EC', crv:'P-256', d: bytesToB64url(d), x: bytesToB64url(x), y: bytesToB64url(y), ext:true };
  const key = await crypto.subtle.importKey('jwk', jwk, { name:'ECDSA', namedCurve:'P-256' }, false, ['sign']);

  const header = { typ:'JWT', alg:'ES256' };
  const payload = { aud: audience, exp: Math.floor(Date.now()/1000) + 12*3600, sub: 'mailto:carservbook@gmail.com' };
  const enc = new TextEncoder();
  const encHeader = bytesToB64url(enc.encode(JSON.stringify(header)));
  const encPayload = bytesToB64url(enc.encode(JSON.stringify(payload)));
  const signingInput = encHeader + '.' + encPayload;

  const sig = await crypto.subtle.sign({ name:'ECDSA', hash:'SHA-256' }, key, enc.encode(signingInput));
  return signingInput + '.' + bytesToB64url(new Uint8Array(sig));
}

async function encryptPushPayload(payloadText, p256dhB64, authB64) {
  const enc = new TextEncoder();
  const plaintext = enc.encode(payloadText);

  const clientPublicKeyBytes = b64urlToBytes(p256dhB64);
  const authSecret = b64urlToBytes(authB64);

  const clientPublicKey = await crypto.subtle.importKey('raw', clientPublicKeyBytes, { name:'ECDH', namedCurve:'P-256' }, false, []);
  const serverKeyPair = await crypto.subtle.generateKey({ name:'ECDH', namedCurve:'P-256' }, true, ['deriveBits']);
  const serverPublicKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', serverKeyPair.publicKey));

  const sharedSecretBits = await crypto.subtle.deriveBits({ name:'ECDH', public: clientPublicKey }, serverKeyPair.privateKey, 256);
  const sharedSecret = new Uint8Array(sharedSecretBits);

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const prkKey = await hmacSha256(authSecret, sharedSecret);
  const keyInfo = concatBytes(enc.encode('WebPush: info\0'), clientPublicKeyBytes, serverPublicKeyRaw);
  const ikmFull = await hmacSha256(prkKey, concatBytes(keyInfo, new Uint8Array([1])));
  const ikm = ikmFull.slice(0, 32);

  const prk = await hmacSha256(salt, ikm);

  const cekInfo = concatBytes(enc.encode('Content-Encoding: aes128gcm\0'), new Uint8Array([1]));
  const cek = (await hmacSha256(prk, cekInfo)).slice(0, 16);

  const nonceInfo = concatBytes(enc.encode('Content-Encoding: nonce\0'), new Uint8Array([1]));
  const nonce = (await hmacSha256(prk, nonceInfo)).slice(0, 12);

  const paddedPlaintext = concatBytes(plaintext, new Uint8Array([2])); // بدون padding اضافه، فقط delimiter

  const cekKey = await crypto.subtle.importKey('raw', cek, { name:'AES-GCM' }, false, ['encrypt']);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name:'AES-GCM', iv: nonce }, cekKey, paddedPlaintext));

  const recordSize = 4096;
  const rsBytes = new Uint8Array(4);
  new DataView(rsBytes.buffer).setUint32(0, recordSize);
  const idLen = new Uint8Array([serverPublicKeyRaw.length]);

  const header = concatBytes(salt, rsBytes, idLen, serverPublicKeyRaw);
  return concatBytes(header, ciphertext);
}

async function sendWebPush(env, subscription, notification) {
  if (!env.VAPID_PRIVATE_KEY) return { ok:false, error:'VAPID_PRIVATE_KEY تنظیم نشده' };
  try {
    const endpointUrl = new URL(subscription.endpoint);
    const audience = endpointUrl.origin;
    const jwt = await createVapidJwt(audience, env.VAPID_PRIVATE_KEY);
    const body = await encryptPushPayload(JSON.stringify(notification), subscription.p256dh, subscription.auth);

    const resp = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400',
        'Authorization': `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`
      },
      body: body
    });

    let respText = '';
    try { respText = await resp.text(); } catch (e) {}
    console.log('sendWebPush: endpoint=', subscription.endpoint.substring(0,80), 'status=', resp.status, 'body=', respText.substring(0,200));

    if (resp.status === 404 || resp.status === 410) {
      await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint=?').bind(subscription.endpoint).run();
    }
    return { ok: resp.ok, status: resp.status, error: resp.ok ? null : respText.substring(0,200) };
  } catch (e) {
    console.log('sendWebPush: EXCEPTION', e.message, e.stack);
    return { ok:false, error: e.message };
  }
}
