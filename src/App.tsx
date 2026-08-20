import {
  ArrowLeft,
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  blogPosts,
  featuredPost,
  formatBlogDate,
  formatCategory,
  getBlogPost,
  type BlogPost,
} from "./blog";
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
  const onBlog = window.location.pathname.startsWith("/blog");
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
            <HouseSimple size={15} weight="bold" />
          </span>
        </a>
        <a href="/#treatments" className="nav-link" {...navLinkProps}>
          <span data-nav-content>Treatments</span>
        </a>
        <a href="/about" className={`nav-link ${onAbout ? "is-active" : ""}`} {...navLinkProps}>
          <span data-nav-content>About</span>
        </a>
        <a href="/blog" className={`nav-link ${onBlog ? "is-active" : ""}`} {...navLinkProps}>
          <span data-nav-content>Blog</span>
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

function SectionRule({ left, right }: { left: string; right?: string }) {
  return (
    <div className="section-rule reveal">
      <span>{left}</span>
      <i />
      {right && <span>{right}</span>}
    </div>
  );
}

function MassiveCard({ panel, index }: { panel: (typeof carePanels)[number]; index: number }) {
  const isTextOnly = index !== 1;
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

  if (isTextOnly) {
    return (
      <article className="massive-card text-only reveal" data-nav-theme="dark">
        <div className="massive-copy">
          <span className="eyebrow">{panel.eyebrow}</span>
          <div className="massive-text-body">
            <h2>{panel.title}</h2>
            <p>{panel.body}</p>
          </div>
          <CtaLink href="/#treatments">Explore treatments</CtaLink>
        </div>
      </article>
    );
  }

  return (
    <article className="massive-card reveal is-reversed" data-nav-theme="dark">
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

function LocationRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="location-row">
      <span className="icon-box">{icon}</span>
      <div className="location-row-content">
        <small>{label}</small>
        {children}
      </div>
    </div>
  );
}

function LocationButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="location-button" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}

function LocationSection() {
  return (
    <section className="location-section" id="location" aria-labelledby="location-heading">
      <SectionRule left="Visit the clinic" />
      <div className="location-grid reveal">
        <div className="location-image-wrap">
          <img src="/images/clinic-interior.png" alt="Editorial placeholder for the future clinic location" />
        </div>
        <div className="location-copy" id="contact">
          <span className="eyebrow dark">Location & contact</span>
          <h2 id="location-heading">A calm place to begin.</h2>
          <p>
            Clinic information is ready to be connected as soon as the final practice details are available.
          </p>
          <div className="location-actions">
            <LocationRow icon={<MapPin size={19} />} label="Clinic">
              <strong className="clinic-name">{clinic.name}</strong>
            </LocationRow>
            <LocationRow icon={<Compass size={19} />} label="Directions">
              <div className="location-button-group">
                <LocationButton href={clinic.appleMaps}>Apple Maps</LocationButton>
                <LocationButton href={clinic.googleMaps}>Google Maps</LocationButton>
              </div>
            </LocationRow>
            <LocationRow icon={<GlobeHemisphereWest size={19} />} label="Website">
              <LocationButton href={clinic.website}>Schedule Appointment</LocationButton>
            </LocationRow>
            <LocationRow icon={<Phone size={19} />} label="Phone">
              <a className="location-phone" href={`tel:${clinic.phone.replaceAll("-", "")}`}>{clinic.phone}</a>
            </LocationRow>
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
        <img src="/images/archi-pic-1.jpg" alt="Editorial placeholder portrait" />
        <span>
          <strong>Archi Patel, PA-C</strong>
          <small>Physician Associate</small>
        </span>
      </a>
      <div className="footer-links">
        <a href="/#treatments">Treatments</a>
        <a href="/about">About</a>
        <a href="/blog">Blog</a>
        <a href="/#location">Location</a>
        <a href="/#contact">Contact</a>
      </div>
      <p>Outpatient psychiatry · Adult patients · Since 2020</p>
    </footer>
  );
}

function BlogMeta({ post }: { post: BlogPost }) {
  return (
    <div className="blog-meta">
      <span>{formatCategory(post.category)}</span>
      <i aria-hidden="true" />
      <span>{formatBlogDate(post.publishedAt)}</span>
      <i aria-hidden="true" />
      <span>{post.readingTime} min read</span>
    </div>
  );
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article className={`blog-card reveal ${featured ? "is-featured" : ""}`}>
      <a className="blog-card-image" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.coverImageAlt ?? ""} />
        ) : (
          <span className="blog-card-placeholder" aria-hidden="true">
            <small>Archi Patel, PA-C</small>
            <strong>{formatCategory(post.category)}</strong>
          </span>
        )}
      </a>
      <div className="blog-card-copy">
        <BlogMeta post={post} />
        <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
        <p>{post.excerpt}</p>
        <a className="blog-read-link" href={`/blog/${post.slug}`}>
          Read article <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function BlogPage() {
  const remainingPosts = featuredPost
    ? blogPosts.filter((post) => post.slug !== featuredPost.slug)
    : blogPosts;

  return (
    <>
      <Nav />
      <header className="blog-hero">
        <div className="blog-hero-heading reveal">
          <span className="eyebrow dark">Journal & patient education</span>
          <h1>Thoughtful notes for a steadier mind.</h1>
        </div>
        <div className="blog-hero-intro reveal">
          <p>
            Clear, compassionate perspectives on mental health, treatment, and the everyday work of feeling well.
          </p>
          <div className="blog-hero-detail">
            <span>{String(blogPosts.length).padStart(2, "0")}</span>
            <p>Published articles written and reviewed with care.</p>
          </div>
        </div>
      </header>

      <main className="blog-main">
        <SectionRule left="From the journal" right="Archi Patel, PA-C" />
        {featuredPost ? (
          <>
            <BlogCard post={featuredPost} featured />
            {remainingPosts.length > 0 && (
              <section className="blog-grid" aria-label="More articles">
                {remainingPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
              </section>
            )}
          </>
        ) : (
          <section className="blog-empty reveal">
            <span className="eyebrow">The journal is taking shape</span>
            <h2>New perspectives are coming soon.</h2>
            <p>
              Archi is preparing practical, approachable articles on mental health and well-being. Please check back soon.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function BlogPostPage({ post }: { post: BlogPost }) {
  const authorName = post.authorType === "guest" && post.guestName
    ? post.guestName
    : "Archi Patel, PA-C";
  const authorTitle = post.authorType === "guest"
    ? [post.guestCredentials, post.guestOrganization].filter(Boolean).join(" · ")
    : "Physician Associate";

  useEffect(() => {
    document.title = post.seoTitle || `${post.title} | Archi Patel, PA-C`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = post.seoDescription || post.excerpt;
    return () => {
      document.title = "Archi Patel, PA-C | Physician Associate";
    };
  }, [post]);

  return (
    <>
      <Nav />
      <main className="article-page">
        <header className="article-hero reveal">
          <a className="article-back" href="/blog"><ArrowLeft size={16} /> Back to blog</a>
          <BlogMeta post={post} />
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>

        {post.coverImage && (
          <figure className="article-cover reveal">
            <img src={post.coverImage} alt={post.coverImageAlt ?? ""} />
            {post.coverImageCaption && <figcaption>{post.coverImageCaption}</figcaption>}
          </figure>
        )}

        <div className="article-layout">
          <aside className="article-author reveal">
            <img src="/images/archi-pic-1.jpg" alt="Editorial placeholder portrait of Archi Patel" />
            <strong>{authorName}</strong>
            {authorTitle && <span>{authorTitle}</span>}
            {post.reviewedAt && <small>Reviewed {formatBlogDate(post.reviewedAt)}</small>}
          </aside>
          <article className="article-body reveal">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ children, href }) => (
                  <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
                    {children}
                  </a>
                ),
              }}
            >
              {post.body}
            </ReactMarkdown>
            <div className="article-disclaimer">
              <strong>A note about this article</strong>
              <p>This content is for general educational purposes and is not a substitute for personalized medical advice, diagnosis, or treatment.</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <Nav />
      <main className="not-found-page">
        <span className="eyebrow dark">404</span>
        <h1>This page could not be found.</h1>
        <a className="blog-read-link" href="/">Return home <ArrowRight size={16} /></a>
      </main>
      <Footer />
    </>
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
            <img src="/images/archi-pic-1-thumb.jpg" alt="Archi Patel" width="75" height="75" />
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
          <span className="eyebrow dark about-label">About</span>
          <h1>Care with a sincere, human center.</h1>
          <p>
            My name is Archi Patel, and I am a board-certified Physician Assistant with a Certificate of Added Qualifications (CAQ) in Psychiatry. I earned my Master of Science in Physician Assistant Studies from Marywood University and have practiced outpatient psychiatry since 2020, caring for adolescents, adults, and geriatric patients.
          </p>
          <div className="about-credentials" aria-label="Professional credentials">
            <span>PA-C</span>
            <span>Psychiatry CAQ</span>
            <span>Practicing since 2020</span>
          </div>
        </div>
        <div className="about-side reveal">
          <div className="about-portrait">
            <img src="/images/archi-pic-1.jpg" alt="Archi Patel, PA-C" />
          </div>
          <aside className="about-jump">
            <span className="eyebrow dark">Get to know me</span>
            <IconLink href="#approach" icon={<Sparkle size={19} />}>My approach</IconLink>
            <IconLink href="#background" icon={<Translate size={19} />}>Languages & background</IconLink>
            <IconLink href="#journey" icon={<Stethoscope size={19} />}>Professional journey</IconLink>
            <IconLink href="#outside-work" icon={<User size={19} />}>Outside of work</IconLink>
          </aside>
        </div>
      </header>

      <main className="about-main">
        <section className="approach-editorial reveal" id="approach" aria-label="Archi Patel's approach" data-nav-theme="dark">
          <SectionRule left="My approach" right="Patient-centered psychiatry" />
          <div className="approach-lead">
            <h2>Care begins with being heard.</h2>
            <div className="approach-intro">
              <p>
                My approach to mental health care is patient-centered, collaborative, and grounded in evidence-based medicine.
              </p>
              <p>
                I believe effective psychiatric care begins with listening and understanding each individual’s unique experiences, concerns, and goals.
              </p>
            </div>
          </div>
          <div className="approach-chapters">
            <article>
              <span>01</span>
              <h3>A collaborative space</h3>
              <p>I strive to create a supportive, nonjudgmental environment where patients feel comfortable being open about their mental health and actively involved in treatment.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Specialized commitment</h3>
              <p>My Psychiatry CAQ, earned in 2023, reflects an ongoing commitment to specialized education. I bring that depth to patients across life stages and a wide range of mental health concerns.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Partnership over time</h3>
              <p>Patients often describe me as sincere, compassionate, detail-oriented, and approachable. My goal is to provide individualized care that builds trust, supports greater stability, and empowers patients to understand and manage their mental health.</p>
            </article>
          </div>
        </section>

        <section className="background-section" id="background" data-nav-theme="dark">
          <div className="background-copy reveal">
            <span className="eyebrow dark">Languages & lived experience</span>
            <h2>A practice shaped by perspective.</h2>
          </div>
          <div className="background-detail reveal">
            <p>
              Having immigrated to the United States with her family in 2013, I understand
              the importance of feeling welcomed, heard, and respected in a new environment. 
              I value the opportunity to provide culturally sensitive care to people from diverse backgrounds.
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
              <h3>Master of Science</h3>
              <p>Physician Assistant Studies · Marywood University, Pennsylvania</p>
            </article>
            <article>
              <span>Since 2020</span>
              <h3>Outpatient psychiatry</h3>
              <p>Care for adolescents, adults, and geriatric patients</p>
            </article>
            <article>
              <span>2023</span>
              <h3>Psychiatry CAQ</h3>
              <p>Advanced qualification reflecting continued specialized education</p>
            </article>
            <article>
              <span>Every visit</span>
              <h3>Individualized partnership</h3>
              <p>Collaborative, evidence-based care shaped around each patient’s needs and goals</p>
            </article>
          </div>
        </section>

        <section className="outside-card reveal" id="outside-work" data-nav-theme="dark">
          <div className="outside-copy">
            <span className="eyebrow">Outside of work</span>
            <h2>Curious, creative, and happiest around dogs.</h2>
            <p>
              Outside of clinical work, I enjoy traveling, exploring new places, spending time with friends and family, and discovering different cuisines. I also love decorating and creating warm, inviting spaces—and whenever I have the opportunity, spending time with dogs brings me a great deal of joy.
            </p>
          </div>
          <img src="/images/nature-path.png" alt="A quiet path winding through a sunlit meadow beside the water" />
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

  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return <HomePage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/blog") return <BlogPage />;
  if (path.startsWith("/blog/")) {
    const slug = decodeURIComponent(path.slice("/blog/".length));
    const post = getBlogPost(slug);
    return post ? <BlogPostPage post={post} /> : <NotFoundPage />;
  }
  return <NotFoundPage />;
}
