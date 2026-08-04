export const clinic = {
  name: "Clinic name coming soon",
  address: "Street address, city, state, ZIP",
  phone: "Phone number coming soon",
  website: "Clinic website coming soon",
  directions: "Directions link coming soon",
  email: "Contact email coming soon",
};

export const treatments = [
  "Depressive Disorders",
  "Mood Disorders",
  "ADHD",
  "Anxiety Disorders, Phobias & Panic Attacks",
  "Childhood Behavioral Disorders",
  "Eating Disorders",
  "Grief",
  "LGBTQ+ Support",
  "Men’s Mental Health",
  "PTSD & Trauma",
  "Self-Harm & Suicidality",
  "Sleep Disorders",
  "Substance Use Conditions",
  "Women’s Mental Health (Peripartum & Postpartum Conditions)",
  "Stress Management",
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
