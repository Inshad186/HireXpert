import Stripe from "stripe";
import { env } from "./env.config";

if(!env.STRIPE_SECRET_KEY){
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables')
}
export const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-12-15.clover"
})
