import type { IPost } from "../../../../types.ts";
import Post from "../components/post.tsx";

type Props = {
    posts: IPost[];
    openPost: (id: number) => void;
};

const PhotoGrid: React.FC<Props> = ({ posts, openPost }) => {
    return (
        <>
            {/* POSTS */}
            {posts.map((post) => (
                <Post key={post.id} post={post} openPost={openPost} />
            ))}
        </>
    );
};
export default PhotoGrid;
