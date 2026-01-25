export default function ProfileBio({
    bio,
    emptyText = "No bio yet.",
}: {
    bio?: string | null;
    emptyText?: string;
}) {
    const text = bio?.trim() ? bio : emptyText;

    return (
        <div className="w-full">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400">
                {text}
            </p>
        </div>
    );
}
