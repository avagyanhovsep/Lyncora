import type { IRawFollowing } from "../../../../types";
import Image from "../../components/image";

type Props = {
    request: IRawFollowing;
    onAccept: () => void;
    onDecline: () => void;
};

export default function RequestRow({ request, onAccept, onDecline }: Props) {
    const sender = request.sender;

    return (
        <li className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 hover:bg-slate-100 transition dark:bg-black/20 dark:hover:bg-white/[0.03]">
            <div className="flex items-center gap-4 min-w-0">
                {sender.avatar ? (
                    <Image
                        src={sender.avatar}
                        alt="avatar"
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                    />
                ) : (
                    <img
                        src="/assets/default.jpeg"
                        alt="avatar"
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
                    />
                )}

                <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate dark:text-white">
                        {sender.username}
                    </p>
                    <p className="text-sm text-slate-600 truncate dark:text-gray-400">
                        {sender.firstName} {sender.lastName}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={onAccept}
                    className="rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-600 active:scale-95 transition"
                >
                    Accept
                </button>

                <button
                    onClick={onDecline}
                    className="rounded-md bg-red-700 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 active:scale-95 transition"
                >
                    Decline
                </button>
            </div>
        </li>
    );
}
