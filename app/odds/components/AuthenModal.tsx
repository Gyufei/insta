import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Clock, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useConnect } from "wagmi";
import { Mail } from "lucide-react";

interface AuthenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoWallet: () => void;
}

const getErrorMessage = (error: Error & { code?: number }) => {
  // User rejected the connection request
  if (error.code === 4001 || error.message.includes("User rejected")) {
    return "Connection rejected. Please try again.";
  }

  // QR Code Modal closed
  if (error.message.includes("Modal closed")) {
    return "Connection cancelled. Please try again.";
  }

  // Chain not configured
  if (error.message.includes("Chain not configured")) {
    return "Unsupported network. Please switch to Monad Testnet.";
  }

  // Default error message
  return "Failed to connect. Please try again.";
};

export default function AuthenModal({
  isOpen,
  onClose,
  onNoWallet,
}: AuthenModalProps) {
  const { connectors, connect, status, error } = useConnect();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<"method-picking" | "email-sent">(
    "method-picking",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeoutSeconds, setTimeoutSeconds] = useState<number | null>(null);
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);
  const [errorCountdown, setErrorCountdown] = useState<number | null>(null);
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] =
    useState(false);
  const [email, setEmail] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const errorIntervalRef = useRef<NodeJS.Timeout>();
  const connectionStartTime = useRef<number>();
  const previousStatus = useRef(status);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = undefined;
    }
    if (errorIntervalRef.current) {
      clearInterval(errorIntervalRef.current);
      errorIntervalRef.current = undefined;
    }
  }, []);

  // Close modal if connection is successful
  useEffect(() => {
    if (status === "success") {
      clearAllTimeouts();
      onClose();
      setIsWalletConnectModalOpen(false);
    }
  }, [status, onClose, clearAllTimeouts]);

  // Handle connection timeout
  useEffect(() => {
    if (status === "pending" && !timeoutRef.current) {
      setIsWalletConnectModalOpen(true);
      setErrorMessage(null);
      setErrorCountdown(null);
      clearAllTimeouts();
      connectionStartTime.current = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - (connectionStartTime.current || 0)) / 1000,
        );
        const remaining = 20 - elapsed;
        if (remaining <= 0) {
          if (!mounted.current) return;
          clearAllTimeouts();
          setTimeoutSeconds(null);
          setErrorMessage("Connection timed out. Please try again.");
          connect({ connector: undefined });
        } else {
          setTimeoutSeconds(remaining);
        }
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        if (!mounted.current) return;
        clearAllTimeouts();
        setErrorMessage("Connection timed out. Please try again.");
        setTimeoutSeconds(null);
        connect({ connector: undefined });
      }, 20000);
    }

    // Handle modal close and cleanup
    return () => {
      // If status changes from pending to idle (modal closed manually) or any other non-pending state
      if (previousStatus.current === "pending" && status === "idle") {
        setIsWalletConnectModalOpen(false);
        clearAllTimeouts();
        setTimeoutSeconds(null);
        setHasAttemptedConnection(false);
        setErrorMessage(null);
      }
      previousStatus.current = status;
    };
  }, [status, clearAllTimeouts]);

  const handleConnect = async (connector: any) => {
    try {
      if (!mounted.current) return;
      clearAllTimeouts();
      setErrorMessage(null);
      setHasAttemptedConnection(true);
      setErrorCountdown(null);
      setTimeoutSeconds(20);
      await connect({ connector, chainId: 10143 }); // Specify Monad Testnet
    } catch (err) {
      if (!mounted.current) return;
      clearAllTimeouts();
      const error = err as Error;
      setErrorMessage(getErrorMessage(error));
      setTimeoutSeconds(null);
      setErrorCountdown(5);

      errorIntervalRef.current = setInterval(() => {
        if (!mounted.current) return;
        setErrorCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      errorTimeoutRef.current = setTimeout(() => {
        clearAllTimeouts();
        if (!mounted.current) return;
        setErrorMessage(null);
        setErrorCountdown(null);
      }, 5000);
    }
  };

  // Clear error message when modal is closed
  // Handle cleanup when modal is closed
  useEffect(() => {
    if (!isOpen) {
      clearAllTimeouts();
      setErrorMessage(null);
      setHasAttemptedConnection(false);
      setErrorCountdown(null);
      setTimeoutSeconds(null);
      setIsWalletConnectModalOpen(false);
      connect({ connector: undefined });
    }
  }, [isOpen, clearAllTimeouts]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setModalState("email-sent");
    }
  };

  const handleBackToMethodPicking = () => {
    setModalState("method-picking");
  };

  const handleClearEmail = () => {
    setEmail("");
  };

  if (!isOpen) return null;

  const renderEmailSentState = () => (
    <div className="space-y-6">
      <div className="absolute right-4 top-4">
        <button
          onClick={handleBackToMethodPicking}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Mail className="h-12 w-12 text-odd-main" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-600">Log in using the link sent to</p>
        <p className="font-medium flex items-center justify-center gap-2">
          {email}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M21 3L15 9M21 3L21 8M21 3L16 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[384px] bg-white rounded-2xl p-8 z-50">
        {modalState === "method-picking" ? (
          <>
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Connect to Tadle</h2>
                {hasAttemptedConnection &&
                  timeoutSeconds !== null &&
                  isWalletConnectModalOpen && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Connection will timeout in {timeoutSeconds}s</span>
                    </div>
                  )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleConnect(connectors[0])}
                  className={`w-full flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
                    status === "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={status === "pending"}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    alt="MetaMask"
                    className="w-8 h-8"
                  />
                  <span className="text-lg font-medium">
                    {status === "pending" ? "Connecting..." : "MetaMask"}
                  </span>
                </button>

                <button
                  onClick={() => handleConnect(connectors[1])}
                  className={`w-full flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
                    status === "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={status === "pending"}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="bg-[#3B99FC] rounded-lg flex-shrink-0"
                  >
                    <path
                      d="M9.58818 11.8556C13.1293 8.31442 18.8706 8.31442 22.4117 11.8556L22.8379 12.2818C23.015 12.4588 23.015 12.7459 22.8379 12.9229L21.3801 14.3808C21.2915 14.4693 21.148 14.4693 21.0595 14.3808L20.473 13.7943C18.0026 11.3239 13.9973 11.3239 11.5269 13.7943L10.8989 14.4223C10.8104 14.5109 10.6668 14.5109 10.5783 14.4223L9.12041 12.9645C8.94336 12.7875 8.94336 12.5004 9.12041 12.3234L9.58818 11.8556ZM25.4268 14.8706L26.7243 16.1682C26.9013 16.3452 26.9013 16.6323 26.7243 16.8093L20.8737 22.6599C20.6966 22.8371 20.4096 22.8371 20.2325 22.6599L16.0802 18.5076C16.0359 18.4634 15.9641 18.4634 15.9199 18.5076L11.7675 22.6599C11.5905 22.8371 11.3034 22.8371 11.1264 22.66C11.1264 22.66 11.1264 22.6599 11.1264 22.6599L5.27561 16.8092C5.09856 16.6322 5.09856 16.3451 5.27561 16.168L6.57313 14.8706C6.75019 14.6934 7.03726 14.6934 7.21431 14.8706L11.3668 19.023C11.411 19.0672 11.4828 19.0672 11.5271 19.023L15.6793 14.8706C15.8563 14.6934 16.1434 14.6934 16.3205 14.8706L20.473 19.023C20.5172 19.0672 20.589 19.0672 20.6332 19.023L24.7856 14.8706C24.9627 14.6935 25.2498 14.6935 25.4268 14.8706Z"
                      fill="white"
                    />
                  </svg>
                  <span className="text-lg font-medium">
                    {status === "pending" ? "Connecting..." : "WalletConnect"}
                  </span>
                </button>
              </div>

              {/* Email Login */}
              <div className="relative my-6 hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="mb-6 hidden">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className={`w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      email ? "pr-[140px]" : "pr-[100px]"
                    }`}
                    required
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={handleClearEmail}
                      className="absolute right-[100px] top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                  >
                    Continue
                  </button>
                </div>
              </form>

              <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 mx-auto">
                <svg
                  aria-hidden="true"
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={onNoWallet}
                >
                  <path
                    d="M1.57568 4.60616C1.57568 2.69827 3.12234 1.15161 5.03023 1.15161H15.3939C17.3018 1.15161 18.8484 2.69826 18.8484 4.60616V10.3637C18.8484 12.2716 17.3018 13.8183 15.3939 13.8183H5.03023C3.12234 13.8183 1.57568 12.2716 1.57568 10.3637V4.60616Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M1 4.79293C1 2.435 3.31004 0.770014 5.54697 1.51566L12.4561 3.81869C13.8667 4.2889 14.8182 5.60901 14.8182 7.09596V13.6313C14.8182 15.9892 12.5081 17.6542 10.2712 16.9086L3.36212 14.6056C1.95149 14.1353 1 12.8152 1 11.3283V4.79293Z"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="10.3863"
                    cy="10.1894"
                    r="1.32574"
                    fill="currentColor"
                  />
                </svg>
                I don't have a crypto wallet
              </button>

              {hasAttemptedConnection && errorMessage && (
                <div className="text-center text-red-500 text-sm">
                  {errorMessage}
                  {errorCountdown !== null && (
                    <span className="text-gray-500 ml-2">
                      ({errorCountdown}s)
                    </span>
                  )}
                </div>
              )}

              {hasAttemptedConnection &&
                timeoutSeconds !== null &&
                isWalletConnectModalOpen && (
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-1000"
                      style={{
                        width: `${(timeoutSeconds / 20) * 100}%`,
                      }}
                    />
                  </div>
                )}

              <div className="text-center text-gray-500 text-sm">
                By connecting you agree to the{" "}
                <Link
                  to="/tos"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    navigate("/tos");
                  }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    navigate("/privacy");
                  }}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </>
        ) : (
          renderEmailSentState()
        )}
      </div>
    </>
  );
}
