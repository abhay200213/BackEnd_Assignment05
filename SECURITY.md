# Security Configuration Justification

This document explains the security-related configuration used in this API, specifically the custom Helmet.js and CORS settings. The goal is to reduce common web security risks while keeping the API usable for local development and testing.

---

## Helmet.js Configuration

### Configuration Applied

```typescript
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "no-referrer" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    noSniff: true,
    hidePoweredBy: true,
  })
);
```

### Justification

1. **contentSecurityPolicy: false**  
   Content Security Policy was disabled because this project is a backend API that returns JSON responses and does not serve browser-rendered HTML pages. CSP is most useful for controlling which scripts, styles, and other resources a browser may load when rendering HTML. Since this API does not serve a frontend application, disabling CSP avoids unnecessary complexity while keeping the configuration appropriate for the current use case.

2. **crossOriginEmbedderPolicy: false**  
   This was disabled to avoid unnecessary restrictions and compatibility issues during API testing and future documentation tooling. Since this project is an API and not a browser-rendered app using advanced cross-origin isolation features, this header is not essential for the current use case.

3. **frameguard: { action: "deny" }**  
   This configuration adds the `X-Frame-Options: DENY` header. It helps prevent clickjacking by telling browsers not to allow the application to be embedded in frames or iframes. Although this project is an API, applying this header globally is still a reasonable defensive measure and demonstrates secure header configuration across routes.

4. **referrerPolicy: { policy: "no-referrer" }**  
   This configuration instructs browsers not to send referrer information when making requests. It reduces the chance of leaking URL details to other origins and supports privacy-conscious API behavior.

5. **hsts: { maxAge: 31536000, includeSubDomains: true }**  
   This enables HTTP Strict Transport Security with a one-year max age and support for subdomains. HSTS instructs browsers to use HTTPS for future requests, reducing downgrade attacks and accidental insecure access. This is an important transport security header for production-style deployments.

6. **noSniff: true**  
   This adds the `X-Content-Type-Options: nosniff` header. It prevents browsers from MIME-sniffing a response away from the declared `Content-Type`, which helps reduce exposure to content-type confusion attacks.

7. **hidePoweredBy: true**  
   This removes the `X-Powered-By` header. Hiding this header does not stop a determined attacker, but it reduces unnecessary disclosure of implementation details.

### Observed Headers

After enabling Helmet, the API responses included headers such as:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Referrer-Policy: no-referrer`
- `X-Download-Options: noopen`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

These headers were verified through response header inspection.

### Sources

1. Helmet.js Official Documentation: https://helmetjs.github.io/
2. OWASP Secure Headers Project: https://owasp.org/www-project-secure-headers/
3. OWASP HTTP Security Response Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
4. OWASP Clickjacking Defense Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html

---

## CORS Configuration

### Configuration Applied

```typescript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy: This origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);
```

### Justification

1. **Restricted origin allowlist**  
   Instead of allowing all origins with `*`, this project uses a specific allowlist stored in environment variables. Only known local development origins are permitted. This is more secure because it reduces which browser-based clients can read responses from the API.

2. **Allow requests with no origin**  
   Requests without an `Origin` header are allowed. This is appropriate for tools such as Postman, curl, and server-to-server requests, which are not typical browser-based cross-origin requests. This keeps development and testing practical without weakening browser CORS policy.

3. **methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]**  
   Only the HTTP methods used by the API are allowed. Including `OPTIONS` supports preflight requests. Restricting methods is better than allowing everything by default.

4. **allowedHeaders: ["Content-Type", "Authorization"]**  
   Only the headers needed for JSON API usage and token-based authentication are explicitly allowed. This keeps the policy tighter and easier to justify than broadly allowing all headers.

5. **credentials: false**  
   Credentialed cross-origin requests were disabled because this API does not rely on browser cookies or session-based authentication. For this project, using `Authorization` headers is sufficient. Keeping credentials disabled also avoids the complications and risks associated with cross-origin cookie handling.

6. **optionsSuccessStatus: 204**  
   This improves compatibility for successful preflight responses and makes preflight handling explicit.

### Observed Behavior

When a request was sent with an allowed origin such as `http://localhost:5173`, the API responded with:

- `Access-Control-Allow-Origin: http://localhost:5173`

The response also included:

- `Vary: Origin`

This confirmed that the API was dynamically validating the request origin rather than returning a wildcard value.

### Sources

1. Express CORS Middleware Documentation: https://expressjs.com/en/resources/middleware/cors.html
2. MDN Web Docs - CORS Guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
3. MDN Web Docs - Access-Control-Allow-Origin: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Origin
4. MDN Web Docs - Access-Control-Allow-Headers: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Headers
5. MDN Web Docs - Access-Control-Allow-Methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Methods

---

## Summary

The API uses a custom Helmet configuration to apply security headers appropriate for a JSON API and a custom CORS policy that restricts cross-origin access to known development origins. Together, these settings reduce unnecessary exposure while supporting the project’s local development and testing workflow.