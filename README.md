# 🌱 EcoScan - Carbon Footprint Calculator

EcoScan is an innovative web application that analyzes photos to detect materials and calculate their carbon footprint, then suggests eco-friendly alternatives to help users make more sustainable choices.

## 🚀 Features

- **Photo Analysis**: Upload photos to detect materials using AI/ML
- **Carbon Footprint Calculation**: Real-time calculation of CO₂ emissions based on detected materials
- **Eco-Friendly Alternatives**: Personalized suggestions for sustainable alternatives
- **Interactive Visualizations**: Charts and graphs showing carbon impact breakdown
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Share Results**: Easy sharing of analysis results

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Styling**: Custom CSS with modern design principles
- **Future Integration**: CNN model for material detection

## 📁 Project Structure

```
Hackathon_MLH/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Quick Start

1. **Clone or Download** the project files
2. **Open** `index.html` in a web browser
3. **Upload** a photo of materials/products
4. **Analyze** the carbon footprint
5. **Explore** eco-friendly alternatives

## 💻 Local Development

### Option 1: Simple File Opening
- Double-click `index.html` to open in your default browser
- No server setup required for basic functionality

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have it installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎯 How It Works

### 1. Photo Upload
- Drag and drop or click to upload images
- Supports common image formats (JPG, PNG, GIF, etc.)
- Real-time photo preview

### 2. Material Detection
- Currently uses mock detection (placeholder for CNN)
- Detects common materials: plastic, metal, glass, paper, fabric, wood, ceramic, rubber
- Provides confidence scores for each detection

### 3. Carbon Calculation
- Uses industry-standard carbon footprint data
- Calculates CO₂ emissions based on material type and quantity
- Provides detailed breakdown by material

### 4. Alternative Suggestions
- Database of eco-friendly alternatives
- Carbon savings calculations
- Benefits and examples for each alternative

## 🔧 Customization

### Adding New Materials
Edit the `MATERIAL_DATABASE` in `script.js`:

```javascript
const MATERIAL_DATABASE = {
    'new_material': {
        name: 'New Material',
        icon: '🆕',
        carbonFootprint: 2.5, // kg CO2 per kg
        description: 'Description of the material'
    }
};
```

### Adding Alternatives
Edit the `ALTERNATIVES_DATABASE` in `script.js`:

```javascript
const ALTERNATIVES_DATABASE = {
    'material_name': [
        {
            name: 'Alternative Name',
            icon: '🌱',
            description: 'Description of the alternative',
            benefits: ['Benefit 1', 'Benefit 2'],
            carbonSavings: '50% less CO2',
            examples: 'Example uses'
        }
    ]
};
```

## 🤖 CNN Integration

To integrate your CNN model for material detection:

1. **Replace the mock function** `detectMaterials()` in `script.js`
2. **Add API endpoint** for your model
3. **Update the analysis flow** to call your model

Example integration:
```javascript
async function detectMaterials(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch('/api/detect-materials', {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
}
```

## 📊 Carbon Footprint Data

The application uses industry-standard carbon footprint data:

| Material | CO₂ per kg | Source |
|----------|------------|---------|
| Plastic | 3.5 kg | Industry average |
| Metal | 8.2 kg | Steel production average |
| Glass | 0.9 kg | Glass manufacturing |
| Paper | 1.2 kg | Paper production |
| Fabric | 2.1 kg | Textile industry |
| Wood | 0.4 kg | Forestry and processing |
| Ceramic | 1.8 kg | Ceramic manufacturing |
| Rubber | 2.8 kg | Rubber production |

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface
- **Responsive**: Works on all device sizes
- **Accessibility**: High contrast, readable fonts
- **Animations**: Smooth transitions and hover effects
- **Color Coding**: Green for eco-friendly, red for high carbon

## 🚀 Future Enhancements

- [ ] Real CNN model integration
- [ ] User accounts and history
- [ ] Batch photo analysis
- [ ] Carbon footprint tracking over time
- [ ] Social features and challenges
- [ ] Mobile app version
- [ ] API for third-party integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🏆 Hackathon Info

**Event**: MLH Hackathon at ASU
**Theme**: Environmental Sustainability
**Duration**: 24-48 hours
**Team**: [Your Team Name]

## 📞 Support

For questions or support:
- Create an issue in the repository
- Contact the team at [your-email@example.com]

## 🌟 Acknowledgments

- Chart.js for data visualization
- Font Awesome for icons
- ASU for hosting the hackathon
- MLH for organizing the event

---

**Made with ❤️ for a greener future! 🌱**
