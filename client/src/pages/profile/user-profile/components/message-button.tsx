import { useNavigate } from "react-router-dom";
import { Axios } from "../../../../api";

const MessageButton = ({ id }: { id: number }) => {
    const navigate = useNavigate();

    const onMessage = async () => {
        const res = await Axios.post("/chats/dm", { partnerId: id });
        const chat = res.data.chat;

        navigate("/profile/inbox", { state: { activeChatId: chat.id, chat } });
    };

    return (
        <button
            onClick={onMessage}
            className={`px-6 py-1 text-sm group relative inline-flex items-center justify-center gap-2 rounded-md duration-200 bg-slate-100 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-200 active:scale-90 dark:bg-white/20 dark:text-white dark:ring-white/10 dark:hover:bg-white/30`}
        >
            <span className="relative">Message</span>
        </button>
    );
};

export default MessageButton;
