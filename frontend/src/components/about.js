"use client"

import { useEffect, useState } from "react"
import "./about.css"

export default function About() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.id
          setIsVisible((prev) => ({ ...prev, [targetId]: true }))
        }
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-section")
    elements.forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener("scroll", handleScroll)
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="about-container">
      {/* Hero Section - Premium with Parallax */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">Growing Since 2018</div>
          <h1 className="hero-title">GreenHub</h1>
          <p className="hero-subtitle">Premium plants. Sustainable passion. Home delivered.</p>
          <div className="hero-line"></div>
          <div className="hero-scroll">Scroll to explore</div>
        </div>
      </section>

      <section id="vmgo-section" className="scroll-section vmgo-section">
        <div className="vmgo-container">
          <div className="section-header">
            <h2 className="section-title">Our Story</h2>
            <p className="section-description">The foundation of everything we do</p>
          </div>
          <div className="vmgo-grid">
            <div id="vmgo-1" className={`vmgo-card scroll-fade ${isVisible["vmgo-1"] ? "visible" : ""}`}>
              <div className="vmgo-icon">V</div>
              <h3>Vision</h3>
              <p>
                Transform every living space into a thriving green sanctuary, making premium indoor plants accessible to
                everyone worldwide.
              </p>
              <div className="card-hover-line"></div>
            </div>
            <div id="vmgo-2" className={`vmgo-card scroll-fade ${isVisible["vmgo-2"] ? "visible" : ""}`}>
              <div className="vmgo-icon">M</div>
              <h3>Mission</h3>
              <p>
                Deliver hand-selected, healthy plants with expert guidance, while promoting sustainable practices and
                building a passionate plant community.
              </p>
              <div className="card-hover-line"></div>
            </div>
            <div id="vmgo-3" className={`vmgo-card scroll-fade ${isVisible["vmgo-3"] ? "visible" : ""}`}>
              <div className="vmgo-icon">G</div>
              <h3>Goals</h3>
              <p>
                Become the leading trusted plant retailer through exceptional quality, community engagement, and
                environmental responsibility.
              </p>
              <div className="card-hover-line"></div>
            </div>
            <div id="vmgo-4" className={`vmgo-card scroll-fade ${isVisible["vmgo-4"] ? "visible" : ""}`}>
              <div className="vmgo-icon">O</div>
              <h3>Objectives</h3>
              <p>
                Expand our sustainable supply chain, educate customers on plant care, and offset our carbon footprint
                through green initiatives.
              </p>
              <div className="card-hover-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section id="heritage-section" className="scroll-section heritage-section">
        <div className="heritage-content">
          <div
            className={`heritage-text scroll-fade ${isVisible["heritage-text"] ? "visible" : ""}`}
            id="heritage-text"
          >
            <div className="heritage-label">Our Journey</div>
            <h2>Founded on Passion</h2>
            <p>
              What started as a small urban garden in 2018 has blossomed into a thriving plant community. We handpick
              every plant from verified sustainable growers, ensuring exceptional quality and ethical practices at every
              step of the journey.
            </p>
            <p>
              Today, thousands of plant lovers trust us to bring nature home. Each plant tells a story—and we're honored
              to help write the next chapter in your space.
            </p>
            <div className="heritage-stats">
              <div className="stat">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Plant Varieties</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          <div className="heritage-image"></div>
        </div>
      </section>

      <section id="values-section" className="scroll-section values-section">
        <div className="section-header">
          <h2 className="section-title">Our Values</h2>
          <p className="section-description">What drives us every single day</p>
        </div>
        <div className="values-grid">
          {[
            { title: "Premium Quality", desc: "Hand-selected plants meeting rigorous health and aesthetic standards." },
            {
              title: "Sustainability",
              desc: "Eco-conscious sourcing, sustainable packaging, and carbon-neutral operations.",
            },
            {
              title: "Expert Care",
              desc: "Personalized plant guides and customer support for your growing journey.",
            },
            {
              title: "Community First",
              desc: "Building connections between plant lovers and fostering growth together.",
            },
          ].map((value, idx) => (
            <div
              key={idx}
              id={`value-${idx}`}
              className={`value-card scroll-fade ${isVisible[`value-${idx}`] ? "visible" : ""}`}
            >
              <div className="value-number">{String(idx + 1).padStart(2, "0")}</div>
              <div className="value-accent"></div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="team-section" className="scroll-section team-section">
        <div className="section-header">
          <h2 className="section-title">Meet the Team</h2>
          <p className="section-description">The passionate people behind every plant delivered</p>
        </div>
        <div className="team-grid">
          {[
            { name: "Sarah Chen", role: "Founder & Botanist", bio: "Plant scientist and sustainability advocate" },
            { name: "Marcus Johnson", role: "Operations Lead", bio: "Logistics expert ensuring perfect delivery" },
            { name: "Elena Rodriguez", role: "Horticulturist", bio: "Plant care specialist and educator" },
            { name: "James Park", role: "Community Director", bio: "Building connections, one plant at a time" },
          ].map((member, idx) => (
            <div
              key={idx}
              id={`team-${idx}`}
              className={`team-member scroll-fade ${isVisible[`team-${idx}`] ? "visible" : ""}`}
            >
              <div className="member-avatar"></div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>
              <div className="member-divider"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="scroll-section cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Space?</h2>
          <p>Explore our curated collection and find your perfect green companion.</p>
          <button className="cta-button">
            Shop Our Collection
            <span className="button-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
