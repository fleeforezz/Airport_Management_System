import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import SwissSuspenseLoader from '../../components/common/SwissSuspenseLoader';
import EmptyState from '../../components/common/EmptyState';
import LazyImage from '../../components/common/LazyImage';
import { formatDate } from '../../utils/format';
import { articleApi } from '../../services/api';
import { Article } from '../../types';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setIsLoading(true);

    const fetchArticle = async () => {
      try {
        let found: Article | null = null;
        try {
          const res = await articleApi.getBySlugOrId(id);
          if (res.success && res.data) found = res.data;
        } catch {
          // Fall back to searching list
        }

        if (!found) {
          const listRes = await articleApi.getAll();
          if (listRes.success && listRes.data) {
            found = listRes.data.find((a) => a.id === id || a.slug === id) || null;
          }
        }

        if (isMounted && found) {
          setArticle(found);
        }
      } catch {
        // Handled cleanly
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchArticle();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <PageShell title="AVIATION BRIEFING" subtitle="RETRIEVING FROM DATABASE...">
        <SwissSuspenseLoader label="LOADING ARTICLE // DATABASE DISPATCH" />
      </PageShell>
    );
  }

  if (!article) {
    return (
      <PageShell title="DIRECTIVE NOT FOUND" subtitle="DATABASE QUERY RETURNED NO RESULTS">
        <EmptyState
          title="ARTICLE NOT FOUND"
          description="The requested directive article could not be retrieved from the database."
          actionLabel="RETURN TO HOME"
          actionPath="/"
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={article.title}
      subtitle={`PUBLISHED: ${formatDate(article.publishedAt)} // ESTIMATED READING TIME: ${article.readTimeMinutes} MIN`}
      badge={article.category}
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Airport Directives', path: '/articles' },
        { label: article.slug },
      ]}
    >
      <article className="max-w-4xl mx-auto bg-white border border-[#E5E7EB] p-6 md:p-10 space-y-6">
        {/* Cover Photo Frame */}
        <div className="h-72 sm:h-96 w-full bg-[#EEEEEE] border border-black overflow-hidden relative">
          <LazyImage
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
            priority={true}
          />
        </div>

        {/* Author & Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E5E7EB] font-mono text-xs text-[#4B5563] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#DC2626]" />
            <span>Author: <strong className="text-black">{article.author}</strong></span>
            {article.authorRole && <span>({article.authorRole})</span>}
          </div>
          <div>DISPATCH UPDATE: {formatDate(article.publishedAt)}</div>
        </div>

        {/* Summary Lead Paragraph */}
        <div className="p-4 bg-[#F5F5F5] border-l-4 border-black font-medium text-xs sm:text-sm text-black leading-relaxed">
          {article.summary}
        </div>

        {/* Article Body Content */}
        <div className="text-xs sm:text-sm text-black leading-relaxed space-y-4 whitespace-pre-line font-sans">
          {article.content}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-[#4B5563] uppercase font-bold mr-2">
            INDEX TAGS:
          </span>
          {article.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-[10px] text-black uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Back link */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider transition-none"
          >
            <span>← RETURN TO FLIGHT PORTAL</span>
          </Link>
        </div>
      </article>
    </PageShell>
  );
};

export default ArticleDetailPage;
