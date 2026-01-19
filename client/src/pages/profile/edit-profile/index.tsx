import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { IContext } from "../../../types";
import { Axios } from "../../../api";
import ProfilePhotoCard from "./components/profile-photo-card";

const EditProfile = () => {
    const { account, setAccount } = useOutletContext<IContext>();

    const [bio, setBio] = useState(account.bio ?? "");
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const maxBio = 150;

    const avatarPicture = useRef<HTMLInputElement | null>(null);

    const onPickFile = () => avatarPicture.current?.click();

    const handleAvatarUpload = () => {
        const input = avatarPicture.current;
        if (!input) return;

        const file = input.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append("profile-pic", file);

        Axios.patch<{ picture: string }>("/account/avatar", form)
            .then((response) => {
                setAccount({
                    ...account,
                    avatarURL: response.data.picture,
                });
            })
            .catch(console.error)
            .finally(() => {
                input.value = "";
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        Axios.patch<{ bio: string; message: string }>("/account/bio", { bio })
            .then((response) => {
                setAccount({
                    ...account,
                    bio: response.data.bio,
                });
                setMessage(response.data.message);
            })
            .catch(console.error);
    };

    return (
        <div className="md:min-h-screen w-full px-4 py-8 md:px-10 md:py-10 text-slate-900 dark:text-white">
            <div className="mx-auto w-full max-w-3xl">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Edit profile
                </h1>

                <form onSubmit={handleSubmit} className="mt-7 space-y-7">
                    <input
                        ref={avatarPicture}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                    />

                    <ProfilePhotoCard
                        username={account.username}
                        avatar={account.avatarURL}
                        onPickFile={onPickFile}
                        buttonText="Change photo"
                    />

                    <section className="space-y-3">
                        <div className="flex items-end justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Bio
                            </h2>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {bio.length} / {maxBio}
                            </span>
                        </div>

                        {message && (
                            <p className="text-sm text-green-600 dark:text-green-500">
                                {message}
                            </p>
                        )}

                        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 overflow-hidden dark:bg-transparent dark:ring-white/10">
                            <textarea
                                ref={textareaRef}
                                value={bio}
                                maxLength={maxBio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write a bio…"
                                className="w-full min-h-[120px] bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none
                                    dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-500"
                            />
                        </div>
                    </section>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-indigo-700 py-2 text-base font-semibold text-white hover:brightness-110 active:scale-[0.99] transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
