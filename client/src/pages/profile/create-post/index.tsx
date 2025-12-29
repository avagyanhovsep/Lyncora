import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";
import type { IContext, IPost } from "../../../types";
import { Axios } from "../../../api";
import PageHeader from "./components/page-header";
import FormCard from "./components/form-card";
import FormField from "./components/form-field";
import TextInput from "./components/text-input";
import TextArea from "./components/text-area";
import TagsInput from "./components/tags-input";
import MediaUploader from "./components/media-uploader";
import StickyFormActions from "./components/sticky-form-actions";

type ApiError = { message?: string };

const CreateNewPost = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        clearErrors,
        reset,
        setValue,
    } = useForm<IPost>();

    const postImageRef = useRef<HTMLInputElement | null>(null);

    const [postImage, setPostImage] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");

    const { account, setAccount } = useOutletContext<IContext>();
    const navigate = useNavigate();

    const commitTagsToForm = (next: string[]) => {
        setTags(next);
        setValue("tags" as const, next, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const addTag = (raw: string) => {
        const t = raw.trim().replace(/\s+/g, "-").toLowerCase();
        if (!t) return;
        if (t.length > 24) return;
        if (tags.includes(t)) return;
        if (tags.length >= 10) return;

        commitTagsToForm([...tags, t]);
        setTagInput("");
    };

    const removeTag = (t: string) => {
        commitTagsToForm(tags.filter((x) => x !== t));
    };

    const onTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const canPublish = useMemo(
        () => Boolean(postImage) && !isSubmitting,
        [postImage, isSubmitting]
    );

    const handleCreatePost: SubmitHandler<IPost> = async (postInformation) => {
        try {
            const response = await Axios.post<{ postInfo: IPost }>("/posts", {
                postInformation: { ...postInformation, tags },
                postImage,
                tags,
            });

            setAccount({
                ...account,
                posts: [...account.posts, response.data.postInfo],
            });

            navigate(`/profile`);
        } catch (e: unknown) {
            if (axios.isAxiosError<ApiError>(e)) {
                console.error(
                    e.response?.data?.message ?? "Failed to create post."
                );
            } else {
                console.error("Failed to create post.");
            }
        }
    };

    const handlePostImageUpload = async () => {
        const file = postImageRef.current?.files?.[0];
        if (!file) return;

        const maxBytes = 15 * 1024 * 1024;
        if (file.size > maxBytes) {
            console.error("File too large (max 15MB).");
            return;
        }

        const form = new FormData();
        form.append("post-image", file);

        try {
            const response = await Axios.patch<{ picture: string }>(
                "/posts/image",
                form
            );
            setPostImage(response.data.picture);
            clearErrors("postImage");
        } catch (e: unknown) {
            if (axios.isAxiosError<ApiError>(e)) {
                console.error(e.response?.data?.message ?? "Upload failed.");
            } else {
                console.error("Upload failed.");
            }
        }
    };

    const onReset = () => {
        reset();
        setTags([]);
        setTagInput("");
        setPostImage("");
        if (postImageRef.current) postImageRef.current.value = "";
    };

    const { ref: postImageReactHookRef, ...postImageRegister } = register(
        "postImage" as const,
        {
            required: "Upload your post image...",
        }
    );

    useEffect(() => {
        setValue("tags" as const, tags, { shouldDirty: true });
    }, [tags, setValue]);

    const leftText = isSubmitting
        ? "Publishing…"
        : isDirty || postImage || tags.length
        ? "Unsaved changes"
        : "No changes";

    return (
        <div className="w-full h-full px-6 pb-20 lg:pb-10 py-10">
            <div className="mx-auto w-full max-w-5xl">
                <PageHeader
                    title="Create New Post"
                    subtitle="Add details and upload your media. Publish when ready."
                />

                <form
                    onSubmit={handleSubmit(handleCreatePost)}
                    className="space-y-6"
                >
                    <FormCard
                        title="Post details"
                        subtitle="Title, description, tags, and location."
                    >
                        <div className="space-y-5">
                            <FormField
                                label="Title"
                                hint="Keep it short and clear."
                            >
                                <TextInput
                                    id="title"
                                    {...register("title")}
                                    placeholder="Give your post a catchy title"
                                />
                            </FormField>

                            <FormField label="Description">
                                <TextArea
                                    id="description"
                                    {...register("description")}
                                    rows={4}
                                    placeholder="Write something about your photos…"
                                />
                            </FormField>

                            <FormField label="Tags">
                                <input
                                    type="hidden"
                                    {...register("tags" as const)}
                                />

                                <TagsInput
                                    tags={tags}
                                    value={tagInput}
                                    onChange={setTagInput}
                                    onKeyDown={onTagKeyDown}
                                    onBlurAdd={() => addTag(tagInput)}
                                    onRemoveTag={removeTag}
                                    maxTags={10}
                                />
                            </FormField>

                            <FormField label="Location">
                                <TextInput
                                    placeholder="e.g., Silicon Valley, CA"
                                    id="location"
                                    {...register("location")}
                                />
                            </FormField>
                        </div>
                    </FormCard>

                    <FormCard
                        title="Media"
                        subtitle="Upload at least one image to publish."
                    >
                        <MediaUploader
                            errorText={errors.postImage?.message}
                            onPickFile={() => postImageRef.current?.click()}
                            previewUrl={postImage}
                            input={
                                <input
                                    id="postImage"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    {...postImageRegister}
                                    ref={(el) => {
                                        postImageRef.current = el;
                                        postImageReactHookRef(el);
                                    }}
                                    onChange={handlePostImageUpload}
                                    className="hidden"
                                />
                            }
                        />
                    </FormCard>

                    <StickyFormActions
                        leftText={leftText}
                        onReset={onReset}
                        disableReset={isSubmitting}
                        canSubmit={canPublish}
                        submitText="Publish"
                    />
                </form>
            </div>
        </div>
    );
};

export default CreateNewPost;
