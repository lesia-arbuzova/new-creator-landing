export const locales = ["uk", "en"] as const;

export type Locale = (typeof locales)[number];

export const instagram = "https://www.instagram.com/rita_visualdesigns/?hl=uk";
export const telegram = "https://t.me/rita_visualdesigns";

const copy = {
  uk: {
    meta: {
      title: "NEW CREATOR — практичний курс зі створення AI-контенту",
      description:
        "Два місяці практичного навчання зі створення AI-фото, відео, реклами та робіт для портфоліо.",
    },
    skip: "Перейти до основного змісту",
    eyebrow: "ПРАКТИЧНИЙ КУРС З AI‑КОНТЕНТУ",
    nav: ["ПРО КУРС", "ПРОГРАМА", "РОБОТИ", "ВІДГУКИ"],
    title: ["НЕ ПРОСТО", "ВИВЧИТИ AI.", "НАВЧИТИСЯ", "СТВОРЮВАТИ."],
    description:
      "Два місяці практики від першого промпту до власних AI-фото, відео, реклами та робіт для портфоліо.",
    cta: "ХОЧУ НА NEW CREATOR",
    secondary: "ДІЗНАТИСЯ БІЛЬШЕ",
    payment: "Бронювання місця — 2 000 грн",
    start: "НОВИЙ ПОТІК NEW CREATOR СТАРТУЄ 7 ЧИСЛА КОЖНОГО МІСЯЦЯ.",
    practice: "ПРАКТИКА, А НЕ ТЕОРІЯ",
    proof: ["2 МІСЯЦІ ПРАКТИКИ", "10 НАВЧАЛЬНИХ БЛОКІВ", "ПОРТФОЛІО ПІД ЧАС НАВЧАННЯ"],
    workLabel: "РОБОТА МЕНТОРКИ РІТИ",
    languageLabel: "Змінити мову на англійську",
    about: {
      kicker: "ЯКЩО ЗАРАЗ У ТЕБЕ ПИТАНЬ БІЛЬШЕ, НІЖ ВІДПОВІДЕЙ",
      title: "AI ВЖЕ ВСЮДИ. АЛЕ З ЧОГО ПОЧАТИ САМЕ ТОБІ?",
      body: "Нейромереж стає більше, а ясності часто не додається. NEW CREATOR побудований не навколо списку сервісів, а навколо реальних творчих задач.",
      questions: ["Яку нейромережу відкрити?", "Що написати в промпті?", "Чому виходить не так?", "Як зібрати з цього готове відео?"],
      note: "Саме тому ми починаємо з нуля - послідовно, зрозуміло й через практику.",
    },
    audience: {
      kicker: "ДЛЯ КОГО ЦЕ НАВЧАННЯ",
      title: "НЕ ПОТРІБНО БУТИ ДИЗАЙНЕРКОЮ, ЩОБ ПОЧАТИ.",
      items: [
        "Хочеш освоїти нову професію або змінити напрям",
        "Хочеш працювати онлайн чи з дому у гнучкому графіку",
        "Маєш бізнес і хочеш самостійно створювати сучасний контент",
        "Працюєш у SMM, дизайні, фотографії або створенні контенту",
        "Хочеш створювати AI-контент для клієнтів",
      ],
      aside: "Тобі потрібні цікавість, готовність пробувати й час на практику. Решту зберемо поступово.",
    },
    outcome: {
      kicker: "ГОЛОВНИЙ РЕЗУЛЬТАТ",
      title: "НЕ «Я ЗНАЮ НЕЙРОМЕРЕЖІ». А «Я ВМІЮ СТВОРЮВАТИ».",
      lead: "Під час навчання ти створюєш власні роботи, отримуєш фідбек, допрацьовуєш їх і поступово збираєш портфоліо.",
      items: [
        "створювати AI-фото та відео",
        "робити рекламу й контент для брендів",
        "створювати контент для власного бізнесу та особистого бренду",
        "зібрати перші роботи в портфоліо",
        "почати розвиватися в AI-контенті та працювати з клієнтами",
      ],
      honesty: "Я не обіцяю, що після курсу ти прокинешся AI-експерткою й одразу почнеш заробляти мільйони. Але дам знання, практику та основу, з якої можна почати.",
    },
    program: {
      kicker: "ПРОГРАМА NEW CREATOR",
      title: "10 БЛОКІВ. ОДНА ЛОГІКА — ВІД ІДЕЇ ДО ГОТОВОЇ РОБОТИ.",
      intro: "Не вивчаємо інструменти заради інструментів. Кожен блок працює на конкретний результат.",
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
      ],
      bonus: "+ додаткові бонуси під час навчання",
    },
    process: {
      kicker: "2 МІСЯЦІ ПРАКТИКИ",
      title: "Я НЕ ПРОСТО ПОКАЗУЮ. Я ПРОВОДЖУ ТЕБЕ ЧЕРЕЗ ВЕСЬ ШЛЯХ.",
      steps: ["УРОК", "ЗАВДАННЯ", "ТВОЯ РОБОТА", "МІЙ ФІДБЕК", "ДОПРАЦЮВАННЯ", "ГОТОВИЙ РЕЗУЛЬТАТ"],
      extra: "Також у програмі — живі зустрічі, воркшопи та Q&A.",
      quote: "Не зверху вниз. А поруч.",
    },
    work: {
      kicker: "СТВОРЕНО З AI. ДОВЕДЕНО ДО РЕЗУЛЬТАТУ.",
      title: "РОБОТИ МЕНТОРКИ РІТИ",
      intro: "Приклади візуального контенту, який Ріта створює у своїй практиці.",
      pieces: ["PRODUCT VISUAL", "РЕКЛАМНИЙ КОНЦЕПТ", "AI-ПЕРСОНАЖ", "FASHION STORY"],
      studentsKicker: "ЦЕ НЕ РОБОТИ ПЕРШОГО ПОТОКУ NEW CREATOR",
      studentsTitle: "РОБОТИ СТУДЕНТІВ, ЯКИХ Я МЕНТОРИЛА",
      studentsIntro: "Реальні роботи, створені під час практики та допрацьовані після фідбеку.",
      students: ["БРЕНДОВЕ ВІДЕО", "FOOD CONTENT", "SURREAL STORY", "AI-ПЕРСОНАЖ"],
    },
    reviews: {
      kicker: "РЕАЛЬНІ ЛЮДИ. РЕАЛЬНИЙ ФІДБЕК.",
      title: "ВІДГУКИ ПРО МОЮ РОБОТУ ЯК МЕНТОРКИ",
      intro: "Ці відгуки залишили студенти, яких Ріта менторила раніше. Вони не є відгуками про перший потік NEW CREATOR.",
      original: "Відгуки подано мовою оригіналу",
    },
    mentor: {
      kicker: "ХТО Я І ЧОМУ СТВОРИЛА NEW CREATOR",
      title: "Я ЗНАЮ, ЯК ЦЕ — ПОЧИНАТИ З НУЛЯ.",
      body: [
        "12 років я працювала майстринею манікюру. Після народження другої дитини зрозуміла, що більше не хочу повертатися в цю професію.",
        "Я повернулася до графічного дизайну, почала працювати з дому, а потім прийшла в AI.",
        "NEW CREATOR створила, щоб провести тебе шляхом, який сама колись проходила — від «я нічого не знаю» до перших робіт і нової професійної навички.",
      ],
      sign: "Ріта, AI-креаторка й менторка",
    },
    faq: {
      kicker: "БЕЗ ЗАЙВОЇ НЕВИЗНАЧЕНОСТІ",
      title: "ПИТАННЯ, ЯКІ МОЖУТЬ ЗУПИНЯТИ",
      items: [
        ["А якщо я нічого не вмію?", "Саме тому ми починаємо з нуля. Не потрібно бути дизайнеркою, монтажеркою чи AI-експерткою."],
        ["Як проходить навчання?", "Два місяці практики: урок, завдання, твоя робота, фідбек Ріти, допрацювання та готовий результат. Також будуть живі зустрічі, воркшопи й Q&A."],
        ["Що буде після навчання?", "У тебе будуть власні роботи для портфоліо, практичні навички створення AI-фото, відео й реклами та основа для подальшої роботи з клієнтами."],
        ["Коли стартує новий потік?", "Новий потік NEW CREATOR стартує 7 числа кожного місяця."],
      ],
    },
    price: {
      kicker: "ОДИН КУРС. БЕЗ ЗАПЛУТАНИХ ТАРИФІВ.",
      title: "ТВОЄ МІСЦЕ В NEW CREATOR",
      full: "12 000 грн",
      fullLabel: "повна вартість навчання",
      options: [["2 000 грн", "бронювання місця"], ["12 000 грн", "повна оплата"], ["6 000 + 6 000 грн", "оплата двома платежами"]],
      note: "Натисни кнопку й напиши Ріті в Instagram Direct. Вона особисто надішле деталі щодо оплати та участі.",
      button: "НАПИСАТИ РІТІ В INSTAGRAM",
      alt: "АБО НАПИСАТИ В TELEGRAM",
    },
    final: {
      line: "ПОЧИНАТИ З НУЛЯ НЕ ОЗНАЧАЄ, ЩО ТИ НІЧОГО НЕ ВМІЄШ.",
      title: "МОЖЛИВО, ТОБІ ВЖЕ ЧАС ПОЧАТИ ЗАНОВО.",
      note: "Не життя. Професію.",
      cta: "ХОЧУ НА NEW CREATOR",
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
    nav: ["ABOUT", "PROGRAM", "WORK", "REVIEWS"],
    title: ["DON'T JUST", "LEARN AI.", "LEARN TO", "CREATE."],
    description:
      "Two months of hands-on practice — from your first prompt to AI photos, videos, advertising and portfolio-ready work.",
    cta: "JOIN NEW CREATOR",
    secondary: "LEARN MORE",
    payment: "Reserve your place — UAH 2,000",
    start: "THE NEXT NEW CREATOR COHORT STARTS ON THE 7TH OF EVERY MONTH.",
    practice: "PRACTICE, NOT THEORY",
    proof: ["2 MONTHS OF PRACTICE", "10 LEARNING MODULES", "A PORTFOLIO BUILT AS YOU LEARN"],
    workLabel: "WORK BY MENTOR RITA",
    languageLabel: "Switch the language to Ukrainian",
    about: {
      kicker: "WHEN YOU HAVE MORE QUESTIONS THAN ANSWERS",
      title: "AI IS EVERYWHERE. BUT WHERE DO YOU START?",
      body: "There are more AI tools every day, but that does not always bring clarity. NEW CREATOR is built around real creative tasks, not a list of platforms to memorise.",
      questions: ["Which AI tool should I open?", "What should I write in the prompt?", "Why doesn't my result look right?", "How do I turn this into a finished video?"],
      note: "That is why we start from zero - clearly, step by step and through practice.",
    },
    audience: {
      kicker: "WHO THIS COURSE IS FOR",
      title: "YOU DON'T NEED TO BE A DESIGNER TO START.",
      items: [
        "You want to learn a new profession or change direction",
        "You want to work online or from home with a flexible schedule",
        "You run a business and want to create modern content yourself",
        "You work in SMM, design, photography or content creation",
        "You want to create AI content for clients",
      ],
      aside: "Bring curiosity, a willingness to try and time for practice. We will build the rest together.",
    },
    outcome: {
      kicker: "THE OUTCOME THAT MATTERS",
      title: "NOT “I KNOW AI TOOLS.” BUT “I CAN CREATE.”",
      lead: "During the course, you create your own work, receive feedback, refine it and gradually build a portfolio.",
      items: ["create AI photos and videos", "make advertising and content for brands", "create content for your business and personal brand", "build your first portfolio pieces", "start developing in AI content and working with clients"],
      honesty: "I will not promise that you will wake up an AI expert and instantly make millions. I will give you knowledge, practice and a solid place to begin.",
    },
    program: {
      kicker: "THE NEW CREATOR PROGRAM",
      title: "10 MODULES. ONE LOGIC — FROM AN IDEA TO FINISHED WORK.",
      intro: "We do not learn tools for their own sake. Every module moves you towards a concrete result.",
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
      ],
      bonus: "+ additional bonuses during the course",
    },
    process: {
      kicker: "2 MONTHS OF PRACTICE",
      title: "I DON'T JUST SHOW YOU. I GUIDE YOU THROUGH THE WHOLE PROCESS.",
      steps: ["LESSON", "TASK", "YOUR WORK", "MY FEEDBACK", "REFINEMENT", "FINISHED RESULT"],
      extra: "The course also includes live sessions, workshops and Q&A.",
      quote: "Not above you. Beside you.",
    },
    work: {
      kicker: "MADE WITH AI. FINISHED WITH INTENT.",
      title: "WORK BY MENTOR RITA",
      intro: "Examples of visual content Rita creates in her own practice.",
      pieces: ["PRODUCT VISUAL", "AD CONCEPT", "AI CHARACTER", "FASHION STORY"],
      studentsKicker: "THESE ARE NOT RESULTS FROM THE FIRST NEW CREATOR COHORT",
      studentsTitle: "WORK BY STUDENTS I HAVE MENTORED",
      studentsIntro: "Real pieces created through practice and refined after feedback.",
      students: ["BRAND VIDEO", "FOOD CONTENT", "SURREAL STORY", "AI CHARACTER"],
    },
    reviews: {
      kicker: "REAL PEOPLE. REAL FEEDBACK.",
      title: "FEEDBACK ON MY WORK AS A MENTOR",
      intro: "These reviews come from students Rita mentored previously. They are not reviews of the first NEW CREATOR cohort.",
      original: "Original feedback is in Ukrainian",
    },
    mentor: {
      kicker: "WHO I AM AND WHY I CREATED NEW CREATOR",
      title: "I KNOW WHAT IT FEELS LIKE TO START FROM ZERO.",
      body: [
        "I worked as a nail technician for 12 years. After my second child was born, I realised I did not want to return to that profession.",
        "I came back to graphic design, started working from home and then discovered AI.",
        "I created NEW CREATOR to guide you through a path I once walked myself - from “I know nothing” to your first pieces and a new professional skill.",
      ],
      sign: "Rita, AI creator and mentor",
    },
    faq: {
      kicker: "CLEAR ANSWERS BEFORE YOU BEGIN",
      title: "QUESTIONS THAT MAY BE HOLDING YOU BACK",
      items: [
        ["What if I know nothing yet?", "That is exactly why we start from zero. You do not need to be a designer, editor or AI expert."],
        ["How does the course work?", "Two months of practice: lesson, task, your work, Rita's feedback, refinement and a finished result. There are also live sessions, workshops and Q&A."],
        ["What will I have at the end?", "You will have your own portfolio pieces, practical skills in AI photo, video and advertising, and a foundation for future client work."],
        ["When does a new cohort start?", "A new NEW CREATOR cohort starts on the 7th of every month."],
      ],
    },
    price: {
      kicker: "ONE COURSE. NO CONFUSING TIERS.",
      title: "YOUR PLACE IN NEW CREATOR",
      full: "UAH 12,000",
      fullLabel: "full course price",
      options: [["UAH 2,000", "reserve your place"], ["UAH 12,000", "pay in full"], ["UAH 6,000 + 6,000", "pay in two instalments"]],
      note: "Click the button and message Rita on Instagram. She will personally send you the payment and participation details.",
      button: "MESSAGE RITA ON INSTAGRAM",
      alt: "OR MESSAGE ON TELEGRAM",
    },
    final: {
      line: "STARTING FROM ZERO DOESN'T MEAN YOU HAVE NOTHING TO BRING.",
      title: "MAYBE IT IS TIME TO START AGAIN.",
      note: "Not your life. Your profession.",
      cta: "JOIN NEW CREATOR",
    },
  },
} as const;

export function getCopy(locale: string) {
  return copy[(locales as readonly string[]).includes(locale as Locale) ? (locale as Locale) : "uk"];
}

export default copy;
