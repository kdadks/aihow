import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BlogCardProps {
  title: string;
  excerpt: string | null;
  author_name: string | null;
  author_image: string | null;
  author_credential: string | null;
  date: string | null;
  read_time: string | null;
  category: string | null;
  featured_image: string | null;
  slug: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  author_name,
  author_image,
  author_credential,
  date,
  read_time,
  category,
  featured_image,
  slug,
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | AI Tools Blog</title>
        <meta name="description" content={excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt,
            "author": {
              "@type": "Person",
              "name": author_name
            },
            "datePublished": date,
            "image": featured_image,
            "articleSection": category,
            "url": `/blog/${slug}`
          })}
        </script>
      </Helmet>
      <article className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <Link to={`/blog/${slug}`} className="block">
          <img
            src={featured_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995'}
            alt={title}
            className="w-full h-48 object-cover hover:opacity-90 transition"
          />
        </Link>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {category}
            </span>
          </div>
          <Link
            to={`/blog/${slug}`}
            className="block mb-2"
          >
            <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
              {title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-4">
            {excerpt || ''}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 font-medium">{author_name || 'Unknown'}</span>
                <span className="text-xs text-gray-500">{author_credential || ''}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{read_time || 'N/A'}</span>
              </div>
              <span>{date || ''}</span>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogCard;