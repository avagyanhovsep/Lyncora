export function InboxEmpty() {
    return (
        <div className="text-sm text-slate-600 dark:text-slate-400 py-3">
            No chats yet.
        </div>
    );
}

export function SelectChatHint() {
    return (
        <div className="h-full hidden md:grid place-items-center text-slate-500 dark:text-slate-400">
            Select a chat
        </div>
    );
}
