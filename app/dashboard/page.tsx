import ProjectList from '@/components/custom/dashboard/ProjectList'
import WelcomeBanner from '@/components/custom/dashboard/WelcomeBanner'

function DashboardPage() {
  return (
    <div>
      {/* {Welcome Page} */}
      <WelcomeBanner/>

      {/* Project List */}
      <ProjectList/>
    </div>
  )
}

export default DashboardPage