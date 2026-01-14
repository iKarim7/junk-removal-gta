export default function NetlifyFormsPage() {
  return (
    <div style={{ display: 'none' }}>
      {/* This page is only for Netlify Forms detection during build */}
      <form name="lead-form" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="lead-form" />
        <input type="hidden" name="city" />
        <input type="hidden" name="state" />
        <p style={{ display: 'none' }}>
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>
        <p>
          <label>
            Name: <input type="text" name="name" required />
          </label>
        </p>
        <p>
          <label>
            Phone: <input type="tel" name="phone" required />
          </label>
        </p>
        <p>
          <label>
            Email: <input type="email" name="email" required />
          </label>
        </p>
        <p>
          <label>
            Message: <textarea name="message"></textarea>
          </label>
        </p>
        <p>
          <button type="submit">Send</button>
        </p>
      </form>
    </div>
  );
}
