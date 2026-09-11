import Image from "next/image";
import { ArrowDown, CalendarDays, ChevronDown, Heart, MapPin, MessageCircle, PartyPopper, Phone, Star } from "lucide-react";
import InvitationShell from "@/components/invitation/invitation-shell";
import SkyDecor from "@/components/invitation/sky-decor";
import Countdown from "@/components/invitation/countdown";
import MemoriesGallery from "@/components/invitation/memories-gallery";
import SecretBirthdayScratch from "@/components/invitation/secret-birthday-scratch";
import photos from "@/lib/baby-photos.json";

export default function Home() {
  return (
    <InvitationShell decoration={<SkyDecor />}>
        <section className="hero-section" id="top" tabIndex={-1} aria-label="Hridyansh Babu’s first birthday invitation">
          <SkyDecor />
          <div className="corner corner-top-left" />
          <div className="corner corner-top-right" />
          <div className="corner corner-bottom-left" />
          <div className="corner corner-bottom-right" />

          <div className="hero-content reveal-in">
            <div className="top-mark"><Star size={14} fill="currentColor" /> <span>ONE YEAR OF JOY</span> <Star size={14} fill="currentColor" /></div>
            <p className="hero-kicker" lang="hi">आप सादर आमन्त्रित हैं</p>
            <h1 className="hero-title" lang="hi">प्रथम जन्मदिन समारोह</h1>
            <p className="hero-subtitle">A very special first birthday celebration</p>

            <div className="portrait-wrap">
              <div className="portrait-ring ring-one" />
              <div className="portrait-ring ring-two" />
              <Image src="/WhatsApp%20Image%202026-09-10%20at%2022.51.13%20(1).jpeg" alt="Hridyansh Babu smiling at home" className="portrait" width={1200} height={1600} sizes="(max-width: 480px) 230px, (max-width: 768px) 250px, 290px" priority />
              <span className="portrait-badge" aria-label="One year old">1<span>year of love</span></span>
            </div>

            <p className="invite-line">Please join us to celebrate</p>
            <h2 className="baby-name">Hridyansh <span>Babu</span></h2>
            <div className="soft-divider"><span>✦</span></div>
            <p className="hero-message">Please join us to celebrate Hridyansh Babu’s first birthday.<span lang="hi">आप हमारे साथ Hridyansh Babu का पहला जन्मदिन मनाने अवश्य आइए।</span></p>
            <a className="scroll-cue" href="#memories" aria-label="Scroll to memories"><span>Scroll to explore</span><ArrowDown size={18} /></a>
          </div>
        </section>

        <section className="quote-section" aria-label="A little boy, a lifetime of love">
          <div className="text-inner">
            <span className="quote-star" aria-hidden="true">✦</span>
            <p className="birthday-quote">One little boy, countless smiles, and a lifetime of love.</p>
            <p className="quote-hindi" lang="hi">हमारे नन्हे राजकुमार की मुस्कान ने हमारी दुनिया रोशन कर दी है।</p>
          </div>
        </section>

        <section className="memories-section" id="memories" aria-labelledby="memories-title">
          <div className="section-inner">
            <p className="section-label">Baby Memories · A first year to treasure</p>
            <h2 className="section-title" id="memories-title">Little Moments <span lang="hi">· छोटी-छोटी यादें</span></h2>
            <p className="memories-intro">A year of tiny hands, sweet smiles and beautiful memories.</p>
            <p className="quote-hindi" lang="hi">नन्हे हाथ, प्यारी मुस्कान और अनगिनत खुशियाँ—Hridyansh Babu का पहला वर्ष।</p>
            <MemoriesGallery photos={photos} />
          </div>
        </section>

        <SecretBirthdayScratch />

        <section className="blessing-section" id="details">
          <div className="section-inner">
            <p className="section-label">आशीर्वाद · Blessing</p>
            <h2 className="section-title">A blessing for our little one</h2>
            <div className="blessing-rule"><span>ॐ</span></div>
            <p className="sanskrit" lang="sa">जीवेम शरदः शतम्।</p>
            <p className="blessing-meaning">May Hridyansh live a hundred joyful years, surrounded by love, health and happiness.</p>
            <p className="blessing-hindi" lang="hi">Hridyansh Babu का जीवन सदा सुख, स्वास्थ्य, प्रेम और उजाले से भरा रहे।</p>
          </div>
        </section>

        <section className="date-section">
          <div className="section-inner date-inner">
            <div className="date-copy">
              <p className="section-label">Save the day · दिन याद रखें</p>
              <h2 className="section-title left-title">Our little prince turns one</h2>
              <p className="body-copy">The celebration is on. Keep the date close and come share a little cake, a lot of laughter and your warmest blessings.</p>
              <p className="body-copy hindi-copy" lang="hi">Hridyansh Babu के पहले जन्मदिन पर आपकी उपस्थिति हमारी खुशी को और भी खास बनाएगी।</p>
              <p className="date-note">Born on 16 September 2025<br /><span lang="hi">जन्म: 31 भाद्र 2082</span></p>
            </div>
            <div className="date-stamp">
              <span className="stamp-weekday">Wednesday</span>
              <span className="date-day">16</span>
              <span className="date-month">September</span>
              <span className="date-year">2026</span>
              <span className="date-hindi" lang="hi">31 भाद्र 2083</span>
            </div>
          </div>
        </section>

        <section className="countdown-section">
          <div className="section-inner countdown-inner">
            <p className="section-label">The countdown begins</p>
            <h2 className="section-title">Counting down to a little magic</h2>
            <Countdown />
          </div>
        </section>

        <section className="details-section">
          <div className="section-inner">
            <p className="section-label">तारीख और स्थान · Details</p>
            <h2 className="section-title">Come celebrate with us</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-icon"><CalendarDays size={20} /></div>
                <div><span className="detail-label">Date · तारीख</span><strong>Wednesday, 16 September 2026</strong><small lang="hi">31 भाद्र 2083</small></div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><MapPin size={20} /></div>
                <div><span className="detail-label">Location · स्थान</span><strong>Mahagadhimai-02</strong><small>Bariyarpur, Bara</small></div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><Heart size={20} fill="currentColor" /></div>
                <div><span className="detail-label">Celebration · उत्सव</span><strong>Hridyansh Babu turns one</strong><small lang="hi">Hridyansh Babu का पहला जन्मदिन</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-inner">
            <PartyPopper className="contact-note-icon" size={28} strokeWidth={1.3} />
            <p className="section-label">आपकी उपस्थिति की प्रतीक्षा · You’re part of our joy</p>
            <h2 className="section-title">Send your blessings</h2>
            <p className="contact-copy">Please share your warm wishes with Hridyansh and the family.</p>
            <div className="contact-actions">
              <a className="primary-button" href="https://wa.me/9779815295454" target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp RSVP</a>
              <a className="secondary-button" href="tel:+9779815295454"><Phone size={17} /> Call the family</a>
            </div>
            <div className="contact-number">Contact · संपर्क: <strong>+977 9815295454</strong></div>
          </div>
        </section>

        <section className="quote-section closing-quote" aria-label="A year of endless love">
          <div className="text-inner">
            <span className="quote-star" aria-hidden="true">♡</span>
            <p className="birthday-quote">Our little prince has filled our world with endless love in just one year.</p>
            <p className="quote-hindi" lang="hi">Hridyansh Babu के पहले जन्मदिन पर आपका आशीर्वाद हमारे लिए अनमोल है।</p>
          </div>
        </section>

        <footer className="footer-section">
          <SkyDecor />
          <div className="footer-content">
            <p className="footer-overline">With love, laughter & little hugs</p>
            <h2 className="footer-name">Hridyansh Babu</h2>
            <p className="footer-hindi" lang="hi">Hridyansh Babu का पहला जन्मदिन</p>
            <div className="footer-heart"><Heart size={15} fill="currentColor" /> ✦ <Heart size={15} fill="currentColor" /></div>
            <a className="back-to-top" href="#top"><ChevronDown size={17} className="rotate-up" /> Back to top</a>
          </div>
        </footer>
    </InvitationShell>
  );
}
