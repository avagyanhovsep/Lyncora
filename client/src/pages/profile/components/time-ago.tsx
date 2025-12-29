import { format } from "timeago.js";

type Props = {
    date: string | number | Date;
};

const TimeAgo = ({ date }: Props) => {
    return (
        <p className="text-[13px] text-slate-500 dark:text-neutral-400">
            {format(date)}
        </p>
    );
};

export default TimeAgo;
