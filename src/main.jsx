import { h, render } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Router, Route, Link, useRoute } from 'wouter';
import { parseFrontmatter, renderMarkdown } from './utils.js';
import './style.css';

// Dynamically import all markdown files in src/posts
const postFiles = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });

// WARNING: This loads all posts at startup. Fine for a small blog.
// If you expect 100+ posts, refactor to lazy/chunked loading for performance (see PHASE III plan).
function usePosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    Promise.all(
      Object.entries(postFiles).map(async ([path, loader]) => {
        try {
          const raw = await loader();
          const { attributes, body } = parseFrontmatter(raw);
          let date = attributes.date ? new Date(attributes.date) : null;
          return { ...attributes, date, body, path };
        } catch (err) {
          console.error('Failed to load or parse post:', path, err);
          return null;
        }
      })
    ).then(all => {
      const valid = all.filter(Boolean);
      setPosts(valid.sort((a, b) => {
        if (a.date && b.date) return b.date - a.date;
        if (a.date) return -1;
        if (b.date) return 1;
        return a.title.localeCompare(b.title);
      }));
    });
  }, []);
  return posts;
}

// Sample data for projects
const projects = [
  {
    icon: '⌬',
    title: 'Knowledge Fractal',
    desc: 'A self-expanding knowledge base, always in flux.',
  },
  {
    icon: '☉',
    title: 'Crypto Agent',
    desc: 'An autonomous agent for cryptographic rituals.',
  },
  {
    icon: '☾',
    title: 'Dream Console',
    desc: 'A terminal for exploring liminal code worlds.',
  },
];

// Simple animated console text effect
function ConsoleText({ text }) {
  const [shown, setShown] = useState(0);
  if (shown < text.length) {
    setTimeout(() => setShown(shown + 1), 30);
  }
  return <span class="font-pixel text-amber">{text.slice(0, shown)}<span class="blink-cursor">█</span></span>;
}

// 3. Blog: Add search/filter by tag and pagination
const POSTS_PER_PAGE = 5;

function useSearchAndPagination(posts) {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  // Filter by search and tag
  const filtered = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = tag ? (post.tags && post.tags.includes(tag)) : true;
    return matchesSearch && matchesTag;
  });
  // Pagination
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  return { search, setSearch, tag, setTag, page, setPage, totalPages, paginated, filtered };
}

// Simple credentials for admin (in real use, move to env/config)
const ADMIN_USER = 'whitehalfmoon';
const ADMIN_PASS = 'changeme'; // CHANGE THIS!

function Admin() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [success, setSuccess] = useState('');
  const handleLogin = e => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setAuth(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };
  const handlePost = async e => {
    e.preventDefault();
    setSuccess(''); setError('');
    try {
      const res = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: ADMIN_PASS,
          title,
          tags,
          description,
          body
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Post saved!');
        setTitle(''); setTags(''); setDescription(''); setBody('');
      } else {
        setError(data.error || 'Failed to save post');
      }
    } catch (err) {
      setError('Network or server error');
    }
  };
  const handleFile = async e => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const { attributes, body } = parseFrontmatter(text);
      setTitle(attributes.title || '');
      setTags((attributes.tags || []).join(', '));
      setDescription(attributes.description || '');
      setBody(body || '');
    } catch (err) {
      setError('Failed to parse markdown file');
    }
  };
  if (!auth) {
    return (
      <div class="min-h-screen flex flex-col items-center justify-center bg-frost text-graphite">
        <h2 class="text-3xl mb-4 font-pixel text-entropy whisper">Admin Login</h2>
        <form class="glass p-8 rounded flex flex-col gap-4 w-80 border-2 border-entropy" onSubmit={handleLogin}>
          <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="text" placeholder="Username" value={user} onInput={e => setUser(e.target.value)} required aria-label="Username" />
          <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="password" placeholder="Password" value={pass} onInput={e => setPass(e.target.value)} required aria-label="Password" />
          <button class="glass p-2 rounded font-pixel bg-entropy text-beige hover:bg-amber hover:text-graphite border border-entropy hover:glow" type="submit">Login</button>
          {error && <div class="text-entropy font-elegant">{error}</div>}
        </form>
      </div>
    );
  }
  return (
    <div class="min-h-screen flex flex-col items-center bg-frost text-graphite">
      <h2 class="text-3xl mt-8 mb-2 font-pixel text-entropy whisper">Admin Panel</h2>
      <form class="glass p-8 rounded flex flex-col gap-4 w-96 border-2 border-entropy" onSubmit={handlePost}>
        <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="file" accept=".md,.markdown,text/markdown" onChange={handleFile} aria-label="Upload Markdown" />
        <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="text" placeholder="Title" value={title} onInput={e => setTitle(e.target.value)} required aria-label="Title" />
        <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="text" placeholder="Tags (comma separated)" value={tags} onInput={e => setTags(e.target.value)} aria-label="Tags" />
        <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="text" placeholder="Description" value={description} onInput={e => setDescription(e.target.value)} aria-label="Description" />
        <textarea class="p-2 rounded font-pixel border border-graphite focus:border-entropy" placeholder="Body (Markdown)" value={body} onInput={e => setBody(e.target.value)} rows={8} aria-label="Body" />
        <button class="glass p-2 rounded font-pixel bg-entropy text-beige hover:bg-amber hover:text-graphite border border-entropy hover:glow" type="submit">Submit Post</button>
        {success && <div class="text-bytegreen font-elegant">{success}</div>}
        {error && <div class="text-entropy font-elegant">{error}</div>}
      </form>
      <div class="mt-4 font-elegant text-mystic">Upload or paste markdown for posts created elsewhere.</div>
    </div>
  );
}

const Home = () => (
  <div class="min-h-screen parallax-bg noise-bg flex flex-col items-center justify-center bg-frost text-graphite px-4 py-4 sm:px-8 sm:py-8">
    <div class="mb-6 text-center">
      <ConsoleText text="Welcome, Operator. Choose your path in the fractal." />
    </div>
    <h1 class="text-4xl mb-8 font-pixel text-entropy drop-shadow whisper">Conscious System Entry</h1>
    <div class="flex flex-wrap gap-8 justify-center w-full max-w-lg flex-col sm:flex-row">
      <Link href="/blog"><div class="glass nav-animated hover-glow p-8 rounded shadow-glass cursor-pointer hover:scale-105 transition font-elegant border-2 border-mystic flex items-center gap-2">☉ <span>Thought Synthesis</span></div></Link>
      <Link href="/projects"><div class="glass nav-animated p-8 rounded shadow-glass cursor-pointer hover:scale-105 transition font-elegant border-2 border-bytegreen flex items-center gap-2">⌬ <span>Constructs</span></div></Link>
      <Link href="/about"><div class="glass nav-animated p-8 rounded shadow-glass cursor-pointer hover:scale-105 transition font-elegant border-2 border-amber flex items-center gap-2">☾ <span>White Half Moon</span></div></Link>
      <Link href="/contact"><div class="glass nav-animated p-8 rounded shadow-glass cursor-pointer hover:scale-105 transition font-elegant border-2 border-entropy flex items-center gap-2">| <span>Signal Pipe</span></div></Link>
    </div>
    <div class="mt-12 flex justify-center">
      {/* Sacred Geometry SVG: Seed of Life motif */}
      <svg viewBox="0 0 120 120" width="96" height="96" class="mx-auto" style={{ shapeRendering: 'geometricPrecision' }} aria-label="Sacred Geometry Seed of Life">
        <circle cx="60" cy="30" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
        <circle cx="60" cy="90" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
        <circle cx="30" cy="60" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
        <circle cx="90" cy="60" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
        <circle cx="42.4" cy="42.4" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="77.6" cy="42.4" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="42.4" cy="77.6" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="77.6" cy="77.6" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

const Blog = () => {
  const posts = usePosts();
  const { search, setSearch, tag, setTag, page, setPage, totalPages, paginated, filtered } = useSearchAndPagination(posts);
  const allTags = Array.from(new Set(posts.flatMap(p => normalizeTags(p.tags))));
  return (
    <div class="min-h-screen parallax-bg noise-bg flex flex-col items-center bg-beige text-graphite px-4 py-4 sm:px-8 sm:py-8">
      <Reveal>
        <h2 class="section-header text-3xl mt-8 mb-2 font-pixel whisper">Thought Synthesis
          <span class="section-header-underline"></span>
        </h2>
        <p class="mb-6 font-elegant text-mystic">Fragments of thought, synthesized at the edge of code and self.</p>
        <div class="flex gap-2 mb-4 w-full max-w-lg flex-col sm:flex-row">
          <input
            class="flex-1 p-3 rounded font-pixel border border-mystic focus:border-entropy text-base"
            type="text"
            placeholder="Search posts..."
            value={search}
            onInput={e => setSearch(e.target.value)}
            aria-label="Search posts"
          />
          <select
            class="p-3 rounded font-pixel border border-mystic focus:border-entropy text-base"
            value={tag}
            onChange={e => setTag(e.target.value)}
            aria-label="Filter by tag"
          >
            <option value="">All Tags</option>
            {allTags.map(t => (
              <option value={t} key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div class="flex flex-col gap-4 w-full max-w-lg">
          {paginated.length === 0 ? (
            <div class="glass p-6 rounded font-elegant border-2 border-mystic text-center text-mystic">
              No posts found. Try a different tag or search term.
            </div>
          ) : paginated.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div class="glass p-6 rounded cursor-pointer hover:scale-105 transition font-elegant border-2 border-mystic hover:bg-mystic hover:text-beige hover:glow flex flex-col gap-2 w-full">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xl">☉</span>
                  <div class="text-lg font-pixel text-entropy">{post.title}</div>
                  {post.date && <span class="ml-2 text-xs text-mystic font-pixel">{post.date.toLocaleDateString()}</span>}
                  {post.author && <span class="ml-2 text-xs text-bytegreen font-pixel">by {post.author}</span>}
                  {post.readingTime && <span class="ml-2 text-xs text-amber font-pixel">{post.readingTime}</span>}
                </div>
                <div class="text-sm text-graphite">{post.description}</div>
                <div class="flex gap-2 mt-2 flex-wrap">
                  {normalizeTags(post.tags).map(tag => (
                    <span class="px-2 py-0.5 rounded text-xs bg-bytegreen text-beige font-pixel transition hover:bg-amber hover:text-graphite focus:bg-amber focus:text-graphite outline-none" tabIndex="0" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div class="flex gap-2 mt-6 flex-col sm:flex-row items-center">
            <button class="px-4 py-2 rounded font-pixel border border-mystic text-base" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span class="font-pixel">Page {page} of {totalPages}</span>
            <button class="px-4 py-2 rounded font-pixel border border-mystic text-base" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
        <Link href="/" class="mt-8 text-bytegreen font-elegant hover:underline focus:underline transition outline-none">← Back to System Entry</Link>
      </Reveal>
    </div>
  );
};

const BlogPost = () => {
  const [match, params] = useRoute('/blog/:slug');
  const posts = usePosts();
  if (!posts.length) {
    return <div class="min-h-screen flex items-center justify-center bg-beige text-graphite font-elegant">Loading...</div>;
  }
  const post = posts.find(p => p.slug === params.slug);
  if (!post) {
    return <div class="min-h-screen flex items-center justify-center bg-beige text-entropy font-elegant">Not found.</div>;
  }
  return (
    <div class="min-h-screen parallax-bg noise-bg flex flex-col items-center bg-beige text-graphite px-4 py-4 sm:px-8 sm:py-8">
      <h2 class="text-3xl mt-8 mb-4 font-pixel text-mystic whisper">{post.title}</h2>
      <Reveal>
        <div class="mb-2 flex gap-2 flex-wrap">
          {normalizeTags(post.tags).map(tag => (
            <span class="px-2 py-0.5 rounded text-xs bg-bytegreen text-beige font-pixel" key={tag}>{tag}</span>
          ))}
          {post.date && <span class="ml-2 text-xs text-mystic font-pixel">{post.date.toLocaleDateString()}</span>}
          {post.author && <span class="ml-2 text-xs text-bytegreen font-pixel">by {post.author}</span>}
          {post.readingTime && <span class="ml-2 text-xs text-amber font-pixel">{post.readingTime}</span>}
        </div>
        <article class="glass p-6 rounded max-w-xl w-full font-elegant border-2 border-mystic prose prose-invert prose-sm overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        {post.slug === 'neo-pixel-fractal' && (
          <FractalDemo />
        )}
        {post.slug === 'entropy-agents-crypto' && <RewardDemo />}
        {post.slug === 'pixel-systems-design' && <PixelGridDemo />}
        {post.slug === 'agent-garden-architecture' && <AgentGardenDemo />}
        {post.slug === 'white-half-moon' && <FireFunctionDemo />}
        <Link href="/blog" class="mt-8 text-bytegreen font-elegant hover:underline">← Back to Thought Synthesis</Link>
      </Reveal>
    </div>
  );
};

const Projects = () => (
  <div class="min-h-screen parallax-bg noise-bg flex flex-col items-center bg-frost text-graphite px-4 py-4 sm:px-8 sm:py-8">
    <Reveal>
      <h2 class="section-header text-3xl mt-8 mb-2 font-pixel whisper">Constructs
        <span class="section-header-underline"></span>
      </h2>
      <p class="mb-6 font-elegant text-bytegreen">Artifacts and agents, built in the liminal space between logic and myth.</p>
      <div class="flex flex-col gap-4 w-full max-w-lg">
        {projects.map(p => (
          <div class="glass p-6 rounded font-elegant border-2 border-bytegreen flex flex-col sm:flex-row items-center gap-4 w-full" key={p.title}>
            <span class="text-2xl font-pixel">{p.icon}</span>
            <div>
              <div class="font-pixel text-lg text-amber">{p.title}</div>
              <div class="text-sm text-graphite">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/" class="mt-8 text-mystic font-elegant hover:underline">← Back to System Entry</Link>
    </Reveal>
  </div>
);

const About = () => {
  const posts = usePosts();
  const post = posts.find(p => p.slug === 'white-half-moon');
  return (
    <div class="min-h-screen parallax-bg noise-bg flex flex-col items-center bg-beige text-graphite px-4 py-4 sm:px-8 sm:py-8">
      <Reveal>
        <h2 class="section-header text-3xl mt-8 mb-2 font-pixel whisper">{post?.title || 'White Half Moon'}
          <span class="section-header-underline"></span>
        </h2>
        <div class="flex justify-center my-6">
          {/* Sacred Geometry SVG: Seed of Life motif */}
          <svg viewBox="0 0 120 120" width="96" height="96" class="mx-auto" style={{ shapeRendering: 'geometricPrecision' }} aria-label="Sacred Geometry Seed of Life">
            <circle cx="60" cy="30" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
            <circle cx="60" cy="90" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
            <circle cx="30" cy="60" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
            <circle cx="90" cy="60" r="28" fill="none" stroke="#0f4c5c" strokeWidth="2" />
            <circle cx="42.4" cy="42.4" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="77.6" cy="42.4" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="42.4" cy="77.6" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="77.6" cy="77.6" r="28" fill="none" stroke="#fbbf24" strokeWidth="2" />
          </svg>
        </div>
        {post && (
          <article class="glass p-6 rounded max-w-xl w-full font-elegant border-2 border-mystic prose prose-invert prose-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        )}
      </Reveal>
    </div>
  );
};

const Contact = () => {
  const [sent, setSent] = useState(false);
  return (
    <div class="min-h-screen parallax-bg noise-bg flex flex-col items-center justify-center bg-frost text-graphite px-4 py-4 sm:px-8 sm:py-8">
      <Reveal>
        <h2 class="section-header text-3xl mb-4 font-pixel whisper">Signal Pipe
          <span class="section-header-underline"></span>
        </h2>
        <div class="mb-4 font-elegant text-entropy">Transmit your signal. Only trusted frequencies are received.</div>
        {sent ? (
          <div class="glass p-6 rounded border-2 border-entropy text-entropy font-elegant mb-6">Signal received. Await further resonance.</div>
        ) : (
          <form class="glass p-8 rounded flex flex-col gap-4 w-full max-w-xs border-2 border-entropy" onSubmit={e => { e.preventDefault(); setSent(true); }} aria-label="Contact form">
            <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="text" placeholder="Name (or Symbol)" required aria-label="Name or Symbol" />
            <input class="p-2 rounded font-pixel border border-graphite focus:border-entropy" type="email" placeholder="Signal Address (Email)" required aria-label="Email address" />
            <textarea class="p-2 rounded font-pixel border border-graphite focus:border-entropy" placeholder="Message (Encrypted)" required aria-label="Message"></textarea>
            <button class="glass p-2 rounded font-pixel hover:scale-105 transition bg-entropy text-beige hover:bg-amber hover:text-graphite border border-entropy hover:glow" type="submit" aria-label="Send message">Transmit</button>
          </form>
        )}
        <Link href="/" class="mt-8 text-mystic font-elegant hover:underline">← Back to System Entry</Link>
      </Reveal>
    </div>
  );
};

// NotFound component for unknown routes
const NotFound = () => (
  <div class="min-h-screen flex flex-col items-center justify-center bg-beige text-entropy font-elegant px-4 py-4 sm:px-8 sm:py-8 text-center">
    <h2 class="section-header text-4xl font-pixel mb-4">404: Lost in the Fractal
      <span class="section-header-underline"></span>
    </h2>
    <p class="mb-6">This path leads nowhere. Return to the <Link href="/">system entry</Link>.</p>
  </div>
);

const App = () => (
  <Router>
    <Route path="/" component={Home} />
    <Route path="/blog" component={Blog} />
    <Route path="/blog/:slug" component={BlogPost} />
    <Route path="/projects" component={Projects} />
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
    <Route path="/admin" component={Admin} />
    <Route component={NotFound} />
  </Router>
);

render(<App />, document.getElementById('app'));

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
  if (typeof tags === 'object') return Object.values(tags).map(String);
  return [String(tags)];
}

function FractalBox({ depth, color, size, pulseSpeed }) {
  if (depth === 0) return <div className="pixel-box" style={{ borderColor: color, width: size, height: size, animationDuration: pulseSpeed + 's' }} />;
  return (
    <div className="pixel-box pulse" style={{ borderColor: color, width: size, height: size, animationDuration: pulseSpeed + 's' }}>
      <FractalBox depth={depth - 1} color={color} size={size} pulseSpeed={pulseSpeed} />
    </div>
  );
}

function FractalDemo() {
  const [depth, setDepth] = useState(5);
  const [size, setSize] = useState(40);
  const [hue, setHue] = useState(260);
  const [entropy, setEntropy] = useState(0);
  // Animate color shift and entropy
  useEffect(() => {
    const interval = setInterval(() => {
      // Entropy increases color randomness and pulse speed
      setHue(h => (h + 2 + Math.floor(Math.random() * entropy)) % 360);
    }, 60);
    return () => clearInterval(interval);
  }, [entropy]);
  // Pulse speed: lower is faster, min 0.3s, max 2s
  const pulseSpeed = 1.2 - entropy * 0.09;
  const color = `hsl(${hue}, 70%, 60%)`;
  return (
    <div class="my-8 flex flex-col items-center">
      <h3 class="font-pixel text-mystic mb-2">Live Fractal Example</h3>
      <label class="mb-2 font-pixel text-xs text-mystic">
        Depth: <input type="range" min="1" max="10" value={depth} onInput={e => setDepth(Number(e.target.value))} /> {depth}
      </label>
      <label class="mb-2 font-pixel text-xs text-mystic">
        Box Size: <input type="range" min="20" max="100" value={size} onInput={e => setSize(Number(e.target.value))} /> {size}px
      </label>
      <label class="mb-4 font-pixel text-xs text-mystic">
        Entropy: <input type="range" min="0" max="10" value={entropy} onInput={e => setEntropy(Number(e.target.value))} /> {entropy}
      </label>
      <FractalBox depth={depth} color={color} size={size} pulseSpeed={Math.max(0.3, pulseSpeed)} />
    </div>
  );
}

function RewardDemo() {
  const [entropy, setEntropy] = useState(0.0);
  const [base, setBase] = useState(1.0);
  const reward = base + entropy * 0.42;
  return (
    <div class="my-8 flex flex-col items-center">
      <h3 class="font-pixel text-mystic mb-2">Live Reward Function Demo</h3>
      <label class="mb-2 font-pixel text-xs text-mystic">
        Entropy: <input type="range" min="0" max="10" step="0.01" value={entropy} onInput={e => setEntropy(Number(e.target.value))} /> {entropy.toFixed(2)}
      </label>
      <label class="mb-4 font-pixel text-xs text-mystic">
        Base Reward: <input type="range" min="-5" max="5" step="0.01" value={base} onInput={e => setBase(Number(e.target.value))} /> {base.toFixed(2)}
      </label>
      <div class="flex flex-col items-center">
        <div class="font-pixel text-amber text-lg mb-1">Reward: {reward.toFixed(2)}</div>
        <div style={{ width: '200px', height: '18px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.max(0, Math.min(1, reward/10))*100}%`, height: '100%', background: '#fbbf24', transition: 'width 0.2s' }} />
        </div>
      </div>
    </div>
  );
}

function PixelGridDemo() {
  const [cols, setCols] = useState(8);
  const [rows, setRows] = useState(8);
  const [gap, setGap] = useState(2);
  const [color, setColor] = useState('#7755aa');
  const defaultColor = '#f5f0e6';
  const [pixels, setPixels] = useState(Array(cols * rows).fill(false));
  // Reset grid when size changes
  useEffect(() => {
    setPixels(Array(cols * rows).fill(false));
  }, [cols, rows]);
  const handlePixel = idx => {
    setPixels(pixels => {
      const next = pixels.slice();
      next[idx] = !next[idx];
      return next;
    });
  };
  return (
    <div class="my-8 flex flex-col items-center">
      <h3 class="font-pixel text-mystic mb-2">Live Pixel Grid Demo</h3>
      <div class="flex gap-4 mb-4">
        <label class="font-pixel text-xs text-mystic">Cols: <input type="range" min="2" max="16" value={cols} onInput={e => setCols(Number(e.target.value))} /> {cols}</label>
        <label class="font-pixel text-xs text-mystic">Rows: <input type="range" min="2" max="16" value={rows} onInput={e => setRows(Number(e.target.value))} /> {rows}</label>
        <label class="font-pixel text-xs text-mystic">Gap: <input type="range" min="0" max="12" value={gap} onInput={e => setGap(Number(e.target.value))} /> {gap}px</label>
        <label class="font-pixel text-xs text-mystic">Color: <input type="color" value={color} onInput={e => setColor(e.target.value)} /></label>
      </div>
      <div class="pixel-grid-demo" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`,
        background: '#f5f0e6',
        border: '2px solid #c8e0f4',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 0 8px 2px #c8e0f433',
        marginBottom: '1rem',
        width: `${cols * 24 + (cols - 1) * gap + 16}px`,
        maxWidth: '100%',
        overflow: 'auto',
      }}>
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div
            key={i}
            onClick={() => handlePixel(i)}
            style={{
              width: '24px',
              height: '24px',
              background: pixels[i] ? color : defaultColor,
              borderRadius: '4px',
              boxShadow: '0 0 2px #3332',
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            title={`Pixel ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function AgentGardenDemo() {
  const [agents, setAgents] = useState([{ x: 180, y: 120, id: 0, parent: null }]);
  const nextId = useRef(1);
  const width = 360, height = 240;
  function bloom() {
    setAgents(agents => {
      const parent = agents[Math.floor(Math.random() * agents.length)];
      // Place new agent near parent, with some randomness
      const angle = Math.random() * 2 * Math.PI;
      const dist = 40 + Math.random() * 30;
      const x = Math.max(24, Math.min(width - 24, parent.x + Math.cos(angle) * dist));
      const y = Math.max(24, Math.min(height - 24, parent.y + Math.sin(angle) * dist));
      return [...agents, { x, y, id: nextId.current++, parent: parent.id }];
    });
  }
  return (
    <div class="my-8 flex flex-col items-center">
      <h3 class="font-pixel text-mystic mb-2">Live Agent Garden Demo</h3>
      <button class="mb-4 px-4 py-2 rounded font-pixel bg-bytegreen text-beige hover:bg-amber hover:text-graphite border border-bytegreen hover:glow hover-glow transition" onClick={bloom}>Bloom</button>
      <svg width={width} height={height} style={{ background: '#f5f0e6', borderRadius: '16px', boxShadow: '0 0 8px #c8e0f433' }}>
        {/* Draw connections */}
        {agents.map(agent => agent.parent !== null && (
          <line key={agent.id + '-line'} x1={agent.x} y1={agent.y} x2={agents.find(a => a.id === agent.parent).x} y2={agents.find(a => a.id === agent.parent).y} stroke="#7755aa" strokeWidth="2" />
        ))}
        {/* Draw agents */}
        {agents.map(agent => (
          <circle key={agent.id} cx={agent.x} cy={agent.y} r="16" fill="#fff" stroke="#7755aa" strokeWidth="3" />
        ))}
        {/* Animate new agent */}
        {agents.length > 1 && (
          <circle cx={agents[agents.length-1].x} cy={agents[agents.length-1].y} r="20" fill="#fbbf24" opacity="0.3">
            <animate attributeName="r" from="20" to="16" dur="0.5s" fill="freeze" />
            <animate attributeName="opacity" from="0.3" to="0" dur="0.5s" fill="freeze" />
          </circle>
        )}
      </svg>
      <div class="mt-2 font-pixel text-xs text-mystic">Agents: {agents.length}</div>
    </div>
  );
}

function Reveal({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal${visible ? ' reveal-visible' : ''}`}>{children}</div>
  );
}

// Add global click handler for codespan copy
useEffect(() => {
  function handleCopy(e) {
    const target = e.target.closest('.has-tooltip');
    if (target && target.querySelector('.tooltip')) {
      const code = target.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent);
        target.querySelector('.tooltip').textContent = 'Copied!';
        setTimeout(() => {
          target.querySelector('.tooltip').textContent = 'Copy';
        }, 1200);
      }
    }
  }
  document.addEventListener('click', handleCopy);
  return () => document.removeEventListener('click', handleCopy);
}, []);

// Add FireFunctionDemo component
function FireFunctionDemo() {
  const [identity, setIdentity] = useState('White Half Moon');
  return (
    <div className="my-8 flex flex-col items-center">
      <h3 className="font-pixel text-mystic mb-2">Live Fire Function Demo</h3>
      <label className="mb-2 font-pixel text-xs text-mystic">
        Identity:
        <input
          type="text"
          className="ml-2 p-2 rounded font-pixel border border-entropy focus:border-mystic text-base w-48 max-w-full"
          value={identity}
          onInput={e => setIdentity(e.target.value)}
          placeholder="Enter your identity"
          aria-label="Identity"
        />
      </label>
      <div className="mt-4 font-pixel text-lg text-amber bg-frost px-4 py-2 rounded border border-mystic">
        {identity ? `${identity} burns with purpose.` : '...'}
      </div>
    </div>
  );
}

