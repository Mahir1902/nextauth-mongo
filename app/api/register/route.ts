import bcrypt from 'bcrypt'
import prisma from '@/lib/prismadb'
import {NextResponse, NextRequest} from 'next/server' // Sends responses back to client



export async function POST(request) {
    const {name, email, password} = await request.json()

    if(!name || !email || !password) {
        return new NextResponse('Please fill in all fields', {status: 400})
    }


    //Check if email already exsits
    const exsit = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(exsit) {
        throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    })

    return NextResponse.json(user)
}


