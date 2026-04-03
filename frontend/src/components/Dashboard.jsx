import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Briefcase, BookOpen, User, Tag, AlertTriangle } from 'lucide-react';

const Dashboard = ({ data, onReset }) => {
  const { extracted_entities, overall_score, classification, job_matches, skill_gaps } = data;

  return (
    <div className="dashboard-container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Analysis Results for <span style={{ color: 'var(--accent-color)' }}>{data.filename}</span></h2>
        <button onClick={onReset} className="upload-btn" style={{ padding: '8px 20px', margin: 0 }}>Analyze Another</button>
      </div>

      <div className="dashboard-grid">
        {/* Left Column - Score & Matches */}
        <div className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel score-widget">
            <h3 style={{ marginBottom: '20px' }}>Overall Score</h3>
            <div style={{ width: '200px', height: '200px' }}>
              <CircularProgressbar 
                value={overall_score} 
                text={`${overall_score}%`} 
                styles={buildStyles({
                  pathColor: `var(--accent-color)`,
                  textColor: '#fff',
                  trailColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: 'transparent',
                })}
              />
            </div>
            <div className={`classification-badge badge-${classification.toLowerCase()}`}>
              {classification} Candidate
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={20} color="var(--accent-color)"/> Top Job Matches
            </h3>
            {job_matches.length > 0 ? job_matches.map((job, idx) => (
              <div key={idx} className="match-card">
                <h4>{job.job_title}</h4>
                <div className="match-score">{job.match_score}% Match</div>
              </div>
            )) : <p>No suitable matches found.</p>}
          </div>

        </div>

        {/* Right Column - Entities & Gaps */}
        <div className="right-panel glass-panel">
          <h3>Extracted Intelligence</h3>
          
          <div className="entities-grid">
            <div className="entity-section">
              <h3><Tag size={18} /> Found Skills ({extracted_entities.skills.length})</h3>
              <div className="tag-list">
                {extracted_entities.skills.length > 0 ? extracted_entities.skills.map((skill, idx) => (
                  <span key={idx} className="tag">{skill}</span>
                )) : <span className="tag">No specific skills detected</span>}
              </div>
            </div>

            <div className="entity-section">
              <h3><User size={18} /> Experience</h3>
              <div className="tag-list">
                {extracted_entities.experience.length > 0 ? extracted_entities.experience.map((exp, idx) => (
                  <span key={idx} className="tag">{exp.years} Years Parsed</span>
                )) : <span className="tag">Could not quantify years</span>}
              </div>
            </div>

            <div className="entity-section">
              <h3><BookOpen size={18} /> Education & Orgs</h3>
              <div className="tag-list">
                {extracted_entities.education.map((edu, idx) => (
                  <span key={idx} className="tag">{edu}</span>
                ))}
                {extracted_entities.organizations.map((org, idx) => (
                  <span key={idx} className="tag">{org}</span>
                ))}
                {extracted_entities.education.length === 0 && extracted_entities.organizations.length === 0 && (
                  <span className="tag">No education/orgs detected</span>
                )}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />

          <div className="entity-section">
            <h3 style={{ color: 'var(--warning-color)' }}><AlertTriangle size={18} color="var(--warning-color)"/> Skill Gap Analysis</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Missing requirements for your top job matches:</p>
            
            {Object.keys(skill_gaps).length > 0 ? Object.keys(skill_gaps).map((jobTitle, idx) => (
              <div key={idx} style={{ marginBottom: '15px' }}>
                <h4 style={{ marginBottom: '8px' }}>{jobTitle}</h4>
                <div className="tag-list">
                  {skill_gaps[jobTitle].map((skill, sIdx) => (
                    <span key={sIdx} className="tag gap-skill">{skill}</span>
                  ))}
                </div>
              </div>
            )) : <p style={{ color: 'var(--accent-color)' }}>You are a perfect match! No skill gaps detected.</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
