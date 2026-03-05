import { useState, useMemo } from 'react'
import { RiTimeLine, RiEyeLine, RiBookmarkLine, RiArrowRightSLine, RiChat3Line, RiExternalLinkLine, RiBookOpenLine } from '@remixicon/react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { TabGroup } from '@/components/ui/TabGroup'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

const categories = ['All Articles', 'Pre-Application', 'Application', 'Interviews', 'Negotiations']

interface Article {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  views: string
  date: string
  url: string
  comments?: string
  featured?: boolean
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Building Proof of Work: The Key to Breaking into Web3',
    description: 'Learn how to build a strong portfolio of proof of work that demonstrates your skills and commitment to the Solana ecosystem.',
    category: 'Pre-Application',
    readTime: '5 min',
    views: '2.4k',
    date: 'Jan 15, 2026',
    url: 'https://talent.superteam.fun/blog/building-proof-of-work',
    featured: true,
  },
  {
    id: '2',
    title: 'Growing Your Twitter Audience in Web3',
    description: 'Strategies for building your personal brand and growing your audience on Twitter/X within the Web3 and Solana community.',
    category: 'Pre-Application',
    readTime: '6 min',
    views: '1.8k',
    date: 'Jan 12, 2026',
    url: 'https://talent.superteam.fun/blog/growing-twitter-audience',
    comments: '12',
  },
  {
    id: '3',
    title: 'Building a Career as a Blockchain Developer',
    description: 'A comprehensive guide to starting and advancing your career as a blockchain developer in the Solana ecosystem.',
    category: 'Pre-Application',
    readTime: '8 min',
    views: '3.1k',
    date: 'Jan 10, 2026',
    url: 'https://talent.superteam.fun/blog/blockchain-developer-career',
    comments: '8',
  },
  {
    id: '4',
    title: 'Writing a Great CV: A Guide to Standing Out',
    description: 'Learn how to craft a compelling CV that highlights your Web3 experience and catches the attention of top Solana employers.',
    category: 'Application',
    readTime: '5 min',
    views: '4.2k',
    date: 'Jan 8, 2026',
    url: 'https://talent.superteam.fun/blog/great-cv-guide',
    comments: '15',
  },
  {
    id: '5',
    title: 'GitHub for Job-Seeking Developers',
    description: 'How to optimize your GitHub profile and repositories to showcase your development skills to potential employers.',
    category: 'Application',
    readTime: '4 min',
    views: '2.1k',
    date: 'Jan 5, 2026',
    url: 'https://talent.superteam.fun/blog/github-for-developers',
    comments: '6',
  },
  {
    id: '6',
    title: 'How to Prepare for Interviews',
    description: 'Essential tips and strategies for preparing for technical and behavioral interviews at top Solana companies.',
    category: 'Interviews',
    readTime: '7 min',
    views: '5.7k',
    date: 'Jan 3, 2026',
    url: 'https://talent.superteam.fun/blog/interview-preparation',
    comments: '20',
  },
  {
    id: '7',
    title: '30 Interview Questions to Ask',
    description: 'A curated list of thoughtful questions to ask during your interviews that demonstrate your interest and preparation.',
    category: 'Interviews',
    readTime: '6 min',
    views: '3.5k',
    date: 'Dec 28, 2025',
    url: 'https://talent.superteam.fun/blog/interview-questions',
    comments: '9',
  },
  {
    id: '8',
    title: 'Acing the Machine Coding Interview',
    description: 'Master the machine coding round with practical tips on problem-solving, time management, and code quality.',
    category: 'Interviews',
    readTime: '10 min',
    views: '2.9k',
    date: 'Dec 22, 2025',
    url: 'https://talent.superteam.fun/blog/machine-coding-interview',
    comments: '11',
  },
  {
    id: '9',
    title: 'The 10 Commandments of Salary Negotiation',
    description: 'Proven negotiation strategies to help you secure the best compensation package for your Web3 role.',
    category: 'Negotiations',
    readTime: '5 min',
    views: '4.8k',
    date: 'Dec 18, 2025',
    url: 'https://talent.superteam.fun/blog/salary-negotiation',
    comments: '14',
  },
  {
    id: '10',
    title: 'Web3 Salary Guide: Understanding Compensation',
    description: 'A comprehensive breakdown of salary ranges, benefits, and compensation structures across Web3 and Solana roles.',
    category: 'Negotiations',
    readTime: '8 min',
    views: '6.2k',
    date: 'Dec 15, 2025',
    url: 'https://talent.superteam.fun/blog/web3-salary-guide',
    comments: '18',
  },
  {
    id: '11',
    title: 'Understanding Token Compensation in Web3',
    description: 'Navigate the complexities of token-based compensation including vesting schedules, cliff periods, and tax implications.',
    category: 'Negotiations',
    readTime: '7 min',
    views: '3.3k',
    date: 'Dec 10, 2025',
    url: 'https://talent.superteam.fun/blog/token-compensation',
    comments: '7',
  },
]

export default function JobPlaybookPage() {
  const { user } = useAuth()
  const [activeCategory, setActiveCategory] = useState('All Articles')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set())

  const featured = mockArticles.find(a => a.featured)

  const filteredArticles = useMemo(() => {
    return mockArticles.filter(a => {
      if (a.featured) return false
      if (activeCategory !== 'All Articles' && a.category !== activeCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q) && !a.category.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [activeCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Articles': mockArticles.filter(a => !a.featured).length }
    categories.forEach(cat => {
      if (cat !== 'All Articles') {
        counts[cat] = mockArticles.filter(a => a.category === cat && !a.featured).length
      }
    })
    return counts
  }, [])

  const categoryTabs = categories.map(cat => ({
    label: `${cat} (${categoryCounts[cat] || 0})`,
    value: cat,
  }))

  const toggleSave = (id: string) => {
    setSavedArticles(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <PageShell user={user}>
      <div className="flex flex-col gap-4 px-4 md:px-8">
        {/* Title + Search row */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-medium text-text-primary tracking-[-0.36px]">Solana Playbook</h1>
            <p className="text-[13px] text-text-secondary tracking-[-0.078px] leading-[1.54] max-w-[540px]">
              Resources for your application and interview process, from CV creation to salary negotiations.
            </p>
          </div>
          <SearchInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Search articles..." className="w-full lg:w-[300px]" />
        </div>

        {/* Featured Article */}
        {featured && !searchQuery && activeCategory === 'All Articles' && (
          <div
            onClick={() => openArticle(featured.url)}
            className="flex flex-col md:flex-row gap-6 border-l-2 border-r-2 border-brand p-4 md:p-6 cursor-pointer hover:bg-bg-card/50 transition-colors"
          >
            <div className="flex flex-col gap-3 flex-1">
              <Badge variant="brand" className="self-start">{featured.category}</Badge>
              <h2 className="text-xl font-medium text-text-primary leading-tight">{featured.title}</h2>
              <p className="text-[13px] text-text-secondary leading-[1.54]">{featured.description}</p>
              <div className="flex items-center gap-4 mt-auto">
                <Button size="sm">
                  Read Article
                  <RiArrowRightSLine size={14} />
                </Button>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <RiTimeLine size={12} /> {featured.readTime}
                </span>
              </div>
            </div>
            <div className="w-full md:w-[356px] h-[200px] bg-bg-secondary shrink-0 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-brand/20 via-bg-card to-brand/10" />
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <TabGroup tabs={categoryTabs} activeTab={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Article Grid */}
      <div className="px-4 md:px-8 pb-8">
        {filteredArticles.length === 0 ? (
          <EmptyState icon={RiBookOpenLine} message="No articles match your search" actionLabel="Reset Filters" onAction={() => { setSearchQuery(''); setActiveCategory('All Articles') }} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map(article => (
              <div
                key={article.id}
                onClick={() => openArticle(article.url)}
                className="bg-bg-elevated flex flex-col cursor-pointer border border-border hover:bg-bg-card hover:border-text-muted/30 transition-all duration-150 group"
              >
                <div className="bg-bg-secondary p-4 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">{article.category}</Badge>
                    <div className="flex items-center gap-1">
                      <RiExternalLinkLine size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }} className={cn(savedArticles.has(article.id) ? 'text-brand' : 'text-text-muted')}>
                        <RiBookmarkLine size={16} />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-text-primary leading-snug">{article.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{article.description}</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-text-secondary flex-wrap">
                  <span className="flex items-center gap-1"><RiTimeLine size={12} /> {article.readTime}</span>
                  <span className="flex items-center gap-1"><RiEyeLine size={12} /> {article.views}</span>
                  {article.comments && (
                    <span className="flex items-center gap-1"><RiChat3Line size={12} /> {article.comments}</span>
                  )}
                  <span className="ml-auto">{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
