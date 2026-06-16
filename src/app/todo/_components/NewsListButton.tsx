"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// create task function
import { createTask } from "@/app/services/todo-crud-actions";

type Props = {
}

const NewsListButton = (props: Props) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(createTask, {});

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        ref={buttonRef}
                        onMouseEnter={handleMouseEnter}
                        variant="outline"
                        className="relative overflow-hidden group px-4 py-2 h-auto rounded-full cursor-pointer border border-border transition-all duration-300"
                    >
                        <span
                            className={cn(
                                "absolute w-10 h-10 rounded-full scale-0 transition-transform duration-700 ease-in-out group-hover:scale-[15] pointer-events-none",
                                "bg-primary"
                            )}
                            style={{
                                left: pos.x - 20,
                                top: pos.y - 20,
                            }}
                        />
                        <span className="relative z-10 transition-colors duration-500 pointer-events-none group-hover:text-primary-foreground">
                            Add Task
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to create a new task.
                        </DialogDescription>

                        {/* when gagal */}
                        {state?.error && (
                            <div className="text-sm font-medium text-destructive bg-destructive/5 px-4 py-2.5 rounded-lg border border-destructive/20 mt-2 animate-in fade-in-50 duration-200">
                                ⚠ {state.error}
                            </div>
                        )}

                        {/* When Success */}
                        {state?.success && (
                            <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200 mt-2 animate-in fade-in-50 duration-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                                ✓ Task successfully created and saved to Supabase!
                            </div>
                        )}
                    </DialogHeader>
                    <form ref={formRef} action={formAction}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    name="title"
                                    id="title"
                                    placeholder="input task title"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    name="description"
                                    id="description"
                                    placeholder="input the descrtiption of your task"
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full mt-4"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewsListButton
