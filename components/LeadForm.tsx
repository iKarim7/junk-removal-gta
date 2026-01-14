'use client';

import { useState, FormEvent, useEffect } from 'react';

interface LeadFormProps {
  city: string;
  state: string;
}

export default function LeadForm({ city, state }: LeadFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for success parameter in URL (from Netlify redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        setIsSubmitted(true);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Build URL-encoded string manually to ensure proper format
    const params = new URLSearchParams();
    
    // Add form-name first (required by Netlify)
    params.append('form-name', 'junk-removal-leads');
    
    // Add all other fields
    formData.forEach((value, key) => {
      if (key !== 'form-name') {
        params.append(key, value.toString());
      }
    });

    try {
      // Submit to current page (Netlify will intercept)
      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      // Netlify Forms returns 200 on success
      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        setIsSubmitting(false);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // If fetch fails, submit naturally as fallback
      // This ensures Netlify definitely gets the submission
      const hiddenForm = document.createElement('form');
      hiddenForm.method = 'POST';
      hiddenForm.action = window.location.pathname;
      hiddenForm.style.display = 'none';
      
      // Copy all form data
      formData.forEach((value, key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        hiddenForm.appendChild(input);
      });
      
      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      // Page will reload, so state reset isn't needed
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl md:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-14 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-400 rounded-full mb-3 sm:mb-4">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">Thank You!</h2>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-4 sm:mb-6 leading-relaxed px-2">
            Your request has been received successfully.
          </p>
          <p className="text-base sm:text-lg text-blue-200 px-2">
            Our team will contact you within 2 hours with free quotes from top-rated professionals in {city}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl md:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-10 lg:p-14 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-2 sm:px-0">
          Get Free Quotes from Top Junk Removal Services
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-4 sm:mb-6 max-w-xl mx-auto px-2 sm:px-0">
          Compare prices from multiple licensed professionals in {city}, {state}
        </p>

        {/* Trust Indicators with Icons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 px-2">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">100% Free</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">No Obligation</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">Response in 2 Hours</span>
          </div>
        </div>

        {/* 5-Star Rating Display */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-4">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs sm:text-sm md:text-base font-semibold">4.9/5 from 2,500+ reviews</span>
        </div>
      </div>

      <form
        name="junk-removal-leads"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        encType="application/x-www-form-urlencoded"
        onSubmit={handleSubmit}
        className="space-y-5 sm:space-y-6 md:space-y-7"
      >
        {/* Hidden fields for Netlify */}
        <input type="hidden" name="form-name" value="junk-removal-leads" />
        <input type="hidden" name="city" value={city} />
        <input type="hidden" name="state" value={state} />

        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label>
            Don't fill this out if you're human:{' '}
            <input name="bot-field" />
          </label>
        </div>

        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-blue-100">
            Full Name <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-gray-900 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all shadow-md"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Phone field */}
        <div>
          <label htmlFor="phone" className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-blue-100">
            Phone Number <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              inputMode="tel"
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-gray-900 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all shadow-md"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-blue-100">
            Email Address <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              required
              inputMode="email"
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-gray-900 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all shadow-md"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="message" className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-blue-100">
            Message <span className="text-gray-400 text-xs sm:text-sm font-normal">(Optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-gray-900 text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all resize-none shadow-md"
            placeholder="Tell us what needs to be removed..."
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-blue-700 font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-2xl hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg sm:text-xl md:text-2xl touch-manipulation"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-base sm:text-lg md:text-xl">Submitting...</span>
              </span>
            ) : (
              'Get Free Quotes Now →'
            )}
          </button>

          {/* Security and Trust Footer */}
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base text-blue-100 px-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-center">Your information is secure and will never be shared</span>
            </div>
            <p className="text-center text-xs sm:text-sm md:text-base text-blue-200 px-2">
              By submitting, you agree to receive quotes from licensed professionals. No spam, ever.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
