export const clinic = {
  name: "Psychiatric Associates of North Carolina",
  phone: "919-828-9937",
  website: "https://psyassoc.com/",
  appleMaps: "https://maps.apple.com/place?address=4020+Westchase+Blvd%2C+Raleigh%2C+NC++27607%2C+United+States&coordinate=35.802965%2C-78.710095&name=4020+Westchase+Blvd",
  googleMaps: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=us&sa=X&geocode=KYPdp4xeX6yJMe4r9ilQsDg1&daddr=4020+Westchase+Blvd+%23370,+Raleigh,+NC+27607",
};

export const treatments = [
  "Depressive Disorders",
  "Mood Disorders",
  "ADHD",
  "Anxiety Disorders, Phobias & Panic Attacks",
  "Childhood Behavioral Disorders",
  "Grief",
  "Men’s Mental Health",
  "PTSD & Trauma",
  "Self-Harm & Suicidality",
  "Sleep Disorders",
  "Substance Use Conditions",
  "Women’s Mental Health (Peripartum & Postpartum Conditions)",
  "Stress Management",
  "Eating Disorders",
  "LGBTQ+ Support"
] as const;

export const carePanels = [
  {
    eyebrow: "The care relationship",
    title: "Thoughtful care begins with being heard.",
    body: "Archi’s practice combines evidence-based medicine with empathy, compassion, and careful attention to each patient’s lived experience.",
    image: "/images/care-consultation.png",
    alt: "Editorial placeholder of a calm mental health consultation",
  },
  {
    eyebrow: "A welcoming practice",
    title: "Care that makes room for the whole person.",
    body: "Fluent in English, Gujarati, and Hindi, Archi strives to create a sincere, approachable environment for patients from many backgrounds.",
    image: "/images/clinic-interior.png",
    alt: "Editorial placeholder of a warm outpatient clinic interior",
  },
  {
    eyebrow: "The goal of care",
    title: "Stability, confidence, and well-being.",
    body: "Through trusting relationships and clear guidance, Archi supports adults as they work through challenges and move toward meaningful, sustainable progress.",
    image: "/images/wellness-walk.png",
    alt: "Editorial placeholder of a peaceful walk with a dog",
  },
] as const;
