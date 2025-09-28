# 🌱 EcoVision - AI-Powered Environmental Analyzer

A modern web application that uses Google Gemini AI to analyze images and calculate their environmental impact, providing sustainable alternatives and carbon footprint data.

## 🚀 Features

- **🔐 User Authentication**: Complete login/register system
- **🤖 AI-Powered Analysis**: Google Gemini AI integration for object detection
- **📊 Carbon Footprint**: Real-time calculation of environmental impact
- **🌿 Eco Alternatives**: AI-recommended sustainable alternatives
- **📱 Responsive Design**: Works perfectly on all devices
- **🎨 Modern UI**: Beautiful, intuitive interface with animations
- **📸 Image Preview**: See your image before and after analysis
- **📤 Share Results**: Easy sharing of analysis results

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Flask (Python)
- **AI**: Google Gemini 2.5 Flash
- **Icons**: Font Awesome
- **Storage**: Local Storage for user data

## 📁 Project Structure

```
sreeram_hacks/
├── app.py                 # Flask backend server
├── index.html            # Main HTML file
├── requirements.txt      # Python dependencies
├── README.md            # Project documentation
└── static/              # Static assets
    ├── styles.css       # CSS styles
    └── script.js        # JavaScript functionality
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- Google Gemini API key

### Installation

1. **Clone or Download** the project files
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Google Gemini API**:
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update `app.py` with your API key:
   ```python
   genai.configure(api_key="YOUR_API_KEY_HERE")
   ```

4. **Run the Application**:
   ```bash
   python app.py
   ```

5. **Open in Browser**:
   - Visit `http://localhost:5000`
   - Register a new account or login
   - Upload an image to analyze!

## 🎯 How It Works

### 1. User Authentication
- Register a new account or login
- User data stored in browser's local storage
- Session management for seamless experience

### 2. Image Upload
- Drag & drop or click to upload images
- Real-time image preview
- Support for common image formats

### 3. AI Analysis
- Image sent to Google Gemini AI
- AI detects objects and materials
- Calculates carbon footprint and weight
- Generates sustainable alternatives

### 4. Results Display
- Beautiful card-based results layout
- Carbon footprint visualization
- Eco-friendly alternative suggestions
- Shareable results

## 🔧 Configuration

### Google Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update the `app.py` file:
   ```python
   genai.configure(api_key="your-api-key-here")
   ```

### Customizing AI Prompts

The AI analysis can be customized by modifying the prompt in `app.py`:

```python
response = model.generate_content([
    """
    Your custom prompt here...
    """,
    uploaded_file
])
```

## 📊 API Endpoints

### POST `/analyze-image`
Analyzes an uploaded image and returns environmental data.

**Request:**
- `image`: Image file (multipart/form-data)

**Response:**
```json
{
    "object_name": "Plastic Bottle",
    "material": "Plastic",
    "estimated_weight_g": 25,
    "carbonFootprint": "50 g CO₂",
    "altName": "Glass Bottle"
}
```

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Engaging user experience
- **Loading States**: Clear feedback during AI processing
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for user feedback

## 🔒 Security Features

- **Client-side Validation**: Form validation before submission
- **Error Handling**: Graceful error handling for API failures
- **CORS Support**: Cross-origin resource sharing enabled
- **Input Sanitization**: Safe handling of user inputs

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
1. Set up a production WSGI server (e.g., Gunicorn)
2. Configure environment variables
3. Set up proper API key management
4. Deploy to your preferred hosting platform

## 🛠️ Development

### Adding New Features
1. **Frontend**: Modify `static/script.js` and `static/styles.css`
2. **Backend**: Update `app.py` for new API endpoints
3. **UI**: Modify `index.html` for new components

### Customizing AI Analysis
- Modify the prompt in the `analyze_image()` function
- Add new material types to the analysis
- Customize carbon footprint calculations

## 📱 Mobile Support

The application is fully responsive and works on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad/Android tablets)
- 💻 Desktop computers
- 🖥️ Large screens

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your Google Gemini API key is correctly set
2. **CORS Issues**: The app includes CORS headers for development
3. **Image Upload Fails**: Check file size and format
4. **Analysis Fails**: Check console for error messages

### Debug Mode
Run with debug mode enabled:
```python
app.run(debug=True)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for powerful image analysis
- Flask for the backend framework
- Font Awesome for beautiful icons
- The open-source community for inspiration

## 📞 Support

For questions or support:
- Check the troubleshooting section
- Review the console for error messages
- Ensure all dependencies are installed

---

**Built with ❤️ for a greener future! 🌱🤖**
