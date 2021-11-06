export type Article = {
  content: string;
  coverImageUrl: string;
  description: string;
  subtitle: string;
  title: string;
  url: string;
};

export type Query = {
  articles: Article[];
};
