import { useState, useEffect } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { resendOtp, verifyOtp } from "@/api/user.api"

export function InputOTPDemo() {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState("") 
  const [loading, setLoading] = useState(false) 
  const navigate = useNavigate()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const email = localStorage.getItem("email")
    const apiType = localStorage.getItem("apiType")

    if (!email || !apiType) {
      navigate("/signup")
      return
    }

    try {
      setLoading(true)
      setError("")
      const response = await verifyOtp(email, otp, apiType)

      console.log("RESPONSE >>>>>>>>  : ",response)

      if (response?.success) {
        console.log("OTP Verified!")
        // localStorage.removeItem("email");
        // localStorage.removeItem("apiType");

        navigate(apiType === "signup" ?"/login" : "/resetPassword")
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setError("Otp incorrect. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const restartTimer=()=>{
    setTimeLeft(60)
    return
}

const handleResendOTP = async (event: React.FormEvent) => {
  event.preventDefault()
  restartTimer()

  const email = localStorage.getItem("email")
  if (!email) {
    navigate("/")
    alert("Something went wrong. Please signup again.")
    return
  }

  try {
    const response = await resendOtp(email)
    if (!response.success) {
      setError(response.error || "Failed to resend OTP.")
      return
    }
  } catch (error) {
    setError("Failed to resend OTP. Try again.")
  }

  setIsActive(true)
  setOtp("")
  setError("")
}

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Enter Verification Code</h2>
              <p className="text-sm text-gray-500">We've sent a code to your phone number</p>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => { if (/^\d*$/.test(value)) setOtp(value) }} className="gap-2">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && ( 
              <div className="text-center text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            <div className="text-center">
              <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
              <p className="text-sm text-gray-500">seconds remaining</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full bg-green-600" onClick={handleSubmit} disabled={otp.length !== 6 || loading}>
            {loading ? "Verifying..." : "Submit"}
          </Button>

          <Button variant="outline" className="w-full bg-black text-white" onClick={handleResendOTP} disabled={timeLeft > 0}>
            Resend OTP
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
