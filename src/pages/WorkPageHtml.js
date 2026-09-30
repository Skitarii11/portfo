import React, { useState } from 'react';

const PROJECTS = [
  {
    id: 'proj-1',
    title: 'SECTOR_01 // Blackwall IDS',
    description: 'A modern, desktop-based Intrusion Detection System (IDS) that leverages Machine Learning to detect anomalous network behavior in real-time, including zero-day threats.',
    tech: ['Scapy', 'Pyqt5', 'Scikit-learn', 'Mmatplotlib', 'Pandas', 'Numpy', 'Geoip2', 'Folium'],
    demoUrl: '/',
    repoUrl: 'https://github.com/Skitarii11/BlackWall-IDS'
  },
  {
    id: 'proj-2',
    title: 'SECTOR_02 // DX Kino',
    description: 'Full-stack movie and series streaming application, built from the ground up to mimic the core functionalities of major platforms like Netflix.',
    tech: ['React native', 'Expo', 'NativewInd', 'Appwrite', 'Mux'],
    demoUrl: '/',
    repoUrl: 'https://github.com/Skitarii11/movie-streaming-app'
  },
  {
    id: 'proj-3',
    title: 'SECTOR_03 // Codebase Explainer',
    description: 'An AI-powered tool designed to help developers navigate and understand complex GitHub repositories instantly. Instead of spending hours reading through 100+ files, users can chat with the codebase and visualize the execution flow.',
    tech: ['LangChain', 'Streamlit', 'Mermaid.js', 'GitPython', 'Gemini API'],
    demoUrl: '',
    repoUrl: 'https://github.com/Skitarii11/codebase-explainer'
  },
  {
    id: 'proj-4',
    title: 'SECTOR_04 // MERN Chat App',
    description: 'This is a full-stack chat application built using the MERN stack. Users can sign up, log in, and chat in real-time with other users.',
    tech: ['React', 'MongoDB', 'Express', 'Node.js', 'Socket.io', 'JWT', 'Bcrypt','Vite', 'TailwindCSS', 'DaisyUI','Zustand','React Hot Toast'],
    demoUrl: '',
    repoUrl: 'https://github.com/Skitarii11/mern-chat-app'
  },
  {
    id: 'proj-5',
    title: 'SECTOR_05 // Solar System Simulation',
    description: 'The Solar-System Simulation Project is a website that allows you to simulate the motion of planets in our solar system. It provides an interactive and educational experience, allowing users to visualize the orbits and movements of celestial bodies.',
    tech: ['Three.js', 'Vite'],
    demoUrl: '',
    repoUrl: 'https://github.com/Skitarii11/Sol'
  },
  {
    id: 'proj-6',
    title: 'SECTOR_06 // Biome cubes',
    description: 'Rubiks cube Biome is a webapp that allows you to manipulate rubiks cube with mini 3D biomes.',
    tech: ['Three.js', 'TWEEN.js', 'Vite'],
    demoUrl: '',
    repoUrl: 'https://github.com/Skitarii11/Biome-cubes'
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