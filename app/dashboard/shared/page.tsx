import ProjectList from '@/components/custom/dashboard/ProjectList'

function SharedPage() {
  return (
    <div>
      {/* Boards with a view-only link: Copy link / Stop sharing */}
      <ProjectList view="shared" />
    </div>
  )
}

export default SharedPage
