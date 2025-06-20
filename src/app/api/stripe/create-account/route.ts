import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export const POST = auth(async function POST(request) {
    if(!request.auth){
        return NextResponse.json({error: "Usuário não autenticado"}, {status: 401})
    }

    try{

        const account = await stripe.accounts.create({
            type: "express",
            country: "BR",
            email: request.auth.user?.email || undefined,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
            business_type: "individual"
        })

        if(!account.id){
            return NextResponse.json({error: "Falha ao criar conta de pagamento"}, {status: 400})
        }

        await prisma.user.update({
            where: {
                id: request.auth.user?.id
            },

            data: {
                connectedStripeAccountId: account.id
            }
        })

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.HOST_URL!}/dashboard`,
            return_url: `${process.env.HOST_URL!}/dashboard`,
            type: "account_onboarding"
        })

        return NextResponse.json({url: accountLink?.url}, { status: 200 })

    }catch(err){
        return NextResponse.json({error: "Falha ao criar link de configuração"}, {status: 400})
    }
})