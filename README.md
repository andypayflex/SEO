# Bytes of Content

A custom, responsive website for Bytes of Content, an SEO and content studio with technical and creative professionals. Plain HTML, CSS, and JavaScript; no framework, package installation, or external asset requests required.

## Run locally

Requires Node.js 18 or newer.

```sh
npm run dev
```

Open http://localhost:3000. To choose another port, run `PORT=4000 npm run dev`.

## Build

```sh
npm run build
```

The complete deployable site is copied to `dist/`. Serve the build locally with `npm run preview` (stop the development server first, or choose another port). Upload the contents of `dist/` to a static website host. The included Node server is for local preview; it is not needed on a static host.

## Update the contact email

Edit `email` in `site-config.js`. It is currently `hello@bytesofcontent.example`, a reserved dummy address that cannot receive email, as requested. The visible email link, enquiry destination, and placeholder notices update from this setting. Also update the fallback email links in `index.html` so they remain useful if JavaScript is disabled.

The form validates the visitor’s details and prepares a preview of their enquiry. Visitors can copy it or open it in their own email app to review and send. It does not send messages automatically, submit to a backend, or store form data. A configured email app is required to use a `mailto:` link; copying the draft is provided as an alternative. Long drafts may exceed some email clients’ URL limits, so the copy option remains available.

## Edit the site

- `index.html`: page copy, section structure, expertise sections, metadata, and organisation structured data.
- `styles.css`: colour tokens, layouts, original CSS/SVG illustration, and responsive styles.
- `app.js`: service detail dialogs, service preselection, mobile navigation, email-draft preparation, clipboard handling, and privacy dialog.
- `site-config.js`: contact email.
- `public/favicon.svg`: original code-bracket brand mark.

Expertise cards use custom typography and code symbols to represent professional disciplines. All artwork is drawn in CSS and SVG, and typography uses local system fonts.

## Before publishing

1. Replace the dummy email with your verified business email and test the entire enquiry flow in your email client.
2. Review the proposed service scope and business copy together. The copy positions your combined skills; it makes no claims about past SEO clients, results, testimonials, or guaranteed rankings.
3. Choose and connect your domain. Add its absolute canonical URL and `og:url` metadata in `index.html`; add a social sharing image if desired.
4. Remove the preview `<meta name="robots" content="noindex, nofollow">` tag in `index.html` and change `Disallow: /` to `Allow: /` in `robots.txt`. These are intentionally set for the current unpublished preview. Add a sitemap using the final domain.
5. Rebuild and upload `dist/`. Check HTTPS, email links and the production page on a phone.

## Brand positioning

The website presents Bytes of Content as a studio specialising in technical SEO, content and copywriting, and SEO strategy, with professionals working across these disciplines. The public site, metadata, and email drafts use the company name without naming individual team members or specifying team size.

## Accessibility and privacy

Semantic headings and sections, a skip link, labelled form controls, native validation, visible keyboard focus, native dialogs with Escape-to-close and focus restoration, accessible mobile-menu state, and reduced-motion support are included. The site loads no third-party fonts, trackers, or analytics. Hosting access logs are separate from the site; review the privacy wording if you later add analytics or a submission service.
