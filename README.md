# xBrophyx.github.io

A polished, responsive, single-page static portfolio site for an Armed Protective
Security Specialist. Built with plain HTML, CSS, and JavaScript - **no build step**.

Sections: a full-screen **PORTFOLIO** hero, **About Me**, **Education**, and
**Work Experience**, styled to match a dark "black aesthetic" with warm-gray
spotlight gradients, thin decorative lines, and the three-dots motif.

## Background music

The site plays a calm instrumental track **continuously looping** in the
background. The audio is a **local mp3 file** (`assets/background-music.mp3`)
that **autoplays and loops automatically** for every visitor. There is **no
visible playback UI/toggle/mute button**.

Because browsers normally block autoplay, the player resumes on the visitor's
first interaction (click, key press, tap, or scroll). Note: the mp3 is a
**large (~55 MB) file**, so it may take a moment to buffer on slower connections.

## Structure

```
.
??? index.html        # Markup for all sections + sticky nav
??? styles.css        # Mobile-first responsive styling (CSS variables, clamp() typography)
??? script.js         # Nav, active-link highlight, mobile toggle, fade-in reveals, local mp3 background music
??? assets/           # Photographs cropped from the original design slides
?   ??? portrait.png
?   ??? edu1.png
?   ??? edu2.png
?   ??? edu3.png
?   ??? work-security.png
?   ??? work-construction.png
?   ??? work-it.png
?   ??? background-music.mp3   # ~55 MB looping background track
??? .nojekyll         # Tells GitHub Pages to serve files as-is (skip Jekyll)
??? README.md
```

## View locally

The simplest option is to just open `index.html` in your browser - everything
works from the file system.

To preview over HTTP (recommended, mirrors how Pages serves the site):

```bash
python -m http.server 8080
```

Then visit <http://localhost:8080/>. Press `Ctrl+C` to stop the server.

## Deploy to GitHub Pages (user site)

This is a **GitHub user/organization Pages site**, which has specific naming rules:

1. The repository **must be named exactly** `xBrophyx.github.io`.
2. Push the project to the **`main`** branch (Pages serves the user site from the
   repository root of `main` by default):

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/xBrophyx/xBrophyx.github.io.git
   git push -u origin main
   ```

3. In the repository on GitHub, go to **Settings ? Pages** and confirm the source
   is **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**.
4. After a minute or two the site will be live at **https://xbrophyx.github.io/**.

The included empty `.nojekyll` file ensures GitHub Pages serves all files
verbatim without running them through Jekyll.
