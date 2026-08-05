import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  EnvelopeSimple,
  GlobeHemisphereWest,
  HouseSimple,
  MapPin,
  Phone,
  Sparkle,
  Stethoscope,
  Translate,
  User,
} from "@phosphor-icons/react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { carePanels, clinic, treatments } from "./content";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  motionStrength?: number;
  disableResponsiveMotion?: boolean;
};

function MagneticLink({
  href,
  children,
  className = "",
  ariaLabel,
  motionStrength = 1,
  disableResponsiveMotion = false,
}: MagneticLinkProps) {
  const handleMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const supportsResponsiveMotion = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 721px)"
    ).matches;

    if (event.pointerType === "touch" || (disableResponsiveMotion && !supportsResponsiveMotion)) {
      event.currentTarget.style.setProperty("--mx", "0px");
      event.currentTarget.style.setProperty("--my", "0px");
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.1 * motionStrength;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.14 * motionStrength;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
  };

  const reset = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--mx", "0px");
    event.currentTarget.style.setProperty("--my", "0px");
  };

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </a>
  );
}

function Nav() {
  const onAbout = window.location.pathname === "/about";
  const navRef = useRef<HTMLElement>(null);
  const [hoverTarget, setHoverTarget] = useState<{ left: number; width: number } | null>(null);
  const supportsNavMotion = () =>
    window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 721px)").matches;

  const updateBackground = (link: HTMLAnchorElement) => {
    if (!navRef.current) return;
    const navBounds = navRef.current.getBoundingClientRect();
    const content = link.querySelector<HTMLElement>("[data-nav-content]");
    const contentBounds = (content ?? link).getBoundingClientRect();
    const horizontalPadding = 16;
    setHoverTarget({
      left: contentBounds.left - navBounds.left - horizontalPadding,
      width: contentBounds.width + horizontalPadding * 2,
    });
  };

  const moveBackground = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch" || !supportsNavMotion()) {
      setHoverTarget(null);
      return;
    }
    updateBackground(event.currentTarget);
  };

  const moveBackgroundOnFocus = (event: React.FocusEvent<HTMLAnchorElement>) => {
    if (!supportsNavMotion()) {
      setHoverTarget(null);
      return;
    }
    updateBackground(event.currentTarget);
  };

  const navLinkProps = {
    onPointerEnter: moveBackground,
    onFocus: moveBackgroundOnFocus,
  };

  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    const checkNavigationTheme = () => {
      if (!navRef.current) return;

      const navBounds = navRef.current.getBoundingClientRect();
      const navCenter = navBounds.top + navBounds.height / 2;

      const overDarkSection = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-theme='dark']")
      ).some((section) => {
        const bounds = section.getBoundingClientRect();

        return bounds.top <= navCenter && bounds.bottom >= navCenter;
      });

      setIsOverDark(overDarkSection);
    };

    checkNavigationTheme();

    window.addEventListener("scroll", checkNavigationTheme, {passive: true});
    window.addEventListener("resize", checkNavigationTheme);

    return () => {
      window.removeEventListener("scroll", checkNavigationTheme);
      window.removeEventListener("resize", checkNavigationTheme);
    };
  }, []);

  useEffect(() => {
    const navMotionQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 721px)"
    );
    const clearMobileTarget = () => {
      if (!navMotionQuery.matches) setHoverTarget(null);
    };

    clearMobileTarget();
    navMotionQuery.addEventListener("change", clearMobileTarget);

    return () => navMotionQuery.removeEventListener("change", clearMobileTarget);
  }, []);

  return (
    <div className="nav-shell">
      <nav
        className={`nav-pill ${isOverDark ? "is-over-dark" : ""}`}
        aria-label="Main navigation"
        ref={navRef}
        onPointerLeave={() => setHoverTarget(null)}
        onPointerDown={() => {
          if (!supportsNavMotion()) setHoverTarget(null);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHoverTarget(null);
        }}
      >
        <span
          className={`nav-hover-bg ${hoverTarget ? "is-targeted" : ""}`}
          style={hoverTarget ? { left: hoverTarget.left, width: hoverTarget.width } : undefined}
          aria-hidden="true"
        />
        <a href="/" className="home-link" aria-label="Home" {...navLinkProps}>
          <span className="nav-home-icon" data-nav-content>
            <HouseSimple size={15} weight="thin" />
          </span>
        </a>
        <a href="/#treatments" className="nav-link" {...navLinkProps}>
          <span data-nav-content>Treatments</span>
        </a>
        <a href="/about" className={`nav-link ${onAbout ? "is-active" : ""}`} {...navLinkProps}>
          <span data-nav-content>About</span>
        </a>
        <a href="/#location" className="nav-link" {...navLinkProps}>
          <span data-nav-content>Location</span>
        </a>
        <a href="/#contact" className="nav-link" {...navLinkProps}>
          <span data-nav-content>Contact</span>
        </a>
      </nav>
    </div>
  );
}

function IconLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <MagneticLink href={href} className="icon-link">
      <span className="icon-box">{icon}</span>
      <span>{children}</span>
      <ArrowUpRight className="icon-link-arrow" size={17} />
    </MagneticLink>
  );
}

function CtaLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <MagneticLink
      href={href}
      className="cta-link"
      motionStrength={0.25}
      disableResponsiveMotion
    >
      <span className="cta-fill" />
      <span className="cta-label">{children}</span>
      <span className="cta-arrow">
        <ArrowRight size={18} />
      </span>
    </MagneticLink>
  );
}

function SectionRule({ left, right }: { left: string; right: string }) {
  return (
    <div className="section-rule reveal">
      <span>{left}</span>
      <i />
      <span>{right}</span>
    </div>
  );
}

function MassiveCard({ panel, index }: { panel: (typeof carePanels)[number]; index: number }) {
  const moveImage = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.3;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.3;
    event.currentTarget.style.setProperty("--image-x", `${horizontal * 10}px`);
    event.currentTarget.style.setProperty("--image-y", `${vertical * 6}px`);
    event.currentTarget.style.setProperty("--image-rotate", `${horizontal * 0.11}deg`);
  };

  const resetImage = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--image-x", "0px");
    event.currentTarget.style.setProperty("--image-y", "0px");
    event.currentTarget.style.setProperty("--image-rotate", "0deg");
  };

  return (
    <article className={`massive-card reveal ${index % 2 ? "is-reversed" : ""}`} data-nav-theme="dark">
      <div className="massive-copy">
        <span className="eyebrow">{panel.eyebrow}</span>
        <h2>{panel.title}</h2>
        <p>{panel.body}</p>
        <CtaLink href={index === 1 ? "/about" : "/#treatments"}>
          {index === 1 ? "Meet Archi" : "Explore treatments"}
        </CtaLink>
      </div>
      <div
        className="massive-image-wrap"
        onPointerMove={moveImage}
        onPointerLeave={resetImage}
      >
        <img src={panel.image} alt={panel.alt} className="massive-image" />
      </div>
    </article>
  );
}

function TreatmentIndex() {
  return (
    <section className="treatments-section" id="treatments" aria-labelledby="treatments-heading" >
      <div className="treatments-heading reveal">
        <div>
          <span className="eyebrow dark">Areas of care</span>
          <h2 id="treatments-heading">
            Treatments <sup>{treatments.length}</sup>
          </h2>
        </div>
        <p>
          Outpatient psychiatric care shaped around the person—not just a list of symptoms.
        </p>
      </div>

      <div className="treatment-index" aria-label="Conditions treated">
        {treatments.map((treatment, index) => (
          <article className="treatment-index-item" key={treatment}>
            <span className="treatment-index-number">{String(index + 1).padStart(2, "0")}</span>
            <strong>{treatment}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderAction({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="placeholder-action" aria-label={`${label}: ${value}`}>
      <span className="icon-box">{icon}</span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      <span className="coming-soon">Coming soon</span>
    </div>
  );
}

function LocationSection() {
  return (
    <section className="location-section" id="location" aria-labelledby="location-heading">
      <SectionRule left="Visit the clinic" right="Details to be confirmed" />
      <div className="location-grid reveal">
        <div className="location-image-wrap">
          <img src="/images/clinic-interior.png" alt="Editorial placeholder for the future clinic location" />
          <span className="image-note">Placeholder clinic photography</span>
        </div>
        <div className="location-copy" id="contact">
          <span className="eyebrow dark">Location & contact</span>
          <h2 id="location-heading">A calm place to begin.</h2>
          <p>
            Clinic information is ready to be connected as soon as the final practice details are available.
          </p>
          <div className="location-actions">
            <PlaceholderAction icon={<MapPin size={19} />} label={clinic.name} value={clinic.address} />
            <PlaceholderAction icon={<Compass size={19} />} label="Directions" value={clinic.directions} />
            <PlaceholderAction icon={<GlobeHemisphereWest size={19} />} label="Website" value={clinic.website} />
            <PlaceholderAction icon={<Phone size={19} />} label="Phone" value={clinic.phone} />
            <PlaceholderAction icon={<EnvelopeSimple size={19} />} label="Contact" value={clinic.email} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <a className="footer-profile" href="/">
        <img src="/images/archi-placeholder-portrait.png" alt="Editorial placeholder portrait" />
        <span>
          <strong>Archi Patel, PA-C</strong>
          <small>Physician Associate</small>
        </span>
      </a>
      <div className="footer-links">
        <a href="/#treatments">Treatments</a>
        <a href="/about">About</a>
        <a href="/#location">Location</a>
        <a href="/#contact">Contact</a>
      </div>
      <p>Outpatient psychiatry · Adult patients · Since 2020</p>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Nav />
      <header className="home-hero">
        <div className="hero-name reveal">
          <h1>
            Archi <br /> Patel
          </h1>
        </div>
        <div className="hero-intro reveal">
          <p>
            Patient-centered psychiatric care rooted in evidence, empathy, and compassion.
          </p>
          <div className="mini-profile">
            <img src="/images/archi-placeholder-portrait.png" alt="Editorial placeholder portrait" />
            <span>
              <strong>PA-C</strong>
              <small>Physician Associate</small>
            </span>
          </div>
        </div>
        <div className="hero-start reveal">
          <span className="eyebrow dark">Where you can start</span>
          <div>
            <IconLink href="/about" icon={<User size={19} />}>
              Learn more about Archi
            </IconLink>
            <IconLink href="/#treatments" icon={<Stethoscope size={19} />}>
              Explore conditions treated
            </IconLink>
            <IconLink href="/#location" icon={<MapPin size={19} />}>
              Find the clinic
            </IconLink>
            <IconLink href="/#contact" icon={<EnvelopeSimple size={19} />}>
              View contact details
            </IconLink>
          </div>
        </div>
      </header>

      <main>
        <section className="care-section" id="approach" aria-label="Approach to care">
          <SectionRule left="Approach to care" right="Patient-centered psychiatry" />
          <div className="massive-card-stack">
            {carePanels.map((panel, index) => (
              <MassiveCard key={panel.title} panel={panel} index={index} />
            ))}
          </div>
        </section>
        <TreatmentIndex />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <Nav />
      <header className="about-hero">
        <div className="about-copy reveal">
          <span className="eyebrow dark">About</span>
          <h1>Care with a sincere, human center.</h1>
          <p>
            My name is Archi Patel. I am a board-certified Physician Associate who graduated from Marywood University in Pennsylvania. Since 2020, I have worked in psychiatry, focusing on the treatment of adult patients in an outpatient setting.
          </p>
          <p>
            My practice emphasizes a patient-centered approach, combining evidence-based medicine with empathy and compassion to support individuals on their mental health journey.
          </p>
          <p>
            I immigrated to the United States in 2013 along with my family. Fluent in English, Gujarati, and Hindi, I strive to create a welcoming environment for patients from diverse backgrounds.
          </p>
          <p>
            My patients often describe me as sincere, detail-oriented, compassionate, and approachable—qualities that help them feel understood, supported, and empowered in managing their mental health.
          </p>
          <p>
            I am passionate about building trusting relationships, guiding patients through challenges, and helping them achieve stability and well-being.
          </p>
        </div>
        <aside className="about-jump reveal">
          <span className="eyebrow dark">Get to know me</span>
          <IconLink href="#approach" icon={<Sparkle size={19} />}>My approach</IconLink>
          <IconLink href="#background" icon={<Translate size={19} />}>Languages & background</IconLink>
          <IconLink href="#journey" icon={<Stethoscope size={19} />}>Professional journey</IconLink>
          <IconLink href="#outside-work" icon={<User size={19} />}>Outside of work</IconLink>
        </aside>
        <div className="about-portrait reveal">
          <img src="/images/archi-placeholder-portrait.png" alt="Editorial placeholder portrait for Archi Patel" />
          <span>Placeholder portrait · Replace with Archi’s photography</span>
        </div>
      </header>

      <main className="about-main">
        <section className="about-principles" id="approach">
          <SectionRule left="Practice philosophy" right="How care feels" />
          <div className="principles-grid reveal">
            <article>
              <span>01</span>
              <h2>Evidence with empathy</h2>
              <p>Clinical decisions are grounded in evidence and communicated with clarity, warmth, and respect.</p>
            </article>
            <article>
              <span>02</span>
              <h2>Careful listening</h2>
              <p>Details matter. A thoughtful understanding of each person guides a more meaningful care plan.</p>
            </article>
            <article>
              <span>03</span>
              <h2>Trust over time</h2>
              <p>Strong therapeutic relationships help patients feel supported as they work toward lasting stability.</p>
            </article>
          </div>
        </section>

        <section className="background-section" id="background">
          <div className="background-image reveal">
            <img src="/images/care-consultation.png" alt="Editorial placeholder of an attentive consultation" />
          </div>
          <div className="background-copy reveal">
            <span className="eyebrow dark">Languages & lived experience</span>
            <h2>A practice shaped by perspective.</h2>
            <p>
              Having built a life in the United States after immigrating with her family, Archi brings cultural humility and personal understanding to her work with patients from varied backgrounds.
            </p>
            <div className="language-list">
              <span>English</span>
              <span>Gujarati</span>
              <span>Hindi</span>
            </div>
          </div>
        </section>

        <section className="journey-section" id="journey">
          <div className="journey-heading reveal">
            <span className="eyebrow dark">Professional journey</span>
            <h2>Grounded in training. Focused on people.</h2>
          </div>
          <div className="timeline reveal">
            <article>
              <span>Education</span>
              <h3>Marywood University</h3>
              <p>Pennsylvania · Physician Associate education</p>
            </article>
            <article>
              <span>Since 2020</span>
              <h3>Outpatient psychiatry</h3>
              <p>Board-certified care focused on adult patients</p>
            </article>
            <article>
              <span>Today</span>
              <h3>Patient-centered practice</h3>
              <p>Evidence-based medicine delivered with empathy and compassion</p>
            </article>
          </div>
        </section>

        <section className="outside-card reveal" id="outside-work">
          <div className="outside-copy">
            <span className="eyebrow">Outside of work</span>
            <h2>Curious, creative, and always happy around dogs.</h2>
            <p>
              Outside of work, I enjoy traveling and exploring new places, spending quality time with friends and family, and discovering different cuisines. I also love decorating and making spaces feel welcoming. In my free time, I especially enjoy being around dogs, whose companionship brings me great joy.
            </p>
          </div>
          <img src="/images/wellness-walk.png" alt="Editorial placeholder of a peaceful walk with a dog" />
        </section>
      </main>
      <Footer />
    </>
  );
}

export function App() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5%" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return window.location.pathname === "/about" ? <AboutPage /> : <HomePage />;
}
