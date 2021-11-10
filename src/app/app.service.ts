import { Injectable } from '@angular/core';

import { Apollo, gql } from 'apollo-angular';
import { map, take } from 'rxjs/operators';
import { Query } from './types';

@Injectable()
export class AppService {
  constructor(private apollo: Apollo) {}

  getArticle(url: string) {
    return this.apollo
      .watchQuery<any>({
        query: gql`
          query getArticle($url: String!) {
            article(url: $url) {
              content
              coverImageUrl
              description
              subtitle
              title
              url
            }
          }
        `,
        variables: {
          url: url,
        },
      })
      .valueChanges.pipe(map((result) => result.data.article));
  }

  getArticlesPerPage(pageNumber: number) {
    return this.apollo
      .watchQuery<Query>({
        query: gql`
          query allArticles($pageNumber: Int!) {
            articles(pageNumber: $pageNumber) {
              content
              coverImageUrl
              description
              subtitle
              title
              url
            }
          }
        `,
        variables: {
          pageNumber: pageNumber,
        },
      })
      .valueChanges.pipe(map((result) => result.data.articles));
  }
}
