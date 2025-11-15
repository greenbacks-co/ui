import React, { FC } from 'react';

const ArticleContainer: FC<{ id: string; title: string }> = ({
  children,
  id,
  title,
}) => (
  <article data-testid={`article-${id}`}>
    <h2>{title}</h2>
    {children}
  </article>
);

export default ArticleContainer;
