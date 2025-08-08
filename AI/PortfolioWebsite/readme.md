# Matthew W. Rippey - Portfolio Website

A modern, responsive portfolio website with an admin panel for managing projects dynamically.

## 📁 File Structure

```
portfolio-website/
├── index.html                  # Main portfolio page
├── admin.html                  # Admin panel for managing projects
├── README.md                   # This documentation file
├── css/
│   ├── styles.css             # Main stylesheet for portfolio
│   └── admin.css              # Admin panel specific styles
├── js/
│   ├── main.js                # Main JavaScript functionality
│   └── admin.js               # Admin panel JavaScript
├── images/                    # Directory for project screenshots
│   ├── quadratic-formula.jpg  # (Add your project images here)
│   └── cryptogram.jpg         # (Add your project images here)
└── data/
    └── projects.json          # JSON file for project data (optional)
```

## 🚀 Features

### Main Portfolio (`index.html`)
- **Responsive Design**: Looks great on all devices
- **Dynamic About Section**: Personalized content highlighting your achievements
- **Interactive Hero Section**: Animated statistics and typing effects
- **Project Gallery**: Dynamically loaded project cards
- **Smooth Scrolling**: Navigation with smooth scroll effects
- **Contact Links**: Direct links to email and GitHub
- **Modern Animations**: Fade-in effects and hover interactions

### Admin Panel (`admin.html`)
- **Password Protection**: Secure access with password "anIdiotsLuggage"
- **Add New Projects**: Upload images and add project details
- **Edit Existing Projects**: Modify project information
- **Delete Projects**: Remove projects from the portfolio
- **Real-time Preview**: Changes reflect immediately on the main site
- **Local Storage**: Projects are saved in browser's local storage

## 🛠️ Setup Instructions

1. **Download/Clone** all files maintaining the folder structure
2. **Add Project Images**: Place your project screenshots in the `images/` folder
3. **Open in Browser**: Simply open `index.html` in your web browser
4. **Access Admin Panel**: Navigate to `admin.html` or click the "Admin" link in the navigation

## 🔐 Admin Access

- **URL**: `admin.html`
- **Password**: `anIdiotsLuggage`
- **Features**: Add, edit, and delete projects with image upload capability

## 📱 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Dynamic functionality and local storage
- **Font Awesome**: Icons throughout the site
- **Local Storage API**: Project data persistence

## 🎨 Customization

### Colors
Edit the CSS custom properties in `css/styles.css`:
```css
:root {
    --primary-color: #2563eb;    /* Main blue color */
    --secondary-color: #1e40af;  /* Darker blue */
    --accent-color: #f59e0b;     /* Yellow accent */
    /* ... other colors */
}
```

### Content
- **About Section**: Edit the content in `index.html` under the `#about` section
- **Contact Info**: Update email and GitHub links in the contact section
- **Navigation**: Modify nav links in both `index.html` and `admin.html`

### Admin Password
To change the admin password, edit the `ADMIN_PASSWORD` constant in `js/admin.js`:
```javascript
const ADMIN_PASSWORD = 'yourNewPassword';
```

## 📂 Adding New Projects

### Method 1: Using Admin Panel (Recommended)
1. Go to `admin.html`
2. Enter password: `anIdiotsLuggage`
3. Click "Add New Project"
4. Fill in project details and upload image
5. Click "Add Project"

### Method 2: Manual Addition
1. Add project image to `images/` folder
2. Edit the `projects` array in `js/main.js`
3. Add new project object with required fields

## 🌐 Deployment

### Local Development
- Simply open `index.html` in your browser
- All files work locally without a server

### Web Hosting
1. Upload all files to your web hosting service
2. Maintain the folder structure
3. Ensure all file paths are correct
4. Test admin panel functionality

### GitHub Pages
1. Create a new repository
2. Upload all files maintaining structure
3. Enable GitHub Pages in repository settings
4. Your site will be available at `username.github.io/repository-name`

## 🔧 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design works on all mobile browsers

## 📝 Notes

- Projects are stored in browser's local storage
- Images should be optimized for web (recommended: under 500KB each)
- Admin panel is client-side only (password is visible in source code)
- For production use, consider implementing server-side authentication

## 🎯 Future Enhancements

- Backend integration for secure project management
- Blog section for technical articles
- Project filtering and search functionality
- Analytics integration
- SEO optimization

## 📞 Support

For questions or issues:
- **Email**: rippey.fam@gmail.com
- **GitHub**: [github.com/rippey-fam](https://github.com/rippey-fam)

---

**Built with ❤️ by Matthew W. Rippey**