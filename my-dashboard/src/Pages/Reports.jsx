import "../styles/Reports.css"
import { useEffect } from "react"

export default function Reports() {
  useEffect(() => {
    document.title = "AeroInsight | Reports"
  }, [])

  return (
    <div className="reports-page">
      <div className="heading-section">
        <h1>Reports</h1>
        <p>Generate and export detailed aviation analytics reports.</p>
      </div>
      
      <div className="reports-placeholder">
        <span>📊</span>
        <p>Reports dashboard coming soon.</p>
      </div>
    </div>
  )
}