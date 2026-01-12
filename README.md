# Rang Website

A modern, hype-themed HTML website for music artist and DJ Rang, featuring a concert/venue/streamer aesthetic with neon effects and dynamic animations.

## Features

- 🎵 **Home Page** - Video background with logo and modern design
- 📖 **About Page** - Journey, stats, and information about Rang
- 🎬 **Content Page** - YouTube videos and content in card-style layout
- 🎫 **Events Page** - Upcoming events, tickets, and 5-star reviews
- 🛍️ **Merch Page** - Shopify integration ready
- 📧 **Contact Page** - Contact form, business email, and social links

## Design

- **Logo**: Custom SVG logo with Indian flag colors (orange, white, green)
- **Theme**: Concert/venue/streamer aesthetic with neon glow effects
- **Colors**: Orange (#FF8C42), Green (#4ADE80), White, Purple accents
- **Typography**: Bebas Neue for headings, Inter for body text
- **Effects**: Neon glows, particle animations, smooth transitions

## Getting Started

### Simple Setup

1. Open `index.html` in your web browser
2. That's it! No build process needed.

### For Development

You can use any local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Configuration

### Video Background

1. Add your banner video to `/videos/rang-banner.mp4`
2. The video will automatically play on the home page background
3. Supported formats: MP4, WebM
4. If video doesn't load, a gradient fallback will appear

### YouTube API Integration

To integrate with YouTube API for the Content page:

1. Get a YouTube Data API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Get your YouTube Channel ID
3. Update `script.js` to fetch videos:

```javascript
async function fetchYouTubeVideos() {
    const API_KEY = 'YOUR_API_KEY';
    const CHANNEL_ID = 'YOUR_CHANNEL_ID';
    
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=12&order=date&type=video&key=${API_KEY}`
    );
    const data = await response.json();
    // Process and display videos
}
```

### Shopify Integration

For Shopify integration, you have several options:

1. **Storefront API** - Fetch products dynamically
2. **Buy Button** - Embed Shopify buy buttons
3. **Direct Link** - Link to your Shopify store
4. **Liquid Theme** - If hosting on Shopify

Update `merch.html` with your Shopify store URL and API credentials.

### Contact Form

The contact form currently uses mock submission. To enable email forwarding:

1. **Option 1: Formspree**
   - Sign up at [Formspree](https://formspree.io/)
   - Update the form action in `contact.html`

2. **Option 2: Email Service**
   - Create a backend endpoint to handle form submissions
   - Update `script.js` to send form data to your endpoint

3. **Option 3: Custom Backend**
   - Set up your own email service endpoint

### Social Media Links

Update social media links in:
- `index.html` - Footer social icons
- `contact.html` - Contact page social links
- All other pages - Footer section

Replace `#` placeholders with actual URLs.

### Business Email

Update the business email in `contact.html`:
```html
<a href="mailto:contact@rangmusic.com">contact@rangmusic.com</a>
```

## Customization

### Colors

Edit `styles.css` to customize the color scheme:
- `--neon-orange`: Primary brand color
- `--neon-green`: Secondary brand color
- `--bg-dark`: Dark background
- `--text-light`: Light text

### Logo

The logo is an inline SVG in each HTML file. To update:
- Edit the SVG paths in each page's header
- Or create a separate logo file and reference it

### Fonts

The site uses:
- **Bebas Neue** - Display font (headings)
- **Inter** - Body font

Fonts are loaded from Google Fonts in each HTML file.

## File Structure

```
rangwebsite/
├── index.html          # Home page
├── about.html          # About page
├── content.html        # Content/YouTube page
├── events.html         # Events and tickets page
├── merch.html          # Merchandise/Shop page
├── contact.html        # Contact page
├── styles.css          # All styles
├── script.js           # JavaScript functionality
├── videos/             # Video assets
│   └── rang-banner.mp4 # Home page video (add your video here)
└── README.md           # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The website uses placeholder content for videos, events, and merchandise
- Replace mock data with actual API integrations
- All social links are placeholders - update with real URLs
- Video background requires a video file in `/videos/`
- Contact form needs email service configuration

## License

Private project for Rang.
