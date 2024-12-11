import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { saveAs } from 'file-saver';
    import Modal from 'react-modal';
    import { 
      FaCog, 
      FaFileUpload, 
      FaSave, 
      FaRobot, 
      FaSearch, 
      FaEdit 
    } from 'react-icons/fa';
    import jsPDF from 'jspdf';

    // API Providers Configuration
    const API_PROVIDERS = {
      ollama: {
        name: 'Ollama',
        baseUrl: 'http://localhost:11434/api/generate',
        models: ['llama2', 'mistral']
      },
      openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        models: ['gpt-3.5-turbo', 'gpt-4']
      },
      anthropic: {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1/complete',
        models: ['claude-2', 'claude-instant-1']
      },
      googleai: {
        name: 'Google AI',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
        models: ['text-bison-001']
      }
    };

    function App() {
      // State Management
      const [essayConfig, setEssayConfig] = useState({
        genre: '',
        theme: '',
        length: 'medium',
        audience: '',
        tone: ''
      });

      const [apiConfig, setApiConfig] = useState({
        provider: 'ollama',
        apiKey: '',
        model: 'llama2',
        baseUrl: API_PROVIDERS.ollama.baseUrl
      });

      const [essayContent, setEssayContent] = useState('');
      const [wordCount, setWordCount] = useState(0);
      const [sources, setSources] = useState([]);
      const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
      const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

      // Word Count Tracking
      useEffect(() => {
        setWordCount(essayContent.trim().split(/\s+/).length);
      }, [essayContent]);

      // API Configuration Handler
      const handleApiConfigChange = (field, value) => {
        setApiConfig(prev => ({
          ...prev,
          [field]: value,
          baseUrl: API_PROVIDERS[value]?.baseUrl || prev.baseUrl
        }));
      };

      // Essay Generation
      const generateEssay = async () => {
        try {
          const prompt = `Generate an essay with the following specifications:
            - Genre: ${essayConfig.genre}
            - Theme: ${essayConfig.theme}
            - Length: ${essayConfig.length}
            - Audience: ${essayConfig.audience}
            - Tone: ${essayConfig.tone}

            Provide a comprehensive and well-structured essay.`;

          const response = await axios.post(apiConfig.baseUrl, {
            model: apiConfig.model,
            prompt: prompt,
            stream: false
          }, {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`
            }
          });

          setEssayContent(response.data.response || response.data.choices[0].message.content);
        } catch (error) {
          console.error('Essay generation error:', error);
          alert('Failed to generate essay. Check your API configuration.');
        }
      };

      // Export Handlers
      const exportEssay = (format) => {
        switch (format) {
          case 'json':
            const jsonBlob = new Blob([JSON.stringify({
              content: essayContent,
              config: essayConfig
            }, null, 2)], { type: 'application/json' });
            saveAs(jsonBlob, 'essay.json');
            break;
          
          case 'pdf':
            const doc = new jsPDF();
            doc.text(essayContent, 10, 10);
            doc.save('essay.pdf');
            break;
          
          case 'mindmap':
            // Simplified mind map generation
            const mindmapContent = essayContent
              .split('\n')
              .map(line => `- ${line}`)
              .join('\n');
            const mindmapBlob = new Blob([mindmapContent], { type: 'text/plain' });
            saveAs(mindmapBlob, 'essay_mindmap.txt');
            break;
        }
      };

      // Advanced Feature Proposal
      const proposeAdditionalFeatures = async (size) => {
        try {
          const prompt = `Propose ${size} additional ideas or features for an essay on the theme: ${essayConfig.theme}`;
          
          const response = await axios.post(apiConfig.baseUrl, {
            model: apiConfig.model,
            prompt: prompt,
            stream: false
          });

          alert(response.data.response);
        } catch (error) {
          console.error('Feature proposal error:', error);
        }
      };

      return (
        <div className="app-container">
          <header>
            <h1>Essay Generator Pro</h1>
            <div className="header-actions">
              <button onClick={() => setIsOptionsModalOpen(true)}>
                <FaCog /> API Options
              </button>
              <button onClick={() => setIsAdvancedModalOpen(true)}>
                <FaRobot /> Advanced Features
              </button>
            </div>
          </header>

          {/* Essay Configuration Form */}
          <div className="essay-config-form">
            <input 
              type="text" 
              placeholder="Essay Genre" 
              value={essayConfig.genre}
              onChange={(e) => setEssayConfig(prev => ({
                ...prev, 
                genre: e.target.value
              }))}
            />
            <input 
              type="text" 
              placeholder="Theme" 
              value={essayConfig.theme}
              onChange={(e) => setEssayConfig(prev => ({
                ...prev, 
                theme: e.target.value
              }))}
            />
            <select
              value={essayConfig.length}
              onChange={(e) => setEssayConfig(prev => ({
                ...prev, 
                length: e.target.value
              }))}
            >
              <option value="short">Short Essay</option>
              <option value="medium">Medium Essay</option>
              <option value="long">Long Essay</option>
            </select>
            <input 
              type="text" 
              placeholder="Target Audience" 
              value={essayConfig.audience}
              onChange={(e) => setEssayConfig(prev => ({
                ...prev, 
                audience: e.target.value
              }))}
            />
            <input 
              type="text" 
              placeholder="Tone (Academic, Casual, etc.)" 
              value={essayConfig.tone}
              onChange={(e) => setEssayConfig(prev => ({
                ...prev, 
                tone: e.target.value
              }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={generateEssay}>
              <FaEdit /> Generate Essay
            </button>
            <button onClick={() => exportEssay('json')}>
              <FaSave /> Export JSON
            </button>
            <button onClick={() => exportEssay('pdf')}>
              <FaSave /> Export PDF
            </button>
            <button onClick={() => exportEssay('mindmap')}>
              <FaSave /> Export Mind Map
            </button>
          </div>

          {/* Essay Display */}
          {essayContent && (
            <div className="essay-display">
              <div className="word-count">Word Count: {wordCount}</div>
              <pre>{essayContent}</pre>
            </div>
          )}

          {/* API Options Modal */}
          <Modal
            isOpen={isOptionsModalOpen}
            onRequestClose={() => setIsOptionsModalOpen(false)}
            className="modal"
          >
            <h2>API Configuration</h2>
            <select 
              value={apiConfig.provider}
              onChange={(e) => handleApiConfigChange('provider', e.target.value)}
            >
              {Object.keys(API_PROVIDERS).map(provider => (
                <option key={provider} value={provider}>
                  {API_PROVIDERS[provider].name}
                </option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="API Key" 
              value={apiConfig.apiKey}
              onChange={(e) => handleApiConfigChange('apiKey', e.target.value)}
            />
            <select 
              value={apiConfig.model}
              onChange={(e) => handleApiConfigChange('model', e.target.value)}
            >
              {API_PROVIDERS[apiConfig.provider].models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <button onClick={() => setIsOptionsModalOpen(false)}>Save</button>
          </Modal>

          {/* Advanced Features Modal */}
          <Modal
            isOpen={isAdvancedModalOpen}
            onRequestClose={() => setIsAdvancedModalOpen(false)}
            className="modal"
          >
            <h2>Advanced Features</h2>
            <button onClick={() => proposeAdditionalFeatures('small')}>
              Propose Small Ideas
            </button>
            <button onClick={() => proposeAdditionalFeatures('medium')}>
              Propose Medium Ideas
            </button>
            <button onClick={() => proposeAdditionalFeatures('long')}>
              Propose Comprehensive Ideas
            </button>
          </Modal>
        </div>
      );
    }

    export default App;
