"use server"

import { prisma } from "@/lib/prisma" 
import { stripe } from "@/lib/stripe"

export async function getStats(userId: string, stripeAccountId: string) {
    if(!userId){
        return{
            error: "Usuário não autenticado"
        }
    }

    try{
        const totalDonations = await prisma.donation.count({
            where:{
                userId: userId
            }
        })

        const totalAmountDonated = await prisma.donation.aggregate({
            where: {
                userId: userId
            },
            _sum:{
                amount: true
            }
        })

        const balance = await stripe.balance.retrieve({
            stripeAccount: stripeAccountId
        })

        return{
            totalQtdDonatios: totalDonations,
            totalAmountResult: totalAmountDonated ?? 0,
            balance: balance?.pending[0]?.amount ?? 0
        }

    }catch(err){
        return{
            error: "Falha ao buscar estatisticas"
        }
    }
    
}