import { useOutletContext } from "react-router-dom";
import type { IRawFollowing, IContext } from "../../../types.ts";
import { Axios } from "../../../api.ts";
import { useEffect, useState } from "react";
import PageHeaderWithBadge from "./components/page-header-with-badge";
import CardShell from "./components/card-shell";
import EmptyStateCard from "./components/empty-state-card";
import RequestRow from "./components/request-row";

const Requests = () => {
    const { account, setAccount } = useOutletContext<IContext>();
    const [requests, setRequests] = useState<IRawFollowing[]>([]);

    useEffect(() => {
        setRequests(account.followers.filter((follower) => !follower.approved));
    }, [account.followers]);

    const handleAcceptRequest = (from: number, to: number) => {
        Axios.patch(`/follow/requests/accept`, { from, to }).then(() => {
            setAccount({
                ...account,
                followers: account.followers.map((follower) =>
                    follower.from === from
                        ? { ...follower, approved: true }
                        : follower
                ),
            });
        });
    };

    const handleDeclineRequest = (from: number, to: number) => {
        Axios.patch(`/follow/requests/decline`, { from, to }).then(() => {
            setAccount({
                ...account,
                followers: account.followers.filter(
                    (follower) => follower.from !== from
                ),
            });
        });
    };

    return (
        <div className="w-full px-6 py-10">
            <div className="mx-auto w-full max-w-5xl">
                <PageHeaderWithBadge
                    title="Requests"
                    subtitle="People who want to follow you."
                    badgeText={`${requests.length} pending`}
                />

                <CardShell>
                    {requests.length === 0 ? (
                        <EmptyStateCard
                            title="No requests right now."
                            subtitle="New requests will show up here."
                        />
                    ) : (
                        <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            {requests.map((request) => (
                                <RequestRow
                                    key={request.from}
                                    request={request}
                                    onAccept={() =>
                                        handleAcceptRequest(
                                            request.from,
                                            request.to
                                        )
                                    }
                                    onDecline={() =>
                                        handleDeclineRequest(
                                            request.from,
                                            request.to
                                        )
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </CardShell>
            </div>
        </div>
    );
};

export default Requests;
