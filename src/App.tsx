import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Onboarding } from './components/Onboarding'
import { CallView } from './components/CallView'
import { FeedbackDashboard } from './components/FeedbackDashboard'
import { VibeProvider } from './context/VibeContext'
import PracticeRoom from './pages/PracticeRoom'
import { RadarReport } from './components/RadarReport'

function App() {
  return (
    <VibeProvider>
      <Router>
        <div className="app-container">
          {/* Background Blobs for Premium Feel */}
          <div className="bg-blobs">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>

          <main className="flex-1 flex flex-col items-center justify-center p-4 w-full h-full relative z-10">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/call" element={<CallView />} />
              <Route path="/practice" element={<PracticeRoom />} />
              <Route path="/feedback" element={<FeedbackDashboard />} />
              <Route path="/results" element={<RadarReport />} />
            </Routes>
          </main>
        </div>
      </Router>
    </VibeProvider>
  )
}

export default App
