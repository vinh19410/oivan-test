import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Article, Query } from '../types';
import { AppService } from '../app.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @ViewChild('divContainerContent') divContent: ElementRef;
  valueSearch: string = '';
  breakpoint: number;
  isLoadMore: boolean = false;
  isShowLoadMore: boolean = false;
  isShowFilter: boolean = false;
  pageNumber: number = 1;
  articles: Article[] = [];
  articlesOrg: Article[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private service: AppService
  ) {}

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if (
      !this.isLoadMore &&
      this.divContent.nativeElement.clientHeight - window.scrollY < 1000
    ) {
      this.loadMore();
    }
  }

  ngOnInit() {
    this.breakpoint = this.getBreakPoint(window.innerWidth);
    this.loadInit();
  }

  onChangeSearch(value: any) {
    this.articles = this.articlesOrg.filter(
      (a) =>
        (a.title && a.title.includes(value)) ||
        (a.subtitle && a.subtitle.includes(value))
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
      return 1;
    }

    if (width <= 1024 && width > 400) {
      return 2;
    }

    return 3;
  }

  loadInit() {
    this.spinner.show('sp1');
    const checkNextPage = this.service
      .getArticlesPerPage(this.pageNumber + 1)
      .pipe(take(1));
    const getData = this.service
      .getArticlesPerPage(this.pageNumber)
      .pipe(take(1));
    forkJoin(checkNextPage, getData).subscribe(
      (res) => {
        //unvisible button when not next data next page
        if (res[0] && res[0].length > 0) {
          this.isShowLoadMore = true;
        }

        if (res[1] && res[1].length > 0) {
          this.articlesOrg = res[1];

          this.articles.push(...this.articlesOrg);
        }
      },
      (err) => {},
      () => {
        this.spinner.hide('sp1');
        this.isShowFilter = true;
      }
    );
  }

  loadMore() {
    if (!this.isShowLoadMore) return;

    this.spinner.show('sp2');
    this.isLoadMore = true;
    let nextPage = this.pageNumber + 1;
    let nextPageCheck = this.pageNumber + 2;
    const checkNextPage = this.service
      .getArticlesPerPage(nextPageCheck)
      .pipe(take(1));
    const getData = this.service.getArticlesPerPage(nextPage).pipe(take(1));
    forkJoin(checkNextPage, getData).subscribe(
      (res) => {
        //unvisible button when not next data next page
        if (!res[0] || res[0].length == 0) {
          this.isShowLoadMore = false;
        }

        if (res[1] && res[1].length > 0) {
          this.articlesOrg = Object.assign([], this.articlesOrg);
          this.articlesOrg.push(...res[1]);
          this.articles = [];
          this.onChangeSearch(this.valueSearch);
          // this.articles.push(...res[1]);
        }
      },
      (err) => {},
      () => {
        this.spinner.hide('sp2');
        this.isLoadMore = false;
        this.pageNumber++;
        console.log(this.pageNumber);
      }
    );
  }

  viewDetail(item: Article) {
    this.router.navigateByUrl('/post', { state: item });
  }

  refresh() {
    // this.isShowFilter = false;
    // this.loadInit();
    window.location.reload();
  }
}
