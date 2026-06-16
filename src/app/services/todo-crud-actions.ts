"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../../lib/prisma";
import { FormState } from "@/lib/_type";

export async function createTask(prevState: FormState, formData: FormData): Promise<FormState> {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || title.trim() === "") {
        return {
            error: "Title and Description cannot be empty!"
        }
    }

    try {
        await prisma.todo.create({
            data: {
                title,
                description: description ?? "",
                updatedAt: new Date(),
            }
        });
        revalidatePath("/todo");
        return {
            success: true
        };
    } catch (error) {
        return { error: "Something went wrong saving to the database." };
    }
}

export async function editTask(id: number, title: string, description: string) {
    try {
        await prisma.todo.update({
            where: {id},
            data: {
                title,
                description
            }
        })
        revalidatePath("/todo");
        return {
            success: true,
        }
    } catch (error) {
        return {
            error: "failed to update data"
        }
    }
}

export async function deleteTask(id: number) {
    try {
        await prisma.todo.delete({
            where: {id},
        })
        revalidatePath("/todo")
        return {
            success: true,
        }
    } catch (error) {
        return {
            error: "failed to delete data"
        }
    }
}