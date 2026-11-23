import ProjectList from '@/components/custom/dashboard/ProjectList'

function ArchivePage() {
  return (
    <div>
      {/* Same list as the dashboard, but archived boards with a Restore button */}
      <ProjectList view="archived" />
    </div>
  )
}

export default ArchivePage
