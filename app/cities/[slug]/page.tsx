import { Metadata } from 'next';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import { marked } from 'marked';
import LeadForm from '@/components/LeadForm';

// Type definitions
type PageProps = {
  params: { slug: string };
};

interface CityFrontmatter {
  title: string;
  city: string;
  state: string;
  slug: string;
  description: string;
}

// Generate static params for all city markdown files
export async function generateStaticParams() {
  const citiesDirectory = join(process.cwd(), 'content', 'cities');
  const files = await readdir(citiesDirectory);
  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  return markdownFiles.map((file) => ({
    slug: file.replace(/\.md$/, ''),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const citiesDirectory = join(process.cwd(), 'content', 'cities');
  const filePath = join(citiesDirectory, `${slug}.md`);
  const fileContents = await readFile(filePath, 'utf8');
  const { data } = matter(fileContents);
  const frontmatter = data as CityFrontmatter;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

// Main page component
export default async function CityPage({ params }: PageProps) {
  const { slug } = params;
  const citiesDirectory = join(process.cwd(), 'content', 'cities');
  const filePath = join(citiesDirectory, `${slug}.md`);
  const fileContents = await readFile(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = data as CityFrontmatter;

  // Configure marked to add IDs to headings
  marked.use({
    renderer: {
      heading(text: string, level: number) {
        const escapedText = text
          .toLowerCase()
          .replace(/[^\w\s-]+/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
          .replace(/^-+|-+$/g, '');
        return `<h${level} id="${escapedText}">${text}</h${level}>`;
      },
    },
  });
  
  // Convert markdown to HTML
  let htmlContent = await marked(content);
  
  // Post-process: Format company info paragraphs (those that come after h3 and contain multiple strong tags)
  // Replace paragraphs with pattern: <p><strong>Label:</strong> text <strong>NextLabel:</strong> text</p>
  htmlContent = htmlContent.replace(
    /<p>(<strong>([^<]+):<\/strong>\s*([^<]*?)(?=<strong>|<\/p>))+/g,
    (match) => {
      // Extract all label-value pairs from the paragraph
      const items: string[] = [];
      const itemRegex = /<strong>([^<]+):<\/strong>\s*([^<]*?)(?=<strong>|<\/p>|$)/g;
      let itemMatch;
      
      while ((itemMatch = itemRegex.exec(match)) !== null) {
        const label = itemMatch[1];
        const value = itemMatch[2].trim();
        items.push(
          `<div class="company-info-item"><strong class="company-info-label">${label}:</strong> <span class="company-info-value">${value}</span></div>`
        );
      }
      
      return `<div class="company-info-container">${items.join('')}</div>`;
    }
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm md:text-base">
                <li>
                  <Link href="/" className="hover:text-blue-100 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-blue-200">/</li>
                <li>
                  <Link href="/" className="hover:text-blue-100 transition-colors">
                    Cities
                  </Link>
                </li>
                <li className="text-blue-200">/</li>
                <li className="text-blue-100 font-medium" aria-current="page">
                  {frontmatter.city}
                </li>
              </ol>
            </nav>

            {/* Title and Description */}
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {frontmatter.title}
              </h1>
              {frontmatter.description && (
                <p className="text-xl md:text-2xl text-blue-50 max-w-3xl leading-relaxed">
                  {frontmatter.description}
                </p>
              )}
            </header>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* LeadForm at TOP - Most Prominent */}
          <div id="lead-form-top" className="mb-16 scroll-mt-8">
            <LeadForm city={frontmatter.city} state={frontmatter.state} />
          </div>

          {/* Value Proposition Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 md:p-10 mb-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compare Quotes from Top {frontmatter.city} Companies
            </h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Get free quotes from multiple licensed professionals. Compare prices, read reviews, and choose the best service for your needs.
            </p>
            <a
              href="#lead-form-top"
              className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Free Quotes Now →
            </a>
          </div>

          {/* Main Content Area with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Article Content */}
            <article className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* CTA Section Before Companies */}
                <div className="bg-blue-50 border-b-4 border-blue-600 px-6 md:px-8 lg:px-12 py-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Ready to Get Quotes?
                      </h3>
                      <p className="text-gray-600">
                        Fill out the form above to receive quotes from these top-rated companies
                      </p>
                    </div>
                    <a
                      href="#lead-form-top"
                      className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Get Quotes →
                    </a>
                  </div>
                </div>

                <div
                  className="prose prose-lg max-w-none px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h1:text-4xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:mt-0 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-8 prose-h2:border-t prose-h2:border-gray-200 prose-h2:pt-8
                    prose-h3:text-base prose-h3:font-semibold
                    prose-p:text-gray-700 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:text-gray-700 prose-ul:text-base prose-ul:leading-relaxed prose-ul:mb-6 prose-ul:space-y-2
                    prose-ol:text-gray-700 prose-ol:text-base prose-ol:leading-relaxed prose-ol:mb-6 prose-ol:space-y-2
                    prose-li:text-gray-700 prose-li:mb-1 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                    [&>h2]:border-t [&>h2]:border-gray-200 [&>h2]:pt-8 [&>h2]:mt-12
                    [&>ul>li]:marker:text-blue-600
                    [&>ol>li]:marker:text-blue-600"
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.7',
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* CTA Section After Companies */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-4 border-blue-600 px-6 md:px-8 lg:px-12 py-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Get Quotes from These Companies
                  </h3>
                  <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                    Fill out our simple form to receive free quotes from multiple licensed professionals in {frontmatter.city}.
                  </p>
                  <a
                    href="#lead-form-top"
                    className="inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Get Free Quotes Now →
                  </a>
                </div>
              </div>
            </article>

            {/* Sidebar - Sticky with Form CTA */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Primary CTA Box - Most Prominent */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl p-6 text-white">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Get Free Quotes</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Compare prices from 3+ licensed professionals in {frontmatter.city}
                    </p>
                  </div>
                  <a
                    href="#lead-form-top"
                    className="block w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-lg text-center hover:bg-blue-50 transition-colors shadow-lg text-lg"
                  >
                    Fill Out Form →
                  </a>
                  <p className="text-xs text-blue-200 text-center mt-3">
                    100% Free • No Obligation • Response in 2 Hours
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Why Use Our Service</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">Compare Multiple Quotes</p>
                        <p className="text-sm text-gray-600">Get quotes from 3+ companies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">Licensed & Insured</p>
                        <p className="text-sm text-gray-600">All providers verified</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">100% Free</p>
                        <p className="text-sm text-gray-600">No cost to you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">Fast Response</p>
                        <p className="text-sm text-gray-600">Quotes within 2 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
                  <nav className="space-y-2">
                    <a href="#top-rated-junk-removal-companies-serving-oakville" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      Top Companies
                    </a>
                    <a href="#types-of-junk-removal-services-available-in-oakville" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      Service Types
                    </a>
                    <a href="#average-junk-removal-costs-in-oakville" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      Pricing Guide
                    </a>
                    <a href="#how-to-choose-a-junk-removal-service-in-oakville" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      How to Choose
                    </a>
                    <a href="#frequently-asked-questions" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      FAQs
                    </a>
                  </nav>
                </div>
              </div>
            </aside>
          </div>

          {/* LeadForm at BOTTOM */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Fill out the form below to receive free quotes from top-rated junk removal companies in {frontmatter.city}
              </p>
            </div>
            <LeadForm city={frontmatter.city} state={frontmatter.state} />
          </div>
        </div>
      </div>
    </main>
  );
}
