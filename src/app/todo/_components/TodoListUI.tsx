"use client";

import { useEffect, useState } from "react";
import { ListViewType } from "@/lib/_type";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";

// edit, delete function
import { editTask, deleteTask } from "@/app/services/todo-crud-actions";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type TodoListUIProps = {
    initialTodos: ListViewType[];
};

export default function TodoListUI({ initialTodos }: TodoListUIProps) {
    const [todos, setTodos] = useState(
        initialTodos.map((todo) => ({
            ...todo,
            completed: false,
        }))
    );

    useEffect(() => {
        const savedStatus = localStorage.getItem("todo-completed-status");
        const completedIds = savedStatus ? (JSON.parse(savedStatus) as number[]) : [];
        setTodos(initialTodos.map((todo) => ({
            ...todo,
            completed: completedIds.includes(todo.id),
        })));
    }, [initialTodos]);

    const toggleTodo = (id: number) => {
        setTodos((prev) => {
            const updated = prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
            const completedIds = updated.filter((t) => t.completed).map((t) => t.id);
            localStorage.setItem("todo-completed-status", JSON.stringify(completedIds));
            return updated;
        });
    };

    // Handler Edit Data Toggle
    const handleDelete = async (id: number) => {
        try {
            const res = await deleteTask(id);
            if (res?.error) alert(res.error);
        } catch (err) {
            alert("Terjadi kesalahan jaringan.");
        }
    };

    // Handler Edit Data
    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        if (!title.trim()) return alert("Judul tidak boleh kosong!");

        try {
            const res = await editTask(id, title, description);
            if (res?.error) alert(res.error);
        } catch (err) {
            alert("Terjadi kesalahan jaringan.");
        }
    };

    // Jika data di database kosong
    if (todos.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg border-dashed">
                <p className="text-muted-foreground italic">
                    Nothing added to the list. Click button above to add one!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {todos.map((todo) => (
                <Item
                    key={todo.id}
                    variant={todo.completed ? "muted" : "default"}
                    className={`cursor-pointer items-center border rounded-lg p-4 transition-all hover:bg-accent/40 ${todo.completed ? "opacity-60" : ""
                        }`}
                    onClick={() => toggleTodo(todo.id)}
                >
                    <ItemMedia>
                        <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </ItemMedia>
                    <ItemContent className="ms-2">
                        <ItemTitle
                            className={`font-medium ${todo.completed ? "text-muted-foreground line-through" : "text-foreground"
                                }`}
                        >
                            {todo.title}
                        </ItemTitle>
                        {todo.description && (
                            <p className={`text-xs mt-0.5 ${todo.completed ? "line-through text-muted-foreground/70" : "text-muted-foreground"}`}>
                                {todo.description}
                            </p>
                        )}
                    </ItemContent>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>

                        {/* DIALOG EDIT */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-106.25">
                                <DialogHeader>
                                    <DialogTitle>Edit Tugas</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => handleEditSubmit(e, todo.id)} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Judul</Label>
                                        <Input id="title" name="title" defaultValue={todo.title} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Input id="description" name="description" defaultValue={todo.description ?? ""} />
                                    </div>
                                    <DialogFooter className="mt-2">
                                        <DialogClose asChild>
                                            <Button type="submit">Simpan Perubahan</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* ALERT DIALOG DELETE */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah kamu benar-benar yakin?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Tugas ini akan dihapus secara permanen dari database.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-1">
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={() => handleDelete(todo.id)}
                                    >
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </Item>
            ))}
        </div>
    );
}