type Props = {
    isDeletedPartner: boolean;
};

export default function ChatEmpty({ isDeletedPartner }: Props) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No messages yet
            </div>
            <div className="mt-1 max-w-xs text-sm">
                {isDeletedPartner
                    ? "This conversation is read-only."
                    : "Send a message to start the conversation."}
            </div>
        </div>
    );
}
