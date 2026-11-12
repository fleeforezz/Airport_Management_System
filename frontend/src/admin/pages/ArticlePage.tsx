import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES } from '../../utils/mockData';
import { Article } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import SourceEditor from '../components/SourceEditor';
import ImageUploader from '../components/ImageUploader';
import { formatDate } from '../../utils/format';
import { articleApi } from '../../services/api';

export const ArticlePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    let isMounted = true;
    articleApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setArticles(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const columns: Column<Article>[] = [
    {
      key: 'title',
      header: 'DIRECTIVE TITLE & SLUG',
      render: (row) => (
        <div>
          <div className="font-bold text-black max-w-sm truncate">{row.title}</div>
          <div className="text-[10px] text-[#4B5563]">SLUG: /{row.slug}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'CATEGORY',
      render: (row) => (
        <span className="px-1.5 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] font-bold">
          {row.category}
        </span>
      ),
    },
    {
      key: 'author',
      header: 'AUTHOR',
      render: (row) => <span>{row.author}</span>,
    },
    {
      key: 'publishedAt',
      header: 'PUBLISHED',
      render: (row) => <span>{formatDate(row.publishedAt)}</span>,
    },
    {
      key: 'actions',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setEditingArticle(row)}
          className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
        >
          COMPOSE
        </button>
      ),
    },
  ];

  const handleSave = () => {
    if (!editingArticle) return;
    setArticles(
      articles.map((a) => (a.id === editingArticle.id ? editingArticle : a))
    );
    setEditingArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="text-xl font-black uppercase text-black">
              TERMINAL DIRECTIVES & PASSENGER ADVISORIES
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            PUBLISH KIOSK CHECK-IN DIRECTIVES, BAGGAGE REGULATIONS, AND RUNWAY UPDATES
          </p>
        </div>
      </div>

      <Table columns={columns} data={articles} />

      <Drawer
        isOpen={!!editingArticle}
        onClose={() => setEditingArticle(null)}
        title="DIRECTIVE EDITOR"
        subtitle="SWISS MARKDOWN DISPATCH COMPOSITION INTERFACE"
        width="max-w-2xl"
        footer={
          <div className="flex justify-between items-center">
            <button
              onClick={() => setEditingArticle(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISCARD
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider"
            >
              SAVE & PUBLISH
            </button>
          </div>
        }
      >
        {editingArticle && (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                DIRECTIVE TITLE
              </label>
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, title: e.target.value })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <ImageUploader
              value={editingArticle.coverImage}
              onChange={(url) =>
                setEditingArticle({ ...editingArticle, coverImage: url })
              }
              label="COVER BANNER FRAME"
            />

            <SourceEditor
              value={editingArticle.content}
              onChange={(val) =>
                setEditingArticle({ ...editingArticle, content: val })
              }
              rows={12}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ArticlePage;
