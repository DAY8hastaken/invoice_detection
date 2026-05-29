"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Card from "../components/Card";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const handleFiles = (fileList) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    
    if (newFiles.length > 0) {
      const filesWithPreview = newFiles.map(f => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              file: f,
              preview: e.target.result,
              id: Math.random(),
            });
          };
          reader.readAsDataURL(f);
        });
      });
      
      Promise.all(filesWithPreview).then(newFilesWithPreviews => {
        setFiles(prev => [...prev, ...newFilesWithPreviews]);
      });
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
  };

  const generateMockReceipt = (fileName, index) => {
    const merchants = ["Whole Foods Market", "Target", "Walmart", "Best Buy", "Trader Joe's", "Costco"];
    const categories = ["Groceries", "Electronics", "Clothing", "Home & Garden", "Pharmacy", "Beauty"];
    const locations = ["San Francisco, CA", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Boston, MA", "Seattle, WA"];
    
    const merchant = merchants[index % merchants.length];
    const category = categories[index % categories.length];
    const location = locations[index % locations.length];
    const amount = Math.round((Math.random() * 200 + 20) * 100) / 100;
    const tax = Math.round(amount * 0.08 * 100) / 100;
    
    return {
      id: Math.random(),
      merchant,
      amount,
      currency: "USD",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      category,
      tax,
      payment: `Visa ····${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      location,
      confidence: Math.round((Math.random() * 8 + 92) * 10) / 10,
      fileName,
      items: [
        { name: "Item 01", price: Math.round(Math.random() * 50 * 100) / 100 },
        { name: "Item 02", price: Math.round(Math.random() * 30 * 100) / 100 },
        { name: "Item 03", price: Math.round(Math.random() * 40 * 100) / 100 },
        { name: `Other items ×${Math.floor(Math.random() * 8 + 2)}`, price: Math.round((amount - 15) * 100) / 100 },
      ],
    };
  };

  const process = async () => {
    if (files.length === 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2400));
    
    // Generate mock receipt data for each file
    const receipts = files.map((f, idx) => generateMockReceipt(f.file.name, idx));
    
    // Store receipts in localStorage
    localStorage.setItem("processedReceipts", JSON.stringify(receipts));
    
    setLoading(false);
    // Redirect to result page to display extracted receipt data
    router.push("/result");
  };

  if (done) {
    return (
      <div style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 28px",
      }}>
        <div style={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
          <div style={{
            fontSize: 72,
            marginBottom: 24,
            animation: "bounce 0.6s ease-in-out",
          }}>
            ✅
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 12,
            background: "linear-gradient(135deg, var(--purple), var(--blue))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {files.length} Receipt{files.length > 1 ? 's' : ''} Processed!
          </div>
          <div style={{
            fontSize: 16,
            color: "var(--text2)",
            marginBottom: 32,
            lineHeight: 1.8,
          }}>
            All receipts have been successfully extracted and saved to your history.
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}>
            {[
              { label: "Processed", value: files.length },
              { label: "Status", value: "Complete" },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: "16px 20px",
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--purple)" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              className="btn-primary"
              onClick={() => reset()}
              style={{
                padding: "14px 32px",
                fontSize: 15,
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              Upload More
            </button>
            <button
              className="btn-ghost"
              style={{
                padding: "14px 32px",
                fontSize: 15,
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 28px",
    }}>
      <div style={{ width: "100%", maxWidth: 750 }}>

        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            padding: "8px 14px",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--purple)",
            marginBottom: 16,
            letterSpacing: "0.05em",
          }}>
            📸 RECEIPT UPLOAD
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 12,
            background: "linear-gradient(135deg, var(--text), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Upload Your Receipts
          </h1>
          <p style={{
            fontSize: 15,
            color: "var(--text2)",
            lineHeight: 1.6,
            maxWidth: 500,
            margin: "0 auto",
          }}>
            Add one or multiple receipts to process them all at once and extract all the details automatically.
          </p>
        </div>

        {/* Upload Card */}
        <Card style={{ marginBottom: 32, overflow: "hidden" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.02), rgba(37,99,235,0.02))",
            padding: 20,
          }}>
            <div
              style={{
                border: `2px dashed ${dragging ? "var(--purple)" : "var(--border2)"}`,
                borderRadius: 20,
                padding: "56px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                cursor: "pointer",
                textAlign: "center",
                background: dragging ? "rgba(124,58,237,0.06)" : "transparent",
                transition: "all 0.3s ease",
              }}
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: dragging 
                  ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.15))"
                  : "linear-gradient(135deg, var(--purple), var(--blue))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                transition: "all 0.3s ease",
                transform: dragging ? "scale(1.1)" : "scale(1)",
                opacity: dragging ? 0.9 : 1,
              }}>
                {dragging ? "⬇️" : "📸"}
              </div>
              <div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "var(--text)",
                }}>
                  {dragging ? "Drop your receipts here" : "Drag & drop your receipts"}
                </div>
                <div style={{
                  fontSize: 14,
                  color: "var(--text2)",
                  lineHeight: 1.6,
                }}>
                  or{" "}
                  <span style={{
                    color: "var(--purple)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}>
                    click to browse
                  </span><br />
                  <span style={{ fontSize: 12, marginTop: 4, display: "inline-block" }}>
                    PNG, JPG, WEBP • Up to 10MB each
                  </span>
                </div>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </Card>

        {/* Files Grid */}
        {files.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: 50,
                background: "linear-gradient(135deg, var(--purple), var(--blue))",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}>
                {files.length}
              </span>
              Selected Receipt{files.length > 1 ? 's' : ''}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 16,
              marginBottom: 28,
            }}>
              {files.map((fileObj, idx) => (
                <div
                  key={fileObj.id}
                  style={{
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "2px solid var(--border2)",
                    background: "var(--surface2)",
                    animation: `slideIn 0.3s ease ${idx * 50}ms backwards`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--purple)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,0.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border2)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "100%",
                    height: 140,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, rgba(124,58,237,0.05), rgba(37,99,235,0.05))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <img
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <button
                    onClick={() => removeFile(fileObj.id)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(220,38,38,0.9)",
                      border: "none",
                      color: "#fff",
                      fontSize: 14,
                      cursor: "pointer",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(220,38,38,1)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(220,38,38,0.9)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <button
                className="btn-primary"
                onClick={process}
                disabled={loading}
                style={{
                  flex: loading ? 0 : "0 1 300px",
                  minWidth: 200,
                  padding: "16px 32px",
                  fontSize: 15,
                  borderRadius: 12,
                  fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      marginRight: 10,
                    }} />
                    Processing {files.length} Receipt{files.length > 1 ? 's' : ''}…
                  </>
                ) : (
                  <>
                    ✓ Process {files.length} Receipt{files.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
              <button
                style={{
                  padding: "16px 28px",
                  fontSize: 15,
                  borderRadius: 12,
                  fontWeight: 700,
                  background: "rgba(124,58,237,0.06)",
                  border: "1.5px solid var(--purple)",
                  color: "var(--purple)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => inputRef.current?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ➕ Add More
              </button>
              <button
                className="btn-ghost"
                onClick={reset}
                style={{
                  padding: "16px 28px",
                  fontSize: 15,
                  borderRadius: 12,
                  fontWeight: 600,
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {files.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "32px 0",
            color: "var(--text3)",
            fontSize: 14,
            opacity: 0.7,
          }}>
            👆 Start by uploading your first receipt
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .btn-primary:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}