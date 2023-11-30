import NextAuth from "next-auth/next";
import prisma from '@/lib/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import  CredentialsProvider  from "next-auth/providers/credentials";
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'


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
                const user = {id: 1, name: 'Mahir', email: 'mahir@gmail.com'}
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