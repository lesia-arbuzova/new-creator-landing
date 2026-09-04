export const locales = ["uk", "en"] as const;

export type Locale = (typeof locales)[number];

export const instagram = "https://www.instagram.com/rita_visualdesigns/?hl=uk";
export const telegram = "https://t.me/rita_visualdesigns";

export type StripItem = { src: string; poster: string; tag: string; title: string };

const copy = {
  uk: {
    meta: {
      title: "NEW CREATOR — практичний курс зі створення AI-контенту",
      description:
        "Два місяці практичного навчання зі створення AI-фото, відео, реклами та робіт для портфоліо.",
    },
    skip: "Перейти до основного змісту",
    eyebrow: "ПРАКТИЧНИЙ КУРС З AI‑КОНТЕНТУ",
    nav: [
      ["ШОУРІЛ", "#works"],
      ["ФОРМАТИ", "#formats"],
      ["МЕНТОРКА", "#mentor"],
      ["ЦІНА", "#price"],
    ] as ReadonlyArray<readonly [string, string]>,
    heroNote: "Практика, а не теорія",
    title: ["AI-КОНТЕНТ,", "ЩО ПРОДАЄ", "ТА ВИДІЛЯЄ."],
    description:
      "Практичний курс для тих, хто хоче опанувати створення AI-фото, відео та креативів і заробляти на сучасному контенті.",
    cta: "ЗАБРОНЮВАТИ МІСЦЕ",
    secondary: "ДІЗНАТИСЬ БІЛЬШЕ",
    payment: "Передоплата 2 000 грн",
    start: "НОВИЙ ПОТІК NEW CREATOR СТАРТУЄ 7 ЧИСЛА КОЖНОГО МІСЯЦЯ.",
    creatorAlt: "Ріта — AI-креаторка й менторка NEW CREATOR",
    stats: [
      ["2", "МІСЯЦІ ПРАКТИКИ"],
      ["10", "БЛОКІВ ПРОГРАМИ"],
      ["10", "AI-ІНСТРУМЕНТІВ У РОБОТІ"],
      ["ПОРТФОЛІО", "ПІД ЧАС НАВЧАННЯ"],
    ] as ReadonlyArray<readonly [string, string]>,
    strip: {
      kicker: "ШОУРІЛ NEW CREATOR",
      title: "РОБОТИ МЕНТОРКИ ТА СТУДЕНТІВ",
      hint: "Відео грають автоматично. Клікни на будь-яке — відкриється на весь екран.",
      disclaimer: "ЦЕ НЕ РОБОТИ ПЕРШОГО ПОТОКУ NEW CREATOR.",
      disclaimerNote: "Ці роботи студентів — з попередніх менторських потоків Ріти.",
      openLabel: "Дивитися відео на весь екран",
      closeLabel: "Закрити відео",
      items: [
        { src: "/showcase-ritora.mp4", poster: "/showcase-ritora-poster.jpg", tag: "МЕНТОРКА", title: "SHOWREEL" },
        { src: "/student-gelato.mp4", poster: "/student-gelato.jpg", tag: "СТУДЕНТ", title: "FOOD CONTENT" },
        { src: "/mentor-coffee.mp4", poster: "/mentor-coffee.jpg", tag: "МЕНТОРКА", title: "PRODUCT VISUAL" },
        { src: "/student-surreal.mp4", poster: "/student-surreal.jpg", tag: "СТУДЕНТ", title: "SURREAL STORY" },
        { src: "/mentor-matcha.mp4", poster: "/mentor-matcha.jpg", tag: "МЕНТОРКА", title: "РЕКЛАМНИЙ КОНЦЕПТ" },
        { src: "/student-pets.mp4", poster: "/student-pets.jpg", tag: "СТУДЕНТ", title: "AI-ПЕРСОНАЖ" },
        { src: "/mentor-pool.mp4", poster: "/mentor-pool.jpg", tag: "МЕНТОРКА", title: "FASHION STORY" },
        { src: "/student-portrait.mp4", poster: "/student-portrait.jpg", tag: "СТУДЕНТ", title: "AI-ПОРТРЕТ" },
      ] as ReadonlyArray<StripItem>,
    },
    formats: {
      kicker: "РЕЗУЛЬТАТ КУРСУ",
      title: "ФОРМАТИ, ЯКІ ТИ ВМІЮШ СТВОРЮВАТИ.",
      intro: "Не теорія про інструменти, а три типи робіт, за які платять клієнти. Кожен проходимо від ідеї до готового ролика.",
      items: [
        ["РЕКЛАМНИЙ РОЛИК ДЛЯ БРЕНДУ", "Повний цикл: ідея, сценарій, генерація кадрів, голос, музика, монтаж. Контент, яким бренди замінюють дорогі зйомки."],
        ["AI-АВАТАР ДЛЯ ЕКСПЕРТА", "Цифровий персонаж, який веде відео без постійних знімань: озвучка, міміка, субтитри, готові виступи."],
        ["ФЕШН- ТА АРТ-ІСТОРІЇ", "Кінематографічний рух і атмосфера — від нейрофотосесії до готової відеоісторії, що виділяється в стрічці."],
      ] as ReadonlyArray<readonly [string, string]>,
      tools: "Інструменти курсу: Kling, Google Veo, HeyGen, ElevenLabs, Suno, CapCut, Magnific, Higgsfield, ChatGPT і Gemini.",
      forWhoKicker: "ДЛЯ КОГО ЦЕ НАВЧАННЯ",
      forWho: [
        "Хочеш освоїти нову професію або змінити напрям",
        "Хочеш працювати онлайн чи з дому у гнучкому графіку",
        "Маєш бізнес і хочеш самостійно створювати сучасний контент",
        "Працюєш у SMM, дизайні, фотографії або створенні контенту",
        "Хочеш створювати AI-контент для клієнтів",
      ],
      programLabel: "ПОДИВИТИСЬ ПОВНУ ПРОГРАМУ",
      program: {
        title: "10 БЛОКІВ. ОДНА ЛОГІКА — ВІД ІДЕЇ ДО ГОТОВОЇ РОБОТИ.",
        modules: [
          ["AI THINKING + GPT / GEMINI / AI-АГЕНТИ", "Створюємо власних AI-помічників для ідей, сценаріїв, контенту та промптів."],
          ["PROMPT ENGINEERING", "Композиція, ракурси, камера, світло, рух, атмосфера, референси, Frames, Ingredients і Multi-shot."],
          ["AI PHOTO / НЕЙРОФОТОСЕСІЯ", "Створюємо персонажа, тренуємо модель і робимо реалістичну серію фото."],
          ["MAGNIFIC AI + HIGGSFIELD AI", "Покращення, деталізація та підготовка якісного візуального контенту."],
          ["GOOGLE FLOW / VEO", "Перетворюємо ідею та зображення на відео, працюємо з Frames, Extend і референсами."],
          ["KLING", "Генеруємо відео, опрацьовуємо рух і Motion Control."],
          ["HEYGEN / AI AVATARS", "Створюємо цифрового персонажа та відеоконтент без постійних знімань себе."],
          ["ELEVENLABS", "Працюємо з озвучкою, власним голосом, Voice Changer, звуковими ефектами й dubbing."],
          ["SUNO", "Створюємо власну музику для відео та реклами."],
          ["CAPCUT", "Збираємо все в готовий ролик: монтаж, субтитри, музика, голос, SFX і фінальна обробка."],
        ] as ReadonlyArray<readonly [string, string]>,
        bonus: "+ додаткові бонуси під час навчання",
      },
    },
    mentor: {
      kicker: "ХТО ВЕДЕ КУРС",
      title: "Я ЗНАЮ, ЯК ЦЕ — ПОЧИНАТИ З НУЛЯ.",
      body: [
        "12 років я працювала майстринею манікюру. Після народження другої дитини зрозуміла, що не хочу повертатися в цю професію, — і повернулася до графічного дизайну, працювати з дому.",
        "Потім прийшла в AI — і створила NEW CREATOR, щоб провести тебе цим шляхом: від «я нічого не знаю» до перших робіт і нової професійної навички.",
      ],
      stepsTitle: "ЯК ПРОХОДИТЬ НАВЧАННЯ",
      steps: ["УРОК", "ЗАВДАННЯ", "ТВОЯ РОБОТА", "ФІДБЕК", "РЕЗУЛЬТАТ"],
      reviewsTitle: "ВІДГУКИ ПРО МОЮ РОБОТУ ЯК МЕНТОРКИ",
      reviewsAlt: "Відгук студентки про менторство Ріти",
      reviewsNote: "Відгуки студентів із попередніх менторських потоків Ріти. Подано мовою оригіналу.",
      sign: "Ріта, AI-креаторка й менторка",
      reviewImages: [2, 6] as ReadonlyArray<number>,
    },
    faq: {
      kicker: "БЕЗ ЗАЙВОЇ НЕВИЗНАЧЕНОСТІ",
      title: "ПИТАННЯ, ЯКІ МОЖУТЬ ЗУПИНЯТИ",
      items: [
        ["А якщо я нічого не вмію?", "Саме тому ми починаємо з нуля. Не потрібно бути дизайнеркою, монтажеркою чи AI-експерткою."],
        ["Як проходить навчання?", "Два місяці практики: урок, завдання, твоя робота, фідбек Ріти, допрацювання та готовий результат. Також будуть живі зустрічі, воркшопи й Q&A."],
        ["Коли стартує новий потік?", "Новий потік NEW CREATOR стартує 7 числа кожного місяця."],
      ] as ReadonlyArray<readonly [string, string]>,
    },
    price: {
      kicker: "ОДИН КУРС. БЕЗ ЗАПЛУТАНИХ ТАРИФІВ.",
      title: "ТВОЄ МІСЦЕ В NEW CREATOR",
      full: "12 000 грн",
      fullLabel: "повна вартість навчання",
      options: [
        ["2 000 грн", "бронювання місця"],
        ["12 000 грн", "повна оплата"],
        ["6 000 + 6 000 грн", "оплата двома платежами"],
      ] as ReadonlyArray<readonly [string, string]>,
      note: "Натисни кнопку й напиши Ріті в Instagram Direct. Вона особисто надішле деталі щодо оплати та участі.",
      button: "НАПИСАТИ РІТІ В INSTAGRAM",
      alt: "АБО НАПИСАТИ В TELEGRAM",
      final: {
        title: "МОЖЛИВО, ТОБІ ВЖЕ ЧАС ПОЧАТИ ЗАНОВО.",
        note: "Не життя. Професію.",
      },
    },
  },
  en: {
    meta: {
      title: "NEW CREATOR — a hands-on AI content course",
      description:
        "Two months of hands-on practice: AI photos, videos, advertising and portfolio-ready work.",
    },
    skip: "Skip to main content",
    eyebrow: "A PRACTICAL AI CONTENT COURSE",
    nav: [
      ["SHOWREEL", "#works"],
      ["FORMATS", "#formats"],
      ["MENTOR", "#mentor"],
      ["PRICE", "#price"],
    ] as ReadonlyArray<readonly [string, string]>,
    heroNote: "Practice, not theory",
    title: ["AI CONTENT", "THAT SELLS", "STANDS OUT."],
    description:
      "A hands-on course for anyone who wants to master AI photo, video and creative work — and earn from modern content.",
    cta: "RESERVE YOUR SPOT",
    secondary: "LEARN MORE",
    payment: "Prepayment UAH 2,000",
    start: "THE NEXT NEW CREATOR COHORT STARTS ON THE 7TH OF EVERY MONTH.",
    creatorAlt: "Rita — AI creator and mentor at NEW CREATOR",
    stats: [
      ["2", "MONTHS OF PRACTICE"],
      ["10", "PROGRAM MODULES"],
      ["10", "AI TOOLS IN PRACTICE"],
      ["PORTFOLIO", "BUILT AS YOU LEARN"],
    ] as ReadonlyArray<readonly [string, string]>,
    strip: {
      kicker: "NEW CREATOR SHOWREEL",
      title: "WORK BY THE MENTOR AND HER STUDENTS",
      hint: "Videos play automatically. Click any of them — it opens fullscreen.",
      disclaimer: "THESE ARE NOT RESULTS FROM THE FIRST NEW CREATOR COHORT.",
      disclaimerNote: "These student works come from Rita's earlier mentorship groups.",
      openLabel: "Watch the video fullscreen",
      closeLabel: "Close the video",
      items: [
        { src: "/showcase-ritora.mp4", poster: "/showcase-ritora-poster.jpg", tag: "MENTOR", title: "SHOWREEL" },
        { src: "/student-gelato.mp4", poster: "/student-gelato.jpg", tag: "STUDENT", title: "FOOD CONTENT" },
        { src: "/mentor-coffee.mp4", poster: "/mentor-coffee.jpg", tag: "MENTOR", title: "PRODUCT VISUAL" },
        { src: "/student-surreal.mp4", poster: "/student-surreal.jpg", tag: "STUDENT", title: "SURREAL STORY" },
        { src: "/mentor-matcha.mp4", poster: "/mentor-matcha.jpg", tag: "MENTOR", title: "AD CONCEPT" },
        { src: "/student-pets.mp4", poster: "/student-pets.jpg", tag: "STUDENT", title: "AI CHARACTER" },
        { src: "/mentor-pool.mp4", poster: "/mentor-pool.jpg", tag: "MENTOR", title: "FASHION STORY" },
        { src: "/student-portrait.mp4", poster: "/student-portrait.jpg", tag: "STUDENT", title: "AI PORTRAIT" },
      ] as ReadonlyArray<StripItem>,
    },
    formats: {
      kicker: "THE OUTCOME",
      title: "THE FORMATS YOU WILL BE ABLE TO CREATE.",
      intro: "No tool theory for its own sake — three types of work that clients pay for. We take each one from idea to finished piece.",
      items: [
        ["AD COMMERCIAL FOR A BRAND", "The full cycle: idea, script, generated footage, voice, music, editing. Content brands use instead of expensive shoots."],
        ["AI AVATAR FOR AN EXPERT", "A digital character that presents on video without constant filming: voice-over, facial motion, captions."],
        ["FASHION & ART STORIES", "Cinematic movement and atmosphere — from a neural photoshoot to a finished video story that stands out."],
      ] as ReadonlyArray<readonly [string, string]>,
      tools: "Course tools: Kling, Google Veo, HeyGen, ElevenLabs, Suno, CapCut, Magnific, Higgsfield, ChatGPT and Gemini.",
      forWhoKicker: "WHO THIS COURSE IS FOR",
      forWho: [
        "You want to learn a new profession or change direction",
        "You want to work online or from home with a flexible schedule",
        "You run a business and want to create modern content yourself",
        "You work in SMM, design, photography or content creation",
        "You want to create AI content for clients",
      ],
      programLabel: "SEE THE FULL PROGRAM",
      program: {
        title: "10 MODULES. ONE LOGIC — FROM AN IDEA TO FINISHED WORK.",
        modules: [
          ["AI THINKING + GPT / GEMINI / AI AGENTS", "Build your own AI assistants for ideas, scripts, content and prompts."],
          ["PROMPT ENGINEERING", "Composition, angles, camera, light, movement, atmosphere, references, Frames, Ingredients and Multi-shot."],
          ["AI PHOTO / NEURAL PHOTOSHOOT", "Create a character, train a model and produce a realistic photo series."],
          ["MAGNIFIC AI + HIGGSFIELD AI", "Enhance, refine and prepare high-quality visual content."],
          ["GOOGLE FLOW / VEO", "Turn ideas and images into video using Frames, Extend and references."],
          ["KLING", "Generate video and work with movement and Motion Control."],
          ["HEYGEN / AI AVATARS", "Create a digital character and video content without constantly filming yourself."],
          ["ELEVENLABS", "Work with voice-over, voice cloning, Voice Changer, sound effects and dubbing."],
          ["SUNO", "Create original music for video and advertising."],
          ["CAPCUT", "Bring everything into a finished piece: editing, captions, music, voice, SFX and final polish."],
        ] as ReadonlyArray<readonly [string, string]>,
        bonus: "+ additional bonuses during the course",
      },
    },
    mentor: {
      kicker: "WHO LEADS THE COURSE",
      title: "I KNOW WHAT IT FEELS LIKE TO START FROM ZERO.",
      body: [
        "I worked as a nail technician for 12 years. After my second child was born I realised I did not want to go back — so I returned to graphic design and started working from home.",
        "Then I found AI — and created NEW CREATOR to walk this path with you: from “I know nothing” to your first pieces and a new professional skill.",
      ],
      stepsTitle: "HOW THE COURSE RUNS",
      steps: ["LESSON", "TASK", "YOUR WORK", "FEEDBACK", "RESULT"],
      reviewsTitle: "FEEDBACK ON MY WORK AS A MENTOR",
      reviewsAlt: "Student feedback on Rita's mentorship",
      reviewsNote: "Reviews from students of Rita's earlier mentorship groups. Shown in the original language.",
      sign: "Rita, AI creator and mentor",
      reviewImages: [2, 6] as ReadonlyArray<number>,
    },
    faq: {
      kicker: "CLEAR ANSWERS BEFORE YOU BEGIN",
      title: "QUESTIONS THAT MAY BE HOLDING YOU BACK",
      items: [
        ["What if I know nothing yet?", "That is exactly why we start from zero. You do not need to be a designer, editor or AI expert."],
        ["How does the course work?", "Two months of practice: lesson, task, your work, Rita's feedback, refinement and a finished result. There are also live sessions, workshops and Q&A."],
        ["When does a new cohort start?", "A new NEW CREATOR cohort starts on the 7th of every month."],
      ] as ReadonlyArray<readonly [string, string]>,
    },
    price: {
      kicker: "ONE COURSE. NO CONFUSING TIERS.",
      title: "YOUR PLACE IN NEW CREATOR",
      full: "UAH 12,000",
      fullLabel: "full course price",
      options: [
        ["UAH 2,000", "reserve your place"],
        ["UAH 12,000", "pay in full"],
        ["UAH 6,000 + 6,000", "pay in two instalments"],
      ] as ReadonlyArray<readonly [string, string]>,
      note: "Click the button and message Rita on Instagram. She will personally send you the payment and participation details.",
      button: "MESSAGE RITA ON INSTAGRAM",
      alt: "OR MESSAGE ON TELEGRAM",
      final: {
        title: "MAYBE IT IS TIME TO START AGAIN.",
        note: "Not your life. Your profession.",
      },
    },
  },
} as const;

export function getCopy(locale: string) {
  return copy[(locales as readonly string[]).includes(locale as Locale) ? (locale as Locale) : "uk"];
}

export default copy;
