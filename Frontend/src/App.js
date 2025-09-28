import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // This will contain the converted CSS

// Utility function to display temporary notifications
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Basic inline styling for a quick notification (better handled in CSS)
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 20px; 
        border-radius: 10px; color: white; font-weight: 600; z-index: 1000;
        background: ${type === 'success' ? '#4ade80' : '#ef4444'};
        transition: opacity 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// --- Main App Component ---
function App() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedImageData, setUploadedImageData] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const fileInputRef = useRef(null);

    // Effect for handling drag-and-drop on the whole component
    useEffect(() => {
        const uploadArea = document.getElementById('uploadArea');
        if (!uploadArea) return;
        
        const handleDragOver = (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        };

        const handleDrop = (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        };

        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);

        return () => {
            uploadArea.removeEventListener('dragover', handleDragOver);
            uploadArea.removeEventListener('dragleave', handleDragLeave);
            uploadArea.removeEventListener('drop', handleDrop);
        };
    }, [uploadedFile]);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImageData(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select a valid image file.', 'error');
        }
    };

    const handleFileInputChange = (event) => {
        handleFileSelect(event.target.files[0]);
    };

    const changeImage = () => {
        setUploadedFile(null);
        setUploadedImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    };

    const analyzeImage = async () => {
        if (!uploadedFile) {
            showNotification('Please upload an image first.', 'error');
            return;
        }

        setIsLoading(true);
        setAnalysisResults(null); // Clear previous results

        const formData = new FormData();
        formData.append('image', uploadedFile);

        try {
            const response = await fetch('/analyze-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const result = await response.json();
            setAnalysisResults(result);
            
            // Scroll to results after setting them
            setTimeout(() => {
                document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error('Analysis Error:', error);
            showNotification(`Error analyzing image: ${error.message || 'Please try again.'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

  const analyzeNewImage = () => {
        // 1. Reset all state variables
        setUploadedFile(null);
        setUploadedImageData(null);
        setAnalysisResults(null);
        setIsLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        // 2. DEFER the scroll action to run AFTER React has updated the DOM
        setTimeout(() => {
            const uploadArea = document.getElementById('uploadArea');
            if (uploadArea) {
                uploadArea.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Fallback for extreme cases (scroll to top of page)
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 0); // Setting timeout to 0 ms defers execution until next tick
    };

    const shareResults = () => {
        if (!analysisResults) {
            showNotification('No results to share.', 'error');
            return;
        }

        const { carbonFootprint, object_name, altName } = analysisResults;
        
        const shareText = `I just analyzed "${object_name}" with Carbon Cruncher AI! 🤖🌱
Carbon footprint: ${carbonFootprint} g CO₂
AI recommendation: ${altName}
Check out Carbon Cruncher for AI-powered environmental analysis!`;

        if (navigator.share) {
            navigator.share({
                title: 'Carbon Cruncher AI Analysis Results',
                text: shareText,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Results copied to clipboard!', 'success');
            });
        }
    };

    const renderUploadSection = () => (
        <div className="upload-section">
            {uploadedFile && uploadedImageData ? (
                // --- Image Preview Container ---
                <div className="image-preview-container">
                    <img id="imagePreview" className="image-preview" src={uploadedImageData} alt="Uploaded" />
                    <div className="preview-actions">
                        <button className="analyze-btn" onClick={analyzeImage} disabled={isLoading}>
                            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
                            {isLoading ? 'AI Analyzing...' : 'Analyze'}
                        </button>
                        <button className="change-btn" onClick={changeImage} disabled={isLoading}>
                            <i className="fas fa-edit"></i>
                            Change Image
                        </button>
                    </div>
                </div>
            ) : (
                // --- Upload Area ---
                <div className="upload-area" id="uploadArea" onClick={() => fileInputRef.current.click()}>
                    <div className="upload-content">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <h3>Choose Your Image</h3>
                        <p>Drag & drop or click to browse</p>
                        <input 
                            type="file" 
                            id="imageInput" 
                            accept="image/*" 
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                        />
                        <button className="upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                            <i className="fas fa-image"></i>
                            Select Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
    const renderLoadingSection = () => (
        <div className="loading-section" id="loadingSection">
            <div className="loading-spinner">
                <div className="spinner"></div>
                <h3>AI is analyzing your image...</h3>
                <p>Our advanced AI is detecting materials and calculating environmental impact</p>
            </div>
        </div>
    );

    const renderResultsSection = () => {
        if (!analysisResults) return null;
        
        const { object_name, estimated_weight_g, carbonFootprint, material, altName, altDescription } = analysisResults;

        return (
            <div id="results" className="results-section">
                <div className="results-header">
                    <h2>🔍 Carbon Cruncher AI Analysis Results</h2>
                    <div className="carbon-badge">
                        <span className="carbon-value">{carbonFootprint || '0'}</span>
                        <span className="carbon-unit">g CO₂</span>
                    </div>
                </div>

                <div className="analyzed-image-container">
                    <h3>📸 Analyzed Image</h3>
                    <img id="analyzedImage" className="analyzed-image" src={uploadedImageData} alt="Analyzed" />
                </div>

                <div className="results-content">
                    <div className="result-card">
                        <div className="card-icon"><i className="fas fa-cube"></i></div>
                        <div className="card-content">
                            <h4>Detected Object</h4>
                            <p id="objectName">{object_name || 'Unknown'}</p>
                        </div>
                    </div>

                    <div className="result-card">
                        <div className="card-icon"><i className="fas fa-weight-hanging"></i></div>
                        <div className="card-content">
                            <h4>Estimated Weight</h4>
                            <p id="objectWeight">{(estimated_weight_g || '0') + " g"}</p>
                        </div>
                    </div>

                    <div className="result-card">
                        <div className="card-icon"><i className="fas fa-recycle"></i></div>
                        <div className="card-content">
                            <h4>Material Type</h4>
                            <p id="materialType">{material || 'Unknown'}</p>
                        </div>
                    </div>
                </div>

                <div className="alternatives-section">
                    <h3>🌿 Recommended Sustainable Alternative</h3>
                    <div className="alternative-card">
                        <div className="alt-icon"><i className="fas fa-leaf"></i></div>
                        <div className="alt-content">
                            <h4 id="altName">{altName || 'Eco-Friendly Option'}</h4>
                            <p id="altDescription">{altDescription || 'AI-recommended sustainable alternative based on analysis'}</p>
                            <div className="savings-badge">
                                <i className="fas fa-chart-line"></i>
                                <span>Better for Environment</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn-primary" onClick={analyzeNewImage}>
                        <i className="fas fa-plus"></i>
                        Analyze Another Image
                    </button>
                    <button className="btn-secondary" onClick={shareResults}>
                        <i className="fas fa-share"></i>
                        Share Results
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div id="mainApp" className="main-app">
            <header className="app-header">
                <div className="header-content">
                    <div className="logo">
                        <i className="fas fa-leaf"></i>
                        <h1>Carbon Cruncher AI</h1>
                    </div>
                </div>
            </header>

            <div className="app-container">
                <div className="hero-section">
                    <h2>🌱 AI-Powered Sustainability Recommender</h2>
                    <p>Upload an image to discover its carbon footprint and eco-friendly alternatives using our AI Agent</p>
                </div>

                {/* Conditional Rendering based on state */}
                {
                    isLoading ? renderLoadingSection() :
                    analysisResults ? renderResultsSection() :
                    renderUploadSection()
                }

                {/* If not loading and not showing full results, show the upload or preview state
                {!isLoading && !analysisResults && renderUploadSection()} */}

                {/* If analysisResults is present, ensure the full results section is rendered
                {renderResultsSection()} */}
            </div>
        </div>
    );
}

export default App;