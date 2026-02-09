import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";

// CSS-in-JS styles object
const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f9fafb',
    backgroundImage: "url('/image.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    marginBottom: '24px',
    color: '#111827',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6'
  },
  idBadge: {
    fontSize: '14px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '6px 12px',
    borderRadius: '20px',
    fontFamily: "'Monaco', 'Menlo', monospace",
    marginBottom: '20px',
    display: 'inline-block'
  },
  dataGrid: {
    display: 'grid',
    gap: '16px'
  },
  dataItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  dataItemHover: {
    backgroundColor: '#f3f4f6',
    transform: 'translateY(-1px)'
  },
  dataLabel: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  dataValue: {
    fontSize: '16px',
    color: '#111827',
    fontWeight: '500'
  },
  dataValuePending: {
    color: '#f59e0b',
    fontWeight: '600'
  },
  dataValueResponded: {
    color: '#10b981',
    fontWeight: '600'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(156, 163, 175, 0.2)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    padding: '12px 16px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '14px'
  },
  copyButton: {
    marginTop: '24px',
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  copyButtonHover: {
    backgroundColor: '#2563eb'
  },
  timestamp: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
    fontStyle: 'italic'
  },
  successMessage: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
    animation: 'slideIn 0.3s ease-out',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  successMessageClose: {
    cursor: 'pointer',
    marginLeft: '8px',
    fontSize: '18px',
    fontWeight: 'bold'
  }
};

// Animation keyframes
const keyframes = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

// Add keyframes to document head
const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString || dateString === "Pending") return "Pending";
  
  try {
    const date = new Date(dateString);
    
    // Format as: "February 14, 2024 at 3:30 PM"
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleString('en-US', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original if formatting fails
  }
};

// Alternative simpler format: "Feb 14, 2024 3:30 PM"
const formatDateSimple = (dateString) => {
  if (!dateString || dateString === "Pending") return "Pending";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateString;
  }
};

// Format as relative time: "2 hours ago", "Yesterday", etc.
const formatRelativeTime = (dateString) => {
  if (!dateString || dateString === "Pending") return "Pending";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    // For older dates, use the simple format
    return formatDateSimple(dateString);
  } catch (error) {
    return dateString;
  }
};

export default function Dashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [dateFormat, setDateFormat] = useState('full'); // 'full', 'simple', or 'relative'
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Added this missing state

  useEffect(() => {
    API.get(`/valentine/dashboard/${id}`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard data. Please check the URL and try again.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const generateValentineLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/val/${id}`;
  };

  const copyToClipboard = async () => {
    const valentineLink = generateValentineLink();
    
    try {
      await navigator.clipboard.writeText(valentineLink);
      setSuccessMessage("✅ Valentine link copied to clipboard!");
      setShowSuccess(true);
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setSuccessMessage("❌ Failed to copy. Please try again.");
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const getFormattedDate = () => {
    if (!data?.respondedAt || data.respondedAt === "Pending") return "Pending";
    
    switch (dateFormat) {
      case 'simple':
        return formatDateSimple(data.respondedAt);
      case 'relative':
        return formatRelativeTime(data.respondedAt);
      case 'full':
      default:
        return formatDate(data.respondedAt);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccess(false);
  };

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const hasResponded = data?.respondedAt && data.respondedAt !== "Pending";

  return (
    <div style={styles.container}>
      {showSuccess && (
        <div 
          style={{
            ...styles.successMessage,
            animation: showSuccess ? 'slideIn 0.3s ease-out' : 'slideOut 0.3s ease-out'
          }}
        >
          <span>{successMessage}</span>
          <span 
            style={styles.successMessageClose}
            onClick={handleCloseSuccessMessage}
          >
            ×
          </span>
        </div>
      )}
      
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h1 style={styles.title}>Valentine Dashboard</h1>
          <div style={styles.idBadge}>
            ID: {id}
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {data && (
          <>
            <div style={styles.dataGrid}>
              <div 
                style={{
                  ...styles.dataItem,
                  ...(isHovering ? styles.dataItemHover : {})
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span style={styles.dataLabel}>Status</span>
                <span style={{
                  ...styles.dataValue,
                  ...(hasResponded ? styles.dataValueResponded : styles.dataValuePending)
                }}>
                  {data.response || "No response yet"}
                </span>
              </div>

              <div style={styles.dataItem}>
                <span style={styles.dataLabel}>Responded At</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.dataValue}>
                    {getFormattedDate()}
                  </div>
                  {hasResponded && (
                    <div style={styles.timestamp}>
                      {dateFormat !== 'relative' && (
                        <span 
                          onClick={() => setDateFormat(dateFormat === 'full' ? 'simple' : 'relative')}
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {dateFormat === 'full' ? 'Show relative time' : 'Show full date'}
                        </span>
                      )}
                      {dateFormat === 'relative' && (
                        <span 
                          onClick={() => setDateFormat('full')}
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Show exact date
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {data.senderName && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>From</span>
                  <span style={styles.dataValue}>
                    {data.senderName}
                  </span>
                </div>
              )}

              {data.receiverName && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>To</span>
                  <span style={styles.dataValue}>
                    {data.receiverName}
                  </span>
                </div>
              )}

              {data.theme && (
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Theme</span>
                  <span style={styles.dataValue}>
                    {data.theme}
                  </span>
                </div>
              )}

              {data.message && (
                <div style={{ ...styles.dataItem, flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={styles.dataLabel}>Message</span>
                  <span style={{ ...styles.dataValue, fontStyle: 'italic' }}>
                    "{data.message}"
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={copyToClipboard}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                ...styles.copyButton,
                ...(isHovering ? styles.copyButtonHover : {})
              }}
            >
              <span>📋</span>
              Copy Valentine Link
            </button>
            
            {/* Optional: Show the link for reference */}
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
              Link: {generateValentineLink()}
            </div>
          </>
        )}

        {!data && !error && (
          <div style={styles.error}>
            No data found for this Valentine. It may have expired or been deleted.
          </div>
        )}
      </div>
    </div>
  );
}