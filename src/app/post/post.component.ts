import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, take } from 'rxjs/operators';
import { AppService } from '../app.service';
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
    private spinner: NgxSpinnerService,
    private service: AppService
  ) {
    window.scrollTo(0, 0);
    this.urlArticle = this.router.getCurrentNavigation()?.extras.state?.url;
  }

  ngOnInit(): void {
    this.spinner.show('sp1');
    this.service.getArticle(this.urlArticle).subscribe(
      (res) => {
        this.article = res;
        this.spinner.hide('sp1');
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.spinner.hide('sp1');
      }
    );
  }

  viewOther() {
    this.router.navigateByUrl('/posts');
  }
}
