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
            type="button"
            className="
                inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium
                bg-slate-100/80 text-slate-900 ring-1 ring-slate-200/70
                shadow-sm shadow-black/5 active:scale-95 transition select-none
                dark:bg-white/10 dark:text-gray-100 dark:ring-white/10
                md:hover:bg-slate-200/60 md:dark:hover:bg-white/[0.14]
            "
        >
            Message
        </button>
    );
};

export default MessageButton;
