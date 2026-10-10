import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

const TRANSLATIONS = {
  en: {
    // Brand & Common Nav
    brandName: 'FloraPulse AI',
    tagline: 'Urban Farming Assistant',
    navHome: 'Home',
    navDashboard: 'Dashboard',
    navPlants: 'My Plants',
    navScanner: 'AI Disease Scanner',
    navCare: 'Care Planner',
    navSettings: 'Settings',
    navLogin: 'Sign In',
    navSignup: 'Get Started Free',
    navLogout: 'Sign Out',
    goToDashboard: 'Open Dashboard',

    // Homepage Hero
    heroBadge: 'Botanical Vision & Balcony Microclimates',
    heroTitle: 'Intelligent foliage diagnostics & precision care for urban balconies.',
    heroSubtitle: 'Diagnose tomato leaf diseases in seconds with calibrated AI, balance watering with live atmospheric telemetry, and follow organic recovery protocols tailored to containers.',
    heroCtaPrimary: 'Start Diagnosing Free',
    heroCtaDemo: 'Explore Interactive Demo',
    heroCtaSignIn: 'Sign In to Garden',

    // Homepage Stats
    statConditions: '10 Tomato Conditions',
    statConditionsSub: 'PlantVillage calibrated model',
    statInference: 'Calibrated Softmax',
    statInferenceSub: 'Uncertainty & lesion quantification',
    statMicroclimate: 'Balcony Weather',
    statMicroclimateSub: 'Open-Meteo & container physics',

    // How It Works Section
    howItWorksPre: 'Simple 4-Step Process',
    howItWorksTitle: 'How FloraPulse AI Works',
    howItWorksSubtitle: 'From plant onboarding to calibrated leaf diagnosis and weather-smart watering — practical plant care designed for urban container growers.',
    howStep1Num: '01',
    howStep1Title: 'Add Your Plant & Container Details',
    howStep1Desc: 'Specify your plant variety, pot material (terracotta, fabric grow bag, plastic), and balcony sunlight exposure to establish an accurate baseline.',
    howStep2Num: '02',
    howStep2Title: 'Scan Leaf for Health Issues',
    howStep2Desc: 'Upload a clear leaf photo. Our calibrated vision model identifies 10 tomato conditions with confidence scores and honest ambiguity warnings.',
    howStep3Num: '03',
    howStep3Title: 'Receive Simple Care Guidance',
    howStep3Desc: 'Get clear, step-by-step organic remedies in English, Hindi, or Gujarati. Plain instructions explain what to do, why it helps, and when to act.',
    howStep4Num: '04',
    howStep4Title: 'Balance Watering with Live Weather',
    howStep4Desc: 'Real-time temperature and humidity for your exact locality prevent root rot and heat stress by factoring in balcony roof sheltering.',
    howCtaStart: 'Start by Adding a Plant',
    howCtaDemo: 'Try Interactive Demo',

    // Features Section
    featureSectionPre: 'Botanical Technology',
    featureSectionTitle: 'Precision plant science designed for urban micro-spaces',
    featureSectionSub: 'Balcony gardens face unique challenges: high wind shear, rapid container evaporation, and intense radiant heat from concrete walls.',
    feature1Title: 'Calibrated Disease Diagnosis',
    feature1Desc: 'Upload a tomato leaf photo to identify Early Blight, Late Blight, Bacterial Spot, Spider Mites, and more with calibrated confidence scores and out-of-distribution ambiguity detection.',
    feature2Title: 'Balcony Microclimate Modeling',
    feature2Desc: 'Integrates live Open-Meteo weather with your terrace orientation, container material, and roof sheltering to calculate evapotranspiration and watering urgency.',
    feature3Title: 'Container & Soil Physics',
    feature3Desc: 'Distinguishes between porous terracotta, breathable fabric grow bags, and plastic containers to ensure optimal root oxygenation and prevent root rot.',
    feature4Title: 'Non-Destructive Organic Care',
    feature4Desc: 'Step-by-step treatment guidance including cold-pressed neem oil schedules, milk sprays, and organic copper protocols that are safe for urban households.',

    // Architecture & Transparency Section
    archTitle: 'Honest, Modern Architecture',
    archSubtitle: 'Designed with dual-mode flexibility. Runs out-of-the-box locally with SQLite and localStorage, with a clean path to Supabase cloud deployment.',
    archLocalBadge: 'Local / Offline Ready',
    archCloudBadge: 'Supabase Cloud Ready',
    archDesc: 'All migrations, Row-Level Security policies, and private bucket definitions are prepared in the repository for turnkey cloud production.',

    // Showcase
    showcaseTitle: 'Built for Urban Balconies & Terraces',
    showcaseSubtitle: 'From Indian apartment railings to high-rise window sills across the country.',

    // Auth Screens
    loginTitle: 'Welcome Back to FloraPulse',
    loginSubtitle: 'Sign in to access your urban garden, diagnosis logs, and irrigation planner.',
    signupTitle: 'Create Your Garden Account',
    signupSubtitle: 'Start diagnosing tomato leaf diseases and managing your balcony crops.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'e.g. Aarav Patel',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',
    confirmPasswordLabel: 'Confirm Password',
    loginButton: 'Sign In to Garden',
    signupButton: 'Create Garden Account',
    quickDemoButton: 'One-Click Demo Garden Login',
    quickDemoDesc: 'Experience the full application immediately with preloaded balcony tomato plants.',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUpLink: 'Create one free',
    signInLink: 'Sign in here',

    // Location & Weather Setup
    locModalTitle: 'Set Garden Location',
    locModalSubtitle: 'Accurate local weather powers realistic watering calculations.',
    locCityLabel: 'City',
    locCityPlaceholder: 'e.g. Rajkot, Ahmedabad, Pune',
    locAreaLabel: 'Area / Locality (Optional)',
    locAreaPlaceholder: 'e.g. Kalawad Road, Race Course, Satellite',
    locAreaHint: 'Example: City: Rajkot, Area: Kalawad Road',
    locQuickSuggestions: 'Quick Select City:',
    locDetectingGps: 'Detecting GPS coordinates...',
    locUseCurrentGps: 'Use My Current Device Location (GPS)',
    locSaveButton: 'Apply Location',
    locChangeBtn: 'Change Location',
    locSetLocation: 'Set Location',
    locResolving: 'Verifying...',
    locErrorCityRequired: 'Please enter your city.',
    weatherTitle: 'Local Microclimate',
    weatherNoLocationTitle: 'No Garden Location Selected',
    weatherNoLocationDesc: 'Please enter your city and area to enable context-aware weather telemetry.',
    weatherSetLocationBtn: 'Set Garden Location',
    weatherFetchError: 'Unable to retrieve live forecast',
    weatherRefresh: 'Refresh weather',
    weatherTranspirationHint: 'Optimal tomato transpiration range: 21°C – 29°C',
    weatherHumidity: 'Humidity',
    weatherWind: 'Wind',
    weatherRain: 'rain',
    weatherPhysicsActive: 'Context-aware balcony rules active',

    // Dashboard
    dashboardGreeting: 'Welcome, Gardener',
    dashboardSubtitle: 'Your balcony microclimate and tomato health overview.',
    dashboardScanCta: 'Scan Tomato Leaf',
    dashboardAddPlantCta: 'Add New Plant',
    dashboardStatsTotalPlants: 'Total Plants',
    dashboardStatsHealthy: 'Healthy Vines',
    dashboardStatsAttention: 'Attention Needed',
    dashboardStatsWateringDue: 'Watering Tasks Due',
    dashboardPendingTasksTitle: 'Pending Garden Tasks',
    dashboardNoPendingTasks: 'All plants are currently hydrated and thriving.',
    dashboardRecentScansTitle: 'Recent Diagnostic Scans',
    dashboardNoScansYet: 'No leaf scans recorded yet. Upload a leaf photo to diagnose health.',
    dashboardViewAllScans: 'View All Scans',
    dashboardMyGardenTitle: 'My Balcony Plants',
    dashboardManagePlants: 'Manage Garden',
    dashboardNoPlantsTitle: 'No Plants in Your Garden',
    dashboardNoPlantsDesc: 'Add your first tomato plant to unlock tailored watering advice and disease tracking.',
    dashboardWaterNowBtn: 'Log Watering',
    dashboardLocationBannerTitle: 'Set Your Garden Location',
    dashboardLocationBannerDesc: 'Enter your city and locality (e.g. Rajkot, Kalawad Road) to receive actual weather readings and avoid overwatering.',

    // Plants Page
    plantsTitle: 'My Urban Garden',
    plantsSubtitle: 'Manage your potted crops, monitor health status, and track watering schedules.',
    plantsFilterAll: 'All Plants',
    plantsFilterHealthy: 'Healthy',
    plantsFilterAttention: 'Needs Attention',
    plantsAddBtn: 'Add Plant',
    plantsEmptyTitle: 'No Plants Found',
    plantsEmptyDesc: 'Your urban garden is currently empty. Add a container plant to begin precision care.',
    plantsAddFirstBtn: 'Add Your First Plant',
    plantCardWateredAgo: 'Watered',
    plantCardNeedsWater: 'Needs Water',
    plantCardOptimalWater: 'Hydrated',
    plantCardTerracotta: 'Terracotta Pot',
    plantCardGrowBag: 'Fabric Grow Bag',
    plantCardPlastic: 'Plastic Container',
    plantCardSunHigh: 'Full Sun (6-8h)',
    plantCardSunMed: 'Partial Sun (4-6h)',
    plantCardSunLow: 'Low Light (<4h)',

    // Plant Detail Page
    plantDetailBack: 'Back to Plants',
    plantDetailSpecs: 'Container & Microclimate Profile',
    plantDetailContainer: 'Container Type',
    plantDetailSunlight: 'Sunlight Exposure',
    plantDetailLocation: 'Growing Location',
    plantDetailWaterHistory: 'Recent Watering History',
    plantDetailLogWaterBtn: 'Log Watering',
    plantDetailScanBtn: 'Scan Leaf',
    plantDetailDeleteBtn: 'Delete Plant',
    plantDetailConfirmDelete: 'Delete this plant from your garden?',
    plantDetailDeleteWarning: 'This action is permanent and will remove all associated watering records.',
    plantDetailRecentScans: 'Plant Scans',
    plantDetailNoScansForPlant: 'No disease scans recorded for this plant yet.',
    plantDetailCarePlanTitle: 'Personalized Care Guidelines',
    plantDetailCarePlanDesc: 'Based on your plant container and latest diagnostic results.',

    // Add Plant Modal
    addPlantTitle: 'Add Plant to Balcony',
    addPlantSubtitle: 'Specify container physics and sunlight to customize watering recommendations.',
    addPlantNameLabel: 'Plant Nickname',
    addPlantNamePlaceholder: 'e.g. Balcony Cherry Tomato, Pot #1',
    addPlantTypeLabel: 'Plant Variety',
    addPlantContainerLabel: 'Container Material',
    addPlantSunlightLabel: 'Daily Balcony Sun',
    addPlantLocationLabel: 'Placement Location',
    addPlantSubmitBtn: 'Add to Garden',
    addPlantCancelBtn: 'Cancel',
    addPlantSaving: 'Adding Plant...',

    // Log Watering Modal
    logWateringTitle: 'Log Plant Watering',
    logWateringSubtitle: 'Record moisture and volume to calibrate future watering schedules.',
    logWateringAmountLabel: 'Water Amount (ml)',
    logWateringSoilLabel: 'Soil Moisture Before Watering',
    logWateringNotesLabel: 'Notes (Optional)',
    logWateringSubmitBtn: 'Save Watering Record',
    logWateringCancelBtn: 'Cancel',
    soilDry: 'Bone Dry Topsoil',
    soilMoist: 'Slightly Moist',
    soilSoggy: 'Wet / Soggy',

    // Scanner Page
    scannerTitle: 'AI Foliage Diagnostic Scanner',
    scannerSubtitle: 'Upload a clear photograph of a tomato leaf to evaluate foliage health and identify diseases.',
    scannerDropzoneTitle: 'Drag & drop a leaf photograph here',
    scannerDropzoneSub: 'Supports JPG, PNG, and WebP up to 10MB',
    scannerCameraBtn: 'Take Photo with Camera',
    scannerUploadBtn: 'Choose Image from Device',
    scannerSelectPlantLabel: 'Associate with Plant (Optional)',
    scannerOptional: 'Optional',
    scannerNotesLabel: 'Observation Notes (Optional)',
    scannerNotesPlaceholder: 'e.g. Noticed small dark spots on bottom leaves after morning rain',
    scannerAnalyzeBtn: 'Analyze Foliage Specimen',
    scannerAnalyzingTitle: 'Analyzing Foliage...',
    scannerAnalyzingDesc: 'Running convolutional vision model with calibrated softmax scaling...',
    scannerTipsTitle: 'Photography Tips for Accurate Results',
    scannerTip1: 'Capture a single leaflet against neutral lighting.',
    scannerTip2: 'Avoid blurry shots or strong flash glare on wet leaves.',
    scannerTip3: 'Focus closely on spots or discoloration.',

    // Diagnosis Result Page
    diagnosisTitle: 'Diagnostic Assessment',
    diagnosisBackDashboard: 'Back to Dashboard',
    diagnosisScanAnother: 'Scan Another Leaf',
    diagnosisCalibratedConfidence: 'Calibrated Confidence',
    diagnosisInconclusiveTitle: 'Inconclusive Visual Sample',
    diagnosisInconclusiveDesc: 'Confidence threshold below 65%. Retake photo in bright diffused daylight or compare physical symptoms below.',
    diagnosisWhatToDoTitle: 'What to Do Right Now',
    diagnosisWhyItMattersTitle: 'Why This Helps',
    diagnosisWhenToDoTitle: 'When to Do It',
    diagnosisSymptomsTitle: 'Symptoms to Look For',
    diagnosisImmediateActionsTitle: 'Immediate Care Steps',
    diagnosisOrganicCareTitle: 'Safe Organic & Home Remedies',
    diagnosisPreventionTitle: 'Long-term Prevention',
    diagnosisChemicalNoticeTitle: 'Responsible Safety Guidance',
    diagnosisChemicalNoticeDesc: 'Always prioritize non-toxic organic controls on home balconies.',
    diagnosisTermsTitle: 'Simple Gardening Terms Explained',
    diagnosisRetakeHint: 'Uncertain about this result? Retake a clearer photo in natural daylight.',

    // Care Planner Page
    carePlannerTitle: 'Weather-Informed Care & Irrigation Planner',
    carePlannerSubtitle: 'Contextual irrigation guidance calculated from real-time Open-Meteo forecasts, container physics, and balcony micro-climates.',
    carePlannerBadge: 'Microclimate Hydration Engine',
    carePlannerWeatherHighlights: 'Current Forecast',
    carePlannerShelterNoteTitle: 'The Balcony Shelter Factor',
    carePlannerShelterNoteDesc: 'Balcony ceilings block natural rain. Always check container soil directly rather than assuming rain hydrated your plant.',
    carePlannerPlantGuidanceTitle: 'Plant-by-Plant Watering Advice',
    carePlannerNoPlants: 'Add plants to view personalized watering recommendations.',
    carePlannerUrgencyWater: 'Water Needed Today',
    carePlannerUrgencyCheck: 'Check Soil Moisture',
    carePlannerUrgencySkip: 'Skip Watering Today',
    carePlannerContainerPhysicsTitle: 'Container Physics Guide',

    // Settings Page
    settingsTitle: 'System & Account Settings',
    settingsSubtitle: 'Configure microclimate location, temperature metrics, profile details, and language preferences.',
    settingsProfileTitle: 'Gardener Profile',
    settingsNameLabel: 'Display Name',
    settingsEmailLabel: 'Email Address',
    settingsLocationTitle: 'Location & Weather Context',
    settingsCityLabel: 'Balcony City',
    settingsAreaLabel: 'Area / Locality',
    settingsGpsTitle: 'Automatic Browser Geolocation',
    settingsGpsDesc: 'Allow browser to detect exact GPS latitude/longitude for weather queries (optional).',
    settingsUnitsTitle: 'Temperature Unit',
    settingsLanguageTitle: 'Application Language',
    settingsStorageTitle: 'Database & Cloud Connection Status',
    settingsSaveBtn: 'Save Settings',
    settingsSavedSuccess: 'Settings saved successfully!',
    settingsLogoutBtn: 'Sign Out of Garden',

    // Status & Error Messages
    demoNoticeBadge: 'Local Development Mode',
    demoNoticeText: 'Cloud Supabase credentials are not configured in .env. Authenticating in local mode with persistent session storage.',
    demoQuickFill: 'Quick Fill Test Credentials',
    errorInvalidEmail: 'Please enter a valid email address.',
    errorShortPassword: 'Password must be at least 6 characters.',
    errorPasswordMismatch: 'Passwords do not match.',
    errorLoginFailed: 'Sign in failed. Please check your credentials.',
    protectedNotice: 'Please sign in to access this garden feature.',

    // Common Buttons & Words
    commonCancel: 'Cancel',
    commonSave: 'Save',
    commonDelete: 'Delete',
    commonRetry: 'Retry',
    commonClose: 'Close',
    commonToday: 'Today',
    commonTomorrow: 'Tomorrow',
    commonDayAfter: 'Day 3',
    commonDaysAgo: 'days ago',
    commonHoursAgo: 'hours ago',
    commonOptimal: 'Optimal Care',
    commonAttention: 'Attention Needed',
    commonCritical: 'Critical Action',
    commonHealthy: 'Healthy',

    // Footer
    footerTagline: 'Empowering city growers with evidence-based agricultural AI.',
    footerCopyright: '© 2026 FloraPulse AI. Built for urban sustainable agriculture.',
  },

  hi: {
    // Brand & Common Nav
    brandName: 'FloraPulse AI',
    tagline: 'शहरी बागवानी सहायक',
    navHome: 'होम',
    navDashboard: 'डैशबोर्ड',
    navPlants: 'मेरे पौधे',
    navScanner: 'एआई रोग स्कैनर',
    navCare: 'देखभाल योजनाकार',
    navSettings: 'सेटिंग्स',
    navLogin: 'साइन इन',
    navSignup: 'निःशुल्क शुरू करें',
    navLogout: 'लॉग आउट',
    goToDashboard: 'डैशबोर्ड खोलें',

    // Homepage Hero
    heroBadge: 'वनस्पति दृष्टि एवं बालकनी माइक्रॉक्लाइमेट',
    heroTitle: 'शहरी बालकनियों और छतों के लिए बुद्धिमान पर्ण निदान और सटीक देखभाल।',
    heroSubtitle: 'अंशांकित एआई से सेकंडों में टमाटर के पत्तों के रोगों का निदान करें, मौसम के आधार पर पानी देने का समय तय करें और गमलों के लिए तैयार जैविक उपचार अपनाएं।',
    heroCtaPrimary: 'निःशुल्क निदान शुरू करें',
    heroCtaDemo: 'लाइव डेमो देखें',
    heroCtaSignIn: 'बगीचे में साइन इन करें',

    // Homepage Stats
    statConditions: '10 टमाटर रोग',
    statConditionsSub: 'प्लांटविलेज अंशांकित मॉडल',
    statInference: 'अंशांकित सॉफ्टमैक्स',
    statInferenceSub: 'अनिश्चितता व घाव विश्लेषण',
    statMicroclimate: 'बालकनी मौसम',
    statMicroclimateSub: 'ओपन-मेटियो व गमला भौतिकी',

    // How It Works Section
    howItWorksPre: 'आसान 4-चरणीय प्रक्रिया',
    howItWorksTitle: 'फ्लोरापल्स एआई कैसे काम करता है',
    howItWorksSubtitle: 'पौधे जोड़ने से लेकर सटीक पत्ती निदान और मौसम-आधारित सिंचाई तक — शहरी गमलों के लिए सरल व व्यावहारिक पादप देखभाल।',
    howStep1Num: '01',
    howStep1Title: 'अपना पौधा और गमले का विवरण जोड़ें',
    howStep1Desc: 'अपने पौधे की किस्म, गमले का प्रकार (मिट्टी, कपड़े का ग्रो बैग, या प्लास्टिक) और बालकनी की धूप चुनें ताकि सही देखभाल आधार तैयार हो सके।',
    howStep2Num: '02',
    howStep2Title: 'पत्ती के स्वास्थ्य की जांच के लिए फोटो लें',
    howStep2Desc: 'पत्ती की एक साफ तस्वीर अपलोड करें। हमारा दृष्टि मॉडल टमाटर के 10 रोगों की पहचान करता है और स्पष्ट विश्वास स्कोर प्रदान करता है।',
    howStep3Num: '03',
    howStep3Title: 'सरल जैविक देखभाल मार्गदर्शन प्राप्त करें',
    howStep3Desc: 'अपनी भाषा में आसान और चरणबद्ध जैविक उपचार प्राप्त करें: तुरंत क्या करें, यह क्यों मदद करता है और कब करना है।',
    howStep4Num: '04',
    howStep4Title: 'मौसम के अनुसार पानी का सही संतुलन बनाएं',
    howStep4Desc: 'अपने शहर और इलाके के वास्तविक तापमान व आर्द्रता के आधार पर पौधों को अधिक पानी से बचाएं और बालकनी की छत के प्रभाव को समझें।',
    howCtaStart: 'पौधा जोड़कर शुरू करें',
    howCtaDemo: 'लाइव डेमो देखें',

    // Features Section
    featureSectionPre: 'वनस्पति प्रौद्योगिकी',
    featureSectionTitle: 'शहरी सूक्ष्म-स्थानों के लिए निर्मित सटीक पादप विज्ञान',
    featureSectionSub: 'बालकनी के पौधों को तेज हवा, कंक्रीट की दीवारों की गर्मी और गमले में पानी तेजी से सूखने जैसी चुनौतियों का सामना करना पड़ता है।',
    feature1Title: 'अंशांकित रोग निदान',
    feature1Desc: 'अगेती झुलसा, पछेती झुलसा, जीवाणु धब्बा और मकड़ी कीट की पहचान के लिए पत्ती की तस्वीर अपलोड करें, साथ ही अनिश्चितता संकेतक प्राप्त करें।',
    feature2Title: 'बालकनी माइक्रॉक्लाइमेट मॉडल',
    feature2Desc: 'छत की दिशा, गमले के प्रकार और सुरक्षा के साथ वास्तविक मौसम पूर्वानुमान को जोड़कर मिट्टी सूखने की दर का सटीक अनुमान लगाएं।',
    feature3Title: 'गमला एवं मिट्टी का विज्ञान',
    feature3Desc: 'मिट्टी के गमलों, कपड़े के ग्रो बैग और प्लास्टिक के कंटेनर के बीच अंतर समझकर जड़ों के लिए उचित ऑक्सीजन सुनिश्चित करें।',
    feature4Title: 'सुरक्षित जैविक उपचार',
    feature4Desc: 'नीम के तेल के छिड़काव, दूध के स्प्रे और जैविक उपचार के स्पष्ट दिशा-निर्देश जो शहरी घरों और पालतू जानवरों के लिए सुरक्षित हैं।',

    // Architecture & Transparency Section
    archTitle: 'पारदर्शी व आधुनिक आर्किटेक्चर',
    archSubtitle: 'दोहरे मोड के साथ निर्मित। SQLite और लोकल स्टोरेज के साथ तुरंत चलता है, और सुपाबेस क्लाउड पर जाने के लिए पूरी तरह तैयार है।',
    archLocalBadge: 'लोकल / ऑफलाइन तैयार',
    archCloudBadge: 'सुपाबेस क्लाउड तैयार',
    archDesc: 'सभी डेटाबेस माइग्रेशन, सुरक्षा नीतियां और प्राइवेट बकेट कॉन्फ़िगरेशन पहले से तैयार हैं।',

    // Showcase
    showcaseTitle: 'शहरी बालकनियों और छतों के लिए समर्पित',
    showcaseSubtitle: 'भारतीय बालकनी की रेलिंग से लेकर देश भर की खिड़कियों के छज्जों तक।',

    // Auth Screens
    loginTitle: 'फ्लोरापल्स में पुनः स्वागत है',
    loginSubtitle: 'अपने बगीचे, रोग निदान इतिहास और सिंचाई योजनाकार तक पहुंचने के लिए साइन इन करें।',
    signupTitle: 'अपना बगीचा खाता बनाएं',
    signupSubtitle: 'एआई की मदद से बालकनी में स्वस्थ पौधे उगाने वाले बागवानों से जुड़ें।',
    fullNameLabel: 'पूरा नाम',
    fullNamePlaceholder: 'उदा. आरव पटेल',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'कम से कम 6 अक्षर',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    loginButton: 'बगीचे में साइन इन करें',
    signupButton: 'खाता बनाएं',
    quickDemoButton: 'एक-क्लिक डेमो गार्डन लॉगिन',
    quickDemoDesc: 'बालकनी टमाटर के पौधों के साथ तुरंत संपूर्ण एप्लिकेशन का अनुभव करें।',
    dontHaveAccount: 'खाता नहीं है?',
    alreadyHaveAccount: 'पहले से खाता है?',
    signUpLink: 'निःशुल्क नया बनाएं',
    signInLink: 'यहाँ साइन इन करें',

    // Location & Weather Setup
    locModalTitle: 'बगीचे का स्थान चुनें',
    locModalSubtitle: 'सटीक स्थानीय मौसम से पानी देने की सटीक गणना संभव होती है।',
    locCityLabel: 'शहर',
    locCityPlaceholder: 'उदा. राजकोट, अहमदाबाद, पुणे',
    locAreaLabel: 'इलाका / क्षेत्र (वैकल्पिक)',
    locAreaPlaceholder: 'उदा. कालावाड रोड, रेस कोर्स, सैटेलाइट',
    locAreaHint: 'उदाहरण: शहर: राजकोट, इलाका: कालावाड रोड',
    locQuickSuggestions: 'त्वरित शहर चयन:',
    locDetectingGps: 'जीपीएस स्थान ढूंढा जा रहा है...',
    locUseCurrentGps: 'मेरे डिवाइस का वर्तमान स्थान (GPS) उपयोग करें',
    locSaveButton: 'स्थान लागू करें',
    locChangeBtn: 'स्थान बदलें',
    locSetLocation: 'स्थान चुनें',
    locResolving: 'सत्यापित किया जा रहा है...',
    locErrorCityRequired: 'कृपया अपना शहर दर्ज करें।',
    weatherTitle: 'स्थानीय माइक्रॉक्लाइमेट',
    weatherNoLocationTitle: 'कोई स्थान नहीं चुना गया',
    weatherNoLocationDesc: 'मौसम आधारित सिंचाई सलाह प्राप्त करने के लिए कृपया अपना शहर और इलाका चुनें।',
    weatherSetLocationBtn: 'स्थान चुनें',
    weatherFetchError: 'मौसम की जानकारी प्राप्त नहीं हो सकी',
    weatherRefresh: 'मौसम रीफ्रेश करें',
    weatherTranspirationHint: 'टमाटर के लिए अनुकूल तापमान सीमा: 21°C – 29°C',
    weatherHumidity: 'आर्द्रता',
    weatherWind: 'हवा',
    weatherRain: 'बारिश',
    weatherPhysicsActive: 'गमला भौतिकी नियम सक्रिय हैं',

    // Dashboard
    dashboardGreeting: 'नमस्ते, बागवान',
    dashboardSubtitle: 'आपकी बालकनी का मौसम और टमाटर पौधों का संपूर्ण अवलोकन।',
    dashboardScanCta: 'टमाटर पत्ती स्कैन करें',
    dashboardAddPlantCta: 'नया पौधा जोड़ें',
    dashboardStatsTotalPlants: 'कुल पौधे',
    dashboardStatsHealthy: 'स्वस्थ पौधे',
    dashboardStatsAttention: 'देखभाल आवश्यक',
    dashboardStatsWateringDue: 'पानी देने योग्य पौधे',
    dashboardPendingTasksTitle: 'बगीचे के लंबित कार्य',
    dashboardNoPendingTasks: 'सभी पौधे वर्तमान में पर्याप्त सींचे हुए और स्वस्थ हैं।',
    dashboardRecentScansTitle: 'हाल के निदान स्कैन',
    dashboardNoScansYet: 'अभी तक कोई स्कैन दर्ज नहीं किया गया। पत्ती की फोटो अपलोड करके जांच करें।',
    dashboardViewAllScans: 'सभी स्कैन देखें',
    dashboardMyGardenTitle: 'मेरे बालकनी पौधे',
    dashboardManagePlants: 'बगीचा प्रबंधित करें',
    dashboardNoPlantsTitle: 'बगीचे में कोई पौधा नहीं है',
    dashboardNoPlantsDesc: 'सटीक पानी देने की सलाह और रोग जांच के लिए अपना पहला पौधा जोड़ें।',
    dashboardWaterNowBtn: 'पानी दर्ज करें',
    dashboardLocationBannerTitle: 'अपने बगीचे का स्थान दर्ज करें',
    dashboardLocationBannerDesc: 'सही मौसम पूर्वानुमान और पानी के सही समय के लिए अपना शहर और इलाका दर्ज करें (उदा. राजकोट, कालावाड रोड)।',

    // Plants Page
    plantsTitle: 'मेरा शहरी बगीचा',
    plantsSubtitle: 'अपने गमलों का प्रबंधन करें, स्वास्थ्य स्थिति देखें और पानी देने का रिकॉर्ड रखें।',
    plantsFilterAll: 'सभी पौधे',
    plantsFilterHealthy: 'स्वस्थ',
    plantsFilterAttention: 'देखभाल आवश्यक',
    plantsAddBtn: 'पौधा जोड़ें',
    plantsEmptyTitle: 'कोई पौधा नहीं मिला',
    plantsEmptyDesc: 'आपका बगीचा अभी खाली है। पौधे जोड़कर स्मार्ट देखभाल शुरू करें।',
    plantsAddFirstBtn: 'पहला पौधा जोड़ें',
    plantCardWateredAgo: 'सींचा गया',
    plantCardNeedsWater: 'पानी आवश्यक',
    plantCardOptimalWater: 'संतोषजनक',
    plantCardTerracotta: 'मिट्टी का गमला',
    plantCardGrowBag: 'ग्रो बैग',
    plantCardPlastic: 'प्लास्टिक गमला',
    plantCardSunHigh: 'पूरी धूप (6-8 घंटे)',
    plantCardSunMed: 'मध्यम धूप (4-6 घंटे)',
    plantCardSunLow: 'कम रोशनी (<4 घंटे)',

    // Plant Detail Page
    plantDetailBack: 'पौधों की सूची पर वापस जाएं',
    plantDetailSpecs: 'गमला एवं माइक्रॉक्लाइमेट विवरण',
    plantDetailContainer: 'गमले का प्रकार',
    plantDetailSunlight: 'दैनिक धूप',
    plantDetailLocation: 'स्थान',
    plantDetailWaterHistory: 'पानी देने का इतिहास',
    plantDetailLogWaterBtn: 'पानी दर्ज करें',
    plantDetailScanBtn: 'पत्ती स्कैन करें',
    plantDetailDeleteBtn: 'पौधा हटाएं',
    plantDetailConfirmDelete: 'क्या आप इस पौधे को हटाना चाहते हैं?',
    plantDetailDeleteWarning: 'यह क्रिया स्थायी है और इससे जुड़े सभी सिंचाई रिकॉर्ड हटा दिए जाएंगे।',
    plantDetailRecentScans: 'रोग स्कैन इतिहास',
    plantDetailNoScansForPlant: 'इस पौधे के लिए अभी कोई स्कैन उपलब्ध नहीं है।',
    plantDetailCarePlanTitle: 'व्यक्तिगत देखभाल योजना',
    plantDetailCarePlanDesc: 'आपके गमले के प्रकार और नवीनतम जांच के आधार पर तैयार।',

    // Add Plant Modal
    addPlantTitle: 'बालकनी में पौधा जोड़ें',
    addPlantSubtitle: 'पानी की सही गणना के लिए गमले की सामग्री और धूप की स्थिति चुनें।',
    addPlantNameLabel: 'पौधे का नाम',
    addPlantNamePlaceholder: 'उदा. बालकनी चेरी टमाटर, गमला #1',
    addPlantTypeLabel: 'किस्म',
    addPlantContainerLabel: 'गमले की सामग्री',
    addPlantSunlightLabel: 'दैनिक धूप',
    addPlantLocationLabel: 'रखने का स्थान',
    addPlantSubmitBtn: 'बगीचे में जोड़ें',
    addPlantCancelBtn: 'रद्द करें',
    addPlantSaving: 'पौधा जोड़ा जा रहा है...',

    // Log Watering Modal
    logWateringTitle: 'पानी देना दर्ज करें',
    logWateringSubtitle: 'भविष्य की सिंचाई योजना को सटीक बनाने के लिए पानी की मात्रा दर्ज करें।',
    logWateringAmountLabel: 'पानी की मात्रा (मिलीलीटर)',
    logWateringSoilLabel: 'पानी देने से पहले मिट्टी की स्थिति',
    logWateringNotesLabel: 'टिप्पणी (वैकल्पिक)',
    logWateringSubmitBtn: 'रिकॉर्ड सहेजें',
    logWateringCancelBtn: 'रद्द करें',
    soilDry: 'पूरी तरह सूखी मिट्टी',
    soilMoist: 'हल्की नम मिट्टी',
    soilSoggy: 'बहुत गीली / दलदली मिट्टी',

    // Scanner Page
    scannerTitle: 'एआई पर्ण निदान स्कैनर',
    scannerSubtitle: 'रोगों की जांच और पौधों के स्वास्थ्य के लिए टमाटर की पत्ती की साफ तस्वीर अपलोड करें।',
    scannerDropzoneTitle: 'यहाँ पत्ती की तस्वीर खींचकर छोड़ें',
    scannerDropzoneSub: 'JPG, PNG, WebP (10MB तक समर्थित)',
    scannerCameraBtn: 'कैमरे से फोटो लें',
    scannerUploadBtn: 'डिवाइस से तस्वीर चुनें',
    scannerSelectPlantLabel: 'पौधे से जोड़ें (वैकल्पिक)',
    scannerOptional: 'वैकल्पिक',
    scannerNotesLabel: 'निरीक्षण टिप्पणी (वैकल्पिक)',
    scannerNotesPlaceholder: 'उदा. निचली पत्तियों पर भूरे धब्बे दिखाई दे रहे हैं',
    scannerAnalyzeBtn: 'पत्ती का विश्लेषण करें',
    scannerAnalyzingTitle: 'पत्ती का विश्लेषण जारी है...',
    scannerAnalyzingDesc: 'अंशांकित दृष्टि मॉडल के साथ रोग लक्षणों की जांच की जा रही है...',
    scannerTipsTitle: 'सटीक परिणाम के लिए फोटो सुझाव',
    scannerTip1: 'प्राकृतिक रोशनी में एक अकेली पत्ती की तस्वीर लें।',
    scannerTip2: 'धुंधली या गीली चमकती पत्तियों की फोटो से बचें।',
    scannerTip3: 'धब्बों या रोगग्रस्त हिस्से पर स्पष्ट फोकस रखें।',

    // Diagnosis Result Page
    diagnosisTitle: 'निदान परिणाम',
    diagnosisBackDashboard: 'डैशबोर्ड पर वापस जाएं',
    diagnosisScanAnother: 'दूसरी पत्ती स्कैन करें',
    diagnosisCalibratedConfidence: 'अंशांकित विश्वास स्तर',
    diagnosisInconclusiveTitle: 'अस्पष्ट नमूना',
    diagnosisInconclusiveDesc: 'विश्वास स्तर 65% से कम है। कृपया अच्छी रोशनी में दोबारा फोटो लें या नीचे दिए गए लक्षणों से मिलान करें।',
    diagnosisWhatToDoTitle: 'अभी क्या करना है',
    diagnosisWhyItMattersTitle: 'यह क्यों जरूरी है',
    diagnosisWhenToDoTitle: 'कब करना है',
    diagnosisSymptomsTitle: 'प्रमुख लक्षण',
    diagnosisImmediateActionsTitle: 'तुरंत करने योग्य कदम',
    diagnosisOrganicCareTitle: 'सुरक्षित जैविक उपचार',
    diagnosisPreventionTitle: 'भविष्य में रोकथाम',
    diagnosisChemicalNoticeTitle: 'सुरक्षा एवं सावधानी',
    diagnosisChemicalNoticeDesc: 'घर की बालकनी में हमेशा गैर-विषाक्त जैविक उपायों को प्राथमिकता दें।',
    diagnosisTermsTitle: 'बागवानी के सरल शब्दों का अर्थ',
    diagnosisRetakeHint: 'परिणाम से संतुष्ट नहीं हैं? दिन के उजाले में दोबारा स्पष्ट फोटो लें।',

    // Care Planner Page
    carePlannerTitle: 'मौसम-आधारित देखभाल एवं सिंचाई योजनाकार',
    carePlannerSubtitle: 'मौसम पूर्वानुमान, गमले के प्रकार और बालकनी की परिस्थितियों के आधार पर पानी देने का सही समय तय करें।',
    carePlannerBadge: 'माइक्रॉक्लाइमेट हाइड्रेशन इंजन',
    carePlannerWeatherHighlights: 'वर्तमान मौसम पूर्वानुमान',
    carePlannerShelterNoteTitle: 'बालकनी की छत का प्रभाव',
    carePlannerShelterNoteDesc: 'बालकनी की छत बारिश का पानी रोक लेती है। केवल मौसम देखकर पानी देना बंद न करें, हमेशा गमले की मिट्टी जांचें।',
    carePlannerPlantGuidanceTitle: 'प्रत्येक पौधे के लिए सिंचाई सलाह',
    carePlannerNoPlants: 'व्यक्तिगत सलाह देखने के लिए पौधे जोड़ें।',
    carePlannerUrgencyWater: 'आज पानी देना जरूरी है',
    carePlannerUrgencyCheck: 'मिट्टी की नमी जांचें',
    carePlannerUrgencySkip: 'आज पानी देने की जरूरत नहीं',
    carePlannerContainerPhysicsTitle: 'गमलों का विज्ञान',

    // Settings Page
    settingsTitle: 'सिस्टम एवं खाता सेटिंग्स',
    settingsSubtitle: 'स्थान, तापमान इकाई, प्रोफ़ाइल और भाषा प्राथमिकताएं बदलें।',
    settingsProfileTitle: 'बागवान प्रोफ़ाइल',
    settingsNameLabel: 'नाम',
    settingsEmailLabel: 'ईमेल पता',
    settingsLocationTitle: 'स्थान एवं मौसम सेटिंग्स',
    settingsCityLabel: 'शहर',
    settingsAreaLabel: 'इलाका / क्षेत्र',
    settingsGpsTitle: 'स्वचालित जीपीएस स्थान',
    settingsGpsDesc: 'सटीक मौसम के लिए ब्राउज़र को जीपीएस स्थान जानने की अनुमति दें (वैकल्पिक)।',
    settingsUnitsTitle: 'तापमान इकाई',
    settingsLanguageTitle: 'एप्लिकेशन भाषा',
    settingsStorageTitle: 'डेटाबेस एवं क्लाउड कनेक्शन स्थिति',
    settingsSaveBtn: 'सेटिंग्स सहेजें',
    settingsSavedSuccess: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
    settingsLogoutBtn: 'लॉग आउट करें',

    // Common Buttons & Words
    commonCancel: 'रद्द करें',
    commonSave: 'सहेजें',
    commonDelete: 'हटाएं',
    commonRetry: 'पुनः प्रयास करें',
    commonClose: 'बंद करें',
    commonToday: 'आज',
    commonTomorrow: 'कल',
    commonDayAfter: 'परसों',
    commonDaysAgo: 'दिन पहले',
    commonHoursAgo: 'घंटे पहले',
    commonOptimal: 'उत्कृष्ट स्थिति',
    commonAttention: 'देखभाल आवश्यक',
    commonCritical: 'गंभीर स्थिति',
    commonHealthy: 'स्वस्थ',

    // Footer
    footerTagline: 'प्रमाण-आधारित कृषि एआई के साथ शहरी बागवानों को सशक्त बनाना।',
    footerCopyright: '© 2026 FloraPulse AI. शहरी संधारणीय कृषि के लिए निर्मित।',
  },

  gu: {
    // Brand & Common Nav
    brandName: 'FloraPulse AI',
    tagline: 'શહેરી ખેતી સહાયક',
    navHome: 'હોમ',
    navDashboard: 'ડેશબોર્ડ',
    navPlants: 'મારા છોડ',
    navScanner: 'એઆઈ રોગ સ્કેનર',
    navCare: 'સંભાળ આયોજક',
    navSettings: 'સેટિંગ્સ',
    navLogin: 'સાઇન ઇન',
    navSignup: 'મફતમાં શરૂ કરો',
    navLogout: 'લૉગ આઉટ',
    goToDashboard: 'ડેશબોર્ડ ખોલો',

    // Homepage Hero
    heroBadge: 'વનસ્પતિ દ્રષ્ટિ અને બાલ્કની માઇક્રોક્લાઇમેટ',
    heroTitle: 'શહેરી બાલ્કનીઓ અને ટેરેસ માટે બુદ્ધિશાળી પર્ણ નિદાન અને સચોટ સંભાળ.',
    heroSubtitle: 'અંકિત એઆઈ વડે સેકન્ડોમાં ટામેટાના પાંદડાના રોગોનું નિદાન કરો, હવામાન અનુસાર પાણી આપવાનો સમય નક્કી કરો અને જૈવિક સારવાર અપનાવો.',
    heroCtaPrimary: 'મફતમાં નિદાન શરૂ કરો',
    heroCtaDemo: 'લાઈવ ડેમો જુઓ',
    heroCtaSignIn: 'બગીચામાં સાઇન ઇન કરો',

    // Homepage Stats
    statConditions: '10 ટામેટા રોગો',
    statConditionsSub: 'પ્લાન્ટવિલેજ કેલિબ્રેટેડ મોડેલ',
    statInference: 'કેલિબ્રેટેડ સોફ્ટમેક્સ',
    statInferenceSub: 'અનિશ્ચિતતા અને ડાઘ વિશ્લેષણ',
    statMicroclimate: 'બાલ્કની હવામાન',
    statMicroclimateSub: 'ઓપન-મેટિઓ અને કૂંડા ભૌતિકી',

    // How It Works Section
    howItWorksPre: 'સરળ 4-પગલાંની પ્રક્રિયા',
    howItWorksTitle: 'ફ્લોરાપલ્સ એઆઈ કેવી રીતે કાર્ય કરે છે',
    howItWorksSubtitle: 'છોડ ઉમેરવાથી લઈને સચોટ પાંદડાના નિદાન અને હવામાન-આધારિત પાણી આપવા સુધી — શહેરી કૂંડા માટે સરળ અને વ્યવહારુ સંભાળ.',
    howStep1Num: '01',
    howStep1Title: 'તમારા છોડ અને કૂંડાની વિગતો ઉમેરો',
    howStep1Desc: 'તમારી જાત, કૂંડાનો પ્રકાર (માટી, કાપડની ગ્રો બેગ, અથવા પ્લાસ્ટિક) અને બાલ્કનીનો તડકો પસંદ કરો જેથી સાચી સંભાળ ગણતરી થઈ શકે.',
    howStep2Num: '02',
    howStep2Title: 'પાંદડાની તંદુરસ્તી તપાસવા ફોટો પાડો',
    howStep2Desc: 'પાંદડાનો સ્પષ્ટ ફોટો અપલોડ કરો. અમારું મોડેલ ટામેટાના 10 રોગો ઓળખીને સ્પષ્ટ પરિણામ અને સલાહ આપે છે.',
    howStep3Num: '03',
    howStep3Title: 'સરળ જૈવિક સારવાર માર્ગદર્શન મેળવો',
    howStep3Desc: 'તમારી ભાષામાં સરળ અને પગલાવાર જૈવિક ઉપાયો: અત્યારે શું કરવું, આ શા માટે મદદ કરે છે અને ક્યારે કરવું.',
    howStep4Num: '04',
    howStep4Title: 'હવામાન મુજબ પાણીનું સંતુલન જાળવો',
    howStep4Desc: 'તમારા શહેર અને વિસ્તારના તાપમાન મુજબ છોડને વધુ પાણીથી બચાવો અને બાલ્કનીની છતની અસર સમજો.',
    howCtaStart: 'છોડ ઉમેરીને શરૂ કરો',
    howCtaDemo: 'લાઈવ ડેમો જુઓ',

    // Features Section
    featureSectionPre: 'વનસ્પતિ ટેકનોલોજી',
    featureSectionTitle: 'શહેરી નાની જગ્યાઓ માટે નિર્મિત સચોટ વનસ્પતિ વિજ્ઞાન',
    featureSectionSub: 'બાલ્કનીના છોડને ભારે પવન, દિવાલોની ગરમી અને કૂંડામાં ઝડપથી પાણી સુકાઈ જવાની સમસ્યાઓનો સામનો કરવો પડે છે.',
    feature1Title: 'સચોટ રોગ નિદાન',
    feature1Desc: 'અગેતી સુકારો, પાછોતરો સુકારો, બેક્ટેરિયલ સ્પોટ અને સ્પાઈડર માઈટ્સ ઓળખવા માટે પાંદડાનો ફોટો અપલોડ કરો.',
    feature2Title: 'બાલ્કની માઇક્રોક્લાઇમેટ મોડેલ',
    feature2Desc: 'ટેરેસની દિશા, કૂંડાની બનાવટ અને હવામાનની આગાહીને જોડીને પાણી આપવાનો સાચો સમય નક્કી કરો.',
    feature3Title: 'કૂંડા અને માટીનું વિજ્ઞાન',
    feature3Desc: 'માટીના કૂંડા, કાપડની ગ્રો બેગ અને પ્લાસ્ટિકના કન્ટેનર વચ્ચેનો ભેદ સમજીને મૂળિયાં માટે યોગ્ય ઓક્સિજન જાળવો.',
    feature4Title: 'કુદરતી જૈવિક ઉપચાર',
    feature4Desc: 'લીમડાના તેલનો છંટકાવ, દૂધનો સ્પ્રે અને જૈવિક ઉપચારો જે શહેરી ઘરો અને પાળતુ પ્રાણીઓ માટે સલામત છે.',

    // Architecture & Transparency Section
    archTitle: 'પારદર્શક અને આધુનિક આર્કિટેક્ચર',
    archSubtitle: 'બેવડા મોડ સાથે તૈયાર. SQLite અને લોકલ સ્ટોરેજ સાથે સીધું ચાલે છે, અને સુપાબેસ ક્લાઉડ માટે તૈયાર છે.',
    archLocalBadge: 'લોકલ / ઓફલાઇન સક્ષમ',
    archCloudBadge: 'સુપાબેસ ક્લાઉડ તૈયાર',
    archDesc: 'બધા ડેટાબેઝ માઇગ્રેશન અને સુરક્ષા નિયમો પ્રોજેક્ટમાં તૈયાર છે.',

    // Showcase
    showcaseTitle: 'શહેરી બાલ્કનીઓ અને ટેરેસ માટે ખાસ',
    showcaseSubtitle: 'ભારતીય બાલ્કનીઓની ગેલેરીથી લઈને દેશભરની બારીઓના છાજલાં સુધી.',

    // Auth Screens
    loginTitle: 'ફ્લોરાપલ્સમાં ફરી સ્વાગત છે',
    loginSubtitle: 'તમારા બગીચા, નિદાન ઇતિહાસ અને સિંચાઈ આયોજક જોવા માટે સાઇન ઇન કરો.',
    signupTitle: 'તમારું બગીચાનું ખાતું બનાવો',
    signupSubtitle: 'એઆઈની મદદથી બાલ્કનીમાં લીલાછમ છોડ ઉછેરતા હજારો માળીઓ સાથે જોડાઓ.',
    fullNameLabel: 'પૂરું નામ',
    fullNamePlaceholder: 'દા.ત. આરવ પટેલ',
    emailLabel: 'ઈમેલ સરનામું',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'પાસવર્ડ',
    passwordPlaceholder: 'ઓછામાં ઓછા 6 અક્ષરો',
    confirmPasswordLabel: 'પાસવર્ડની ખાતરી કરો',
    loginButton: 'બગીચામાં સાઇન ઇન કરો',
    signupButton: 'ખાતું બનાવો',
    quickDemoButton: 'એક-ક્લિક ડેમો ગાર્ડન લૉગિન',
    quickDemoDesc: 'બાલ્કની ટામેટાના છોડ સાથે તરત જ સંપૂર્ણ એપ્લિકેશનનો અનુભવ કરો.',
    dontHaveAccount: 'ખાતું નથી?',
    alreadyHaveAccount: 'પહેલેથી ખાતું છે?',
    signUpLink: 'મફત નવું ખાતું બનાવો',
    signInLink: 'અહીં સાઇન ઇન કરો',

    // Location & Weather Setup
    locModalTitle: 'બગીચાનું સ્થળ પસંદ કરો',
    locModalSubtitle: 'સચોટ સ્થાનિક હવામાનથી પાણી આપવાની સચોટ ગણતરી શક્ય બને છે.',
    locCityLabel: 'શહેર',
    locCityPlaceholder: 'દા.ત. રાજકોટ, અમદાવાદ, સુરત',
    locAreaLabel: 'વિસ્તાર / સોસાયટી (વૈકલ્પિક)',
    locAreaPlaceholder: 'દા.ત. કાલાવડ રોડ, રેસ કોર્સ, સેટેલાઇટ',
    locAreaHint: 'ઉદાહરણ: શહેર: રાજકોટ, વિસ્તાર: કાલાવડ રોડ',
    locQuickSuggestions: 'ઝડપી શહેર પસંદગી:',
    locDetectingGps: 'જીપીએસ સ્થાન શોધાઈ રહ્યું છે...',
    locUseCurrentGps: 'મારા ઉપકરણનું વર્તમાન સ્થાન (GPS) વાપરો',
    locSaveButton: 'સ્થળ લાગુ કરો',
    locChangeBtn: 'સ્થળ બદલો',
    locSetLocation: 'સ્થળ પસંદ કરો',
    locResolving: 'ચકાસણી ચાલુ છે...',
    locErrorCityRequired: 'કૃપા કરીને તમારું શહેર દાખલ કરો.',
    weatherTitle: 'સ્થાનિક માઇક્રોક્લાઇમેટ',
    weatherNoLocationTitle: 'કોઈ સ્થળ પસંદ કરેલ નથી',
    weatherNoLocationDesc: 'હવામાન આધારિત સિંચાઈ સલાહ મેળવવા માટે કૃપા કરીને તમારું શહેર અને વિસ્તાર પસંદ કરો.',
    weatherSetLocationBtn: 'સ્થળ પસંદ કરો',
    weatherFetchError: 'હવામાનની વિગતો મેળવી શકાઈ નથી',
    weatherRefresh: 'હવામાન તાજું કરો',
    weatherTranspirationHint: 'ટામેટા માટે ઉત્તમ તાપમાન સીમા: 21°C – 29°C',
    weatherHumidity: 'ભેજ',
    weatherWind: 'પવન',
    weatherRain: 'વરસાદ',
    weatherPhysicsActive: 'કૂંડા ભૌતિકી નિયમો સક્રિય છે',

    // Dashboard
    dashboardGreeting: 'સ્વાગત છે, માળી મિત્ર',
    dashboardSubtitle: 'તમારી બાલ્કનીનું હવામાન અને ટામેટાના છોડની એકંદર સ્થિતિ.',
    dashboardScanCta: 'ટામેટાનું પાંદડું સ્કેન કરો',
    dashboardAddPlantCta: 'નવો છોડ ઉમેરો',
    dashboardStatsTotalPlants: 'કુલ છોડ',
    dashboardStatsHealthy: 'તંદુરસ્ત છોડ',
    dashboardStatsAttention: 'સંભાળ જરૂરી',
    dashboardStatsWateringDue: 'પાણી આપવાના છોડ',
    dashboardPendingTasksTitle: 'બાકી રહેલા કાર્યો',
    dashboardNoPendingTasks: 'બધા છોડ હાલમાં પૂરતા સિંચાયેલા અને સ્વસ્થ છે.',
    dashboardRecentScansTitle: 'તાજેતરના સ્કેન',
    dashboardNoScansYet: 'હજુ સુધી કોઈ સ્કેન નોંધાયેલ નથી. પાંદડાનો ફોટો અપલોડ કરીને તપાસ કરો.',
    dashboardViewAllScans: 'બધા સ્કેન જુઓ',
    dashboardMyGardenTitle: 'મારા બાલ્કની છોડ',
    dashboardManagePlants: 'બગીચો મેનેજ કરો',
    dashboardNoPlantsTitle: 'બગીચામાં કોઈ છોડ નથી',
    dashboardNoPlantsDesc: 'સચોટ પાણી આપવાની સલાહ અને રોગ તપાસ માટે તમારો પ્રથમ છોડ ઉમેરો.',
    dashboardWaterNowBtn: 'પાણી આપેલ નોંધો',
    dashboardLocationBannerTitle: 'તમારા બગીચાનું સ્થળ દાખલ કરો',
    dashboardLocationBannerDesc: 'સાચી હવામાન આગાહી અને પાણી આપવાના સાચા સમય માટે તમારું શહેર અને વિસ્તાર દાખલ કરો (દા.ત. રાજકોટ, કાલાવડ રોડ).',

    // Plants Page
    plantsTitle: 'મારો શહેરી બગીચો',
    plantsSubtitle: 'તમારા કૂંડાનું સંચાલન કરો, તંદુરસ્તી જુઓ અને પાણી આપવાનું શેડ્યૂલ ટ્રૅક કરો.',
    plantsFilterAll: 'બધા છોડ',
    plantsFilterHealthy: 'તંદુરસ્ત',
    plantsFilterAttention: 'સંભાળ જરૂરી',
    plantsAddBtn: 'છોડ ઉમેરો',
    plantsEmptyTitle: 'કોઈ છોડ મળ્યો નથી',
    plantsEmptyDesc: 'તમારો બગીચો હાલમાં ખાલી છે. સ્માર્ટ સંભાળ શરૂ કરવા છોડ ઉમેરો.',
    plantsAddFirstBtn: 'પ્રથમ છોડ ઉમેરો',
    plantCardWateredAgo: 'પાણી આપ્યું',
    plantCardNeedsWater: 'પાણી જરૂરી',
    plantCardOptimalWater: 'સંતોષકારક',
    plantCardTerracotta: 'માટીનું કૂંડું',
    plantCardGrowBag: 'ગ્રો બેગ',
    plantCardPlastic: 'પ્લાસ્ટિક કૂંડું',
    plantCardSunHigh: 'સંપૂર્ણ તડકો (6-8 કલાક)',
    plantCardSunMed: 'મધ્યમ તડકો (4-6 કલાક)',
    plantCardSunLow: 'ઓછો તડકો (<4 કલાક)',

    // Plant Detail Page
    plantDetailBack: 'છોડની યાદી પર પાછા જાઓ',
    plantDetailSpecs: 'કૂંડું અને માઇક્રોક્લાઇમેટ વિગતો',
    plantDetailContainer: 'કૂંડાનો પ્રકાર',
    plantDetailSunlight: 'દૈનિક તડકો',
    plantDetailLocation: 'સ્થળ',
    plantDetailWaterHistory: 'પાણી આપવાનો ઇતિહાસ',
    plantDetailLogWaterBtn: 'પાણી આપ્યાની નોંધ કરો',
    plantDetailScanBtn: 'પાંદડું સ્કેન કરો',
    plantDetailDeleteBtn: 'છોડ દૂર કરો',
    plantDetailConfirmDelete: 'શું તમે આ છોડને દૂર કરવા માંગો છો?',
    plantDetailDeleteWarning: 'આ ક્રિયા કાયમી છે અને તેની સાથે જોડાયેલ તમામ રેકોર્ડ દૂર થશે.',
    plantDetailRecentScans: 'રોગ સ્કેન ઇતિહાસ',
    plantDetailNoScansForPlant: 'આ છોડ માટે હજુ સુધી કોઈ સ્કેન ઉપલબ્ધ નથી.',
    plantDetailCarePlanTitle: 'વ્યક્તિગત સંભાળ આયોજન',
    plantDetailCarePlanDesc: 'તમારા કૂંડા અને તાજેતરના સ્કેન પરિણામના આધારે તૈયાર.',

    // Add Plant Modal
    addPlantTitle: 'બાલ્કનીમાં છોડ ઉમેરો',
    addPlantSubtitle: 'પાણીની સાચી ગણતરી માટે કૂંડાની બનાવટ અને તડકાની સ્થિતિ પસંદ કરો.',
    addPlantNameLabel: 'છોડનું નામ',
    addPlantNamePlaceholder: 'દા.ત. બાલ્કની ચેરી ટામેટા, કૂંડું #1',
    addPlantTypeLabel: 'જાત',
    addPlantContainerLabel: 'કૂંડાની બનાવટ',
    addPlantSunlightLabel: 'દૈનિક તડકો',
    addPlantLocationLabel: 'મૂકવાની જગ્યા',
    addPlantSubmitBtn: 'બગીચામાં ઉમેરો',
    addPlantCancelBtn: 'રદ કરો',
    addPlantSaving: 'છોડ ઉમેરાઈ રહ્યો છે...',

    // Log Watering Modal
    logWateringTitle: 'પાણી આપ્યાની નોંધ કરો',
    logWateringSubtitle: 'ભવિષ્યના સિંચાઈ આયોજનને સચોટ બનાવવા પાણીની માત્રા નોંધો.',
    logWateringAmountLabel: 'પાણીની માત્રા (મિલીલીટર)',
    logWateringSoilLabel: 'પાણી આપતા પહેલાં માટીની સ્થિતિ',
    logWateringNotesLabel: 'નોંધ (વૈકલ્પિક)',
    logWateringSubmitBtn: 'નોંધ સાચવો',
    logWateringCancelBtn: 'રદ કરો',
    soilDry: 'તદ્દન સૂકી માટી',
    soilMoist: 'હળવી ભેજવાળી માટી',
    soilSoggy: 'અતિશય ભીની / કાદવવાળી માટી',

    // Scanner Page
    scannerTitle: 'એઆઈ પર્ણ નિદાન સ્કેનર',
    scannerSubtitle: 'રોગોની તપાસ અને છોડના સ્વાસ્થ્ય માટે ટામેટાના પાંદડાનો સ્પષ્ટ ફોટો અપલોડ કરો.',
    scannerDropzoneTitle: 'અહીં પાંદડાનો ફોટો ખેંચીને મૂકો',
    scannerDropzoneSub: 'JPG, PNG, WebP (10MB સુધી)',
    scannerCameraBtn: 'કેમેરાથી ફોટો પાડો',
    scannerUploadBtn: 'ઉપકરણમાંથી ફોટો પસંદ કરો',
    scannerSelectPlantLabel: 'છોડ સાથે જોડો (વૈકલ્પિક)',
    scannerOptional: 'વૈકલ્પિક',
    scannerNotesLabel: 'અવલોકન નોંધ (વૈકલ્પિક)',
    scannerNotesPlaceholder: 'દા.ત. નીચેના પાંદડા પર કાળા ડાઘ દેખાય છે',
    scannerAnalyzeBtn: 'પાંદડાનું વિશ્લેષણ કરો',
    scannerAnalyzingTitle: 'પાંદડાનું વિશ્લેષણ થઈ રહ્યું છે...',
    scannerAnalyzingDesc: 'કેલિબ્રેટેડ વિઝન મોડેલ દ્વારા રોગના લક્ષણો તપાસાઈ રહ્યા છે...',
    scannerTipsTitle: 'સચોટ પરિણામ માટે ફોટો ટિપ્સ',
    scannerTip1: 'કુદરતી અજવાળામાં એક જ પાંદડાનો ફોટો લો.',
    scannerTip2: 'ઝાંખા અથવા ભીના ચમકતા પાંદડાનો ફોટો ન લેશો.',
    scannerTip3: 'ડાઘ કે રોગગ્રસ્ત ભાગ પર કેમેરો કેન્દ્રિત રાખો.',

    // Diagnosis Result Page
    diagnosisTitle: 'નિદાન પરિણામ',
    diagnosisBackDashboard: 'ડેશબોર્ડ પર પાછા જાઓ',
    diagnosisScanAnother: 'બીજું પાંદડું સ્કેન કરો',
    diagnosisCalibratedConfidence: 'કેલિબ્રેટેડ વિશ્વાસ સ્તર',
    diagnosisInconclusiveTitle: 'અસ્પષ્ટ નમૂનો',
    diagnosisInconclusiveDesc: 'વિશ્વાસ સ્તર 65% કરતાં ઓછું છે. કૃપા કરીને સારા અજવાળામાં ફરીથી ફોટો લો અથવા નીચેના લક્ષણો સરખાવો.',
    diagnosisWhatToDoTitle: 'અત્યારે શું કરવું',
    diagnosisWhyItMattersTitle: 'આ શા માટે મદદ કરે છે',
    diagnosisWhenToDoTitle: 'ક્યારે કરવું',
    diagnosisSymptomsTitle: 'જોવા મળતા મુખ્ય લક્ષણો',
    diagnosisImmediateActionsTitle: 'તરત લેવાના પગલાં',
    diagnosisOrganicCareTitle: 'સલામત કુદરતી જૈવિક ઉપાયો',
    diagnosisPreventionTitle: 'લાંબા ગાળાની અગમચેતી',
    diagnosisChemicalNoticeTitle: 'જવાબદાર સુરક્ષા માર્ગદર્શન',
    diagnosisChemicalNoticeDesc: 'ઘરની બાલ્કનીમાં હંમેશા બિન-ઝેરી જૈવિક ઉપાયોને પ્રાથમિકતા આપો.',
    diagnosisTermsTitle: 'બાગકામના સરળ શબ્દોની સમજૂતી',
    diagnosisRetakeHint: 'પરિણામથી અસંતોષ છે? દિવસના અજવાળામાં ફરીથી સ્પષ્ટ ફોટો લો.',

    // Care Planner Page
    carePlannerTitle: 'હવામાન-આધારિત સંભાળ અને સિંચાઈ આયોજક',
    carePlannerSubtitle: 'હવામાન આગાહી, કૂંડાના પ્રકાર અને બાલ્કનીની સ્થિતિ મુજબ પાણી આપવાનો સાચો સમય નક્કી કરો.',
    carePlannerBadge: 'માઇક્રોક્લાઇમેટ હાઇડ્રેશન એન્જિન',
    carePlannerWeatherHighlights: 'હાલની હવામાન આગાહી',
    carePlannerShelterNoteTitle: 'બાલ્કનીની છતની અસર',
    carePlannerShelterNoteDesc: 'બાલ્કનીની છત વરસાદનું પાણી રોકે છે. ફક્ત વરસાદ જોઈને પાણી આપવાનું બંધ ન કરો, હંમેશા કૂંડાની માટી તપાસો.',
    carePlannerPlantGuidanceTitle: 'દરેક છોડ માટે સિંચાઈ સલાહ',
    carePlannerNoPlants: 'વ્યક્તિગત સલાહ જોવા માટે છોડ ઉમેરો.',
    carePlannerUrgencyWater: 'આજે પાણી આપવું જરૂરી છે',
    carePlannerUrgencyCheck: 'માટીનો ભેજ તપાસો',
    carePlannerUrgencySkip: 'આજે પાણી આપવાની જરૂર નથી',
    carePlannerContainerPhysicsTitle: 'કૂંડાનું વિજ્ઞાન',

    // Settings Page
    settingsTitle: 'સિસ્ટમ અને એકાઉન્ટ સેટિંગ્સ',
    settingsSubtitle: 'સ્થળ, તાપમાન એકમ, પ્રોફાઇલ અને ભાષા પસંદગીઓ બદલો.',
    settingsProfileTitle: 'માળી પ્રોફાઇલ',
    settingsNameLabel: 'નામ',
    settingsEmailLabel: 'ઈમેલ સરનામું',
    settingsLocationTitle: 'સ્થળ અને હવામાન સેટિંગ્સ',
    settingsCityLabel: 'શહેર',
    settingsAreaLabel: 'વિસ્તાર',
    settingsGpsTitle: 'આપોઆપ જીપીએસ સ્થાન',
    settingsGpsDesc: 'સચોટ હવામાન માટે બ્રાઉઝરને જીપીએસ સ્થાન જાણવાની પરવાનગી આપો (વૈકલ્પિક).',
    settingsUnitsTitle: 'તાપમાન એકમ',
    settingsLanguageTitle: 'એપ્લિકેશન ભાષા',
    settingsStorageTitle: 'ડેટાબેઝ અને ક્લાઉડ જોડાણ સ્થિતિ',
    settingsSaveBtn: 'સેટિંગ્સ સાચવો',
    settingsSavedSuccess: 'સેટિંગ્સ સફળતાપૂર્વક સાચવવામાં આવી!',
    settingsLogoutBtn: 'લૉગ આઉટ કરો',

    // Common Buttons & Words
    commonCancel: 'રદ કરો',
    commonSave: 'સાચવો',
    commonDelete: 'દૂર કરો',
    commonRetry: 'ફરી પ્રયાસ કરો',
    commonClose: 'બંધ કરો',
    commonToday: 'આજે',
    commonTomorrow: 'આવતીકાલે',
    commonDayAfter: 'પરમદિવસે',
    commonDaysAgo: 'દિવસો પહેલાં',
    commonHoursAgo: 'કલાક પહેલાં',
    commonOptimal: 'ઉત્તમ સ્થિતિ',
    commonAttention: 'સંભાળ જરૂરી',
    commonCritical: 'ગંભીર સ્થિતિ',
    commonHealthy: 'તંદુરસ્ત',

    // Footer
    footerTagline: 'પુરાવા-આધારિત કૃષિ એઆઈ વડે શહેરી ખેડૂતોને સશક્ત બનાવવું.',
    footerCopyright: '© 2026 FloraPulse AI. શહેરી ટકાઉ ખેતી માટે નિર્મિત.',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('flora_language') || 'en';
  });

  // Sync with Supabase user metadata when auth session changes
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const userLang = session?.user?.user_metadata?.language;
        if (userLang && TRANSLATIONS[userLang]) {
          setLanguageState(userLang);
          localStorage.setItem('flora_language', userLang);
        }
      });
    }
  }, []);

  const setLanguage = async (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem('flora_language', langCode);

      // Persist to Supabase user metadata if signed in
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.updateUser({
            data: { language: langCode }
          });
        } catch (e) {
          // ignore offline error
        }
      }
    }
  };

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key] !== undefined) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key] !== undefined) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
