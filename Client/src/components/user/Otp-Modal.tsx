
import { useState, useEffect } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export function InputOTPDemo() {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(true)

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

  const handleResendOTP = () => {
    // In a real app, you would call your API to resend the OTP
    setTimeLeft(60)
    setIsActive(true)
    setOtp("")
  }

  const handleSubmit = () => {
    alert("OTP Submitted")
    navigate("/login")
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
            <InputOTP maxLength={6} value={otp} onChange={(value) =>{if(/^\d*$/.test(value)) setOtp(value)}} className="gap-2">
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

          <div className="text-center">
            <div className="text-3xl font-bold">{timeLeft}</div>
            <p className="text-sm text-gray-500">seconds remaining</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full bg-green-600" onClick={handleSubmit} disabled={otp.length !== 6}>
          Submit
        </Button>

        <Button variant="outline" className="w-full bg-black text-white" onClick={handleResendOTP} disabled={timeLeft > 0}>
          {timeLeft > 0 ? "Resend OTP" : "Resend OTP"}
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
