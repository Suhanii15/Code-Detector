const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const rand = (min, max) => Math.round(Math.random() * (max - min) + min)
const randf = (min, max) => +(Math.random() * (max - min) + min).toFixed(3)

const riskScore = () => randf(0.05, 0.95)

const riskLevel = (score) => {
  if (score >= 0.7) return 'high'
  if (score >= 0.4) return 'medium'
  return 'low'
}

const authors = ['alice', 'bob', 'carol', 'dan', 'eve', 'frank', 'grace']
const files = [
  'src/components/App.tsx',
  'src/components/Navbar.tsx',
  'src/components/Sidebar.tsx',
  'src/components/Footer.tsx',
  'src/components/Modal.tsx',
  'src/components/Dropdown.tsx',
  'src/hooks/useAuth.ts',
  'src/hooks/useFetch.ts',
  'src/hooks/useDebounce.ts',
  'src/hooks/useLocalStorage.ts',
  'src/utils/helpers.ts',
  'src/utils/validators.ts',
  'src/utils/formatters.ts',
  'src/utils/constants.ts',
  'src/pages/Home.tsx',
  'src/pages/About.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Profile.tsx',
  'src/services/api.ts',
  'src/services/auth.ts',
  'src/services/analytics.ts',
  'src/styles/globals.css',
  'src/styles/variables.css',
  'src/store/index.ts',
  'src/store/userSlice.ts',
  'src/store/configSlice.ts',
  'src/types/index.ts',
  'src/types/user.ts',
  'src/types/api.ts',
  'tests/App.test.tsx',
  'tests/hooks.test.ts',
  'tests/utils.test.ts',
  'config/webpack.js',
  'config/babel.js',
  'config/jest.js',
  'scripts/deploy.sh',
  'scripts/build.js',
  'api/routes/users.js',
  'api/routes/auth.js',
  'api/middleware.js',
  'api/models/User.js',
  'lib/logger.js',
  'lib/cache.js',
  'lib/database.js',
  'docs/api.md',
  'docs/usage.md',
  'docker/Dockerfile',
]

export function generateMockResult(owner, repo) {
  const fileResults = files.map((path) => {
    const score = riskScore()
    return {
      path,
      loc: rand(50, 1200),
      churn_rate: rand(1, 45),
      bug_fix_pct: randf(0, 0.4),
      comment_density: randf(0.02, 0.35),
      unique_authors: rand(1, 7),
      complexity: rand(5, 80),
      riskScore: score,
      riskLevel: riskLevel(score),
    }
  })

  const stats = {
    total: fileResults.length,
    high: fileResults.filter((f) => f.riskLevel === 'high').length,
    medium: fileResults.filter((f) => f.riskLevel === 'medium').length,
    low: fileResults.filter((f) => f.riskLevel === 'low').length,
  }

  return {
    owner,
    repo,
    analyzedAt: new Date().toISOString(),
    totalFiles: fileResults.length,
    stars: rand(50, 15000),
    forks: rand(10, 3000),
    stats,
    files: fileResults,
  }
}
