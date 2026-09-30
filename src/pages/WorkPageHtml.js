import React, { useState } from 'react';

const PROJECTS = [
  {
    id: 'proj-1',
    title: 'SECTOR_01 // Neural Matrix',
    description: 'Cyberpunk-styled interactive web experience built with React and Three.js canvas components.',
    tech: ['React', 'R3F', 'Three.js', 'GLSL'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com'
  },
  {
    id: 'proj-2',
    title: 'SECTOR_02 // Glitch Engine',
    description: 'Custom post-processing shader pipeline and CRT screen distortion effects.',
    tech: ['GLSL', 'WebGL', 'Three.js'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com'
  },
  {
    id: 'proj-3',
    title: 'SECTOR_03 // Cyberdeck UI',
    description: 'Retro-futuristic terminal portfolio template with real-time reactive audio visualizers.',
    tech: ['React', 'Web Audio API', 'Tailwind'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com'
  },
  {
    id: 'proj-4',
    title: 'SECTOR_04 // Neural Interface',
    description: 'Immersive virtual reality interface for neurofeedback applications.',
    tech: ['React', 'A-Frame', 'WebXR'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com'
  },
  {
    id: 'proj-5',
    title: 'SECTOR_05 // Data Stream',
    description: 'Real-time data visualization platform for financial market analysis.',
    tech: ['React', 'D3.js', 'WebSocket'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com'
  },
  {
    id: 'proj-6',
    title: 'SECTOR_06 // Holographic Display',
    description: 'Interactive 3D holographic projection system for immersive presentations.',
    tech: ['React', 'Three.js', 'WebGL'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com'
  }
];

const WorkPageHtml = () => {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);

  return (
    <div className='work-section'>
      {/* Left Monitor Screen */}
      <div className='screen-panel left-panel'>
        <h3 className='panel-header'>// DIRECTORY_LIST</h3>
        <div className='project-list'>
          {PROJECTS.map((proj) => (
            <button
              key={proj.id}
              className={`project-btn ${selectedProject.id === proj.id ? 'active' : ''}`}
              onClick={() => setSelectedProject(proj)}
            >
              <span className='arrow'>{selectedProject.id === proj.id ? '>' : ' '}</span>
              <span className='title'>{proj.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Monitor Screen */}
      <div className='screen-panel right-panel'>
        <h3 className='panel-header'>// PROJECT_DATA</h3>
        {selectedProject && (
          <div className='project-details'>
            <h4 className='details-title'>{selectedProject.title}</h4>
            <p className='details-desc'>{selectedProject.description}</p>
            
            <div className='tech-tags'>
              {selectedProject.tech.map((tech) => (
                <span key={tech} className='tag'>{tech}</span>
              ))}
            </div>

            <div className='details-links'>
              <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className='cyber-btn'>[ DEMO ]</a>
              <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer" className='cyber-btn'>[ CODE ]</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPageHtml;