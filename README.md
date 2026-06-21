# ZJ Programmers Portfolio

A responsive, animated static portfolio built with HTML, CSS, and JavaScript. No build step or framework is required.

## Personalize the site

- **Profile picture:** Add your photo as `assets/images/zahid-profile.jpg`. The generated robotic founder portrait is shown automatically until that file exists.
- **WhatsApp:** The site uses `+92 337 7854900` through `https://wa.me/923377854900`.
- **Business links:** LinkedIn, Fiverr, Facebook, WhatsApp, and the E11/2 Islamabad address are connected in `index.html`.
- **Team:** Edit the six `.team-card` articles in `index.html`. Optimized team portraits are stored in `assets/images/` as WebP files.
- **Projects:** Edit the four `.project-card` articles in the Projects section of `index.html`. Update matching modal text in the `projects` object inside `script.js`.
- **Reviews:** Edit the `.review-card` articles in the Client Reviews section of `index.html`.
- **Themes:** Edit the CSS variables at the top of `style.css`. The available themes are `gold`, `blue`, `emerald`, `purple`, `cyan`, and `pearl`.

## Contact form

The included form uses front-end validation and displays a success state without sending data. To receive submissions, connect it to Netlify Forms, Formspree, or your own endpoint.

## Deploy

### Netlify

Drag the complete `zj-portfolio` folder into Netlify Drop, or connect the folder through a Git repository. No build command is needed; use the project folder as the publish directory.

### Vercel

Import the Git repository, choose **Other** as the framework preset, leave the build command empty, and use the project folder as the output directory.

### GitHub Pages

Push the folder contents to a GitHub repository, open **Settings → Pages**, choose **Deploy from a branch**, and select the branch and root folder containing `index.html`.

## Local preview

Open `index.html` directly, or serve this folder with any simple local web server for the most accurate preview.
