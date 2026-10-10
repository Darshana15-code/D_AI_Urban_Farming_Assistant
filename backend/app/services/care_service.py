from typing import Dict, Any, Optional

TOMATO_CARE_DATABASE: Dict[str, Dict[str, Any]] = {
    "tomato_healthy": {
        "condition_code": "tomato_healthy",
        "scientific_name": "Solanum lycopersicum",
        "status": "healthy",
        "severity": "none",
        "translations": {
            "en": {
                "name": "Healthy Tomato Foliage",
                "summary": "Your tomato plant looks vigorous and green with no sign of disease.",
                "symptoms": [
                    "Bright green leaves with clean edges.",
                    "No yellowing or brown spots.",
                    "Strong, upright stems."
                ],
                "immediate_actions": [
                    "Water only when top inch of soil feels dry.",
                    "Give 6 to 8 hours of daily balcony sun.",
                    "Prune bottom leaves touching the pot soil."
                ],
                "why_it_matters": "Keeping leaves dry and off the soil stops fungal germs from splashing onto the foliage.",
                "when_to_do_it": "Water early in the morning before peak sunlight.",
                "prevention": [
                    "Keep pots spaced apart for fresh air movement.",
                    "Always water soil directly without wetting leaves."
                ],
                "organic_treatment": [
                    "Feed with a handful of vermicompost or seaweed tea once every 2 weeks."
                ]
            },
            "hi": {
                "name": "स्वस्थ टमाटर का पौधा",
                "summary": "आपका पौधा हरा-भरा, मजबूत और बिल्कुल स्वस्थ है। पत्तियों पर कोई रोग नहीं है।",
                "symptoms": [
                    "चमकदार हरी पत्तियां और साफ किनारे।",
                    "कोई पीले या भूरे धब्बे नहीं।",
                    "मजबूत और सीधा तना।"
                ],
                "immediate_actions": [
                    "जब ऊपरी मिट्टी सूखी लगे, तभी केवल जड़ों में पानी दें।",
                    "रोजाना 6 से 8 घंटे बालकनी की सीधी धूप दें।",
                    "निचली पत्तियों को काटें जो गमले की गीली मिट्टी को छू रही हों।"
                ],
                "why_it_matters": "पत्तियों को सूखा रखने से फंगस और फफूंदी के कीटाणु पौधे पर नहीं पनपते।",
                "when_to_do_it": "सुबह के समय पानी दें ताकि दिन भर पौधा तरोताजा रहे।",
                "prevention": [
                    "गमलों के बीच जगह रखें ताकि ताजी हवा घूम सके।",
                    "हमेशा केवल मिट्टी में पानी डालें।"
                ],
                "organic_treatment": [
                    "हर 15 दिन में एक मुट्ठी केंचुआ खाद (वर्मीकम्पोस्ट) गमले में डालें।"
                ]
            },
            "gu": {
                "name": "તંદુરસ્ત ટામેટાનો છોડ",
                "summary": "તમારો છોડ એકદમ લીલોછમ અને મજબૂત છે. પાંદડા પર કોઈ રોગ નથી.",
                "symptoms": [
                    "ચમકદાર લીલા પાંદડા અને ચોખ્ખી કિનારીઓ.",
                    "કોઈ પીળા કે કથ્થઈ ડાઘ નથી.",
                    "મજબૂત થડ."
                ],
                "immediate_actions": [
                    "કૂંડાની ઉપરની માટી સૂકી લાગે ત્યારે જ મૂળ પાસે પાણી આપો.",
                    "રોજ 6 થી 8 કલાક બાલ્કનીનો તડકો આપો.",
                    "માટીને અડતા નીચેના પાંદડા કાપી લો જેથી ચેપ ન લાગે."
                ],
                "why_it_matters": "પાંદડા સૂકા રાખવાથી ફૂગના જંતુઓ પાંદડા પર ચોંટતા નથી.",
                "when_to_do_it": "સવારે વહેલા પાણી આપો જેથી દિવસ દરમિયાન છોડ તાજો રહે.",
                "prevention": [
                    "કૂંડા વચ્ચે જગ્યા રાખો જેથી તાજી હવા ફરી શકે.",
                    "હંમેશા ફક્ત માટીમાં જ પાણી આપો."
                ],
                "organic_treatment": [
                    "દર 15 દિવસે એક મુઠ્ઠી અળસિયાનું ખાતર (વર્મીકમ્પોસ્ટ) કૂંડામાં નાખો."
                ]
            }
        }
    },
    "tomato_early_blight": {
        "condition_code": "tomato_early_blight",
        "scientific_name": "Alternaria solani",
        "status": "attention_needed",
        "severity": "moderate",
        "translations": {
            "en": {
                "name": "Early Blight",
                "summary": "Common fungal disease causing circular brown spots with bullseye rings on lower leaves.",
                "symptoms": [
                    "Dark brown spots with concentric bullseye rings.",
                    "Yellow coloring spreading around spots.",
                    "Lower leaves turning yellow and dropping."
                ],
                "immediate_actions": [
                    "Step 1: Snip off all spotted lower leaves with clean scissors right away.",
                    "Step 2: Dispose of cut leaves in household trash (do NOT compost).",
                    "Step 3: Pour water strictly at the soil level; keep foliage dry."
                ],
                "why_it_matters": "Removing sick leaves stops fungal spores from spreading up to new leaves and fruits.",
                "when_to_do_it": "Prune immediately today and water only in the morning.",
                "prevention": [
                    "Spread dry coconut mulch over soil to stop water droplets from splashing spores.",
                    "Space pots 24 inches apart on balconies."
                ],
                "organic_treatment": [
                    "Spray cold-pressed neem oil (5ml/L water) at sunset once weekly."
                ]
            },
            "hi": {
                "name": "अगेती झुलसा (छल्लेदार भूरे धब्बे)",
                "summary": "एक सामान्य फफूंद रोग जिसमें निचली पत्तियों पर छल्लेदार गोल भूरे धब्बे बनते हैं।",
                "symptoms": [
                    "गोल छल्ले जैसे भूरे-काले धब्बे।",
                    "धब्बों के चारों ओर पीलापन।",
                    "निचली पत्तियों का सूखकर गिरना।"
                ],
                "immediate_actions": [
                    "कदम 1: जिन पत्तियों पर धब्बे हैं, उन्हें साफ कैंची से तुरंत काट लें।",
                    "कदम 2: काटी गई पत्तियों को कूड़ेदान में फेंकें (खाद में न डालें)।",
                    "कदम 3: केवल गमले की मिट्टी में पानी डालें; पत्तियों पर पानी न छिड़कें।"
                ],
                "why_it_matters": "बीमार पत्तियों को हटाने से फफूंद ऊपर की नई पत्तियों और टमाटरों में नहीं फैलती।",
                "when_to_do_it": "आज ही छंटाई करें और हमेशा सुबह के समय पानी दें।",
                "prevention": [
                    "मिट्टी पर सूखे पत्ते बिछाएं ताकि पानी के छींटे पत्तियों पर न पड़ें।",
                    "गमलों के बीच पर्याप्त दूरी रखें।"
                ],
                "organic_treatment": [
                    "1 लीटर पानी में 5 मिली नीम का तेल मिलाकर शाम के समय पत्तियों पर छिड़कें।"
                ]
            },
            "gu": {
                "name": "અગેતી સુકારો (ગોળાકાર કથ્થઈ ડાઘ)",
                "summary": "એક સામાન્ય ફૂગ રોગ જેમાં નીચેના પાંદડા પર ગોળાકાર કથ્થઈ ડાઘ પડે છે.",
                "symptoms": [
                    "ચક્રીય ગોળ કથ્થઈ-કાળા ડાઘ.",
                    "ડાઘની આસપાસ પીળાશ.",
                    "નીચેના પાંદડા ખરી પડવા."
                ],
                "immediate_actions": [
                    "પગલું 1: ડાઘવાળા નીચેના પાંદડા સાફ કાતરથી તરત કાપી લો.",
                    "પગલું 2: કાપેલા પાંદડા કચરાપેટીમાં ફેંકી દો (ખાતરમાં ન નાખો).",
                    "પગલું 3: પાણી ફક્ત કૂંડાની માટીમાં જ આપો; પાંદડા પર પાણી ન છાંટો."
                ],
                "why_it_matters": "રોગવાળા પાંદડા દૂર કરવાથી ફૂગ ઉપરના નવા ટામેટા સુધી ફેલાતી અટકે છે.",
                "when_to_do_it": "આજે જ છંટાઈ કરો અને સવારે જ પાણી આપો.",
                "prevention": [
                    "કૂંડાની માટી પર સૂકા પાંદડા પાથરો જેથી પાણીના છાંટા પાંદડા પર ન ઊડે.",
                    "કૂંડા વચ્ચે યોગ્ય અંતર રાખો."
                ],
                "organic_treatment": [
                    "1 લિટર પાણીમાં 5 મિલી લીમડાનું તેલ ઉમેરી સાંજે સ્પ્રે કરો."
                ]
            }
        }
    },
    "tomato_late_blight": {
        "condition_code": "tomato_late_blight",
        "scientific_name": "Phytophthora infestans",
        "status": "critical",
        "severity": "high",
        "translations": {
            "en": {
                "name": "Late Blight",
                "summary": "A fast-acting fungal disease favored by wet weather causing dark oily patches.",
                "symptoms": [
                    "Dark brown oily-looking spots on leaves and stems.",
                    "White fuzz under leaves on humid days.",
                    "Firm brown rot on tomato fruit."
                ],
                "immediate_actions": [
                    "Step 1: Move this pot away from your other plants immediately.",
                    "Step 2: Cut off all dark blackened stems and bag securely in plastic.",
                    "Step 3: Move pot under covered balcony shelter away from rainfall."
                ],
                "why_it_matters": "Late blight spreads rapidly in humid air. Isolating the pot protects your other plants.",
                "when_to_do_it": "Act within the next few hours.",
                "prevention": [
                    "Maximize ventilation and never wet leaves during watering."
                ],
                "organic_treatment": [
                    "Spray with organic copper soap or diluted sour buttermilk (1:9 ratio with water)."
                ]
            },
            "hi": {
                "name": "पछेती झुलसा (काले तेलीय धब्बे)",
                "summary": "बारिश और अधिक नमी में तेजी से फैलने वाला गंभीर फफूंद रोग जो पत्तियों को काला कर देता है।",
                "symptoms": [
                    "पत्तियों पर काले तेलीय बड़े धब्बे।",
                    "पत्ती के नीचे सफेद रोएं जैसी फफूंद।",
                    "टमाटर का काला पड़ना और सड़ना।"
                ],
                "immediate_actions": [
                    "कदम 1: इस गमले को तुरंत अन्य पौधों से अलग दूर रखें।",
                    "कदम 2: काले पड़े तनों और पत्तियों को काटकर प्लास्टिक की थैली में बंद करके फेंकें।",
                    "कदम 3: गमले को बालकनी की छत के नीचे रखें ताकि उस पर बारिश न पड़े।"
                ],
                "why_it_matters": "यह रोग बहुत तेजी से फैलता है। गमले को अलग रखने से बाकी पौधे बच जाते हैं।",
                "when_to_do_it": "अगले कुछ घंटों में तुरंत यह कदम उठाएं।",
                "prevention": [
                    "हवा का अच्छा बहाव रखें और रात में पत्तियों को गीला न रहने दें।"
                ],
                "organic_treatment": [
                    "खट्टी छाछ (1 भाग छाछ और 9 भाग पानी) मिलाकर पत्तियों पर छिड़कें।"
                ]
            },
            "gu": {
                "name": "પાછોતરો સુકારો (કાળા ભીના ડાઘ)",
                "summary": "ભેજવાળા વાતાવરણમાં ઝડપથી ફેલાતો ગંભીર ફૂગ રોગ જે પાંદડાને કાળા કરી દે છે.",
                "symptoms": [
                    "પાંદડા પર કાળા તેલ જેવા ડાઘ.",
                    "વરસાદમાં પાંદડા નીચે સફેદ ફૂગ.",
                    "ટામેટા કાળા પડી સડવા."
                ],
                "immediate_actions": [
                    "પગલું 1: આ કૂંડાને તરત જ અન્ય છોડથી દૂર મૂકો.",
                    "પગલું 2: કાળા પડી ગયેલા ડાળી-પાંદડા કાપીને પ્લાસ્ટિકની થેલીમાં ફેંકી દો.",
                    "પગલું 3: કૂંડાને બાલ્કનીની છત નીચે મૂકો જેથી વરસાદનું પાણી ન પડે."
                ],
                "why_it_matters": "આ રોગ ખૂબ ઝડપી ફેલાય છે. કૂંડું અલગ કરવાથી તમારા અન્ય છોડ સુરક્ષિત રહે છે.",
                "when_to_do_it": "આજે જ આગામી થોડા કલાકોમાં આ પગલું ભરો.",
                "prevention": [
                    "હવાની સારી અવરજવર રાખો અને રાત્રે પાંદડા ભીના ન રહેવા દો."
                ],
                "organic_treatment": [
                    "ખાટી છાશ (1 ભાગ છાશ અને 9 ભાગ પાણી) મિક્સ કરીને પાંદડા પર સ્પ્રે કરો."
                ]
            }
        }
    }
}

class CareService:
    def get_guidance(self, condition_code: str, lang: str = "en") -> Dict[str, Any]:
        """Returns easy-to-understand, localized care guidance for beginners."""
        lang_key = lang if lang in ("en", "hi", "gu") else "en"
        
        entry = TOMATO_CARE_DATABASE.get(condition_code)
        if entry:
            t = entry["translations"].get(lang_key, entry["translations"]["en"])
            return {
                "condition_code": entry["condition_code"],
                "condition_name": t["name"],
                "scientific_name": entry["scientific_name"],
                "status": entry["status"],
                "severity": entry["severity"],
                "summary": t["summary"],
                "symptoms": t["symptoms"],
                "immediate_actions": t["immediate_actions"],
                "prevention": t["prevention"],
                "organic_treatment": t["organic_treatment"],
                "chemical_guidance": [
                    "शहरी बालकनी में सुरक्षित जैविक उपचार ही अपनाएं।" if lang_key == "hi"
                    else "ઘરની બાલ્કનીમાં સુરક્ષિત જૈવિક ઉપાયો જ અપનાવો." if lang_key == "gu"
                    else "Prioritize non-toxic organic controls over synthetic sprays on home balconies."
                ],
                "sources": [
                    "ICAR - Indian Institute of Horticultural Research",
                    "TNAU Agritech Urban Gardening Advisory"
                ]
            }

        # Safe fallback for unspecified conditions
        fallback_names = {
            "en": "Unspecified Foliar Condition",
            "hi": "अनिर्दिष्ट पर्ण स्थिति",
            "gu": "અનિર્દિષ્ટ પર્ણ સ્થિતિ"
        }
        fallback_summaries = {
            "en": "Visual irregularities detected. Inspect leaf underside in natural light.",
            "hi": "पत्ती पर अनियमितता देखी गई। प्राकृतिक रोशनी में पत्ती के निचले हिस्से की जांच करें।",
            "gu": "પાંદડા પર અનિયમિતતા જણાઈ. કુદરતી અજવાળામાં પાંદડાના નીચેના ભાગની તપાસ કરો."
        }
        fallback_actions = {
            "en": ["Inspect foliage underside with a magnifying lens.", "Water soil gently at base only."],
            "hi": ["पत्ती के नीचे लेंस से कीड़ों की जांच करें।", "केवल जड़ों में धीरे-धीरे पानी दें।"],
            "gu": ["પાંદડા નીચે જીવાત તપાસો.", "ફક્ત મૂળ પાસે ધીમેથી પાણી આપો."]
        }

        return {
            "condition_code": condition_code or "unknown_anomaly",
            "condition_name": fallback_names.get(lang_key, fallback_names["en"]),
            "scientific_name": "Solanum lycopersicum",
            "status": "attention_needed",
            "severity": "moderate",
            "summary": fallback_summaries.get(lang_key, fallback_summaries["en"]),
            "symptoms": ["Visual irregularities detected on leaf surface."],
            "immediate_actions": fallback_actions.get(lang_key, fallback_actions["en"]),
            "prevention": ["Water at soil line and ensure 6 hours of sunlight."],
            "organic_treatment": ["Isolate plant and inspect for pest vectors."],
            "chemical_guidance": ["Avoid synthetic chemicals without confirmed identification."],
            "sources": ["Urban Farming Extension Advisory"]
        }

care_service = CareService()
