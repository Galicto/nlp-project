import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ThreeCanvas from '../components/ThreeCanvas';
import { ArrowRight, Cpu, Zap, BarChart3 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Cpu size={24} />,
      title: "Deep NLP Parsing",
      description: "Advanced spaCy-powered entity extraction identifies skills, experience, and key professional metrics with high precision."
    },
    {
      icon: <Zap size={24} />,
      title: "Vector Similarity",
      description: "Uses TF-IDF and Cosine Similarity to calculate mathematical match scores between candidate profiles and job requirements."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Skill Gap Analysis",
      description: "Identifies exactly what skills are missing for top-matched roles and provides automated growth recommendations."
    }
  ];

  return (
    <div className="landing-wrapper-scroll">
      <div className="landing-wrapper">
        <div className="landing-layout">
          
          {/* Left Action / Copy Column */}
          <div className="hero-content">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="live-dot"></span> NLP Engine v2.0
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Automate <br/>
              Talent Discovery.
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Instantly parse thousands of unstructured resumes. Extract key skills, quantify experiences, and automatically match candidates to perfect roles using deep vector geometry.
            </motion.p>

            <motion.div
              className="cta-wrapper"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="primary-btn" onClick={() => navigate('/app')}>
                Launch Dashboard <ArrowRight size={18} className="btn-icon" />
              </button>
              <button className="secondary-btn" onClick={() => navigate('/app')}>
                View Tech Specs
              </button>
            </motion.div>
          </div>

          {/* Right 3D Visual Column */}
          <div className="hero-visual">
            <ThreeCanvas />
          </div>

        </div>
      </div>

      {/* NEW: Features Section */}
      <section className="features-section">
        <div className="features-header">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Engineered for Precision.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Our NLP pipeline processes unstructured data into actionable insights instantly.
          </motion.p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{ padding: '40px 80px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2026 Intelligence Engine Pro. All rights reserved. Built with Advanced NLP.
      </footer>
    </div>
  );
}
