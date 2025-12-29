import ProfileAvatar from "../../components/profile-avatar";

type ProfilePhotoCardProps = {
    username: string;
    avatar?: string | null;
    buttonText?: string;
    onPickFile: () => void;
    children?: React.ReactNode;
};

const ProfilePhotoCard = ({
    username,
    avatar,
    buttonText = "Change photo",
    onPickFile,
    children,
}: ProfilePhotoCardProps) => {
    return (
        <section className="rounded-xl bg-white ring-1 ring-slate-200/70 px-5 py-4 md:px-6 md:py-5 dark:bg-white/5 dark:ring-white/10">
            <div className="flex items-center gap-4">
                <div className="shrink-0">
                    <ProfileAvatar src={avatar ?? undefined} size="md" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold text-slate-900 truncate dark:text-slate-100">
                        {username}
                    </div>
                    {children}
                </div>

                <button
                    type="button"
                    onClick={onPickFile}
                    className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 active:scale-95 transition"
                >
                    {buttonText}
                </button>
            </div>
        </section>
    );
};

export default ProfilePhotoCard;
