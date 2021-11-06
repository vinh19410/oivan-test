import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, take } from 'rxjs/operators';
import { Article } from '../types';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  article: Article;
  urlArticle: string;
  constructor(
    private router: Router,
    private apollo: Apollo,
    private spinner: NgxSpinnerService
  ) {
    window.scrollTo(0, 0);
    this.urlArticle = this.router.getCurrentNavigation()?.extras.state?.url;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getArticle(
      this.urlArticle
        ? this.urlArticle
        : 'https://www.fiercebiotech.com/biotech/pfizer-s-oral-covid-19-antiviral-cuts-hospitalization-death-by-85-sending-team-barreling-to'
    ).subscribe(
      (res) => {
        this.article = res;
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

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
}
