

export interface IWebhookService {
    verifyWebhookSignature(body: Buffer | string, signature: string): Promise<any>
    handlePaymentIntentSucceeded(paymentIntent: any): Promise<any>
}