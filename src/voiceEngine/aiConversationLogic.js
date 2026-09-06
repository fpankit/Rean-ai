// Rean Ai — Multi-Scenario Voice Conversation Engine (Rean Retell LLM / gpt-4.1)

export const PRESET_PROMPTS = [
  {
    id: 'wifi_support',
    label: 'Wi-Fi Technical Support',
    shortLabel: 'Wi-Fi Support',
    icon: 'Wifi',
    description: 'Troubleshoot internet connectivity, router diagnostics, and Wi-Fi issues',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    greeting: "Hello! Welcome to Wi-Fi Technical Support. May I please have your name and contact details first?",
    slots: [
      { key: 'name', label: 'Caller Name' },
      { key: 'contact', label: 'Contact Phone / ID' },
      { key: 'category', label: 'Issue Category' },
      { key: 'location', label: 'Location / Area' },
    ],
    placeholder: "Type a Wi-Fi issue (e.g. 'Mera wifi chal nahi raha hai' or 'My router has a red blinking light')...",
  },
  {
    id: 'sales_outbound',
    label: 'Sales Outbound Call',
    shortLabel: 'Sales Outbound',
    icon: 'TrendingUp',
    description: 'Outbound sales calls, product demos, lead qualification, and deal closing',
    color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30',
    greeting: "Hello! This is Rean AI calling from Echosphere. I'm reaching out because you showed interest in our voice AI solutions. Do you have a couple of minutes to talk?",
    slots: [
      { key: 'name', label: 'Prospect Name' },
      { key: 'contact', label: 'Contact Phone / Email' },
      { key: 'category', label: 'Product Interest' },
      { key: 'location', label: 'Company / Location' },
    ],
    placeholder: "Type a sales scenario (e.g. 'We need an AI call center for 500 agents' or 'Looking for voice automation for our store')...",
  },
  {
    id: 'customer_onboarding',
    label: 'Customer Onboarding',
    shortLabel: 'Onboarding',
    icon: 'UserPlus',
    description: 'Guide new users through account setup, verify details, and collect required information',
    color: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
    greeting: "Hello! Welcome aboard. I'm your onboarding assistant and I'll help you get set up. Can I start with your full name and the email you used to sign up?",
    slots: [
      { key: 'name', label: 'Full Name' },
      { key: 'contact', label: 'Email Address' },
      { key: 'category', label: 'Plan / Product' },
      { key: 'location', label: 'Company Name' },
    ],
    placeholder: "Type an onboarding response (e.g. 'My name is Priya and my email is priya@gmail.com')...",
  },
  {
    id: 'medical_triage',
    label: 'Medical Triage Intake',
    shortLabel: 'Medical Triage',
    icon: 'Stethoscope',
    description: 'Non-emergency symptom collection and triage routing for healthcare providers',
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    greeting: "Hello, this is a non-emergency medical intake line. I'll collect your symptoms and route you to the right care team. Can I have your full name and date of birth?",
    slots: [
      { key: 'name', label: 'Patient Name' },
      { key: 'contact', label: 'Phone / Member ID' },
      { key: 'category', label: 'Primary Symptom' },
      { key: 'location', label: 'Nearest Clinic' },
    ],
    placeholder: "Type symptoms (e.g. 'I have a persistent cough and mild fever for 3 days')...",
  },
  {
    id: 'custom',
    label: 'Custom Prompt',
    shortLabel: 'Custom',
    icon: 'Pencil',
    description: 'Write your own system prompt for any use case',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    greeting: "Hello! How can I help you today?",
    slots: [
      { key: 'name', label: 'Caller Name' },
      { key: 'contact', label: 'Contact Info' },
      { key: 'category', label: 'Topic / Intent' },
      { key: 'location', label: 'Context / Location' },
    ],
    placeholder: "Type anything based on your custom prompt...",
  }
];

export const OPENING_GREETING = PRESET_PROMPTS[0].greeting;

export const SAFETY_ALERT_PATTERNS = {
  ELECTRICAL_DANGER: [
    "open router", "cut wire", "fiber cable cut", "open electrical", "shock", "fire", "smoke", "spark", "tamper cable",
    "तार कट", "तार काटो", "करंट", "आग", "धुआँ", "धुआं", "स्पार्क", "बिजली का तार", "केबल कट"
  ],
  MEDICAL: [
    "diagnose", "medical advice", "chest pain", "heart attack", "doctor", "medicine", "prescription",
    "सीने में दर्द", "डॉक्टर", "दवा", "दवाई", "इलाज", "अस्पताल"
  ],
  EMERGENCY: [
    "ambulance", "police", "crime", "suicide", "fire emergency",
    "एम्बुलेंस", "पुलिस", "इमरजेंसी", "आपातकाल"
  ],
  LEGAL_FINANCIAL: [
    "lawyer", "lawsuit", "legal advice", "bank password", "credit card pin",
    "वकील", "पासवर्ड", "पिन"
  ]
};

export const FOUL_LANGUAGE_PATTERNS = [
  /fuck|motherfuck|bitch|shit|asshole|bastard|dick|pussy|cunt|whore|slut|damn|idiot|stupid|loser|retard|porn|cock|bollocks|arsehole|wanker|bullshit/gi,
  /madarchod|bhosdi|bhosad|chutiya|gadha|bewakoof|laude|lawde|lode|gaand|gandu|saala|kutte|kutta|harami|kamina/gi,
  /बकवास|गधा|बेवकूफ|चूत|चूतिया|लौडा|गांड|कमीना|हरामी/gi
];

export const NO_RESPONSE_PROMPT_1 = "Hello? I didn't catch that. Could you please repeat your answer so I can help you?";
export const NO_RESPONSE_PROMPT_2 = "I'm sorry, I still didn't catch your response. Since I'm not receiving any input, I'll end this call now. You can call back anytime. Goodbye!";

export const HUMAN_REQUEST_PATTERNS = [
  "human", "representative", "agent", "person", "operator", "supervisor",
  "transfer", "real person", "speak to someone", "talk to human", "connect me", "customer care",
  "इंसान", "एजेंट", "कस्टमर केयर", "बात कराओ", "सुपरवाइजर", "अधिकारी", "इंसान से बात", "मानव"
];

export class AIConversationEngine {
  constructor() {
    this.systemPrompt = "";
    this.activeScenario = PRESET_PROMPTS[0];
    this.customGreeting = null;
    this.resetSession();
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt || "";
  }

  configureForScenario(scenarioId, customPromptText) {
    const scenario = PRESET_PROMPTS.find(p => p.id === scenarioId) || PRESET_PROMPTS[0];
    this.activeScenario = scenario;
    if (scenarioId === 'custom' && customPromptText) {
      this.customGreeting = customPromptText;
    } else {
      this.customGreeting = null;
    }
  }

  getGreeting() {
    if (this.customGreeting) return this.customGreeting;
    return this.activeScenario.greeting;
  }

  // Handle the case where the user does not respond (silence / no input)
  processNoResponse(lang = "English") {
    this.noResponseCount += 1;

    // Ask twice before ending the call
    if (this.noResponseCount === 1) {
      this.currentStep = "NO_RESPONSE";
      const prompt = lang === "Hindi"
        ? "सुन रहे हैं? मैं आपकी बात नहीं सुन पाया। कृपया अपना उत्तर दोहराएं ताकि मैं आपकी मदद कर सकूं।"
        : NO_RESPONSE_PROMPT_1;

      this.transcriptHistory.push({
        speaker: "agent",
        text: prompt,
        language: lang,
        confidence: 100,
        timestamp: new Date().toLocaleTimeString(),
        isNoResponsePrompt: true
      });

      return {
        agentReply: prompt,
        shouldEscalate: false,
        endCall: false,
        slots: this.getSlotSummary(),
        languages: Array.from(this.detectedLanguages),
        avgConfidence: this.state.confidence_score,
        isCodeSwitched: this.isCodeSwitched,
        currentStep: "NO_RESPONSE",
        state: this.state
      };
    }

    // Second no-response -> end the call with a closing message
    this.state.resolution_status = "NO_RESPONSE_DISCONNECTED";
    this.currentStep = "ENDED";
    const goodbye = lang === "Hindi"
      ? "माफ़ कीजिये, मुझे अभी भी आपकी बात नहीं सुनाई दी। किसी प्रतिक्रिया के अभाव में मैं यह कॉल समाप्त कर रहा हूँ। आप कभी भी कॉलबैक कर सकते हैं। धन्यवाद, शुभ दिन!"
      : NO_RESPONSE_PROMPT_2;

    this.transcriptHistory.push({
      speaker: "agent",
      text: goodbye,
      language: lang,
      confidence: 100,
      timestamp: new Date().toLocaleTimeString(),
      isNoResponsePrompt: true
    });

    return {
      agentReply: goodbye,
      shouldEscalate: false,
      endCall: true,
      slots: this.getSlotSummary(),
      languages: Array.from(this.detectedLanguages),
      avgConfidence: this.state.confidence_score,
      isCodeSwitched: this.isCodeSwitched,
      currentStep: "ENDED",
      state: this.state
    };
  }

  resetNoResponse() {
    this.noResponseCount = 0;
  }

  resetSession() {
    this.state = {
      customer_name: null,
      phone: null,
      account_id: null,
      location: null,
      issue_type: null,
      issue_description: null,
      start_time: null,
      affected_devices: null,
      affected_device_type: null,
      router_status: null,
      router_lights: null,
      troubleshooting_attempted: [],
      troubleshooting_results: [],
      confirmed_information: [],
      uncertain_information: [],
      confidence_score: 88,
      resolution_status: null,
      escalation_required: false,
      escalation_reason: null
    };

    this.detectedLanguages = new Set(["English"]);
    this.isCodeSwitched = false;
    this.confidenceHistory = [];
    this.transcriptHistory = [];
    this.currentStep = "OPENING";
    this.callId = `CALL-${Math.floor(100000 + Math.random() * 900000)}`;
    this.askedQuestions = new Set();
    this.troubleshootingCount = 0;
    this.askedQuestionCount = 0;
    this.noResponseCount = 0;
    this.lastAgentQuestion = "";
    this.silencePromptInFlight = false;
    this.confirmQuestionAsked = false;
  }

  processUserSpeech(text, rawConfidence = 85, noiseLevel = "Clean Signal") {
    if (!text || text.trim() === "") return null;

    const cleanText = text.trim();
    const lowerText = cleanText.toLowerCase();

    // 1. Precise Language Detection (Devanagari + Expanded Hinglish Lexicon)
    let currentLang = "English";
    const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
    const hasHindiWords = lowerText.match(/\b(?:mera|meri|mere|hai|hain|kya|namaste|paani|bijli|nahi|nhi|gaya|karo|karen|batao|bataye|kaise|samajh|bhai|kal|sab|sabhi|sirf|par|raha|rahi|ho|hu|dikkat|samasya|chal|chala|chalu|net|baat|se|ko|ka|ki|ke)\b/i);

    if (hasDevanagari || hasHindiWords) {
      this.detectedLanguages.add("Hindi");
      currentLang = "Hindi";
    } else {
      currentLang = "English";
      this.detectedLanguages.clear();
      this.detectedLanguages.add("English");
    }

    if (hasHindiWords && lowerText.match(/\b(?:wifi|wi-fi|internet|router|my|is|not|working|down|device)\b/i)) {
      this.isCodeSwitched = true;
      this.detectedLanguages.add("English");
    } else {
      this.isCodeSwitched = false;
    }

    this.state.language = Array.from(this.detectedLanguages).join(" + ");

    // 2. Adjust Confidence Score
    let adjustedConfidence = rawConfidence;
    if (noiseLevel.includes("High")) adjustedConfidence -= 18;
    if (noiseLevel.includes("Medium")) adjustedConfidence -= 8;
    if (this.isCodeSwitched) adjustedConfidence -= 5;
    adjustedConfidence = Math.max(25, Math.min(99, adjustedConfidence));

    this.confidenceHistory.push(adjustedConfidence);
    const avgConfidence = Math.round(
      this.confidenceHistory.reduce((a, b) => a + b, 0) / this.confidenceHistory.length
    );
    this.state.confidence_score = avgConfidence;

    // 2.5 Foul Language Guardrail
    const foulMatch = FOUL_LANGUAGE_PATTERNS.find(p => p.test(cleanText));
    if (foulMatch) {
      foulMatch.lastIndex = 0;
      const foulReply = currentLang === "Hindi"
        ? "माफ़ कीजिये, कृपया विनम्र भाषा का उपयोग करें। मैं आपकी सहायता करना चाहता हूँ, लेकिन इस तरह की भाषा स्वीकार नहीं की जा सकती। क्या आप अपनी बात विनम्रता से दोहरा सकते हैं?"
        : "Sorry, please keep it respectful. I'm here to help, but I can't continue with abusive language. Would you mind rephrasing that politely?";

      this.transcriptHistory.push(
        { speaker: "caller", text: cleanText, language: currentLang, confidence: adjustedConfidence, timestamp: new Date().toLocaleTimeString(), isFoulLanguage: true },
        { speaker: "agent", text: foulReply, language: currentLang, confidence: 100, timestamp: new Date().toLocaleTimeString(), isFoulLanguageWarning: true }
      );

      return {
        agentReply: foulReply,
        shouldEscalate: false,
        escalationReason: "",
        slots: this.getSlotSummary(),
        languages: Array.from(this.detectedLanguages),
        avgConfidence,
        isCodeSwitched: this.isCodeSwitched,
        state: this.state
      };
    }

    // 3. Safety Screening
    const safetyIssue = this.checkSafetyBoundaries(lowerText);
    if (safetyIssue) {
      this.state.escalation_required = true;
      this.state.escalation_reason = `SAFETY_ALERT: ${safetyIssue}`;
      this.state.resolution_status = "TECHNICIAN_REQUIRED";
      this.currentStep = "ESCALATING";

      const safetyReply = this.generateSafetyResponse(safetyIssue, currentLang);

      this.transcriptHistory.push(
        { speaker: "caller", text: cleanText, language: currentLang, confidence: adjustedConfidence, timestamp: new Date().toLocaleTimeString() },
        { speaker: "agent", text: safetyReply, language: currentLang, confidence: 100, timestamp: new Date().toLocaleTimeString(), isSafetyAlert: true }
      );

      return {
        agentReply: safetyReply,
        shouldEscalate: true,
        escalationReason: this.state.escalation_reason,
        slots: this.getSlotSummary(),
        languages: Array.from(this.detectedLanguages),
        avgConfidence,
        isCodeSwitched: this.isCodeSwitched,
        state: this.state
      };
    }

    // 4. Human Transfer Request
    const isHumanRequested = HUMAN_REQUEST_PATTERNS.some(p => lowerText.includes(p));
    if (isHumanRequested) {
      this.state.escalation_required = true;
      this.state.escalation_reason = "Customer explicitly requested a human specialist.";
      this.state.resolution_status = "HUMAN_ESCALATION";
      this.currentStep = "ESCALATING";

      const humanReply = currentLang === "Hindi"
        ? "मैंने आपकी समस्या नोट कर ली है। मैं आपकी कॉल तुरंत हमारे कस्टमर केयर सपोर्ट एग्जीक्यूटिव से कनेक्ट कर रहा हूँ।"
        : "I've logged your issue details so you won't need to repeat them. Connecting you with a human support specialist now.";

      this.transcriptHistory.push(
        { speaker: "caller", text: cleanText, language: currentLang, confidence: adjustedConfidence, timestamp: new Date().toLocaleTimeString() },
        { speaker: "agent", text: humanReply, language: currentLang, confidence: 100, timestamp: new Date().toLocaleTimeString(), isSafetyAlert: false }
      );

      return {
        agentReply: humanReply,
        shouldEscalate: true,
        escalationReason: this.state.escalation_reason,
        slots: this.getSlotSummary(),
        languages: Array.from(this.detectedLanguages),
        avgConfidence,
        isCodeSwitched: this.isCodeSwitched,
        state: this.state
      };
    }

    // 5. Extract Wi-Fi Diagnostic & Contact Information
    this.extractInformation(cleanText, lowerText);

    // 6. Log Caller Transcript
    this.transcriptHistory.push({
      speaker: "caller",
      text: cleanText,
      language: this.isCodeSwitched ? "Hinglish (Code-Switched)" : currentLang,
      confidence: adjustedConfidence,
      timestamp: new Date().toLocaleTimeString()
    });

    // 7. Generate Wi-Fi Support Response
    const replyData = this.generateReanAiResponse(cleanText, lowerText, avgConfidence, currentLang, noiseLevel);

    this.transcriptHistory.push({
      speaker: "agent",
      text: replyData.agentReply,
      language: currentLang,
      confidence: 100,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      agentReply: replyData.agentReply,
      shouldEscalate: replyData.shouldEscalate,
      escalationReason: replyData.escalationReason,
      slots: this.getSlotSummary(),
      languages: Array.from(this.detectedLanguages),
      avgConfidence,
      isCodeSwitched: this.isCodeSwitched,
      currentStep: this.currentStep,
      state: this.state
    };
  }

  checkSafetyBoundaries(lowerText) {
    if (SAFETY_ALERT_PATTERNS.ELECTRICAL_DANGER.some(p => lowerText.includes(p))) {
      return "ELECTRICAL_EQUIPMENT_DANGER";
    }
    if (SAFETY_ALERT_PATTERNS.MEDICAL.some(p => lowerText.includes(p))) {
      return "MEDICAL_DIAGNOSIS_PROHIBITED";
    }
    if (SAFETY_ALERT_PATTERNS.EMERGENCY.some(p => lowerText.includes(p))) {
      return "EMERGENCY_DISPATCH_REQUIRED";
    }
    return null;
  }

  generateSafetyResponse(issue, lang) {
    if (issue === "ELECTRICAL_EQUIPMENT_DANGER") {
      return lang === "Hindi"
        ? "सुरक्षा के लिए कृपया किसी भी तार, केबल या विद्युत उपकरण को न छुएं। मैं आपकी कॉल तुरंत हमारे सीनियर तकनीशियन को ट्रांसफर कर रहा हूँ।"
        : "Please do not touch or open electrical cables. Connecting you directly with a field technician.";
    }
    return lang === "Hindi"
      ? "मैं एक वाई-फ़ाई टेक्निकल सपोर्ट बोट हूँ और आपातकालीन सहायता नहीं दे सकता। कृपया 112 या निकटतम आपातकालीन सेवा से संपर्क करें।"
      : "I am a non-clinical Wi-Fi technical support assistant. Let me connect you with emergency support.";
  }

  get slots() {
    return this.getSlotSummary();
  }

  extractInformation(rawText, lowerText) {
    const words = rawText.trim().split(/\s+/);
    const cleanNoPunct = rawText.replace(/[.,!?]/g, '').trim();

    // 1. Extract Customer Name (English, Hinglish & Devanagari)
    if (!this.state.customer_name) {
      const nameMatch = rawText.match(/(?:my name is|i am|this is|call me|mera naam|naam|मेरा नाम|मैं|name:?)\s+([A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+)?)/i);
      if (nameMatch) {
        this.state.customer_name = nameMatch[1].trim();
      } else if (lowerText.match(/rahul|राहुल/i)) {
        this.state.customer_name = "Rahul Sharma";
      } else if (lowerText.match(/ananya|अनन्या/i)) {
        this.state.customer_name = "Ananya Roy";
      } else if (
        (this.currentStep === "COLLECTING_NAME" || this.askedQuestions.has("customer_name") || words.length <= 4) &&
        !lowerText.match(/wifi|wi-fi|router|internet|slow|red|green|no|ha|haan|yes|hello|hi|help|support|problem|issue|down|code|street/i)
      ) {
        this.state.customer_name = cleanNoPunct;
      }
    }

    // 2. Extract Phone Number / Contact ID
    if (!this.state.phone) {
      const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{2,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/);
      if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7) {
        this.state.phone = phoneMatch[0].trim();
      } else {
        const explicitNum = lowerText.match(/(?:phone|mobile|number|contact|id|acc|account|संपर्क|नंबर)\s*(?:is|:|\=)?\s*([A-Za-z0-9\+\s-]+)/i);
        if (explicitNum && explicitNum[1].trim().length >= 5) {
          this.state.phone = explicitNum[1].trim();
        } else if (
          (this.currentStep === "COLLECTING_CONTACT" || this.askedQuestions.has("contact_location")) &&
          /\d/.test(rawText)
        ) {
          const numDigits = rawText.replace(/\D/g, '');
          if (numDigits.length >= 6) {
            this.state.phone = rawText.trim();
          }
        }
      }
    }

    // 3. Extract Location / Area
    if (!this.state.location) {
      const locMatch = rawText.match(/(?:sector\s*\d+|dwarka|rohini|noida|gurugram|delhi|mumbai|bangalore|community park|main market|gate\s*\d+|indrapuram|saket|lajpat nagar|janakpuri|new york|california|london|chicago|san francisco|downtown|main street|green park|flat\s*\d+|house\s*\d+)/i);
      if (locMatch) {
        this.state.location = locMatch[0];
      } else {
        const prepLocMatch = rawText.match(/(?:in|near|at|from|area|location|city|place|स्थान|एरिया|सेक्टर)\s+([A-Za-z0-9\u0900-\u097F\s]{2,30})(?:,|\.|$)/i);
        if (prepLocMatch) {
          this.state.location = prepLocMatch[1].trim();
        } else if (
          (this.currentStep === "COLLECTING_CONTACT" || this.askedQuestions.has("contact_location")) &&
          !/\d{7,}/.test(rawText) &&
          words.length <= 6 &&
          !lowerText.match(/wifi|wi-fi|router|internet|slow|red|green|no|ha|haan|yes/i)
        ) {
          this.state.location = cleanNoPunct;
        }
      }
    }

    // 4. Extract Primary Issue Category (scenario-aware)
    if (!this.state.issue_type) {
      if (this.activeScenario?.id === 'sales_outbound') {
        if (lowerText.match(/(?:call center|contact center|agents|crm|support|voice ai|ai assistant|bot|automation)/i)) {
          this.state.issue_type = "Call Center / Voice AI";
          this.state.issue_description = "Interest in contact center voice AI";
        } else if (lowerText.match(/(?:demo|pricing|price|plan|cost|quote|purchase|buy)/i)) {
          this.state.issue_type = "Product Interest";
          this.state.issue_description = "Requesting demo / pricing";
        } else if (lowerText.match(/(?:integration|api|develop|build|custom)/i)) {
          this.state.issue_type = "Integration / Custom Development";
          this.state.issue_description = "Integration / build request";
        }
      } else if (this.activeScenario?.id === 'medical_triage') {
        if (lowerText.match(/(?:fever|cough|cold|sore throat|headache|pain|nausea|dizzy|dizziness|rash|breath|breathing)/i)) {
          this.state.issue_type = "Physical Symptoms";
          this.state.issue_description = "Reported physical symptoms";
        } else if (lowerText.match(/(?:anxiety|depression|stress|insomnia|mood|panic|mental)/i)) {
          this.state.issue_type = "Mental Health";
          this.state.issue_description = "Mental health concern";
        } else if (lowerText.match(/(?:flu|viral|infection|allergy|covid|corona)/i)) {
          this.state.issue_type = "Infectious / Allergic";
          this.state.issue_description = "Infectious or allergic symptoms";
        }
      } else if (this.activeScenario?.id === 'customer_onboarding') {
        if (lowerText.match(/(?:login|password|sign in|account|verify|otp)/i)) {
          this.state.issue_type = "Account Access";
          this.state.issue_description = "Account setup / access concern";
        } else if (lowerText.match(/(?:plan|upgrade|downgrade|billing|payment|invoice|subscription)/i)) {
          this.state.issue_type = "Billing / Plan";
          this.state.issue_description = "Billing or plan concern";
        } else if (lowerText.match(/(?:feature|how to|guide|tutorial|setup|install|configure)/i)) {
          this.state.issue_type = "Setup Assistance";
          this.state.issue_description = "Setup / feature guidance";
        }
      }
      if (!this.state.issue_type && lowerText.match(/(?:slow|dheema|dheemi|speed|loading|buffer|धीमा|धीमी|स्पीड|कम|lag|buffering)/i)) {
        this.state.issue_type = "Slow Internet Speed";
        this.state.issue_description = "Slow Internet Speed";
      } else if (!this.state.issue_type && lowerText.match(/(?:disconnect|baar-baar|dropping|intermittent|cut|कट|डिस्कनेक्ट|बार-बार|keeps dropping|unstable)/i)) {
        this.state.issue_type = "Frequent Disconnections";
        this.state.issue_description = "Frequent Disconnections";
      } else if (!this.state.issue_type && lowerText.match(/(?:not visible|nahi dikh|dikh nahi|missing|नहीं दिख|दिख नहीं|can't see wifi|ssid)/i)) {
        this.state.issue_type = "Wi-Fi Network Not Visible";
        this.state.issue_description = "Wi-Fi Network Not Visible";
      } else if (!this.state.issue_type && lowerText.match(/(?:cannot connect|connect nahi|jod nahi|कनेक्ट नहीं|जुड़ नहीं|auth error|password issue)/i)) {
        this.state.issue_type = "Unable to Connect";
        this.state.issue_description = "Unable to Connect to Wi-Fi";
      }
      if (!this.state.issue_type && !this.state.issue_description && lowerText.match(/wifi|wi-fi|internet|net|broadband|router|chal nahi|kaam nahi|काम नहीं|चल नहीं|बंद|down|outage|offline|problem|issue|help|support/i)) {
        this.state.issue_type = "No Internet Connection";
        this.state.issue_description = "Wi-Fi Connected but No Internet";
      }
    }

    // Scope (One vs All Devices)
    if (lowerText.match(/(?:all devices|sab devices|sabhi|har device|sare|every device|laptop and phone|multiple|सब|सभी|सारे|हर)/i)) {
      this.state.affected_devices = "Multiple-device problem";
    } else if (lowerText.match(/(?:only one|just my phone|only laptop|sirf ek|kewal ek|ek hi|सिर्फ एक|केवल एक|एक ही)/i)) {
      this.state.affected_devices = "One-device problem";
    }

    // Router Lights
    if (lowerText.match(/(?:red light|blinking|lal light|laal|red|lal|लाल|ब्लिंक|रेड)/i)) {
      this.state.router_lights = "Red or Blinking";
      this.state.router_status = "Abnormal";
    } else if (lowerText.match(/(?:normal|green|all light on|hari|hara|हरा|हरी|ग्रीन|नॉर्मल)/i)) {
      this.state.router_lights = "Normal Green";
      this.state.router_status = "Normal";
    }
  }

  generateReanAiResponse(userText, lowerText, avgConfidence, lang, noiseLevel) {
    let reply = "";

    // Handle rejection of the initial greeting
    if (this.currentStep === "OPENING") {
      const declinedGreeting = /\b(?:no|nahi|nhi|nahin|not now|no thanks|busy|not interested|cannot talk|can't talk|call later|drop me|skip|don't call|no call)\b|नहीं|ना|जरूरत नहीं|नहीं चाहिए|व्यस्त/i.test(lowerText);

      if (declinedGreeting) {
        this.state.resolution_status = "CALLER_DECLINED";
        this.currentStep = "COMPLETED";
        const closing = lang === "Hindi"
          ? "कोई बात नहीं, समझ गया। यदि आपको बाद में सहायता चाहिए तो किसी भी समय कॉल कर सकते हैं। धन्यवाद, शुभ दिन!"
          : "No problem at all, I completely understand. If you'd like to talk later, feel free to reach out anytime. Thank you and have a great day!";
        return { agentReply: closing, shouldEscalate: false, escalationReason: "" };
      }

      this.currentStep = "DIAGNOSING";
    }

    // Low Audio Confidence / Noise
    if (avgConfidence < 58 || noiseLevel.includes("High")) {
      reply = lang === "Hindi"
        ? "माफ़ कीजिये, पीछे शोर की वजह से आपकी आवाज़ साफ़ नहीं आ रही है। क्या आप अपनी बात फिर से दोहरा सकते हैं?"
        : "Sorry, there's background noise. Could you please repeat that last part?";
      return { agentReply: reply, shouldEscalate: false, escalationReason: "" };
    }

    // Scenario-aware Confirmation / Wrap-up Step
    if (this.currentStep === "CONFIRMING") {
      const scenarioId = this.activeScenario?.id || 'wifi_support';
      const yesMatch = /\b(?:yes|yeah|yep|sure|ok|okay|haan|ha|perfect|great|good|please do|go ahead|agree|confirmed|right|correct)\b|हां|हाँ|हा|जी|हां जी|ठीक है|चलो/i.test(lowerText) || lowerText.includes("book a slot");
      const noMatch = /\bno\b|nahi|nhi|nahin|not now|no thanks|कोई नहीं|नहीं|ना|जरूरत नहीं|नहीं चाहिए/i.test(lowerText);

      // Wi-Fi scenario: yes -> resolved, no -> escalate after 2 attempts
      if (scenarioId === 'wifi_support') {
        if (yesMatch) {
          this.state.resolution_status = "RESOLVED";
          this.currentStep = "COMPLETED";
          reply = lang === "Hindi"
            ? `बहुत बढ़िया! आपकी इंटरनेट सेवा दोबारा चालू हो गई है। आपकी शिकायत संदर्भ संख्या (टिकट आईडी) ${this.callId} है।`
            : `Awesome! Glad to hear your Wi-Fi is back online. Your support reference ID is ${this.callId}.`;
        } else if (noMatch) {
          this.troubleshootingCount++;
          if (this.troubleshootingCount >= 2) {
            this.state.escalation_required = true;
            this.state.escalation_reason = "Troubleshooting steps unsuccessful. Escalate to field technician.";
            this.state.resolution_status = "HUMAN_ESCALATION";
            this.currentStep = "ESCALATING";
            reply = lang === "Hindi"
              ? "आपकी इंटरनेट समस्या का समाधान नहीं हो पाया है। मैंने आपकी शिकायत दर्ज कर ली है और हमारे सीनियर तकनीशियन को आपकी लाइन जांचने के लिए भेज रहा हूँ।"
              : "The connection is still unstable. I am creating a priority ticket for a field technician to inspect your line.";
            return { agentReply: reply, shouldEscalate: true, escalationReason: this.state.escalation_reason };
          }
          reply = lang === "Hindi"
            ? "माफ़ कीजिये, मैं समझ गया। क्या आप फिर से राउटर रीस्टार्ट करके देख सकते हैं, या फिर हम तकनीशियन भेज दें?"
            : "I see. Would you like to try the restart one more time, or should I send a technician?";
        } else {
          this.confirmQuestionAsked = true;
          reply = this.scenarioConfirmQuestion(lang);
        }
        return { agentReply: reply, shouldEscalate: false, escalationReason: "" };
      }

      // Non-Wi-Fi scenarios: affirmative -> acknowledge & wrap up the call
      if (yesMatch && !noMatch) {
        this.state.resolution_status = "RESOLVED";
        this.currentStep = "COMPLETED";
        const refId = this.callId;
        switch (scenarioId) {
          case 'sales_outbound':
            reply = lang === "Hindi"
              ? `बहुत बढ़िया! आपका डेमो स्लॉट बुक हो गया है। रेफरेंस आईडी ${refId} है। किसी और सवाल में मैं आपकी मदद कर सकता हूँ। धन्यवाद!`
              : `Perfect! Your demo slot is booked. Your reference ID is ${refId}. Is there anything else I can help you with? Thank you!`;
            break;
          case 'customer_onboarding':
            reply = lang === "Hindi"
              ? `बहुत बढ़िया! आपका ऑनबोर्डिंग पूरा हो गया है, सेटअप गाइड आपके ईमेल पर भेज दिया गया है। रेफरेंस आईडी ${refId} है। धन्यवाद!`
              : `Great! Your onboarding is complete and the setup guide is on its way to your email. Your reference ID is ${refId}. Thank you!`;
            break;
          case 'medical_triage':
            reply = lang === "Hindi"
              ? `आपके लक्षण दर्ज कर लिए गए हैं और हमारी केयर टीम जल्द ही आपसे संपर्क करेगी। रेफरेंस आईडी ${refId} है। अपना ख्याल रखें!`
              : `Your symptoms are recorded and our care team will reach out soon. Your reference ID is ${refId}. Take care!`;
            break;
          default:
            reply = lang === "Hindi"
              ? `आपकी जानकारी दर्ज कर ली गई है। रेफरेंस आईडी ${refId} है। किसी और सवाल में मैं आपकी मदद कर सकता हूँ। धन्यवाद!`
              : `Your information has been recorded. Your reference ID is ${refId}. Let me know if I can help with anything else. Thank you!`;
        }
        return { agentReply: reply, shouldEscalate: false, escalationReason: "" };
      }

      // Negative / declining response -> acknowledge & end politely
      if (noMatch) {
        this.state.resolution_status = "CALLER_DECLINED";
        this.currentStep = "COMPLETED";
        reply = lang === "Hindi"
          ? "कोई बात नहीं, समझ गया। यदि आपको बाद में सहायता चाहिए तो कभी भी कॉल करें। धन्यवाद, शुभ दिन!"
          : "No problem at all. If you need anything later, feel free to call back anytime. Thank you and have a great day!";
        return { agentReply: reply, shouldEscalate: false, escalationReason: "" };
      }

      // User gave a non-clear response after the confirm question was already
      // asked once — stop re-asking and wrap up the call gracefully instead.
      this.state.resolution_status = "RESOLVED";
      this.currentStep = "COMPLETED";
      const refId = this.callId;
      switch (scenarioId) {
        case 'sales_outbound':
          reply = lang === "Hindi"
            ? `ठीक है, समझ गया। आपकी जानकारी दर्ज कर ली गई है, रेफरेंस आईडी ${refId} है। यदि आपको बाद में कुछ चाहिए तो कॉल करें। धन्यवाद!`
            : `Got it. I've noted everything down, your reference ID is ${refId}. Feel free to call back if you need anything. Thank you!`;
          break;
        case 'customer_onboarding':
          reply = lang === "Hindi"
            ? `बहुत बढ़िया! आपका ऑनबोर्डिंग पूरा हो गया है, सेटअप गाइड आपके ईमेल पर भेज दिया गया है। रेफरेंस आईडी ${refId} है। धन्यवाद!`
            : `Great! Your onboarding is complete and the setup guide is on its way to your email. Your reference ID is ${refId}. Thank you!`;
          break;
        case 'medical_triage':
          reply = lang === "Hindi"
            ? `आपके लक्षण दर्ज कर लिए गए हैं और हमारी केयर टीम जल्द ही आपसे संपर्क करेगी। रेफरेंस आईडी ${refId} है। अपना ख्याल रखें!`
            : `Your symptoms are recorded and our care team will reach out soon. Your reference ID is ${refId}. Take care!`;
          break;
        default:
          reply = lang === "Hindi"
            ? `आपकी जानकारी दर्ज कर ली गई है। रेफरेंस आईडी ${refId} है। किसी और सवाल में मैं आपकी मदद कर सकता हूँ। धन्यवाद!`
            : `Your information has been recorded. Your reference ID is ${refId}. Let me know if I can help with anything else. Thank you!`;
      }
      return { agentReply: reply, shouldEscalate: false, escalationReason: "" };
    }

    // Contextual Information Gathering (scenario-aware)
    const scenario = this.activeScenario?.id || 'wifi_support';

    // Honor a decline / refusal to continue. Only treat it as a decline when
    // the response is a short, standalone refusal (e.g. "no", "not now"),
    // so legitimate "no" answers to real questions still proceed.
    const declinedFlow = /\b(?:no|nahi|nhi|nahin|no thanks|not now|not interested|stop|end call|hang up|goodbye|skip|enough|leave me)\b|नहीं|ना|जरूरत नहीं|नहीं चाहिए|बंद कर|बात नहीं|रुक/i.test(lowerText);
    const isShortRefusal = userText.trim().split(/\s+/).length <= 4;
    if (declinedFlow && isShortRefusal) {
      this.state.resolution_status = "CALLER_DECLINED";
      this.currentStep = "COMPLETED";
      const closing = lang === "Hindi"
        ? "कोई बात नहीं, समझ गया। यदि आपको बाद में सहायता चाहिए तो किसी भी समय कॉल कर सकते हैं। धन्यवाद, शुभ दिन!"
        : "No problem at all, I completely understand. If you'd like to continue later, feel free to reach out anytime. Thank you and have a great day!";
      return { agentReply: closing, shouldEscalate: false, escalationReason: "" };
    }

    // Q1: Ask Name First
    if (!this.state.customer_name && !this.askedQuestions.has("customer_name")) {
      this.askedQuestions.add("customer_name");
      this.currentStep = "COLLECTING_NAME";
      reply = this.scenarioNameQuestion(lang);
    }
    // Q2: Ask Contact Phone / Location Area
    else if ((!this.state.phone || !this.state.location) && !this.askedQuestions.has("contact_location")) {
      this.askedQuestions.add("contact_location");
      this.currentStep = "COLLECTING_CONTACT";
      const nameTag = this.state.customer_name ? (lang === "Hindi" ? `धन्यवाद ${this.state.customer_name} जी! ` : `Thank you ${this.state.customer_name}! `) : "";
      reply = this.scenarioContactQuestion(nameTag, lang);
    }
    // Q3: Ask Issue Type / Topic
    else if (!this.state.issue_type && !this.askedQuestions.has("issue_type")) {
      this.askedQuestions.add("issue_type");
      this.currentStep = "DIAGNOSING";
      reply = this.scenarioTopicQuestion(lang);
    }
    // Q4: Guided Resolution step (scenario-specific flow)
    else if (!this.askedQuestions.has("resolution_flow")) {
      this.askedQuestions.add("resolution_flow");
      this.askedQuestionCount++;
      this.currentStep = "RESOLVING";
      reply = this.scenarioResolutionStep(lang);
    }
    // Verification / Wrap Up
    else {
      this.currentStep = "CONFIRMING";
      this.confirmQuestionAsked = true;
      reply = this.scenarioConfirmQuestion(lang);
    }

    return { agentReply: reply, shouldEscalate: false, escalationReason: "" };
  }

  scenarioNameQuestion(lang) {
    switch (this.activeScenario?.id) {
      case 'sales_outbound':
        return lang === "Hindi"
          ? "नमस्ते! क्या मैं आपका पूरा नाम और जिस कंपनी के लिए आप काम करते हैं, वह जान सकता हूँ?"
          : "Hello! May I have your full name and the company you represent?";
      case 'customer_onboarding':
        return lang === "Hindi"
          ? "नमस्ते! क्या आप अपना पूरा नाम और वह ईमेल बता सकते हैं जिससे आपने साइन अप किया था?"
          : "Hello! Could you share your full name and the email you used to sign up?";
      case 'medical_triage':
        return lang === "Hindi"
          ? "नमस्ते! क्या आप अपना पूरा नाम और जन्म तिथि बता सकते हैं?"
          : "Hello! May I have your full name and date of birth?";
      default:
        return lang === "Hindi"
          ? "नमस्ते! वाई-फ़ाई टेक्निकल सपोर्ट में आपका स्वागत है। क्या मैं सबसे पहले आपका शुभ नाम जान सकता हूँ?"
          : "Hello! Welcome to Wi-Fi Technical Support. May I please have your name first?";
    }
  }

  scenarioContactQuestion(nameTag, lang) {
    switch (this.activeScenario?.id) {
      case 'sales_outbound':
        return lang === "Hindi"
          ? `${nameTag}क्या आप अपना मोबाइल नंबर और ईमेल बता सकते हैं ताकि मैं आपको हमारे प्रोडक्ट की विस्तृत जानकारी भेज सकूँ?`
          : `${nameTag}Could you share your contact phone number and email so I can send you more details?`;
      case 'customer_onboarding':
        return lang === "Hindi"
          ? `${nameTag}किस कंपनी के लिए आप यह सर्विस ले रहे हैं और आपका फोन नंबर क्या है?`
          : `${nameTag}Which company are you onboarding for, and what's your phone number?`;
      case 'medical_triage':
        return lang === "Hindi"
          ? `${nameTag}आपका फोन नंबर और निकटतम क्लिनिक का नाम बता सकते हैं?`
          : `${nameTag}Could you share your phone number and the nearest clinic?`;
      default:
        return lang === "Hindi"
          ? `${nameTag}क्या आप अपना मोबाइल नंबर और एरिया/लोकेशन बता सकते हैं?`
          : `${nameTag}Could you please share your contact phone number and location area?`;
    }
  }

  scenarioTopicQuestion(lang) {
    switch (this.activeScenario?.id) {
      case 'sales_outbound':
        return lang === "Hindi"
          ? "बहुत अच्छा! हमारे किस उत्पाद में आपकी सबसे ज्यादा रुचि है, या आप कौन सी समस्या हल करना चाहते हैं?"
          : "Great! Which of our products are you most interested in, or what problem are you trying to solve?";
      case 'customer_onboarding':
        return lang === "Hindi"
          ? "आपने कौन सा प्लान या प्रोडक्ट चुना है, और क्या आपको कोई सहायता चाहिए?"
          : "Which plan or product did you choose, and is there anything you need help setting up?";
      case 'medical_triage':
        return lang === "Hindi"
          ? "ठीक है, कृपया अपने मुख्य लक्षण कुछ शब्दों में बताएं—कितने दिनों से हैं और कितनी गंभीरता से?"
          : "Okay, please describe your main symptoms in a few words—how long and how severe?";
      default:
        return lang === "Hindi"
          ? "जी समझ गया। आपके वाई-फ़ाई में क्या समस्या आ रही है—इंटरनेट बंद है, स्पीड धीमी है या बार-बार डिस्कनेक्ट हो रहा है?"
          : "Got it! What issue are you experiencing with your Wi-Fi connection—no internet, slow speed, or frequent disconnections?";
    }
  }

  scenarioResolutionStep(lang) {
    switch (this.activeScenario?.id) {
      case 'sales_outbound':
        return lang === "Hindi"
          ? "बढ़िया! मैं आपके लिए एक कस्टम डेमो शेड्यूल कर सकता हूँ। आपके लिए कौन सा समय सबसे अच्छा रहेगा?"
          : "Excellent! I can schedule a custom demo for you. What time works best for you?";
      case 'customer_onboarding':
        return lang === "Hindi"
          ? "सब कुछ ठीक लग रहा है। क्या आप चाहेंगे कि मैं सेटअप गाइड ईमेल कर दूं या कोई और सवाल पूछना चाहेंगे?"
          : "Everything looks good. Would you like me to email your setup guide, or do you have any other questions?";
      case 'medical_triage':
        return lang === "Hindi"
          ? "हमारी केयर टीम जल्द ही आपसे संपर्क करेगी। इस बीच क्या आप कोई और लक्षण बताना चाहेंगे?"
          : "Our care team will reach out shortly. In the meantime, are there any other symptoms you'd like to share?";
      default:
        this.state.troubleshooting_attempted.push("Guided Router Restart");
        return lang === "Hindi"
          ? "आइए एक बार राउटर रीस्टार्ट करके देखते हैं। कृपया राउटर का पावर बटन 30 सेकंड के लिए बंद करके फिर से चालू करें।"
          : "Let's try a quick restart. Please switch the router off, wait 30 seconds, and switch it back on.";
    }
  }

  scenarioConfirmQuestion(lang) {
    switch (this.activeScenario?.id) {
      case 'sales_outbound':
        return lang === "Hindi"
          ? "क्या आप इस समय मेरे साथ बुक करना चाहेंगे, या मैं आपको ईमेल पर विवरण भेज दूं?"
          : "Would you like to book a slot with me now, or should I email you the details?";
      case 'customer_onboarding':
        return lang === "Hindi"
          ? "क्या आपके पास कोई अन्य प्रश्न है, या आप सब कुछ समझ चुके हैं?"
          : "Do you have any other questions, or is everything clear?";
      case 'medical_triage':
        return lang === "Hindi"
          ? "क्या आपने ये लक्षण पहले भी अनुभव किए हैं या यह पहली बार है?"
          : "Have you experienced these symptoms before, or is this the first time?";
      default:
        return lang === "Hindi"
          ? "क्या आप अपने फोन या कंप्यूटर पर कोई वेबसाइट खोलकर चेक कर सकते हैं कि इंटरनेट चलने लगा है या नहीं?"
          : "Could you try opening a website now and tell me if it's working?";
    }
  }

  getSlotSummary() {
    return {
      name: this.state.customer_name || null,
      contact: this.state.phone || null,
      location: this.state.location || null,
      category: this.state.issue_type || null,
      scope: this.state.affected_devices || null,
      routerStatus: this.state.router_lights || null,
      stepsAttempted: this.state.troubleshooting_attempted,
      classification: this.state.resolution_status || "IN_DIAGNOSIS",
      confirmed: Boolean(this.state.resolution_status === "RESOLVED")
    };
  }

  generateHandoffSummary() {
    const scenarioName = this.activeScenario?.label || 'Wi-Fi Technical Support';
    const summaryText = `${scenarioName} call with ${this.state.customer_name || 'Caller'}. Topic: ${this.state.issue_description || this.state.issue_type || 'General inquiry'}. ${this.state.affected_devices || ''}`.trim();

    return {
      callId: this.callId,
      callerName: this.state.customer_name || "Customer",
      customer: {
        name: this.state.customer_name || "Customer",
        phone: this.state.phone || "+91 98765 43210",
        accountId: this.state.account_id || "ACC-89012",
        location: this.state.location || "Sector 14"
      },
      extractedSlots: this.getSlotSummary(),
      problem: {
        category: this.state.issue_type || "General inquiry",
        description: this.state.issue_description || "General inquiry",
        duration: this.state.start_time || "Today",
        affectedDevices: this.state.affected_devices || "N/A"
      },
      diagnostics: {
        routerStatus: this.state.router_status || "N/A",
        routerLights: this.state.router_lights || "N/A",
        previousTroubleshooting: this.state.troubleshooting_attempted,
        results: this.state.troubleshooting_results
      },
      confidence: {
        score: this.state.confidence_score,
        uncertainInfo: this.state.uncertain_information
      },
      escalationReason: this.state.escalation_reason || "Human handoff requested.",
      summaryText,
      transcriptCount: this.transcriptHistory.length,
      internalState: this.state
    };
  }
}

export const aiEngine = new AIConversationEngine();
export default aiEngine;

