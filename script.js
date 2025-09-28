// Global variables
let uploadedFile = null;
let analysisResults = null;
let currentUser = null;

// Material database with carbon footprint data (kg CO2 per kg of material)
const MATERIAL_DATABASE = {
    'plastic': {
        name: 'Plastic',
        icon: '🧴',
        carbonFootprint: 3.5,
        description: 'Synthetic polymer material'
    },
    'metal': {
        name: 'Metal',
        icon: '🔩',
        carbonFootprint: 8.2,
        description: 'Metallic materials (steel, aluminum, etc.)'
    },
    'glass': {
        name: 'Glass',
        icon: '🪟',
        carbonFootprint: 0.9,
        description: 'Silica-based material'
    },
    'paper': {
        name: 'Paper',
        icon: '📄',
        carbonFootprint: 1.2,
        description: 'Cellulose-based material'
    },
    'fabric': {
        name: 'Fabric',
        icon: '👕',
        carbonFootprint: 2.1,
        description: 'Textile materials'
    },
    'wood': {
        name: 'Wood',
        icon: '🪵',
        carbonFootprint: 0.4,
        description: 'Natural wood material'
    },
    'ceramic': {
        name: 'Ceramic',
        icon: '🏺',
        carbonFootprint: 1.8,
        description: 'Clay-based material'
    },
    'rubber': {
        name: 'Rubber',
        icon: '🛞',
        carbonFootprint: 2.8,
        description: 'Elastic polymer material'
    }
};

// Eco-friendly alternatives database
const ALTERNATIVES_DATABASE = {
    'plastic': [
        {
            name: 'Bamboo Products',
            icon: '🎋',
            description: 'Bamboo is a fast-growing, renewable resource that can replace many plastic items.',
            benefits: ['Biodegradable', 'Renewable', 'Durable', 'Lightweight'],
            carbonSavings: '85% less CO2',
            examples: 'Bamboo utensils, containers, phone cases'
        },
        {
            name: 'Glass Containers',
            icon: '🫙',
            description: 'Glass is infinitely recyclable and doesn\'t leach chemicals.',
            benefits: ['Infinitely recyclable', 'Non-toxic', 'Durable', 'Heat resistant'],
            carbonSavings: '60% less CO2',
            examples: 'Glass jars, bottles, food storage'
        },
        {
            name: 'Stainless Steel',
            icon: '🥤',
            description: 'Stainless steel is durable, recyclable, and long-lasting.',
            benefits: ['Highly recyclable', 'Durable', 'Non-toxic', 'Long-lasting'],
            carbonSavings: '70% less CO2',
            examples: 'Water bottles, lunch boxes, straws'
        }
    ],
    'metal': [
        {
            name: 'Recycled Aluminum',
            icon: '♻️',
            description: 'Recycled aluminum uses 95% less energy than virgin aluminum.',
            benefits: ['95% energy savings', 'Infinitely recyclable', 'Same quality', 'Lower cost'],
            carbonSavings: '95% less CO2',
            examples: 'Cans, foil, construction materials'
        },
        {
            name: 'Bamboo Steel',
            icon: '🎋',
            description: 'Bamboo-reinforced materials can replace some metal applications.',
            benefits: ['Renewable', 'Lightweight', 'Strong', 'Biodegradable'],
            carbonSavings: '80% less CO2',
            examples: 'Furniture, construction, automotive parts'
        }
    ],
    'paper': [
        {
            name: 'Digital Solutions',
            icon: '📱',
            description: 'Digital alternatives reduce paper consumption significantly.',
            benefits: ['No paper waste', 'Instant sharing', 'Searchable', 'Space-saving'],
            carbonSavings: '90% less CO2',
            examples: 'E-books, digital receipts, online forms'
        },
        {
            name: 'Recycled Paper',
            icon: '♻️',
            description: 'Recycled paper reduces the need for virgin wood pulp.',
            benefits: ['Reduces deforestation', 'Lower energy use', 'Same quality', 'Cost effective'],
            carbonSavings: '40% less CO2',
            examples: 'Notebooks, packaging, printing'
        }
    ],
    'fabric': [
        {
            name: 'Organic Cotton',
            icon: '🌱',
            description: 'Organic cotton is grown without harmful pesticides and chemicals.',
            benefits: ['No pesticides', 'Better for soil', 'Safer for workers', 'Biodegradable'],
            carbonSavings: '46% less CO2',
            examples: 'Clothing, towels, bedding'
        },
        {
            name: 'Hemp Fabric',
            icon: '🌿',
            description: 'Hemp requires less water and pesticides than conventional cotton.',
            benefits: ['Low water use', 'No pesticides', 'Durable', 'Biodegradable'],
            carbonSavings: '58% less CO2',
            examples: 'Clothing, bags, rope'
        }
    ],
    'glass': [
        {
            name: 'Recycled Glass',
            icon: '♻️',
            description: 'Recycled glass uses less energy and raw materials.',
            benefits: ['Lower energy use', 'Reduces waste', 'Same quality', 'Cost effective'],
            carbonSavings: '30% less CO2',
            examples: 'Bottles, jars, windows'
        }
    ],
    'wood': [
        {
            name: 'Bamboo',
            icon: '🎋',
            description: 'Bamboo grows much faster than trees and is highly renewable.',
            benefits: ['Fast growing', 'Renewable', 'Strong', 'Versatile'],
            carbonSavings: '60% less CO2',
            examples: 'Furniture, flooring, construction'
        },
        {
            name: 'Reclaimed Wood',
            icon: '🪵',
            description: 'Reclaimed wood gives new life to old materials.',
            benefits: ['No new trees cut', 'Unique character', 'Durable', 'Sustainable'],
            carbonSavings: '100% less CO2',
            examples: 'Furniture, flooring, decor'
        }
    ],
    'ceramic': [
        {
            name: 'Recycled Ceramic',
            icon: '♻️',
            description: 'Recycled ceramic reduces the need for new clay extraction.',
            benefits: ['Reduces mining', 'Lower energy use', 'Same quality', 'Sustainable'],
            carbonSavings: '25% less CO2',
            examples: 'Tiles, pottery, tableware'
        }
    ],
    'rubber': [
        {
            name: 'Natural Rubber',
            icon: '🌿',
            description: 'Natural rubber from sustainable sources is more eco-friendly.',
            benefits: ['Biodegradable', 'Renewable', 'Natural', 'Durable'],
            carbonSavings: '40% less CO2',
            examples: 'Tires, shoes, gloves'
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('ecoscan_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserInfo();
        showMainContent();
    } else {
        showAuthSection();
    }
    
    setupFileUpload();
    setupDragAndDrop();
}

// Authentication Functions
function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function showUserInfo() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
}

function showMainContent() {
    document.getElementById('mainContent').style.display = 'block';
}

function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
    closeModal('loginModal');
    showRegister();
}

function switchToLogin() {
    closeModal('registerModal');
    showLogin();
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
        closeModal('loginModal');
        showUserInfo();
        showMainContent();
        alert('Login successful!');
    } else {
        alert('Invalid email or password!');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('ecoscan_users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists!');
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
    closeModal('registerModal');
    showUserInfo();
    showMainContent();
    alert('Registration successful!');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ecoscan_user');
    showAuthSection();
    // Reset the app state
    uploadedFile = null;
    analysisResults = null;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

// File upload functionality
function setupFileUpload() {
    const photoInput = document.getElementById('photoInput');
    const uploadArea = document.getElementById('uploadArea');
    
    photoInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => photoInput.click());
}

function setupDragAndDrop() {
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
        displayPhotoPreview(file);
    } else {
        alert('Please select a valid image file.');
    }
}

function displayPhotoPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('previewImage');
        const photoPreview = document.getElementById('photoPreview');
        const uploadArea = document.getElementById('uploadArea');
        
        previewImage.src = e.target.result;
        photoPreview.style.display = 'block';
        uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function changePhoto() {
    const photoPreview = document.getElementById('photoPreview');
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const resultsSection = document.getElementById('resultsSection');
    
    photoPreview.style.display = 'none';
    uploadArea.style.display = 'block';
    resultsSection.style.display = 'none';
    photoInput.value = '';
    uploadedFile = null;
    analysisResults = null;
}

// Mock material detection (placeholder for CNN)
function detectMaterials(imageFile) {
    // This is a mock function that simulates material detection
    // In a real implementation, this would call your CNN model
    
    // Add some randomness to make it more realistic
    const allMaterials = Object.keys(MATERIAL_DATABASE);
    const numMaterials = Math.floor(Math.random() * 3) + 1; // 1-3 materials
    const selectedMaterials = [];
    
    for (let i = 0; i < numMaterials; i++) {
        const randomMaterial = allMaterials[Math.floor(Math.random() * allMaterials.length)];
        if (!selectedMaterials.find(m => m.material === randomMaterial)) {
            selectedMaterials.push({
                material: randomMaterial,
                confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
                quantity: Math.random() * 0.8 + 0.2 // 0.2-1.0 kg
            });
        }
    }
    
    return selectedMaterials;
}

// Carbon footprint calculation
function calculateCarbonFootprint(materials) {
    let totalCarbon = 0;
    const materialBreakdown = [];
    
    materials.forEach(item => {
        const materialData = MATERIAL_DATABASE[item.material];
        const carbonForMaterial = item.quantity * materialData.carbonFootprint;
        totalCarbon += carbonForMaterial;
        
        materialBreakdown.push({
            material: item.material,
            name: materialData.name,
            quantity: item.quantity,
            carbonFootprint: materialData.carbonFootprint,
            totalCarbon: carbonForMaterial,
            confidence: item.confidence
        });
    });
    
    return {
        totalCarbon: Math.round(totalCarbon * 100) / 100,
        breakdown: materialBreakdown
    };
}

// Main analysis function
function analyzePhoto() {
    if (!uploadedFile) {
        alert('Please upload a photo first.');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate processing time
    setTimeout(() => {
        // Detect materials (mock)
        const detectedMaterials = detectMaterials(uploadedFile);
        
        // Calculate carbon footprint
        const carbonData = calculateCarbonFootprint(detectedMaterials);
        
        // Store results
        analysisResults = {
            materials: detectedMaterials,
            carbonData: carbonData,
            timestamp: new Date()
        };
        
        // Display results
        displayResults();
    }, 2000);
}

function showLoading() {
    const loadingSection = document.getElementById('loadingSection');
    const photoPreview = document.getElementById('photoPreview');
    const resultsSection = document.getElementById('resultsSection');
    
    loadingSection.style.display = 'block';
    photoPreview.style.display = 'none';
    resultsSection.style.display = 'none';
}

function displayResults() {
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Update carbon score
    updateCarbonScore();
    
    // Display detected materials
    displayMaterials();
    
    // Display alternatives
    displayAlternatives();
}

function updateCarbonScore() {
    const carbonScore = document.getElementById('carbonScore');
    carbonScore.textContent = analysisResults.carbonData.totalCarbon;
}

function displayMaterials() {
    const materialsGrid = document.getElementById('materialsGrid');
    materialsGrid.innerHTML = '';
    
    analysisResults.carbonData.breakdown.forEach(item => {
        const materialCard = document.createElement('div');
        materialCard.className = 'material-card';
        
        const materialData = MATERIAL_DATABASE[item.material];
        
        materialCard.innerHTML = `
            <div class="material-icon">${materialData.icon}</div>
            <div class="material-name">${item.name}</div>
            <div class="material-impact">${item.totalCarbon} kg CO₂</div>
            <div class="material-quantity">${item.quantity} kg</div>
            <div class="material-confidence">${Math.round(item.confidence * 100)}% confidence</div>
        `;
        
        materialsGrid.appendChild(materialCard);
    });
}

function displayAlternatives() {
    const alternativesGrid = document.getElementById('alternativesGrid');
    alternativesGrid.innerHTML = '';
    
    // Get unique materials from analysis
    const materials = [...new Set(analysisResults.materials.map(m => m.material))];
    
    materials.forEach(material => {
        const alternatives = ALTERNATIVES_DATABASE[material];
        if (alternatives) {
            alternatives.forEach(alternative => {
                const alternativeCard = document.createElement('div');
                alternativeCard.className = 'alternative-card';
                
                alternativeCard.innerHTML = `
                    <div class="alternative-header">
                        <div class="alternative-icon">${alternative.icon}</div>
                        <div class="alternative-name">${alternative.name}</div>
                    </div>
                    <div class="alternative-description">${alternative.description}</div>
                    <ul class="alternative-benefits">
                        ${alternative.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                    <div class="carbon-savings">${alternative.carbonSavings}</div>
                `;
                
                alternativesGrid.appendChild(alternativeCard);
            });
        }
    });
}

function analyzeNewPhoto() {
    const resultsSection = document.getElementById('resultsSection');
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    
    resultsSection.style.display = 'none';
    uploadArea.style.display = 'block';
    photoPreview.style.display = 'none';
    photoInput.value = '';
    uploadedFile = null;
    analysisResults = null;
}

function shareResults() {
    if (!analysisResults) {
        alert('No results to share.');
        return;
    }
    
    const carbonScore = analysisResults.carbonData.totalCarbon;
    const materials = analysisResults.carbonData.breakdown.map(item => item.name).join(', ');
    
    const shareText = `I just analyzed my photo with EcoScan! 📸🌱
    
Detected materials: ${materials}
Carbon footprint: ${carbonScore} kg CO₂

Check out EcoScan to calculate your own carbon footprint from photos!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'EcoScan Analysis Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeModal('loginModal');
    }
    if (event.target === registerModal) {
        closeModal('registerModal');
    }
}