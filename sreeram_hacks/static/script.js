// Global variables
let uploadedFile = null;
let currentUser = null;
let analysisResults = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('ecoscan_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLoginPage();
    }
    
    setupFileInput();
}

// Authentication Functions
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
}

function switchTab(tab) {
    // Remove active class from all tabs and forms
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    // Add active class to selected tab and form
    event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation (in real app, this would be server-side)
    const users = JSON.parse(localStorage.getItem('ecoscan_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('ecoscan_user', JSON.stringify(user));
        showMainApp();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid email or password!', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('ecoscan_users') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('User with this email already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('ecoscan_users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('ecoscan_user', JSON.stringify(newUser));
    showMainApp();
    showNotification('Registration successful!', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ecoscan_user');
    showLoginPage();
    resetApp();
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        background: ${type === 'success' ? '#4ade80' : '#ef4444'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// File input setup
function setupFileInput() {
    const imageInput = document.getElementById('imageInput');
    
    imageInput.addEventListener('change', handleFileSelect);
    
    // Setup drag and drop
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files: files } });
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        uploadedFile = file;
        displayImagePreview(file);
    } else {
        showNotification('Please select a valid image file.', 'error');
    }
}

function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const uploadArea = document.getElementById('uploadArea');
        
        imagePreview.src = e.target.result;
        imagePreviewContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        
        // Also store the image data for later use in results
        window.uploadedImageData = e.target.result;
    };
    reader.readAsDataURL(file);
}

function changeImage() {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    imagePreviewContainer.style.display = 'none';
    uploadArea.style.display = 'block';
    imageInput.value = '';
    uploadedFile = null;
}

// Main analysis function - integrates with Flask backend
async function analyzeImage() {
    if (!uploadedFile) {
        showNotification('Please upload an image first.', 'error');
        return;
    }
    
    // Show loading state
    const analyzeBtn = document.querySelector('.analyze-btn');
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI Analyzing...';
    
    // Show loading section
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    
    try {
        // Call the Flask backend API
        const analysisResult = await callBackendAPI(uploadedFile);
        
        // Store results
        analysisResults = analysisResult;
        
        // Display results
        displayResults(analysisResult);
        
    } catch (error) {
        console.error('Analysis Error:', error);
        showNotification('Error analyzing image. Please try again.', 'error');
        // Show image preview again
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('imagePreviewContainer').style.display = 'block';
    } finally {
        // Reset button
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = originalText;
    }
}

// Function to call the Flask backend API
async function callBackendAPI(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('/analyze-image', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Handle potential errors from backend
        if (result.error) {
            throw new Error(result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('Backend API Error:', error);
        throw error;
    }
}

function displayResults(result) {
    // Hide loading section
    document.getElementById('loadingSection').style.display = 'none';
    
    // Show the analyzed image in results
    const analyzedImage = document.getElementById('analyzedImage');
    if (window.uploadedImageData) {
        analyzedImage.src = window.uploadedImageData;
    }
    
    // Update the display with backend results
    document.getElementById('objectName').textContent = result.object_name || "Unknown";
    document.getElementById('objectWeight').textContent = (result.estimated_weight_g || 0) + " g";
    document.getElementById('carbonFootprint').textContent = result.carbonFootprint || "0";
    document.getElementById('materialType').textContent = result.material || "Unknown";
    document.getElementById('altName').textContent = result.altName || "Eco-Friendly Alternative";
    document.getElementById('altDescription').textContent = "AI-recommended sustainable alternative based on analysis";
    
    // Show results
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function analyzeNewImage() {
    const resultsSection = document.getElementById('results');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    resultsSection.classList.add('hidden');
    uploadArea.style.display = 'block';
    imageInput.value = '';
    uploadedFile = null;
    analysisResults = null;
    window.uploadedImageData = null;
}

function shareResults() {
    if (!analysisResults) {
        showNotification('No results to share.', 'error');
        return;
    }
    
    const carbonScore = document.getElementById('carbonFootprint').textContent;
    const objectName = document.getElementById('objectName').textContent;
    const altName = document.getElementById('altName').textContent;
    
    const shareText = `I just analyzed "${objectName}" with EcoVision AI! 🤖🌱
    
Carbon footprint: ${carbonScore} g CO₂
AI recommendation: ${altName}

Check out EcoVision for AI-powered environmental analysis!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'EcoVision AI Analysis Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Results copied to clipboard!', 'success');
        });
    }
}

// Utility function to reset the app
function resetApp() {
    uploadedFile = null;
    analysisResults = null;
    window.uploadedImageData = null;
    document.getElementById('imageInput').value = '';
    document.getElementById('results').classList.add('hidden');
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('analyzedImage').src = '';
}
