import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia' | 'Middle East' | 'Africa' | 'Global';
  direction?: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  // Major Global Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Americas' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East', direction: 'rtl' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Americas' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Asia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'Asia', direction: 'rtl' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Europe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Asia' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Asia' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Asia' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Asia' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Asia' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Asia' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Asia' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europe' },
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', flag: '🇮🇷', region: 'Middle East', direction: 'rtl' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Europe' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Middle East', direction: 'rtl' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Europe' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Europe' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europe' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Europe' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Europe' },
  { code: 'tl', name: 'Tagalog (Filipino)', nativeName: 'Filipino', flag: '🇵🇭', region: 'Asia' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'Africa' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', region: 'Asia' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', region: 'Asia' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာစာ', flag: '🇲🇲', region: 'Asia' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', region: 'Asia' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', region: 'Asia' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿', region: 'Asia' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿', region: 'Asia' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', region: 'Asia' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', region: 'Europe' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', region: 'Europe' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', region: 'Europe' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Europe' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', region: 'Europe' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', region: 'Europe' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Europe' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Europe' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Europe' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Europe' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Europe' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', region: 'Europe' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', region: 'Europe' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', region: 'Europe' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', region: 'Europe' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'Europe' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', region: 'Europe' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', region: 'Europe' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', region: 'Europe' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', region: 'Europe' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'Africa' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Africa' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga', flag: '🇸🇴', region: 'Africa' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', region: 'Africa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬', region: 'Africa' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', region: 'Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'Africa' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', region: 'Africa' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', flag: '🇹🇯', region: 'Middle East' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', region: 'Middle East', direction: 'rtl' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', region: 'Asia', direction: 'rtl' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл', flag: '🇲🇳', region: 'Asia' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད་', flag: '🇨🇳', region: 'Asia' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', region: 'Asia' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', region: 'Asia' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Binisaya', flag: '🇵🇭', region: 'Asia' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Fiteny Malagasy', flag: '🇲🇬', region: 'Africa' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', region: 'Americas' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', region: 'Americas' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Sāmoa', flag: '🇼🇸', region: 'Global' },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', flag: '🇳🇿', region: 'Global' },
  { code: 'la', name: 'Latin', nativeName: 'Latina', flag: '🇻🇦', region: 'Europe' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌐', region: 'Global' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🇮🇱', region: 'Europe', direction: 'rtl' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татар теле', flag: '🇷🇺', region: 'Europe' },
  { code: 'ba', name: 'Bashkir', nativeName: 'Башҡорт теле', flag: '🇷🇺', region: 'Europe' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', region: 'Asia' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', region: 'Asia' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲', region: 'Asia' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', region: 'Europe' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', region: 'Europe' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', flag: '🇫🇷', region: 'Europe' },
  { code: 'fy', name: 'Frisian', nativeName: 'Frysk', flag: '🇳🇱', region: 'Europe' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', region: 'Africa' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', region: 'Africa' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', region: 'Africa' },
];

// Offline core dictionary for instantaneous responsiveness
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    browseEvents: 'Browse Events',
    myRegistrations: 'My Registrations',
    hoursAttendance: 'Attendance & Hours',
    myCertificates: 'My Certificates',
    volunteerProfile: 'Volunteer Profile',
    coordinatorDashboard: 'Coordinator Dashboard',
    welcome: 'Welcome',
    rsvp: 'RSVP for Event',
    viewPass: 'View QR Pass',
    logHours: 'Log Hours',
    exportCsv: 'Export CSV',
    downloadCert: 'Download Certificate',
    contactCoordinator: 'Contact Coordinator',
    totalHours: 'Verified Hours',
    activeShifts: 'Active Shifts',
    reliability: 'Reliability Score',
    economicImpact: 'Economic Impact',
    search: 'Search...',
    changeThemeColor: 'Theme & Accent Colors',
    changeLanguage: 'Select Language',
    allCategories: 'All Categories',
    callNow: 'Call Now',
    message: 'Send Message',
  },
  es: {
    dashboard: 'Panel de Control',
    browseEvents: 'Explorar Eventos',
    myRegistrations: 'Mis Inscripciones',
    hoursAttendance: 'Asistencia y Horas',
    myCertificates: 'Mis Certificados',
    volunteerProfile: 'Perfil de Voluntario',
    coordinatorDashboard: 'Panel de Coordinador',
    welcome: '¡Bienvenido(a)!',
    rsvp: 'Confirmar Asistencia',
    viewPass: 'Pase Digital QR',
    logHours: 'Registrar Horas',
    exportCsv: 'Exportar CSV',
    downloadCert: 'Descargar Certificado',
    contactCoordinator: 'Contactar Coordinador',
    totalHours: 'Horas Verificadas',
    activeShifts: 'Turnos Activos',
    reliability: 'Confiabilidad',
    economicImpact: 'Impacto Económico',
    search: 'Buscar...',
    changeThemeColor: 'Colores del Tema',
    changeLanguage: 'Seleccionar Idioma',
    allCategories: 'Todas las Categorías',
    callNow: 'Llamar Ahora',
    message: 'Enviar Mensaje',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    browseEvents: 'Explorer les Événements',
    myRegistrations: 'Mes Inscriptions',
    hoursAttendance: 'Présence & Heures',
    myCertificates: 'Mes Certificats',
    volunteerProfile: 'Profil Bénévole',
    coordinatorDashboard: 'Tableau Coordinateur',
    welcome: 'Bienvenue',
    rsvp: 'Participer',
    viewPass: 'Pass QR Digital',
    logHours: 'Enregistrer des Heures',
    exportCsv: 'Exporter en CSV',
    downloadCert: 'Télécharger le Certificat',
    contactCoordinator: 'Contacter le Coordinateur',
    totalHours: 'Heures Vérifiées',
    activeShifts: 'Missions Actives',
    reliability: 'Taux de Présence',
    economicImpact: 'Impact Économique',
    search: 'Rechercher...',
    changeThemeColor: 'Couleurs du Thème',
    changeLanguage: 'Choisir la Langue',
    allCategories: 'Toutes Catégories',
    callNow: 'Appeler',
    message: 'Envoyer un Message',
  },
  de: {
    dashboard: 'Dashboard',
    browseEvents: 'Events Entdecken',
    myRegistrations: 'Meine Anmeldungen',
    hoursAttendance: 'Anwesenheit & Stunden',
    myCertificates: 'Meine Zertifikate',
    volunteerProfile: 'Freiwilligenprofil',
    coordinatorDashboard: 'Koordinator-Dashboard',
    welcome: 'Willkommen',
    rsvp: 'Jetzt Anmelden',
    viewPass: 'Digitaler QR-Pass',
    logHours: 'Stunden erfassen',
    exportCsv: 'CSV Exportieren',
    downloadCert: 'Zertifikat herunterladen',
    contactCoordinator: 'Koordinator kontaktieren',
    totalHours: 'Verifizierte Stunden',
    activeShifts: 'Aktive Einsätze',
    reliability: 'Zuverlässigkeit',
    economicImpact: 'Wirtschaftlicher Wert',
    search: 'Suchen...',
    changeThemeColor: 'Farbschema anpassen',
    changeLanguage: 'Sprache wählen',
    allCategories: 'Alle Kategorien',
    callNow: 'Jetzt anrufen',
    message: 'Nachricht senden',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    browseEvents: 'कार्यक्रम देखें',
    myRegistrations: 'मेरे पंजीकरण',
    hoursAttendance: 'उपस्थिति और सेवा घंटे',
    myCertificates: 'मेरे प्रमाणपत्र',
    volunteerProfile: 'स्वयंसेवक प्रोफाइल',
    coordinatorDashboard: 'समन्वयक डैशबोर्ड',
    welcome: 'स्वागत है',
    rsvp: 'कार्यक्रम के लिए RSVP करें',
    viewPass: 'डिजिटल QR पास देखें',
    logHours: 'सेवा घंटे दर्ज करें',
    exportCsv: 'CSV निर्यात करें',
    downloadCert: 'प्रमाणपत्र डाउनलोड करें',
    contactCoordinator: 'समन्वयक से संपर्क करें',
    totalHours: 'सत्यापित सेवा घंटे',
    activeShifts: 'सक्रिय पारियां',
    reliability: 'विश्वसनीयता स्कोर',
    economicImpact: 'आर्थिक योगदान',
    search: 'खोजें...',
    changeThemeColor: 'रंग थीम बदलें',
    changeLanguage: 'भाषा चुनें',
    allCategories: 'सभी श्रेणियां',
    callNow: 'कॉल करें',
    message: 'संदेश भेजें',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    browseEvents: 'استكشاف الفعاليات',
    myRegistrations: 'تسجيلاتي',
    hoursAttendance: 'الحضور وساعات التطوع',
    myCertificates: 'شهاداتي',
    volunteerProfile: 'ملف المتطوع',
    coordinatorDashboard: 'لوحة منسق المنظمة',
    welcome: 'أهلاً بك',
    rsvp: 'تأكيد الحضور',
    viewPass: 'بطاقة QR الرقمية',
    logHours: 'تسجيل ساعات التطوع',
    exportCsv: 'تصدير كملف CSV',
    downloadCert: 'تحميل الشهادة',
    contactCoordinator: 'التواصل مع المنسق',
    totalHours: 'الساعات المعتمدة',
    activeShifts: 'المهام النشطة',
    reliability: 'نسبة الالتزام',
    economicImpact: 'الأثر الاقتصادي',
    search: 'بحث...',
    changeThemeColor: 'تغيير ألوان المظهر',
    changeLanguage: 'اختر اللغة',
    allCategories: 'جميع الفئات',
    callNow: 'اتصل الآن',
    message: 'إرسال رسالة',
  },
  zh: {
    dashboard: '仪表板',
    browseEvents: '浏览公益活动',
    myRegistrations: '我的报名',
    hoursAttendance: '志愿工时与考勤',
    myCertificates: '荣誉证书',
    volunteerProfile: '志愿者个人资料',
    coordinatorDashboard: '协作者控制台',
    welcome: '欢迎',
    rsvp: '立即报名参加',
    viewPass: '出示电子通行码',
    logHours: '自主申报工时',
    exportCsv: '导出表格 CSV',
    downloadCert: '下载官方荣誉证书',
    contactCoordinator: '联系协调员',
    totalHours: '已认证志愿工时',
    activeShifts: '进行中的班次',
    reliability: '出勤履约率',
    economicImpact: '创造社会价值',
    search: '搜索...',
    changeThemeColor: '更换主题配色',
    changeLanguage: '切换语言',
    allCategories: '全部类型',
    callNow: '即刻致电',
    message: '发送留言',
  },
  ja: {
    dashboard: 'ダッシュボード',
    browseEvents: 'ボランティア案件を探す',
    myRegistrations: '参加申し込み一覧',
    hoursAttendance: '活動実績と出勤記録',
    myCertificates: '表彰・修了証明書',
    volunteerProfile: 'ボランティアプロフィール',
    coordinatorDashboard: '管理者ダッシュボード',
    welcome: 'ようこそ',
    rsvp: '参加を申し込む',
    viewPass: 'デジタル参加QRパス',
    logHours: '活動時間を申請',
    exportCsv: 'CSVデータ出力',
    downloadCert: '公式証明書を保存',
    contactCoordinator: '担当コーディネーターへ連絡',
    totalHours: '認定活動時間',
    activeShifts: '確定シフト数',
    reliability: '出席信頼度スコア',
    economicImpact: '創出社会価値',
    search: '検索...',
    changeThemeColor: 'テーマカラー変更',
    changeLanguage: '言語を選択',
    allCategories: 'すべてのカテゴリー',
    callNow: '電話をかける',
    message: 'メッセージ送信',
  },
  ru: {
    dashboard: 'Панель управления',
    browseEvents: 'Все Мероприятия',
    myRegistrations: 'Мои Регистрации',
    hoursAttendance: 'Посещаемость и Часы',
    myCertificates: 'Мои Сертификаты',
    volunteerProfile: 'Профиль Волонтера',
    coordinatorDashboard: 'Панель Координатора',
    welcome: 'Добро пожаловать',
    rsvp: 'Записаться на событие',
    viewPass: 'Цифровой QR-пропуск',
    logHours: 'Внести отработанные часы',
    exportCsv: 'Экспорт в CSV',
    downloadCert: 'Скачать сертификат',
    contactCoordinator: 'Связаться с координатором',
    totalHours: 'Подтвержденные часы',
    activeShifts: 'Активные смены',
    reliability: 'Индекс надежности',
    economicImpact: 'Экономический вклад',
    search: 'Поиск...',
    changeThemeColor: 'Сменить тему оформления',
    changeLanguage: 'Выбрать язык',
    allCategories: 'Все категории',
    callNow: 'Позвонить',
    message: 'Написать',
  },
  pt: {
    dashboard: 'Painel Geral',
    browseEvents: 'Explorar Projetos',
    myRegistrations: 'Minhas Inscrições',
    hoursAttendance: 'Horas e Presença',
    myCertificates: 'Meus Certificados',
    volunteerProfile: 'Perfil do Voluntário',
    coordinatorDashboard: 'Painel do Coordenador',
    welcome: 'Boas-vindas',
    rsvp: 'Confirmar Presença',
    viewPass: 'Passe Digital QR',
    logHours: 'Registrar Horas',
    exportCsv: 'Exportar CSV',
    downloadCert: 'Baixar Certificado',
    contactCoordinator: 'Falar com Coordenador',
    totalHours: 'Horas Validadas',
    activeShifts: 'Turnos Ativos',
    reliability: 'Taxa de Assiduidade',
    economicImpact: 'Impacto Social Gerado',
    search: 'Pesquisar...',
    changeThemeColor: 'Cores de Destaque',
    changeLanguage: 'Mudar Idioma',
    allCategories: 'Todas as Categorias',
    callNow: 'Ligar Agora',
    message: 'Enviar Mensagem',
  },
  it: {
    dashboard: 'Pannello di Controllo',
    browseEvents: 'Esplora Eventi',
    myRegistrations: 'Le mie Iscrizioni',
    hoursAttendance: 'Presenze e Ore',
    myCertificates: 'I miei Certificati',
    volunteerProfile: 'Profilo Volontario',
    coordinatorDashboard: 'Dashboard Coordinatore',
    welcome: 'Benvenuto',
    rsvp: 'Partecipa',
    viewPass: 'Pass Digitale QR',
    logHours: 'Registra Ore',
    exportCsv: 'Esporta CSV',
    downloadCert: 'Scarica Certificato',
    contactCoordinator: 'Contatta Coordinatore',
    totalHours: 'Ore Verificate',
    activeShifts: 'Turni Attivi',
    reliability: 'Affidabilità',
    economicImpact: 'Valore Economico',
    search: 'Cerca...',
    changeThemeColor: 'Personalizza Colori',
    changeLanguage: 'Cambia Lingua',
    allCategories: 'Tutte le Categorie',
    callNow: 'Chiama Ora',
    message: 'Invia Messaggio',
  },
  ko: {
    dashboard: '대시보드',
    browseEvents: '봉사활동 탐색',
    myRegistrations: '나의 신청 내역',
    hoursAttendance: '출석 및 인증 시간',
    myCertificates: '나의 수료증',
    volunteerProfile: '자원봉사자 프로필',
    coordinatorDashboard: '관리자 대시보드',
    welcome: '환영합니다',
    rsvp: '봉사 참여 신청',
    viewPass: '디지털 QR 패스',
    logHours: '봉사시간 자가 등록',
    exportCsv: 'CSV 데이터 내보내기',
    downloadCert: '인증서 다운로드',
    contactCoordinator: '담당 코디네이터 문의',
    totalHours: '공식 인증 시간',
    activeShifts: '예정된 봉사 일정',
    reliability: '출석 성실도',
    economicImpact: '창출된 사회적 가치',
    search: '검색...',
    changeThemeColor: '테마 색상 변경',
    changeLanguage: '언어 선택',
    allCategories: '전체 카테고리',
    callNow: '전화 걸기',
    message: '메시지 전송',
  },
  tr: {
    dashboard: 'Kontrol Paneli',
    browseEvents: 'Etkinlikleri Keşfet',
    myRegistrations: 'Kayıtlarım',
    hoursAttendance: 'Katılım ve Saatler',
    myCertificates: 'Sertifikalarım',
    volunteerProfile: 'Gönüllü Profili',
    coordinatorDashboard: 'Koordinatör Paneli',
    welcome: 'Hoş Geldiniz',
    rsvp: 'Etkinliğe Katıl',
    viewPass: 'Dijital QR Kartı',
    logHours: 'Saat Bildir',
    exportCsv: 'CSV Olarak İndir',
    downloadCert: 'Sertifikayı İndir',
    contactCoordinator: 'Koordinatöre Ulaş',
    totalHours: 'Onaylanan Saatler',
    activeShifts: 'Aktif Görevler',
    reliability: 'Güvenilirlik Puanı',
    economicImpact: 'Ekonomik Katkı',
    search: 'Ara...',
    changeThemeColor: 'Renk Temasını Değiştir',
    changeLanguage: 'Dil Seçin',
    allCategories: 'Tüm Kategoriler',
    callNow: 'Hemen Ara',
    message: 'Mesaj Gönder',
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  languages: Language[];
  t: (key: string, defaultText?: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'voluneease-language-code';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLangCode, setCurrentLangCode] = useState<string>(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  });

  const currentLanguage = LANGUAGES.find((l) => l.code === currentLangCode) || LANGUAGES[0];
  const isRtl = currentLanguage.direction === 'rtl';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', currentLanguage.code);
    root.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // Trigger Google Translate engine element if available
    try {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = currentLanguage.code;
        select.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      // Ignore
    }
  }, [currentLanguage, isRtl]);

  const setLanguage = (code: string) => {
    setCurrentLangCode(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);

    // Apply translation cookie for Google Translate widget seamlessly
    try {
      document.cookie = `googtrans=/en/${code}; path=/;`;
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      // Ignore
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[currentLanguage.code];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages: LANGUAGES,
        t,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
