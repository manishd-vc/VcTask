import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define available languages
export type Language = "en" | "hi" | "gu";

// Initialize English translations
const en = {
  common: {
    search: "Search",
    filter: "Filter",
    apply: "Apply",
    reset: "Reset",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    noResults: "No results found",
    error: "An error occurred",
    success: "Success",
    contactUs: "Contact Us",
    aboutUs: "About Us",
    home: "Home",
    catalog: "Catalog",
    categories: "Categories",
    seeAll: "See All",
  },
  home: {
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    browseByCategory: "Browse by Category",
    specialOffer: "Special Offer",
    discoverCollection:
      "Discover our premium collection with special wholesale prices",
    exploreNow: "Explore Now",
    needHelp: "Need Help Choosing?",
    expertConsultants:
      "Our expert consultants are ready to assist you in selecting the perfect tiles for your space.",
  },
  product: {
    size: "Size",
    color: "Color",
    finish: "Finish",
    price: "Price",
    availability: "Availability",
    inStock: "In Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    specifications: "Technical Specifications",
    description: "Description",
    idealFor: "Ideal For",
    contactForPrice: "Contact for Price",
    priceOnRequest: "Price on request",
    callNow: "Call Now",
    sendInquiry: "Send Inquiry",
    addToCompare: "Add to Compare",
    compare: "Compare",
  },
  calculator: {
    tileCalculator: "Tile Calculator",
    roomDimensions: "Room Dimensions",
    length: "Length",
    width: "Width",
    tileSize: "Tile Size",
    wastagePercentage: "Wastage Percentage",
    calculate: "Calculate",
    results: "Results",
    totalArea: "Total Area",
    tilesNeeded: "Tiles Needed",
    wastage: "Wastage",
    totalTiles: "Total Tiles",
    reset: "Reset Calculator",
  },
  contact: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Submit Inquiry",
    storeLocations: "Our Store Locations",
    visitUs: "Visit us to explore our wide range of premium tiles",
    getDirections: "Get Directions",
    openingHours: "Opening Hours",
    address: "Address",
  },
  dealer: {
    findDealer: "Find a Dealer",
    nearbyDealers: "Nearby Dealers",
    searchDealers: "Search by city, pincode or area...",
    noResults: "No dealers found",
    viewAll: "View all dealers",
    authorizedDealer: "Authorized Dealer",
    premiumRetailer: "Premium Retailer",
    directions: "Directions",
    callDealer: "Call",
  },
};

// Hindi translations
const hi = {
  common: {
    search: "खोज",
    filter: "फ़िल्टर",
    apply: "लागू करें",
    reset: "रीसेट",
    cancel: "रद्द करें",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    loading: "लोड हो रहा है...",
    noResults: "कोई परिणाम नहीं मिला",
    error: "एक त्रुटि हुई",
    success: "सफलता",
    contactUs: "संपर्क करें",
    aboutUs: "हमारे बारे में",
    home: "होम",
    catalog: "कैटलॉग",
    categories: "श्रेणियां",
    seeAll: "सभी देखें",
  },
  home: {
    featuredProducts: "विशेष उत्पाद",
    newArrivals: "नए आगमन",
    browseByCategory: "श्रेणी के अनुसार ब्राउज़ करें",
    specialOffer: "विशेष प्रस्ताव",
    discoverCollection:
      "विशेष थोक मूल्य के साथ हमारे प्रीमियम संग्रह की खोज करें",
    exploreNow: "अभी एक्सप्लोर करें",
    needHelp: "चुनने में मदद चाहिए?",
    expertConsultants:
      "हमारे विशेषज्ञ परामर्शदाता आपके स्थान के लिए सही टाइल्स चुनने में आपकी सहायता करने के लिए तैयार हैं।",
  },
  product: {
    size: "साइज़",
    color: "रंग",
    finish: "फिनिश",
    price: "मूल्य",
    availability: "उपलब्धता",
    inStock: "स्टॉक में",
    lowStock: "कम स्टॉक",
    outOfStock: "स्टॉक में नहीं",
    specifications: "तकनीकी विनिर्देश",
    description: "विवरण",
    idealFor: "के लिए आदर्श",
    contactForPrice: "मूल्य के लिए संपर्क करें",
    priceOnRequest: "अनुरोध पर मूल्य",
    callNow: "अभी कॉल करें",
    sendInquiry: "पूछताछ भेजें",
    addToCompare: "तुलना में जोड़ें",
    compare: "तुलना करें",
  },
  calculator: {
    tileCalculator: "टाइल कैलकुलेटर",
    roomDimensions: "कमरे के आयाम",
    length: "लंबाई",
    width: "चौड़ाई",
    tileSize: "टाइल का आकार",
    wastagePercentage: "बर्बादी प्रतिशत",
    calculate: "गणना करें",
    results: "परिणाम",
    totalArea: "कुल क्षेत्र",
    tilesNeeded: "आवश्यक टाइल्स",
    wastage: "बर्बादी",
    totalTiles: "कुल टाइल्स",
    reset: "कैलकुलेटर रीसेट करें",
  },
  contact: {
    name: "नाम",
    email: "ईमेल",
    phone: "फोन",
    message: "संदेश",
    submit: "पूछताछ जमा करें",
    storeLocations: "हमारे स्टोर स्थान",
    visitUs:
      "हमारे प्रीमियम टाइल्स की विस्तृत श्रृंखला का अन्वेषण करने के लिए हमसे मिलें",
    getDirections: "दिशा-निर्देश प्राप्त करें",
    openingHours: "खुलने का समय",
    address: "पता",
  },
  dealer: {
    findDealer: "डीलर खोजें",
    nearbyDealers: "आस-पास के डीलर",
    searchDealers: "शहर, पिनकोड या क्षेत्र से खोजें...",
    noResults: "कोई डीलर नहीं मिला",
    viewAll: "सभी डीलर देखें",
    authorizedDealer: "अधिकृत डीलर",
    premiumRetailer: "प्रीमियम रिटेलर",
    directions: "दिशा-निर्देश",
    callDealer: "कॉल",
  },
};

// Gujarati translations
const gu = {
  common: {
    search: "શોધ",
    filter: "ફિલ્ટર",
    apply: "લાગુ કરો",
    reset: "રીસેટ",
    cancel: "રદ કરો",
    save: "સાચવો",
    delete: "કાઢી નાખો",
    edit: "સંપાદિત કરો",
    loading: "લોડ થઈ રહ્યું છે...",
    noResults: "કોઈ પરિણામ મળ્યું નથી",
    error: "એક ભૂલ આવી",
    success: "સફળતા",
    contactUs: "અમારો સંપર્ક કરો",
    aboutUs: "અમારા વિશે",
    home: "હોમ",
    catalog: "કેટલોગ",
    categories: "શ્રેણીઓ",
    seeAll: "બધું જુઓ",
  },
  home: {
    featuredProducts: "ફીચર્ડ પ્રોડક્ટ્સ",
    newArrivals: "નવા આગમન",
    browseByCategory: "શ્રેણી દ્વારા બ્રાઉઝ કરો",
    specialOffer: "સ્પેશિયલ ઓફર",
    discoverCollection:
      "સ્પેશિયલ હોલસેલ કિંમતો સાથે અમારા પ્રીમિયમ કલેક્શનને શોધો",
    exploreNow: "હમણાં એક્સપ્લોર કરો",
    needHelp: "પસંદ કરવામાં મદદની જરૂર છે?",
    expertConsultants:
      "અમારા નિષ્ણાત સલાહકારો તમારા સ્થાન માટે સંપૂર્ણ ટાઇલ્સ પસંદ કરવામાં તમારી સહાય કરવા માટે તૈયાર છે.",
  },
  product: {
    size: "સાઇઝ",
    color: "રંગ",
    finish: "ફિનિશ",
    price: "કિંમત",
    availability: "ઉપલબ્ધતા",
    inStock: "સ્ટોકમાં",
    lowStock: "ઓછો સ્ટોક",
    outOfStock: "સ્ટોકમાં નથી",
    specifications: "ટેકનિકલ સ્પેસિફિકેશન્સ",
    description: "વર્ણન",
    idealFor: "આદર્શ",
    contactForPrice: "કિંમત માટે સંપર્ક કરો",
    priceOnRequest: "વિનંતી પર કિંમત",
    callNow: "હમણાં કૉલ કરો",
    sendInquiry: "પૂછપરછ મોકલો",
    addToCompare: "તુલના કરવા માટે ઉમેરો",
    compare: "તુલના કરો",
  },
  calculator: {
    tileCalculator: "ટાઇલ કેલ્ક્યુલેટર",
    roomDimensions: "રૂમના પરિમાણો",
    length: "લંબાઈ",
    width: "પહોળાઈ",
    tileSize: "ટાઇલનું કદ",
    wastagePercentage: "બગાડ ટકાવારી",
    calculate: "ગણતરી કરો",
    results: "પરિણામો",
    totalArea: "કુલ વિસ્તાર",
    tilesNeeded: "જરૂરી ટાઇલ્સ",
    wastage: "બગાડ",
    totalTiles: "કુલ ટાઇલ્સ",
    reset: "કેલ્ક્યુલેટર રીસેટ કરો",
  },
  contact: {
    name: "નામ",
    email: "ઇમેઇલ",
    phone: "ફોન",
    message: "સંદેશ",
    submit: "પૂછપરછ સબમિટ કરો",
    storeLocations: "અમારા સ્ટોર સ્થાનો",
    visitUs: "અમારી પ્રીમિયમ ટાઇલ્સની વિશાળ શ્રેણી શોધવા માટે અમારી મુલાકાત લો",
    getDirections: "દિશાઓ મેળવો",
    openingHours: "ખુલવાનો સમય",
    address: "સરનામું",
  },
  dealer: {
    findDealer: "ડીલર શોધો",
    nearbyDealers: "નજીકના ડીલર્સ",
    searchDealers: "શહેર, પિનકોડ અથવા વિસ્તાર દ્વારા શોધો...",
    noResults: "કોઈ ડીલર મળ્યા નથી",
    viewAll: "બધા ડીલર્સ જુઓ",
    authorizedDealer: "અધિકૃત ડીલર",
    premiumRetailer: "પ્રીમિયમ રિટેલર",
    directions: "દિશાઓ",
    callDealer: "કૉલ",
  },
};

// All available translations
const translations = {
  en,
  hi,
  gu,
};

interface LocalizationState {
  currentLanguage: Language;
  translations: typeof translations;
  t: (key: string) => string;
  changeLanguage: (language: Language) => Promise<void>;
}

// Helper function to get nested translation values by dot notation
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      // Return the key as fallback if translation not found
      return path;
    }
  }

  return typeof result === "string" ? result : path;
};

// Create the store
export const useLocalizationStore = create<LocalizationState>((set, get) => ({
  currentLanguage: "en",
  translations,

  // Translation function
  t: (key: string) => {
    const { currentLanguage, translations } = get();
    return getNestedTranslation(translations[currentLanguage], key);
  },

  // Change language and save to AsyncStorage
  changeLanguage: async (language: Language) => {
    try {
      await AsyncStorage.setItem("USER_LANGUAGE", language);
      set({ currentLanguage: language });
    } catch (error) {
      console.error("Failed to save language preference", error);
    }
  },
}));

// Initialize language from AsyncStorage
export const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("USER_LANGUAGE");
    if (
      savedLanguage &&
      (savedLanguage === "en" ||
        savedLanguage === "hi" ||
        savedLanguage === "gu")
    ) {
      useLocalizationStore.setState({
        currentLanguage: savedLanguage as Language,
      });
    }
  } catch (error) {
    console.error("Failed to retrieve language preference", error);
  }
};
