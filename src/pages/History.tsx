import HistoryPage from '../components/history/index'
import MainLayout from '../components/layout/MainLayout'
import AboutSection from '../components/sections/AboutSection'
import CommitmentSection from '../components/sections/CommitmentSection'

function History() {
  return (
    <MainLayout>
      <HistoryPage />
      <AboutSection />
      <CommitmentSection />
    </MainLayout>
  )
}

export default History