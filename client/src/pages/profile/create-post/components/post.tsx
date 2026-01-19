import type { IPost } from "../../../../types";


const Post = ({ post, openPost }: { post: IPost; openPost: (id: number) => void }) => {
    return (
        <div onClick={() => openPost(post.id)} className="relative cursor-pointer rounded-sm overflow-hidden duration-300 group">
            <div className="w-full aspect-[4/6] relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-300"/>
                <img
                    src={post.postImageURL}
                    alt="coverImage"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};
export default Post;