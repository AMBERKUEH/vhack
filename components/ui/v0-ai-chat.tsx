"use client";
import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
} from "lucide-react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;
            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }
            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = `${minHeight}px`;
            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );
            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );
    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);
    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface VercelV0ChatProps {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    actionButtons?: { icon: React.ReactNode; label: string; onClick?: () => void }[];
}

export function VercelV0Chat({ 
    value: controlledValue, 
    onChange, 
    onSubmit,
    placeholder = "Ask a compliance question...",
    disabled = false,
    actionButtons
}: VercelV0ChatProps) {
    const [internalValue, setInternalValue] = useState("");
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const setValue = onChange || setInternalValue;
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled) {
                onSubmit?.(value);
                setValue("");
                adjustHeight(true);
            }
        }
    };

    const handleSubmit = () => {
        if (value.trim() && !disabled) {
            onSubmit?.(value);
            setValue("");
            adjustHeight(true);
        }
    };

    return (
        <div className="w-full">
            <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="overflow-y-auto">
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            adjustHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            "w-full px-4 py-3",
                            "resize-none",
                            "bg-transparent",
                            "border-none",
                            "text-white text-sm",
                            "focus:outline-none",
                            "focus-visible:ring-0 focus-visible:ring-offset-0",
                            "placeholder:text-neutral-500 placeholder:text-sm",
                            "min-h-[60px]"
                        )}
                        style={{
                            overflow: "hidden",
                        }}
                    />
                </div>

                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <Paperclip className="w-4 h-4 text-white" />
                            <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                                Attach
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Project
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!value.trim() || disabled}
                            className={cn(
                                "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                                value.trim() && !disabled
                                    ? "bg-white text-black"
                                    : "text-zinc-400"
                            )}
                        >
                            <ArrowUpIcon
                                className={cn(
                                    "w-4 h-4",
                                    value.trim() && !disabled
                                        ? "text-black"
                                        : "text-zinc-400"
                                )}
                            />
                            <span className="sr-only">Send</span>
                        </button>
                    </div>
                </div>
            </div>

            {actionButtons && actionButtons.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                    {actionButtons.map((btn, idx) => (
                        <ActionButton
                            key={idx}
                            icon={btn.icon}
                            label={btn.label}
                            onClick={btn.onClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
            {icon}
            <span className="text-xs">{label}</span>
        </button>
    );
}
