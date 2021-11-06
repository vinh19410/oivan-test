import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Article, Query } from '../types';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  valueSearch: string = '';
  breakpoint: number;
  isLoadMore: boolean = false;
  isShowLoadMore: boolean = false;
  isShowFilter: boolean = false;
  pageNumber: number = 1;
  articles: Article[] = [];
  articlesOrg: Article[] = [];
  constructor(
    private apollo: Apollo,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpoint = this.getBreakPoint(window.innerWidth);
    this.loadInit();
  }

  onChangSearch(value: any) {
    this.articles = this.articlesOrg.filter(
      (a) =>
        (a.title && a.title.includes(value)) ||
        (a.subtitle && a.subtitle.includes(value)) ||
        (a.description && a.description.includes(value))
    );
  }

  clearSearch() {
    this.valueSearch = '';
    this.articles = this.articlesOrg;
  }

  onResize(event: any) {
    this.breakpoint = this.getBreakPoint(event.target.innerWidth);
  }

  getBreakPoint(width: number) {
    if (width <= 400) {
      return 2;
    }

    if (width <= 1024 && width > 400) {
      return 3;
    }

    return 5;
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

  loadInit() {
    this.spinner.show();
    const checkNextPage = this.getArticlesPerPage(this.pageNumber + 1).pipe(
      take(1)
    );
    const getData = this.getArticlesPerPage(this.pageNumber).pipe(take(1));
    forkJoin(checkNextPage, getData).subscribe(
      (res) => {
        //unvisible button when not next data next page
        if (res[0] && res[0].length > 0) {
          this.isShowLoadMore = true;
        }

        if (res[1]) {
          this.articlesOrg = Object.assign([], this.articlesOrg);
          this.articlesOrg.push(...res[1]);
          this.articles.push(...this.articlesOrg);
        }
      },
      (err) => {},
      () => {
        this.spinner.hide();
        this.isShowFilter = true;
      }
    );
  }

  loadMore() {
    this.isLoadMore = true;
    let nextPage = this.pageNumber + 1;
    let nextPageCheck = this.pageNumber + 2;
    const checkNextPage = this.getArticlesPerPage(nextPageCheck).pipe(take(1));
    const getData = this.getArticlesPerPage(nextPage).pipe(take(1));
    forkJoin(checkNextPage, getData).subscribe(
      (res) => {
        //unvisible button when not next data next page
        if (!res[0] || res[0].length == 0) {
          this.isShowLoadMore = false;
        }

        if (res[1]) {
          this.articlesOrg = Object.assign([], this.articlesOrg);
          this.articlesOrg.push(...res[1]);
          this.articles.push(...this.articlesOrg);
        }
      },
      (err) => {},
      () => {
        this.isLoadMore = false;
        this.pageNumber++;
      }
    );
  }

  viewDetail(item: Article) {
    this.router.navigateByUrl('/post', { state: item });
  }
}
