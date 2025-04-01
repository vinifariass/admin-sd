"use server";

import { signInFormSchema, singUpFormSchema, updateUserSchema } from "../validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth, signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatErrors } from "../utils";
import { revalidatePath } from "next/cache";
import { Prisma, Tipo } from "@prisma/client";
import { PAGE_SIZE } from "../constants";
import { z } from "zod";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        // Validate form data
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });
        await signIn('credentials', user);

        return { success: true, message: 'Signed in successfully' };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Invalid email or password' };
    }
}

export async function signUpUser(prevState: unknown, formData: FormData) {
    try {

        const user = singUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        })

        const plainPassword = user.password;

        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });

        await signIn('credentials', {
            email: user.email,
            password: plainPassword
        });

        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatErrors(error) };
    }
}

export async function signOutUser() {
    await signOut();
}

// Get all the users
export async function getAllUsers({
    limit = PAGE_SIZE,
    page
    , query
}: {
    limit?: number,
    page: number,
    query: string
}) {

    const queryFilter: Prisma.UserWhereInput = query && query !== 'all' ? {
            name: {
                contains: query,
                mode: 'insensitive'
            } as Prisma.StringFilter
    } : {}


    const data = await prisma.user.findMany({
        where:{
            ...queryFilter
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
    });

    const dataCounter = await prisma.user.count();

    return {
        data,
        totalPages: Math.ceil(dataCounter / limit)
    }
}

// Deletar user
export async function deleteUser(id: string) {
    try {

        await prisma.user.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/users');

        return {
            success: true,
            message: 'User deleted successfully'
        }

    } catch (error) {
        return { success: false, message: formatErrors(error) };
    }
}

//Get user by id
export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) throw new Error('User not found');
    return user;
}

//Atualizar a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
    try {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: user.name,
                tipo: user.tipo
            }
        });

        revalidatePath('/admin/users');

        return {
            success: true,
            message: 'User updated successfully'
        }

    } catch (error) {
        return { success: false, message: formatErrors(error) };
    }
}