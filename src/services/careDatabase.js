/**
 * FloraPulse AI — Beginner-Friendly Agronomic Care Knowledge Base
 * Explains plant care in simple, everyday language for home balcony gardeners.
 * Fully localized in English, Hindi, and Gujarati with practical 3-part action steps:
 * 1. What to do right now
 * 2. Why this helps
 * 3. When to do it
 */

export const GLOSSARY_TERMS = {
  en: {
    pruning: 'Pruning: Cutting off dead or diseased leaves using clean scissors so the plant saves its energy for healthy growth.',
    mulching: 'Mulching: Spreading a thin 1-inch layer of dry leaves or coconut fiber over the pot soil to keep roots cool and retain moisture.',
    bottomWatering: 'Bottom Watering: Pouring water directly into the pot saucer or at the soil base so water soaks up into roots without wetting the leaves.',
    aeration: 'Root Aeration: Letting air reach the roots so they do not rot in soggy, waterlogged soil.',
    neemOil: 'Neem Oil Spray: A natural, plant-safe organic oil spray that gently clears away pests and fungal spots without harmful chemicals.'
  },
  hi: {
    pruning: 'छंटाई (Pruning): साफ कैंची से सूखी या रोगग्रस्त पत्तियों को काटना ताकि पौधा अपनी ऊर्जा स्वस्थ विकास में लगा सके।',
    mulching: 'मल्चिंग (Mulching): गमले की मिट्टी पर सूखे पत्ते या नारियल के रेशे की पतली परत बिछाना ताकि मिट्टी में नमी बनी रहे और जड़ें ठंडी रहें।',
    bottomWatering: 'जड़ सिंचाई (Bottom Watering): पत्तियों को गीला किए बिना सीधे गमले की जड़ या तश्तरी में पानी देना।',
    aeration: 'जड़ों की हवा (Aeration): गमले की मिट्टी को हल्का रखना ताकि जड़ों को सांस लेने के लिए हवा मिल सके और जड़ें सड़े नहीं।',
    neemOil: 'नीम का तेल (Neem Oil): प्राकृतिक और सुरक्षित जैविक तेल जो पौधों से कीड़े और फंगस को बिना किसी हानिकारक रसायन के दूर करता है।'
  },
  gu: {
    pruning: 'છંટાઈ (Pruning): સ્વચ્છ કાતર વડે સૂકા કે રોગિષ્ઠ પાંદડા કાપી નાખવા જેથી છોડ પોતાની શક્તિ નવા વિકાસમાં લગાવી શકે.',
    mulching: 'મલ્ચિંગ (Mulching): કૂંડાની માટી પર સૂકા પાંદડા અથવા નારિયેળના છોતરાં પાથરવા જેથી ભેજ જળવાઈ રહે અને મૂળ ઠંડા રહે.',
    bottomWatering: 'મૂળમાં પાણી (Bottom Watering): પાંદડા ભીના કર્યા વિના કૂંડાની નીચેની રકાબીમાં અથવા સીધું માટીમાં પાણી આપવું.',
    aeration: 'મૂળનો શ્વાસ (Aeration): કૂંડાની માટીને છૂટી રાખવી જેથી મૂળ સુધી હવા પહોંચે અને મૂળ કોહવાઈ ન જાય.',
    neemOil: 'લીમડાનું તેલ (Neem Oil): કુદરતી અને સલામત જૈવિક તેલ જે નુકસાનકારક કેમિકલ વિના જીવાત અને ફૂગને દૂર રાખે છે.'
  }
};

export const TOMATO_CONDITIONS = {
  tomato_healthy: {
    code: 'tomato_healthy',
    scientificName: 'Solanum lycopersicum (Healthy Foliage)',
    status: 'healthy',
    severity: 'none',
    translations: {
      en: {
        name: 'Healthy Tomato Plant',
        simpleSummary: 'Your plant looks green, strong, and full of life with no disease spots.',
        whatToDoNow: [
          'Water gently at the base only when top inch of soil feels dry.',
          'Give your plant 6 to 8 hours of daily natural balcony sunlight.',
          'Remove any small lower leaves that touch the soil directly.'
        ],
        whyItMatters: 'Keeping leaves dry and off the wet soil prevents fungal germs from splashing onto the plant.',
        whenToDoIt: 'Water in the early morning before the sun gets too hot.',
        symptoms: ['Clean, bright green leaves', 'No yellow rings or brown spots', 'Firm stems standing upright'],
        organicCare: ['Add a handful of vermicompost or seaweed tea once every 2 weeks to feed the roots.'],
        prevention: ['Space pots slightly apart so fresh balcony air can flow freely around all sides.']
      },
      hi: {
        name: 'स्वस्थ टमाटर का पौधा',
        simpleSummary: 'आपका पौधा हरा-भरा, मजबूत और बिल्कुल स्वस्थ है। पत्तियों पर कोई रोग नहीं है।',
        whatToDoNow: [
          'जब गमले की ऊपरी मिट्टी सूखी लगे, तभी केवल जड़ों में पानी दें।',
          'पौधे को रोज 6 से 8 घंटे बालकनी की सीधी धूप में रखें।',
          'निचली पत्तियों को काट दें जो गमले की गीली मिट्टी को छू रही हों।'
        ],
        whyItMatters: 'पत्तियों को सूखा रखने से फंगस और फफूंदी के कीटाणु पौधे पर नहीं पनपते।',
        whenToDoIt: 'सुबह के समय पानी दें ताकि दिन भर पौधा तरोताजा रहे।',
        symptoms: ['चमकदार हरी पत्तियां', 'कोई पीले या भूरे धब्बे नहीं', 'मजबूत और सीधा तना'],
        organicCare: ['हर 15 दिन में एक मुट्ठी वर्मीकम्पोस्ट (केंचुआ खाद) गमले की मिट्टी में मिलाएं।'],
        prevention: ['गमलों के बीच थोड़ी जगह रखें ताकि बालकनी की ताजी हवा चारों तरफ घूम सके।']
      },
      gu: {
        name: 'તંદુરસ્ત ટામેટાનો છોડ',
        simpleSummary: 'તમારો છોડ એકદમ લીલોછમ અને મજબૂત છે. પાંદડા પર કોઈ રોગ નથી.',
        whatToDoNow: [
          'કૂંડાની ઉપરની માટી સૂકી લાગે ત્યારે જ મૂળ પાસે હળવેથી પાણી આપો.',
          'છોડને દરરોજ 6 થી 8 કલાક બાલ્કનીનો તડકો આપો.',
          'માટીને અડતા નીચેના પાંદડા કાપી લો જેથી ચેપ ન લાગે.'
        ],
        whyItMatters: 'પાંદડા સૂકા રાખવાથી ફૂગના જંતુઓ પાંદડા પર ચોંટતા નથી.',
        whenToDoIt: 'સવારે વહેલા પાણી આપો જેથી દિવસ દરમિયાન છોડ તાજો રહે.',
        symptoms: ['ચમકદાર લીલા પાંદડા', 'કોઈ પીળા કે કથ્થઈ ડાઘ નથી', 'મજબૂત થડ'],
        organicCare: ['દર 15 દિવસે એક મુઠ્ઠી અળસિયાનું ખાતર (વર્મીકમ્પોસ્ટ) કૂંડામાં નાખો.'],
        prevention: ['કૂંડા વચ્ચે થોડી જગ્યા રાખો જેથી તાજી હવા સરળતાથી ફરી શકે.']
      }
    }
  },

  tomato_early_blight: {
    code: 'tomato_early_blight',
    scientificName: 'Alternaria solani',
    status: 'attention_needed',
    severity: 'moderate',
    translations: {
      en: {
        name: 'Early Blight (Brown Spots with Rings)',
        simpleSummary: 'A common fungus causing brown spots with bullseye rings, starting on lower leaves.',
        whatToDoNow: [
          'Step 1: Snip off all spotted lower leaves with clean scissors right away.',
          'Step 2: Throw the cut leaves into the household dustbin (do NOT put them in compost).',
          'Step 3: Pour water strictly at the soil level; keep all foliage completely dry.'
        ],
        whyItMatters: 'Removing sick leaves stops fungal spores from spreading up to your new flowers and tomatoes.',
        whenToDoIt: 'Prune immediately today, and water only early in the morning.',
        symptoms: ['Brown-black spots with round rings like a target board', 'Yellow color spreading around the spots', 'Lower leaves turning yellow and dropping off'],
        organicCare: ['Mix 5ml cold-pressed neem oil and 2 drops mild soap in 1 liter water; spray foliage at sunset once weekly.'],
        prevention: ['Add dry coconut mulch on top of soil to prevent water drops from splashing soil spores onto leaves.']
      },
      hi: {
        name: 'अगेती झुलसा (छल्लेदार भूरे धब्बे)',
        simpleSummary: 'एक सामान्य फफूंद रोग जिसमें निचली पत्तियों पर छल्लेदार गोल भूरे धब्बे बनते हैं।',
        whatToDoNow: [
          'कदम 1: जिन पत्तियों पर धब्बे हैं, उन्हें साफ कैंची से तुरंत काट लें।',
          'कदम 2: काटी गई पत्तियों को कूड़ेदान में फेंकें (खाद के गड्ढे में न डालें)।',
          'कदम 3: केवल गमले की मिट्टी में पानी डालें; पत्तियों पर पानी बिल्कुल न छिड़कें।'
        ],
        whyItMatters: 'बीमार पत्तियों को हटाने से फफूंद ऊपर की नई पत्तियों और टमाटरों में नहीं फैलती।',
        whenToDoIt: 'आज ही छंटाई करें और हमेशा सुबह के समय पानी दें।',
        symptoms: ['गोल छल्ले जैसे भूरे-काले धब्बे', 'धब्बों के चारों ओर पीलापन', 'निचली पत्तियों का सूखकर गिरना'],
        organicCare: ['1 लीटर पानी में 5 मिली नीम का तेल मिलाकर शाम के समय पत्तियों पर छिड़कें।'],
        prevention: ['गमले की मिट्टी पर सूखे पत्ते या नारियल के रेशे बिछाएं ताकि पानी के छींटे पत्तियों पर न पड़ें।']
      },
      gu: {
        name: 'અગેતી સુકારો (ગોળાકાર કથ્થઈ ડાઘ)',
        simpleSummary: 'એક સામાન્ય ફૂગ રોગ જેમાં નીચેના પાંદડા પર ગોળાકાર કથ્થઈ ડાઘ પડે છે.',
        whatToDoNow: [
          'પગલું 1: ડાઘવાળા બધા નીચેના પાંદડા સાફ કાતરથી તરત કાપી લો.',
          'પગલું 2: કાપેલા પાંદડા કચરાપેટીમાં ફેંકી દો (ખાતરના ખાડામાં ન નાખો).',
          'પગલું 3: પાણી ફક્ત કૂંડાની માટીમાં જ આપો; પાંદડા પર પાણી ન છાંટો.'
        ],
        whyItMatters: 'રોગવાળા પાંદડા દૂર કરવાથી ફૂગ ઉપરના નવા ટામેટા સુધી ફેલાતી અટકે છે.',
        whenToDoIt: 'આજે જ છંટાઈ કરો અને સવારે જ પાણી આપો.',
        symptoms: ['ચક્રીય ગોળ કથ્થઈ-કાળા ડાઘ', 'ડાઘની આસપાસ પીળાશ', 'નીચેના પાંદડા ખરી પડવા'],
        organicCare: ['1 લિટર પાણીમાં 5 મિલી લીમડાનું તેલ ઉમેરી સાંજના સમયે પાંદડા પર સ્પ્રે કરો.'],
        prevention: ['કૂંડાની માટી પર સૂકા પાંદડા પાથરો જેથી પાણીના છાંટા પાંદડા પર ન ઊડે.']
      }
    }
  },

  tomato_late_blight: {
    code: 'tomato_late_blight',
    scientificName: 'Phytophthora infestans',
    status: 'critical',
    severity: 'high',
    translations: {
      en: {
        name: 'Late Blight (Dark Water-Soaked Patches)',
        simpleSummary: 'A fast-acting fungal disease favored by wet weather that causes dark, oily patches on leaves.',
        whatToDoNow: [
          'Step 1: Move this pot away from your other plants immediately so it does not spread.',
          'Step 2: Cut off all dark, blackened stems and bag them securely in plastic.',
          'Step 3: Move the pot under balcony roof shelter to keep rain off the leaves.'
        ],
        whyItMatters: 'Late blight spreads rapidly in humid air. Isolating the pot protects your entire balcony garden.',
        whenToDoIt: 'Take action within the next few hours. Do not wait overnight.',
        symptoms: ['Dark brown oily-looking spots on leaves and stems', 'White fuzz under leaves on rainy days', 'Fruits turning brown and rotting quickly'],
        organicCare: ['Spray with organic copper soap spray or dilute sour buttermilk (1 part buttermilk to 9 parts water).'],
        prevention: ['Ensure lots of balcony breeze and never let foliage stay wet overnight.']
      },
      hi: {
        name: 'पछेती झुलसा (काले तेलीय धब्बे)',
        simpleSummary: 'बारिश और अधिक नमी में तेजी से फैलने वाला गंभीर फफूंद रोग जो पत्तियों को काला कर देता है।',
        whatToDoNow: [
          'कदम 1: इस गमले को तुरंत अन्य पौधों से अलग दूर रख दें ताकि बीमारी न फैले।',
          'कदम 2: काले पड़े तनों और पत्तियों को काटकर प्लास्टिक की थैली में बंद करके फेंकें।',
          'कदम 3: गमले को बालकनी की छत के नीचे रखें ताकि उस पर बारिश का पानी न पड़े।'
        ],
        whyItMatters: 'यह रोग बहुत तेजी से फैलता है। गमले को अलग रखने से आपके बाकी पौधे बच जाते हैं।',
        whenToDoIt: 'अगले कुछ घंटों में तुरंत यह कदम उठाएं। कल तक का इंतजार न करें।',
        symptoms: ['पत्तियों पर काले तेलीय बड़े धब्बे', 'पत्ती के नीचे सफेद रोएं जैसी फफूंद', 'टमाटर का काला पड़ना'],
        organicCare: ['खट्टी छाछ (1 भाग छाछ और 9 भाग पानी) मिलाकर पत्तियों पर छिड़कें।'],
        prevention: ['हवा का अच्छा बहाव रखें और रात के समय पत्तियों को कभी गीला न रहने दें।']
      },
      gu: {
        name: 'પાછોતરો સુકારો (કાળા ભીના ડાઘ)',
        simpleSummary: 'ભેજવાળા વાતાવરણમાં ઝડપથી ફેલાતો ગંભીર ફૂગ રોગ જે પાંદડાને કાળા કરી દે છે.',
        whatToDoNow: [
          'પગલું 1: આ કૂંડાને તરત જ અન્ય છોડથી દૂર મૂકી દો જેથી રોગ ન ફેલાય.',
          'પગલું 2: કાળા પડી ગયેલા ડાળી-પાંદડા કાપીને પ્લાસ્ટિકની થેલીમાં ભરીને ફેંકી દો.',
          'પગલું 3: કૂંડાને બાલ્કનીની છત નીચે મૂકો જેથી વરસાદનું પાણી પાંદડા પર ન પડે.'
        ],
        whyItMatters: 'આ રોગ ખૂબ ઝડપી ફેલાય છે. કૂંડું અલગ કરવાથી તમારા અન્ય છોડ સુરક્ષિત રહે છે.',
        whenToDoIt: 'આજે જ આગામી થોડા કલાકોમાં આ પગલું ભરો.',
        symptoms: ['પાંદડા પર કાળા તેલ જેવા ડાઘ', 'વરસાદમાં પાંદડા નીચે સફેદ ફૂગ', 'ટામેટા કાળા પડી સડવા'],
        organicCare: ['ખાટી છાશ (1 ભાગ છાશ અને 9 ભાગ પાણી) મિક્સ કરીને પાંદડા પર સ્પ્રે કરો.'],
        prevention: ['હવાની સારી અવરજવર રાખો અને રાત્રે પાંદડા ભીના ન રહેવા દો.']
      }
    }
  },

  tomato_bacterial_spot: {
    code: 'tomato_bacterial_spot',
    scientificName: 'Xanthomonas perforans',
    status: 'attention_needed',
    severity: 'moderate',
    translations: {
      en: {
        name: 'Bacterial Spot (Tiny Dark Dots)',
        simpleSummary: 'Bacteria causing tiny dark spots with yellow circles, common in warm rainy periods.',
        whatToDoNow: [
          'Step 1: Clip away heavily spotted leaves with clean shears.',
          'Step 2: Water only around the stem base and avoid touching wet leaves with bare hands.',
          'Step 3: Disinfect scissors with sanitizing wipe after trimming.'
        ],
        whyItMatters: 'Bacteria travel on water droplets. Keeping leaves dry stops the infection.',
        whenToDoIt: 'Prune on a dry sunny afternoon when leaves are completely dry.',
        symptoms: ['Small dark brown spots (under 3mm) with yellow halos', 'Leaves look ragged or shot full of tiny holes'],
        organicCare: ['Apply organic copper spray or diluted milk spray (1 part milk, 9 parts water) once a week in sun.'],
        prevention: ['Always wash hands after touching sick leaves to avoid infecting healthy plants.']
      },
      hi: {
        name: 'जीवाणु धब्बा (छोटे काले बिंदु)',
        simpleSummary: 'बैक्टीरिया से होने वाले छोटे काले धब्बे जिनके चारों तरफ पीला घेरा होता है।',
        whatToDoNow: [
          'कदम 1: अधिक प्रभावित पत्तियों को कैंची से काटकर अलग करें।',
          'कदम 2: केवल मिट्टी में पानी डालें, गीली पत्तियों को हाथों से न छुएं।',
          'कदम 3: छंटाई के बाद कैंची को साबुन या सैनिटाइजर से साफ करें।'
        ],
        whyItMatters: 'बैक्टीरिया पानी की बूंदों के जरिए एक पत्ती से दूसरी पत्ती तक पहुंचते हैं।',
        whenToDoIt: 'धूप वाले समय में करें जब पत्तियां पूरी तरह सूखी हों।',
        symptoms: ['छोटे काले-भूरे बिंदु', 'बिंदुओं के चारों ओर पीला छल्ला', 'पत्तियों में छोटे छेद दिखना'],
        organicCare: ['दूध का घोल (1 भाग दूध और 9 भाग पानी) मिलाकर धूप में पत्तियों पर छिड़कें।'],
        prevention: ['बीमार पत्तियों को छूने के बाद हमेशा हाथ धोएं।']
      },
      gu: {
        name: 'બેક્ટેરિયલ સ્પોટ (નાના કાળા ટપકાં)',
        simpleSummary: 'બેક્ટેરિયાથી થતા નાના કાળા ટપકાં જેની આસપાસ પીળી કિનારી હોય છે.',
        whatToDoNow: [
          'પગલું 1: વધુ અસરગ્રસ્ત પાંદડા કાતરથી કાપી લો.',
          'પગલું 2: માત્ર માટીમાં જ પાણી આપો, ભીના પાંદડાને હાથ ન લગાડો.',
          'પગલું 3: કાપ્યા પછી કાતરને સાબુ કે સેનિટાઈઝરથી સાફ કરો.'
        ],
        whyItMatters: 'બેક્ટેરિયા પાણીના ટીપાં દ્વારા ફેલાય છે. પાંદડા સૂકા રાખવાથી રોગ અટકે છે.',
        whenToDoIt: 'તડકો હોય ત્યારે કરો જ્યારે પાંદડા સાવ સૂકા હોય.',
        symptoms: ['નાના કાળા-કથ્થઈ ટપકાં', 'ટપકાંની ફરતે પીળું કુંડાળું', 'પાંદડામાં કાણાં પડવા'],
        organicCare: ['દૂધનું મિશ્રણ (1 ભાગ દૂધ અને 9 ભાગ પાણી) બનાવી તડકામાં સ્પ્રે કરો.'],
        prevention: ['બીમાર પાંદડાને અડ્યા પછી હંમેશા હાથ સાફ કરો.']
      }
    }
  },

  tomato_spider_mites: {
    code: 'tomato_spider_mites',
    scientificName: 'Tetranychus urticae',
    status: 'attention_needed',
    severity: 'moderate',
    translations: {
      en: {
        name: 'Spider Mites (Dusty Specks & Fine Webbing)',
        simpleSummary: 'Tiny pests that suck sap from leaf undersides during hot, dry weather, leaving yellow speckles.',
        whatToDoNow: [
          'Step 1: Spray underside of leaves with a firm stream of clean water to wash mites off.',
          'Step 2: Wipe underside of leaves with a soft damp cloth to clear fine webs.',
          'Step 3: Move plant slightly away from hot, reflective concrete walls.'
        ],
        whyItMatters: 'Mites love dry, dusty heat. Increasing humidity around foliage naturally drives them away.',
        whenToDoIt: 'Rinse leaves early in the morning so they dry out before midday heat.',
        symptoms: ['Tiny yellow dots (stippling) on top of leaves', 'Fine silk webbing underneath leaves', 'Leaves look dusty and dull'],
        organicCare: ['Spray cold-pressed neem oil (5ml/L) or diluted mild soap water under leaves twice a week.'],
        prevention: ['Keep the balcony floor swept clean of dust and mist surrounding air on hot dry days.']
      },
      hi: {
        name: 'मकड़ी कीट (पीले धब्बे और बारीक जाले)',
        simpleSummary: 'गर्म मौसम में पत्तियों के नीचे छिपने वाले बारीक कीड़े जो पत्तियों का रस चूसकर जाला बनाते हैं।',
        whatToDoNow: [
          'कदम 1: पत्ती के पिछले हिस्से पर पानी की तेज धार मारकर कीड़ों को धो दें।',
          'कदम 2: जाले हटाने के लिए पत्तियों के नीचे हल्के गीले कपड़े से पोंछें।',
          'कदम 3: पौधे को बहुत गर्म कंक्रीट की दीवार से थोड़ा दूर रखें।'
        ],
        whyItMatters: 'ये कीड़े सूखी और गर्म हवा में पनपते हैं। धोने से इनकी संख्या तुरंत कम हो जाती है।',
        whenToDoIt: 'सुबह के समय धोएं ताकि पत्तियां दोपहर तक सूख जाएं।',
        symptoms: ['पत्तियों पर बारीक पीले दाने', 'पत्ती के नीचे बारीक मकड़ी का जाला', 'पत्तियां बेजान और धूल भरी दिखना'],
        organicCare: ['नीम का तेल (5 मिली प्रति लीटर पानी) पत्ती के निचले हिस्से पर हफ्ते में 2 बार छिड़कें।'],
        prevention: ['बालकनी को साफ-सुथरा रखें और बहुत गर्म दिनों में आसपास पानी छिड़कें।']
      },
      gu: {
        name: 'સ્પાઈડર માઈટ્સ (ઝીણા ટપકાં અને જાળાં)',
        simpleSummary: 'ગરમ વાતાવરણમાં પાંદડાની નીચે રસ ચૂસતી ઝીણી જીવાત જે પાંદડા પર જાળાં બનાવે છે.',
        whatToDoNow: [
          'પગલું 1: પાંદડાની નીચે પાણીની ધાર મારીને જીવાતને ધોઈ નાખો.',
          'પગલું 2: જાળાં સાફ કરવા પાંદડાની નીચે ભીના કપડાથી હળવેથી લૂછો.',
          'પગલું 3: છોડને ખૂબ ગરમ દિવાલથી થોડો દૂર રાખો.'
        ],
        whyItMatters: 'આ જીવાત ગરમ અને સૂકી હવામાં વધે છે. ધોવાથી તરત કાબૂમાં આવે છે.',
        whenToDoIt: 'સવારે ધોઈ લો જેથી બપોર સુધીમાં પાંદડા સુકાઈ જાય.',
        symptoms: ['પાંદડા પર ઝીણી પીળાશ', 'પાંદડા નીચે પાતળાં જાળાં', 'પાંદડા ધૂળવાળા દેખાવા'],
        organicCare: ['લીમડાના તેલનો સ્પ્રે (5 મિલી/લિટર) પાંદડાની નીચે અઠવાડિયામાં 2 વાર કરો.'],
        prevention: ['બાલ્કની ચોખ્ખી રાખો અને ગરમ દિવસોમાં આસપાસ ભેજ જાળવો.']
      }
    }
  },

  tomato_leaf_mold: {
    code: 'tomato_leaf_mold',
    scientificName: 'Passalora fulva',
    status: 'attention_needed',
    severity: 'moderate',
    translations: {
      en: {
        name: 'Leaf Mold (Pale Yellow Patches with Olive Fuzz)',
        simpleSummary: 'A greenhouse and balcony mold caused by trapped stagnant humidity.',
        whatToDoNow: [
          'Step 1: Increase air circulation around pots; space containers at least 2 feet apart.',
          'Step 2: Prune middle leaves to let balcony breeze pass right through the plant center.',
          'Step 3: Keep foliage dry during all watering sessions.'
        ],
        whyItMatters: 'Mold spores cannot survive when fresh air moves freely through the foliage.',
        whenToDoIt: 'Prune on a breezy morning.',
        symptoms: ['Pale yellow patches on upper leaf surface', 'Olive green or brownish velvety mold underneath'],
        organicCare: ['Spray baking soda mix (5g baking soda + 5ml vegetable oil + 1L water) every 7 days.'],
        prevention: ['Avoid crowding multiple pots in tight corners with poor air movement.']
      },
      hi: {
        name: 'पर्ण फफूंदी (पीले धब्बे और जैतूनी फफूंद)',
        simpleSummary: 'बंद जगह और अधिक नमी के कारण पत्तियों पर होने वाली मखमली फफूंद।',
        whatToDoNow: [
          'कदम 1: गमलों को एक-दूसरे से कम से कम 2 फीट दूर रखें ताकि हवा आ-जा सके।',
          'कदम 2: पौधे के बीच की कुछ पत्तियां काटें ताकि अंदर तक धूप और हवा पहुंचे।',
          'कदम 3: पानी देते समय पत्तियों को बिल्कुल सूखा रखें।'
        ],
        whyItMatters: 'हवा का अच्छा बहाव फफूंद को बढ़ने से रोकता है।',
        whenToDoIt: 'सुबह के समय हल्की हवा में छंटाई करें।',
        symptoms: ['ऊपर हल्के पीले धब्बे', 'नीचे जैतून जैसे हरे-भूरे मखमली रोएं'],
        organicCare: ['बेकिंग सोडा घोल (1 लीटर पानी में आधा चम्मच बेकिंग सोडा) हफ्ते में एक बार छिड़कें।'],
        prevention: ['बालकनी के बंद कोनों में गमलों को बहुत सटाकर न रखें।']
      },
      gu: {
        name: 'પર્ણ ફૂગ (પીળા ડાઘ અને મખમલી ફૂગ)',
        simpleSummary: 'બંધ જગ્યા અને વધુ ભેજને કારણે પાંદડા પર થતી ફૂગ.',
        whatToDoNow: [
          'પગલું 1: કૂંડા વચ્ચે 2 ફૂટની જગ્યા રાખો જેથી હવા આવી-જઈ શકે.',
          'પગલું 2: વચ્ચેના થોડા પાંદડા કાપો જેથી અંદર સુધી તડકો અને હવા પહોંચે.',
          'પગલું 3: પાણી આપતી વખતે પાંદડા સાવ કોરા રાખો.'
        ],
        whyItMatters: 'હવાની સારી અવરજવર ફૂગને વધવા દેતી નથી.',
        whenToDoIt: 'સવારે પવન હોય ત્યારે છંટાઈ કરો.',
        symptoms: ['ઉપર ઝાંખા પીળા ડાઘ', 'નીચે લીલાશ પડતી મખમલી ફૂગ'],
        organicCare: ['ખાવાનો સોડા (1 લિટર પાણીમાં અડધી ચમચી ખાવાનો સોડા) અઠવાડિયે એક વાર સ્પ્રે કરો.'],
        prevention: ['બાલ્કનીના બંધ ખૂણામાં કૂંડાને એકબીજાની અડોઅડ ન મૂકો.']
      }
    }
  },

  tomato_septoria_leaf_spot: {
    code: 'tomato_septoria_leaf_spot',
    scientificName: 'Septoria lycopersici',
    status: 'attention_needed',
    severity: 'moderate',
    translations: {
      en: {
        name: 'Septoria Leaf Spot (Small Spots with Dark Borders)',
        simpleSummary: 'Numerous tiny circular spots with grey centers and dark rims on lower leaves.',
        whatToDoNow: [
          'Step 1: Pinch off all lower leaves showing these small speckled spots.',
          'Step 2: Add 1 inch of dry mulch over soil to block splashing water droplets.',
          'Step 3: Only water soil directly from a small watering can spout.'
        ],
        whyItMatters: 'This fungus hibernates in soil and splashes up when water hits the potting mix.',
        whenToDoIt: 'Remove leaves today before rain or watering.',
        symptoms: ['Circular spots 2-3mm wide with light grey center and dark brown border', 'Leaves turning yellow and withering from ground up'],
        organicCare: ['Spray bio-fungicide (Trichoderma or copper soap) every 10 days.'],
        prevention: ['Keep lower 8 inches of tomato stem free of leaves to create a splash-free barrier.']
      },
      hi: {
        name: 'सेप्टोरिया पर्ण धब्बा (गहरे किनारे वाले छोटे धब्बे)',
        simpleSummary: 'निचली पत्तियों पर भूरे किनारे और हल्के केंद्र वाले गोल छोटे-छोटे धब्बे।',
        whatToDoNow: [
          'कदम 1: जिन निचली पत्तियों पर धब्बे हैं, उन्हें तुरंत तोड़कर फेंक दें।',
          'कदम 2: मिट्टी के ऊपर सूखे पत्ते बिछाएं ताकि पानी के छींटे ऊपर न उछलें।',
          'कदम 3: केवल जड़ में धीरे-धीरे पानी डालें।'
        ],
        whyItMatters: 'यह फंगस मिट्टी में होती है और पानी की बूंदों से उछलकर पत्तियों तक पहुंचती है।',
        whenToDoIt: 'पानी देने से पहले आज ही पत्तियां हटाएं।',
        symptoms: ['छोटे गोल धब्बे जिनके किनारे गहरे और बीच का भाग हल्का होता है', 'निचली पत्तियां पीली पड़ना'],
        organicCare: ['नीम का तेल या तांबा आधारित जैविक स्प्रे 10 दिन में एक बार करें।'],
        prevention: ['तने के निचले 8 इंच हिस्से को पत्तियों से खाली रखें।']
      },
      gu: {
        name: 'સેપ્ટોરિયા પર્ણ ડાઘ (ઘેરી કિનારીવાળા નાના ડાઘ)',
        simpleSummary: 'નીચેના પાંદડા પર કથ્થઈ કિનારી અને આછા કેન્દ્રવાળા અસંખ્ય નાના ગોળ ડાઘ.',
        whatToDoNow: [
          'પગલું 1: ડાઘવાળા નીચેના પાંદડા તરત તોડીને ફેંકી દો.',
          'પગલું 2: માટી પર સૂકા પાંદડા પાથરો જેથી પાણીના છાંટા ઉપર ન ઊડે.',
          'પગલું 3: ફક્ત મૂળ પાસે ધીમેથી પાણી આપો.'
        ],
        whyItMatters: 'આ ફૂગ માટીમાં હોય છે અને પાણીના છાંટાથી પાંદડા સુધી પહોંચે છે.',
        whenToDoIt: 'પાણી આપતા પહેલાં આજે જ પાંદડા દૂર કરો.',
        symptoms: ['નાના ગોળ ડાઘ જેની કિનારી ઘેરી અને વચ્ચેનો ભાગ આછો હોય', 'નીચેના પાંદડા પીળા પડવા'],
        organicCare: ['લીમડાનું તેલ 10 દિવસે એક વાર સ્પ્રે કરો.'],
        prevention: ['થડના નીચેના 8 ઇંચ સુધી કોઈ પાંદડા ન રહેવા દો.']
      }
    }
  },

  tomato_target_spot: {
    code: 'tomato_target_spot',
    scientificName: 'Corynespora cassiicola',
    status: 'attention_needed',
    severity: 'moderate',
    translations: {
      en: {
        name: 'Target Spot (Spreading Brown Blotches)',
        simpleSummary: 'Spreading brown lesions with light brown centers that attack leaves in warm humid weather.',
        whatToDoNow: [
          'Step 1: Trim off affected leaves with clean scissors.',
          'Step 2: Ensure pots receive full balcony sunlight and maximum air breeze.',
          'Step 3: Keep foliage dry.'
        ],
        whyItMatters: 'Warm stagnant moisture causes target spot to grow rapidly across leaves.',
        whenToDoIt: 'Trim in morning sun so cut stems heal quickly.',
        symptoms: ['Brown blotches that grow and join together', 'Leaves turning yellow around large blotches'],
        organicCare: ['Spray dilute neem oil (5ml/L) or copper soap at dusk every 7 to 10 days.'],
        prevention: ['Prune bushy inner branches to keep the plant canopy open to sunlight.']
      },
      hi: {
        name: 'टारगेट स्पॉट (फैलने वाले भूरे धब्बे)',
        simpleSummary: 'गर्म और नम मौसम में पत्तियों पर बनने वाले भूरे धब्बे जो धीरे-धीरे बड़े हो जाते हैं।',
        whatToDoNow: [
          'कदम 1: प्रभावित पत्तियों को साफ कैंची से काट लें।',
          'कदम 2: गमले को भरपूर धूप और खुली हवा वाली जगह पर रखें।',
          'कदम 3: पत्तियों को सूखा रखें।'
        ],
        whyItMatters: 'अधिक गर्मी और नमी इस रोग को तेजी से फैलाती है।',
        whenToDoIt: 'सुबह की धूप में छंटाई करें ताकि तना जल्दी सूख जाए।',
        symptoms: ['भूरे धब्बे जो आपस में मिलकर बड़े हो जाते हैं', 'धब्बों के आसपास पत्ती पीली पड़ना'],
        organicCare: ['शाम के समय नीम का तेल (5 मिली प्रति लीटर) 10 दिन में एक बार छिड़कें।'],
        prevention: ['पौधे की अंदरूनी घनी टहनियों को हल्का रखें ताकि धूप अंदर तक जा सके।']
      },
      gu: {
        name: 'ટાર્ગેટ સ્પોટ (ફેલાતા કથ્થઈ ડાઘ)',
        simpleSummary: 'ગરમ અને ભેજવાળા વાતાવરણમાં પાંદડા પર થતા કથ્થઈ ડાઘ જે ધીમે ધીમે મોટા થાય છે.',
        whatToDoNow: [
          'પગલું 1: અસરગ્રસ્ત પાંદડા કાતરથી કાપી લો.',
          'પગલું 2: કૂંડાને પૂરતો તડકો અને ખુલ્લી હવા મળે ત્યાં મૂકો.',
          'પગલું 3: પાંદડા સૂકા રાખો.'
        ],
        whyItMatters: 'ગરમી અને ભેજ આ રોગને ઝડપથી વધારે છે.',
        whenToDoIt: 'સવારે તડકામાં છંટાઈ કરો જેથી ઘા ઝડપથી રૂઝાય.',
        symptoms: ['કથ્થઈ ડાઘ જે મોટા થઈ ભેગા થાય છે', 'ડાઘની આસપાસ પીળાશ'],
        organicCare: ['સાંજે લીમડાના તેલનો સ્પ્રે 10 દિવસે એક વાર કરો.'],
        prevention: ['છોડની વચ્ચેની ઘાટી ડાળીઓ હળવી રાખો જેથી તડકો અંદર સુધી પહોંચે.']
      }
    }
  },

  tomato_yellow_leaf_curl_virus: {
    code: 'tomato_yellow_leaf_curl_virus',
    scientificName: 'Geminiviridae (TYLCV)',
    status: 'critical',
    severity: 'high',
    translations: {
      en: {
        name: 'Yellow Leaf Curl (Cupped Upward Leaves)',
        simpleSummary: 'A plant virus spread by tiny whiteflies causing leaves to curl upward like small cups and stunt plant growth.',
        whatToDoNow: [
          'Step 1: Inspect leaf undersides for tiny fluttering white flies.',
          'Step 2: Hang a yellow sticky insect trap card near the plant to catch whiteflies.',
          'Step 3: If plant is severely stunted with no fruit setting, remove it to protect other plants.'
        ],
        whyItMatters: 'Viruses cannot be cured with sprays, but catching whiteflies stops them from spreading to other pots.',
        whenToDoIt: 'Hang yellow sticky traps immediately today.',
        symptoms: ['Leaves curling upward like cups', 'Yellowing margins and pale veins', 'Stunted stunted bushy growth without fruit'],
        organicCare: ['Spray neem oil under leaves once weekly to deter whiteflies from feeding.'],
        prevention: ['Use fine balcony mesh netting or companion basil plants to deter flying insect pests.']
      },
      hi: {
        name: 'पीली पत्ती मरोड़िया (पत्तियां ऊपर मुड़ना)',
        simpleSummary: 'सफेद मक्खियों द्वारा फैलाया जाने वाला वायरस जिससे पत्तियां कटोरी जैसी ऊपर मुड़ जाती हैं।',
        whatToDoNow: [
          'कदम 1: पत्ती के नीचे उड़ने वाली छोटी सफेद मक्खियों की जांच करें।',
          'कदम 2: गमले के पास पीला चिपचिपा ट्रैप कार्ड लगाएं ताकि मक्खियां उसमें चिपक जाएं।',
          'कदम 3: अगर पौधा बहुत छोटा रह गया है और फल नहीं लग रहे, तो उसे हटा दें ताकि दूसरे पौधे सुरक्षित रहें।'
        ],
        whyItMatters: 'वायरस का कोई रासायनिक इलाज नहीं है, लेकिन मक्खियों को रोककर अन्य गमलों को बचाया जा सकता है।',
        whenToDoIt: 'आज ही पीला स्टिकी ट्रैप लगाएं।',
        symptoms: ['पत्तियां ऊपर की ओर मुड़कर कटोरी जैसी बनना', 'पत्तियों की नसें पीली होना', 'पौधे की बढ़वार रुकना'],
        organicCare: ['सफेद मक्खियों को भगाने के लिए हफ्ते में एक बार नीम का तेल छिड़कें।'],
        prevention: ['बालकनी में तुलसी या गेंदे के पौधे पास रखें जो कीड़ों को दूर रखते हैं।']
      },
      gu: {
        name: 'પીળી પર્ણ કૂકડ (પાંદડા ઉપર વળવા)',
        simpleSummary: 'સફેદ માખી દ્વારા ફેલાતો વાયરસ જેનાથી પાંદડા વાટકી જેવા ઉપર વળી જાય છે અને છોડનો વિકાસ અટકે છે.',
        whatToDoNow: [
          'પગલું 1: પાંદડા નીચે ઊડતી ઝીણી સફેદ માખીઓ તપાસો.',
          'પગલું 2: કૂંડા પાસે પીળું ચીકણું ટ્રેપ કાર્ડ લગાવો જેથી માખીઓ ચોંટી જાય.',
          'પગલું 3: જો છોડ સાવ ઠિંગણો થઈ ગયો હોય, તો અન્ય છોડને બચાવવા તેને દૂર કરો.'
        ],
        whyItMatters: 'વાયરસનો કોઈ સ્પ્રે ઈલાજ નથી, પરંતુ માખીઓ પકડવાથી બીજા છોડ બચી જાય છે.',
        whenToDoIt: 'આજે જ પીળું સ્ટીકી ટ્રેપ લગાવો.',
        symptoms: ['પાંદડા ઉપર તરફ વાટકી જેવા વળવા', 'નસો પીળી પડવી', 'છોડનો વિકાસ અટકી જવો'],
        organicCare: ['માખીઓ દૂર રાખવા અઠવાડિયે એક વાર લીમડાના તેલનો સ્પ્રે કરો.'],
        prevention: ['બાલ્કનીમાં તુલસી અથવા ગલગોટાના છોડ સાથે રાખો જે જીવાતને દૂર રાખે છે.']
      }
    }
  },

  tomato_mosaic_virus: {
    code: 'tomato_mosaic_virus',
    scientificName: 'Tobamovirus (ToMV)',
    status: 'critical',
    severity: 'high',
    translations: {
      en: {
        name: 'Mosaic Virus (Mottled Green & Yellow Patches)',
        simpleSummary: 'A plant virus that causes mosaic-like dark and light green patterns with crinkled leaves.',
        whatToDoNow: [
          'Step 1: Isolate this plant immediately.',
          'Step 2: Wash hands thoroughly with soap before touching any other plant in your garden.',
          'Step 3: Sterilize shears and pots with disinfectant.'
        ],
        whyItMatters: 'Mosaic virus spreads easily on fingers, tools, and garden gloves. Strict hygiene protects your remaining crops.',
        whenToDoIt: 'Wash hands and tools right away today.',
        symptoms: ['Patchy light and dark green patterns on leaves', 'Distorted, crinkled or shoestring-like narrow leaves', 'Stunted plant growth'],
        organicCare: ['No organic or chemical cure exists for plant viruses; safe prompt removal protects your garden.'],
        prevention: ['Never smoke or handle tobacco near tomato plants; always wash hands before handling balcony pots.']
      },
      hi: {
        name: 'मोज़ेक वायरस (चितकबरे पीले-हरे धब्बे)',
        simpleSummary: 'एक पादप वायरस जिससे पत्तियों पर हल्के और गहरे हरे रंग के चितकबरे धब्बे बन जाते हैं।',
        whatToDoNow: [
          'कदम 1: इस पौधे को तुरंत अन्य पौधों से अलग रखें।',
          'कदम 2: दूसरे पौधों को छूने से पहले अपने हाथों को साबुन से अच्छी तरह धोएं।',
          'कदम 3: उपयोग किए गए औजारों और कैंची को डेटॉल या साबुन से साफ करें।'
        ],
        whyItMatters: 'यह वायरस हाथों और औजारों के जरिए बहुत तेजी से फैलता है। सफाई ही इसका मुख्य बचाव है।',
        whenToDoIt: 'आज ही हाथ और औजार अच्छी तरह धोएं।',
        symptoms: ['पत्तियों पर हल्के और गहरे हरे रंग के धब्बे', 'पत्तियों का मुड़ना या पतली हो जाना', 'पौधा छोटा रह जाना'],
        organicCare: ['वायरस का कोई सीधा इलाज नहीं है; पौधे को समय पर अलग करना ही सही उपाय है।'],
        prevention: ['टमाटर के पौधों के पास धूम्रपान न करें और बागवानी से पहले हाथ साफ रखें।']
      },
      gu: {
        name: 'મોઝેક વાયરસ (ધાબાવાળા લીલા-પીળા પટ્ટા)',
        simpleSummary: 'એક વનસ્પતિ વાયરસ જેનાથી પાંદડા પર આછા અને ઘાટા લીલા ધાબા પડી જાય છે.',
        whatToDoNow: [
          'પગલું 1: આ છોડને તરત જ અન્ય કૂંડાથી અલગ મૂકો.',
          'પગલું 2: બીજા છોડને અડતા પહેલાં હાથ સાબુથી બરાબર ધોઈ લો.',
          'પગલું 3: વપરાયેલી કાતર અને સાધનો સાબુ કે ડેટોલથી સાફ કરો.'
        ],
        whyItMatters: 'આ વાયરસ હાથ અને સાધનો દ્વારા સરળતાથી ફેલાય છે. સ્વચ્છતા જ શ્રેષ્ઠ ઉપાય છે.',
        whenToDoIt: 'આજે જ હાથ અને સાધનો બરાબર સાફ કરો.',
        symptoms: ['પાંદડા પર આછા-ઘાટા લીલા પટ્ટા', 'પાંદડા સંકોચાઈ જવા', 'છોડનો વિકાસ અટકી જવો'],
        organicCare: ['વાયરસનો કોઈ સીધો ઈલાજ નથી; છોડ અલગ કરવો એ જ સમજદારી છે.'],
        prevention: ['ટામેટાના છોડ પાસે ધૂમ્રપાન ન કરો અને બાગકામ પહેલાં હાથ ચોખ્ખા રાખો.']
      }
    }
  }
};

/**
 * Returns localized, beginner-friendly details for a specific condition code.
 */
export function getConditionDetails(conditionCode, language = 'en') {
  const cond = TOMATO_CONDITIONS[conditionCode] || TOMATO_CONDITIONS.tomato_healthy;
  const langKey = cond.translations[language] ? language : 'en';
  const tData = cond.translations[langKey];

  return {
    code: cond.code,
    scientificName: cond.scientificName,
    status: cond.status,
    severity: cond.severity,
    name: tData.name,
    simpleSummary: tData.simpleSummary,
    summary: tData.simpleSummary,
    whatToDoNow: tData.whatToDoNow,
    whyItMatters: tData.whyItMatters,
    whenToDoIt: tData.whenToDoIt,
    symptoms: tData.symptoms,
    immediateActions: tData.whatToDoNow,
    organicTreatment: tData.organicCare,
    organicCare: tData.organicCare,
    prevention: tData.prevention,
    chemicalGuidance: [
      langKey === 'hi'
        ? 'शहरी बालकनी में रासायनिक कीटनाशकों के बजाय जैविक उपचार ही अपनाएं।'
        : langKey === 'gu'
        ? 'ઘરની બાલ્કનીમાં રાસાયણિક જંતુનાશકોને બદલે જૈવિક ઉપાયો જ અપનાવો.'
        : 'Prioritize non-toxic organic controls over synthetic sprays on home balconies.'
    ],
    sources: [
      'ICAR - Indian Institute of Horticultural Research',
      'TNAU Agritech Urban Gardening Advisory'
    ]
  };
}

/**
 * Returns personalized, easy-to-understand advice combining:
 * 1. The plant container (terracotta, grow bag, plastic)
 * 2. Live weather for user's actual city / locality
 * 3. Step-by-step actions in the user's selected language
 */
export function getPersonalizedAdvice({ plant, conditionCode, weather, location, language = 'en' }) {
  const details = getConditionDetails(conditionCode, language);
  const temp = weather?.current?.temp ?? 28;
  const humidity = weather?.current?.humidity ?? 60;
  const locName = location?.locationName || (language === 'hi' ? 'आपकी बालकनी' : language === 'gu' ? 'તમારી બાલ્કની' : 'your garden');

  let containerNote = '';
  if (plant?.container_type === 'terracotta_pot') {
    containerNote = language === 'hi'
      ? 'आपका पौधा मिट्टी के गमले में है जो गर्मी में जल्दी सूखता है। ऊपर की 2 इंच मिट्टी सूखते ही पानी दें।'
      : language === 'gu'
      ? 'તમારો છોડ માટીના કૂંડામાં છે જે ગરમીમાં ઝડપથી સુકાય છે. ઉપરની 2 ઈંચ માટી સુકાય ત્યારે પાણી આપો.'
      : 'Your plant is in a porous terracotta pot which dries out quickly in warm weather. Check moisture frequently.';
  } else if (plant?.container_type === 'grow_bag') {
    containerNote = language === 'hi'
      ? 'आपका पौधा कपड़े के ग्रो बैग में है। इसमें जड़ों को अच्छी हवा मिलती है, लेकिन किनारे जल्दी सूखते हैं।'
      : language === 'gu'
      ? 'તમારો છોડ કાપડની ગ્રો બેગમાં છે. મૂળને સારી હવા મળે છે પણ કિનારી ઝડપથી સુકાય છે.'
      : 'Your plant is in a fabric grow bag with high aeration. Water slowly around the center.';
  } else {
    containerNote = language === 'hi'
      ? 'प्लास्टिक के गमले में पानी लंबे समय तक रुकता है। अधिक पानी देने से बचें ताकि जड़ें न सड़ें।'
      : language === 'gu'
      ? 'પ્લાસ્ટિક કૂંડામાં ભેજ લાંબો સમય રહે છે. વધુ પડતું પાણી ન આપો જેથી મૂળ સડે નહીં.'
      : 'Your plastic container holds moisture longer. Ensure drainage holes are open to prevent soggy soil.';
  }

  const weatherNote = language === 'hi'
    ? `${locName} में वर्तमान तापमान ${temp}°C और आर्द्रता ${humidity}% है।`
    : language === 'gu'
    ? `${locName} માં હાલનું તાપમાન ${temp}°C અને ભેજ ${humidity}% છે.`
    : `Current microclimate in ${locName} is ${temp}°C with ${humidity}% humidity.`;

  return {
    ...details,
    containerNote,
    weatherNote,
    locationName: locName
  };
}

/**
 * Honest limitation guidance for unsupported plants.
 */
export function getUnsupportedPlantGuidance(plantName = '', language = 'en') {
  if (language === 'hi') {
    return {
      title: 'एआई मॉडल सीमा सूचना',
      message: `हमारा विज़न स्कैनर वर्तमान में टमाटर के पत्तों के लिए विशेष रूप से अंशांकित है। ${plantName || 'इस पौधे'} के लिए सुरक्षित सामान्य नियम:`,
      tips: [
        'मिट्टी को हल्का नम रखें, गमले में पानी जमा न होने दें।',
        'पौधे को रोजाना 4 से 6 घंटे की धूप दें।',
        'पीली या सूखी पत्तियों को समय-समय पर साफ कैंची से हटाते रहें।'
      ]
    };
  } else if (language === 'gu') {
    return {
      title: 'એઆઈ મોડેલ મર્યાદા નોંધ',
      message: `અમારું વિઝન સ્કેનર હાલમાં ટામેટાના પાંદડા માટે ખાસ તાલીમ પામેલું છે. ${plantName || 'આ છોડ'} માટે સલામત સામાન્ય નિયમો:`,
      tips: [
        'માટીને હળવી ભેજવાળી રાખો, કૂંડામાં પાણી ભરાઈ ન રહેવા દો.',
        'છોડને દરરોજ 4 થી 6 કલાકનો તડકો આપો.',
        'પીળા કે સૂકા પાંદડા સમયાંતરે સાફ કાતરથી દૂર કરતા રહો.'
      ]
    };
  }

  return {
    title: 'AI Model Scope Note',
    message: `Our vision diagnostic pipeline is currently calibrated specifically for tomato foliage. For ${plantName || 'this plant'}, follow safe general balcony guidelines:`,
    tips: [
      'Maintain moist but never waterlogged potting soil.',
      'Provide 4 to 6 hours of natural balcony light daily.',
      'Prune off yellow or dry lower leaves to encourage healthy new foliage.'
    ]
  };
}
