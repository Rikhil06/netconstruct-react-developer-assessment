export type Category = {
    id: string;
    name: string;
};

export type Author = {
    name: string;
    avatar: string;
};

export type Post = {
    id: string;
    title: string;
    author: Author;
    summary: string;
    categories: Category[];
};

export type PostResponse = {
    posts: Post[];
};
