import { ListViewType } from "@/lib/_type";
import prisma from "../../../lib/prisma";
import NewsListButton from "./_components/NewsListButton";
import TodoListUI from "./_components/TodoListUI";

export default async function Todo() {
    const todos: ListViewType[] = await prisma.todo.findMany({
        select: {
            id: true,
            title: true,
            description: true,
        },
        orderBy: {
            id: 'desc'
        }
    });

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto flex max-w-2xl flex-col gap-8">

                    {/* Header Bagian Atas */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-semibold md:text-4xl tracking-tight">
                                My TodoList
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Manage your database tasks with visual feedback.
                            </p>
                        </div>
                        <NewsListButton />
                    </div>

                    {/* Data List */}
                    <TodoListUI initialTodos={todos} />

                </div>
            </div>
        </section>
    );
}