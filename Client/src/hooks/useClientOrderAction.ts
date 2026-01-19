import { accept_Delivery, request_Revision } from "@/api/client.api"
import { useState, useCallback } from "react"

export const useClientOrderAction = () => {
    
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const acceptDelivery = useCallback(async(orderId: string, feedback: string, rating: number) => {
        setActionLoading(orderId)
        try {
            const response = await accept_Delivery(orderId, feedback, rating)
            if(response.success){
                return { success: true, message: "Order completed successfully!"}
            }else{
                return { success: false, message: "Failed to complete order"}
            }
        } catch (error) {
            console.error("Error accepting delivery:", error);
            return {success: false, message: "Failed to accept delivery"}
        } finally {
            setActionLoading(null)
        }
    },[])

    const requestRevision = useCallback(async(orderId: string, revisionReason: string, revisionCount: number) => {
        setActionLoading(orderId)

        try {
            const response = await request_Revision(orderId, revisionReason, revisionCount)
            if(response.success){
                return { success: true, message: "Order cancelled successfully!"}
            }else{
                return { success: false, message: "Failed to cancel order"}
            }
        } catch (error) {
            console.error("Error cancel delivery: ", error)
            return { success: false, message: "Failed to cancel delivery"}
        }finally {
            setActionLoading(null)
        }
    },[])

    return{
        acceptDelivery,
        requestRevision,
        actionLoading
    }
}
