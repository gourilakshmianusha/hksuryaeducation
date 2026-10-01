import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookOpen, Clock, ArrowRight, X, Calendar, Share2, RefreshCw } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await api.public.getBlog();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="blog" className="py-20 bg-[#050A1A] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00D2FF] tracking-wider uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>PERSPECTIVES & RESEARCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Insights & Roadmaps
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Curated architectural deep-dives, industry shifts, and career strategies from the HKSURYA faculty.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Updated Weekly with First-Party Research
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#00D2FF]" />
            <span>Loading publications from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl bg-[#091129] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#00D2FF]/40 transition-all duration-300 shadow-xl group hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="text-[#00D2FF] font-semibold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00D2FF] transition-colors leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{post.author}</div>
                    <div className="text-[11px] text-slate-400">{post.authorRole}</div>
                  </div>

                  <span className="text-xs font-bold text-[#00D2FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#091129] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <span className="text-[#00D2FF] font-semibold">{selectedPost.category}</span>
              <span>·</span>
              <span>{selectedPost.readTime}</span>
              <span>·</span>
              <span>{selectedPost.date}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {selectedPost.title}
            </h3>

            <div className="flex items-center justify-between py-3 border-y border-white/10 mb-6 text-xs text-slate-400">
              <div>
                <span className="text-white font-semibold">{selectedPost.author}</span> · {selectedPost.authorRole}
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-[#00D2FF] hover:underline"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <p className="text-base text-white font-medium">
                {selectedPost.excerpt}
              </p>
              <p>
                {selectedPost.content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold text-white transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
