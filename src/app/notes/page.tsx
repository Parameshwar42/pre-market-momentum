"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  User, 
  Plus, 
  Tag, 
  ChevronRight, 
  Copy, 
  Check, 
  Trash2, 
  TrendingUp,
  Info,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import initialNotes from "@/data/notes.json";

interface Note {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  author: string;
  tags: string[];
}

export default function DailyNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes as Note[]);
  const [selectedNote, setSelectedNote] = useState<Note | null>((initialNotes[0] as Note) || null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formAuthor, setFormAuthor] = useState("Premarket Cues Team");

  // Load notes from localStorage + fallback to static JSON
  useEffect(() => {
    const savedNotes = localStorage.getItem("premarket_daily_notes_v2");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        setNotes(initialNotes as Note[]);
      }
    } else {
      setNotes(initialNotes as Note[]);
      localStorage.setItem("premarket_daily_notes_v2", JSON.stringify(initialNotes));
    }

    // Check if admin mode is active in URL query string (e.g. ?admin=true)
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("admin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent || !formSummary) return;

    const id = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newNote: Note = {
      id,
      title: formTitle,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      summary: formSummary,
      content: formContent,
      author: formAuthor,
      tags: formTags.split(",").map(tag => tag.trim()).filter(Boolean)
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("premarket_daily_notes_v2", JSON.stringify(updatedNotes));

    // Reset form
    setFormTitle("");
    setFormSummary("");
    setFormContent("");
    setFormTags("");
    setIsPublishing(false);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note from local storage?")) {
      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem("premarket_daily_notes_v2", JSON.stringify(updatedNotes));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(notes, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1 flex flex-col justify-start">
      {/* Dynamic Article Schema Markup for Google SEO */}
      {notes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": selectedNote ? selectedNote.title : notes[0].title,
              "description": selectedNote ? selectedNote.summary : notes[0].summary,
              "datePublished": new Date().toISOString(),
              "author": {
                "@type": "Organization",
                "name": "Pre-Market Momentum"
              }
            })
          }}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <FileText className="h-3.5 w-3.5" />
            SEO Keyword Booster
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Daily Market Notes & Signal Analysis
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Daily opening breakdowns, post-market analyses, and programmatic SEO articles targeting high-intent financial keywords.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsPublishing(!isPublishing)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold shadow transition-all cursor-pointer select-none"
          >
            <Plus className="h-4 w-4" />
            {isPublishing ? "Close Panel" : "Add Daily Note"}
          </button>
        )}
      </div>

      {/* Admin Panel (Publish Form) */}
      {isPublishing && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <h3 className="text-sm font-black text-foreground">Create New SEO Note</h3>
            </div>
            <button
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-[10px] font-bold text-foreground cursor-pointer transition-colors"
              title="Copy JSON data to paste in src/data/notes.json"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy code JSON"}
            </button>
          </div>
          
          <div className="rounded-lg bg-muted p-3 border border-border/70 text-[11px] text-muted-foreground flex gap-2">
            <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <p>
              Adding a note here immediately saves it to your browser's local storage for mobile validation. To make it permanent for Google/SEO indexers, click <strong>"Copy code JSON"</strong> and paste it into the <code>src/data/notes.json</code> file in your repository.
            </p>
          </div>

          <form onSubmit={handleAddNote} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Article Title (SEO Target)</label>
              <input
                type="text"
                placeholder="e.g., GIFT Nifty Pre-Market Opening Signal Today"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., GIFT Nifty, Nifty 50, Pre-Market"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">SEO Summary (For google search snippet)</label>
              <input
                type="text"
                placeholder="A short 1-2 sentence description summarizing the article."
                value={formSummary}
                onChange={(e) => setFormSummary(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Article Content (Markdown supported)</label>
              <textarea
                placeholder="Write your article content here. Use paragraphs, bullet points, or markdown formatting."
                rows={6}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none font-sans"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishing(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-secondary/80 border border-border cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 cursor-pointer"
              >
                Publish Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Right side - Full Article View */}
        <div className="lg:col-span-8 space-y-6 lg:order-2">
          {selectedNote ? (
            <article className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <button
                onClick={() => setSelectedNote(null)}
                className="lg:hidden inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline mb-2 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to all notes
              </button>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground border border-border"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-black text-foreground tracking-tight sm:text-3xl leading-tight">
                  {selectedNote.title}
                </h2>

                <div className="flex items-center gap-4 text-xs text-muted-foreground border-y border-border/60 py-3 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {selectedNote.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    By {selectedNote.author}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-4">
                {selectedNote.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("###")) {
                    return (
                      <h3 key={i} className="text-base font-black text-foreground mt-6 mb-2">
                        {para.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  if (para.startsWith("*")) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1.5">
                        {para.split("\n").map((li, j) => (
                          <li key={j}>{li.replace(/^\*\s*/, "").trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith("$$")) {
                    return (
                      <div key={i} className="my-4 p-4 rounded-xl bg-muted border border-border/80 text-center font-mono text-foreground overflow-x-auto text-xs">
                        {para.replace(/\$\$/g, "").trim()}
                      </div>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
              
              <div className="border-t border-border/60 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Helpful Tool</span>
                  <p className="text-xs font-semibold text-foreground">Track arbitrage and signal changes live on our terminal.</p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow"
                >
                  Open Live Terminal
                  <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </article>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center border border-dashed border-border/80 rounded-3xl p-12 min-h-[450px] text-center bg-card/20 space-y-3">
              <FileText className="h-12 w-12 text-muted-foreground/60 animate-pulse" />
              <h3 className="text-base font-extrabold text-foreground">Select a note to read</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                Click on any note in the list on the left to read the full analysis and check SEO keyword distribution.
              </p>
            </div>
          )}
        </div>

        {/* Left side - Notes List */}
        <div className="lg:col-span-4 space-y-4 lg:order-1">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
            All Notes ({notes.length})
          </h3>

          <div className="space-y-3">
            {notes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`group relative rounded-2xl border p-4 space-y-3 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-secondary border-primary dark:border-indigo-500/80 shadow-sm"
                      : "bg-card border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground font-mono">
                        {note.date}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete from local storage"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {note.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-block rounded-md bg-secondary/80 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-[9px] font-bold text-muted-foreground/60 px-1">
                        +{note.tags.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
