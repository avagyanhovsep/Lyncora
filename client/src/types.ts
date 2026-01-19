export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    avatarName: string;
    avatarURL: string;
    coverImage: string;
    isAccountPrivate: boolean;
    bio?: string;
    theme?: string;
    deletedAt?: string | null;
}

export interface IContext {
    account: IAccount;
    setAccount: (account: IAccount | null) => void;
}

export type IAccount = Omit<IUser, "password" | "email"> & {
    followers: IFollower[];
    followings: IFollowing[];
    posts: IPost[];
};

export interface IRawFollowing {
    id: number;
    from: number;
    to: number;
    approved: boolean;
    sender: IUser;
    receiver: IUser;
}

export interface IFollower extends IRawFollowing {
    sender: IUser;
}

export interface IFollowing extends IRawFollowing {
    receiver: IUser;
}

export interface IPost {
    id: number;
    title: string;
    description: string;
    authorId: number;
    postImageName: string;
    postImageURL: string;
    tags: string[];
    location: string;
    ago: number;
    createdAt: string;
    postComments: IComment[];
    author: IUser;
    postReactions: IPostReaction[];
}

export interface IPostReaction {
    id: number;
    postId: number;
    userId: number;
}

export interface IComment {
    id: number;
    postId: number;
    userId: number;
    user: IUser;
    text: string;
    ago: number;
    createdAt: string;
    reactions: ICommentReaction[];
}

export interface ICommentReaction {
    id: number;
    commentId: number;
    userId: number;
}

export interface IMessage {
    id: number;
    chatId: number;
    userId: number;
    sender: IUser;
    text: string;
    createdAt: string;
    deletedAt?: string | null;
}

export interface IMember {
    userId: number;
    user: IUser;
    lastReadAt?: string | null;
}

export interface IChat {
    id: number;
    members: IMember[];
    createdAt: string;
    updatedAt: string;
    messages: IMessage[];
}
