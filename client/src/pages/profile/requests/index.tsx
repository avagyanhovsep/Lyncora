import { useOutletContext } from "react-router-dom";
import type { IRawFollowing, IContext } from "../../../types.ts";
import { Axios } from "../../../api.ts";
import { useEffect, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import PageHeaderWithBadge from "./components/page-header-with-badge";
import CardShell from "./components/card-shell";
import EmptyStateCard from "./components/empty-state-card";
import RequestRow from "./components/request-row";
import ConfirmModal from "../components/confirm-modal.tsx";

const Requests = () => {
    const { account, setAccount } = useOutletContext<IContext>();
    const [requests, setRequests] = useState<IRawFollowing[]>([]);

    useEffect(() => {
        setRequests(account.followers.filter((follower) => !follower.approved));
    }, [account.followers]);

    const handleAcceptRequest = (from: number, to: number) => {
        NiceModal.show(ConfirmModal, {
            title: "Accept request?",
            description:
                "This person will be able to follow you and see your posts.",
            confirmText: "Accept",
            cancelText: "Cancel",
            variant: "default",
            onConfirm: async () => {
                await Axios.patch(`/follow/requests/accept`, { from, to });
            },
            onSuccess: () => {
                setAccount({
                    ...account,
                    followers: account.followers.map((follower) =>
                        follower.from === from
                            ? { ...follower, approved: true }
                            : follower,
                    ),
                });
            },
        });
    };

    const handleDeclineRequest = (from: number, to: number) => {
        NiceModal.show(ConfirmModal, {
            title: "Decline request?",
            description: "This request will be removed.",
            confirmText: "Decline",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: async () => {
                await Axios.patch(`/follow/requests/decline`, { from, to });
            },
            onSuccess: () => {
                setAccount({
                    ...account,
                    followers: account.followers.filter(
                        (follower) => follower.from !== from,
                    ),
                });
            },
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
                                            request.to,
                                        )
                                    }
                                    onDecline={() =>
                                        handleDeclineRequest(
                                            request.from,
                                            request.to,
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
