import NextAuth from "next-auth/next";
import prisma from '@/lib/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import  CredentialsProvider  from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'


export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'text', placeholder: 'e.g. JohnDoe@gmail.com'},
                password: {label:"Password", type: "password", },
                username: {label: "Username", type: "text", placeholder: "Username"}
            },
            async authorize(credentials) {


                if(!credentials.email || !credentials.password) {
                    throw new Error('Missing fields')
                }

                // Check if the user exists in the db
                const user = await prisma.user.findUnique({
                    where : {
                        email: credentials.email
                    }
                })

                if(!user || !user?.hashedPassword) {
                    throw new Error('No user found')
                }

                // Check if the passoword given matches
                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

                if (!passwordMatch) {
                    throw new Error('Incorrect Password')
                }

                return user
            }
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: 'jwt'
    },
    debug: process.env.NODE_ENV==='development'
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}